var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/browser/builder", "vs/base/common/winjs.base", "vs/base/common/errors", "vs/base/browser/ui/sash/sash", "vs/workbench/services/editor/common/editorService", "vs/workbench/services/part/common/partService", "vs/workbench/services/viewlet/browser/viewlet", "vs/platform/storage/common/storage", "vs/platform/contextview/browser/contextView", "vs/base/common/lifecycle", "vs/workbench/services/group/common/groupService", "vs/base/browser/browser", "vs/platform/theme/common/themeService"], function (require, exports, builder_1, winjs_base_1, errors, sash_1, editorService_1, partService_1, viewlet_1, storage_1, contextView_1, lifecycle_1, groupService_1, browser_1, themeService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MIN_SIDEBAR_PART_WIDTH = 170;
    var MIN_EDITOR_PART_HEIGHT = 70;
    var MIN_EDITOR_PART_WIDTH = 220;
    var MIN_PANEL_PART_HEIGHT = 77;
    var DEFAULT_PANEL_HEIGHT_COEFFICIENT = 0.4;
    var HIDE_SIDEBAR_WIDTH_THRESHOLD = 50;
    var HIDE_PANEL_HEIGHT_THRESHOLD = 50;
    var TITLE_BAR_HEIGHT = 22;
    var STATUS_BAR_HEIGHT = 22;
    var ACTIVITY_BAR_WIDTH = 50;
    /**
     * The workbench layout is responsible to lay out all parts that make the Workbench.
     */
    var WorkbenchLayout = (function () {
        // Take parts as an object bag since instatation service does not have typings for constructors with 9+ arguments
        function WorkbenchLayout(parent, workbenchContainer, parts, quickopen, storageService, contextViewService, editorService, editorGroupService, partService, viewletService, themeService) {
            var _this = this;
            this.storageService = storageService;
            this.contextViewService = contextViewService;
            this.editorService = editorService;
            this.editorGroupService = editorGroupService;
            this.partService = partService;
            this.viewletService = viewletService;
            this.parent = parent;
            this.workbenchContainer = workbenchContainer;
            this.titlebar = parts.titlebar;
            this.activitybar = parts.activitybar;
            this.editor = parts.editor;
            this.sidebar = parts.sidebar;
            this.panel = parts.panel;
            this.statusbar = parts.statusbar;
            this.quickopen = quickopen;
            this.toUnbind = [];
            this.partLayoutInfo = this.getPartLayoutInfo();
            this.panelHeightBeforeMaximized = 0;
            this.panelMaximized = false;
            this.sashX = new sash_1.Sash(this.workbenchContainer.getHTMLElement(), this, {
                baseSize: 5
            });
            this.sashY = new sash_1.Sash(this.workbenchContainer.getHTMLElement(), this, {
                baseSize: 4,
                orientation: sash_1.Orientation.HORIZONTAL
            });
            this.sidebarWidth = this.storageService.getInteger(WorkbenchLayout.sashXWidthSettingsKey, storage_1.StorageScope.GLOBAL, -1);
            this.panelHeight = this.storageService.getInteger(WorkbenchLayout.sashYHeightSettingsKey, storage_1.StorageScope.GLOBAL, 0);
            this.layoutEditorGroupsVertically = (this.editorGroupService.getGroupOrientation() !== 'horizontal');
            this.toUnbind.push(themeService.onThemeChange(function (_) { return _this.layout(); }));
            this.toUnbind.push(editorGroupService.onEditorsChanged(function () { return _this.onEditorsChanged(); }));
            this.toUnbind.push(editorGroupService.onGroupOrientationChanged(function (e) { return _this.onGroupOrientationChanged(); }));
            this.registerSashListeners();
        }
        WorkbenchLayout.prototype.getPartLayoutInfo = function () {
            return {
                titlebar: {
                    height: TITLE_BAR_HEIGHT
                },
                activitybar: {
                    width: ACTIVITY_BAR_WIDTH
                },
                sidebar: {
                    minWidth: MIN_SIDEBAR_PART_WIDTH
                },
                panel: {
                    minHeight: MIN_PANEL_PART_HEIGHT
                },
                editor: {
                    minWidth: MIN_EDITOR_PART_WIDTH,
                    minHeight: MIN_EDITOR_PART_HEIGHT
                },
                statusbar: {
                    height: STATUS_BAR_HEIGHT
                }
            };
        };
        WorkbenchLayout.prototype.registerSashListeners = function () {
            var _this = this;
            var startX = 0;
            var startY = 0;
            this.sashX.addListener('start', function (e) {
                _this.startSidebarWidth = _this.sidebarWidth;
                startX = e.startX;
            });
            this.sashY.addListener('start', function (e) {
                _this.startPanelHeight = _this.panelHeight;
                startY = e.startY;
            });
            this.sashX.addListener('change', function (e) {
                var doLayout = false;
                var sidebarPosition = _this.partService.getSideBarPosition();
                var isSidebarVisible = _this.partService.isVisible(partService_1.Parts.SIDEBAR_PART);
                var newSashWidth = (sidebarPosition === partService_1.Position.LEFT) ? _this.startSidebarWidth + e.currentX - startX : _this.startSidebarWidth - e.currentX + startX;
                var promise = winjs_base_1.TPromise.as(null);
                // Sidebar visible
                if (isSidebarVisible) {
                    // Automatically hide side bar when a certain threshold is met
                    if (newSashWidth + HIDE_SIDEBAR_WIDTH_THRESHOLD < _this.partLayoutInfo.sidebar.minWidth) {
                        var dragCompensation = MIN_SIDEBAR_PART_WIDTH - HIDE_SIDEBAR_WIDTH_THRESHOLD;
                        promise = _this.partService.setSideBarHidden(true);
                        startX = (sidebarPosition === partService_1.Position.LEFT) ? Math.max(_this.activitybarWidth, e.currentX - dragCompensation) : Math.min(e.currentX + dragCompensation, _this.workbenchSize.width - _this.activitybarWidth);
                        _this.sidebarWidth = _this.startSidebarWidth; // when restoring sidebar, restore to the sidebar width we started from
                    }
                    else {
                        _this.sidebarWidth = Math.max(_this.partLayoutInfo.sidebar.minWidth, newSashWidth); // Sidebar can not become smaller than MIN_PART_WIDTH
                        doLayout = newSashWidth >= _this.partLayoutInfo.sidebar.minWidth;
                    }
                }
                else {
                    if ((sidebarPosition === partService_1.Position.LEFT && e.currentX - startX >= _this.partLayoutInfo.sidebar.minWidth) ||
                        (sidebarPosition === partService_1.Position.RIGHT && startX - e.currentX >= _this.partLayoutInfo.sidebar.minWidth)) {
                        _this.startSidebarWidth = _this.partLayoutInfo.sidebar.minWidth - (sidebarPosition === partService_1.Position.LEFT ? e.currentX - startX : startX - e.currentX);
                        _this.sidebarWidth = _this.partLayoutInfo.sidebar.minWidth;
                        promise = _this.partService.setSideBarHidden(false);
                    }
                }
                if (doLayout) {
                    promise.done(function () { return _this.layout(); }, errors.onUnexpectedError);
                }
            });
            this.sashY.addListener('change', function (e) {
                var doLayout = false;
                var isPanelVisible = _this.partService.isVisible(partService_1.Parts.PANEL_PART);
                var newSashHeight = _this.startPanelHeight - (e.currentY - startY);
                var promise = winjs_base_1.TPromise.as(null);
                // Panel visible
                if (isPanelVisible) {
                    // Automatically hide panel when a certain threshold is met
                    if (newSashHeight + HIDE_PANEL_HEIGHT_THRESHOLD < _this.partLayoutInfo.panel.minHeight) {
                        var dragCompensation = MIN_PANEL_PART_HEIGHT - HIDE_PANEL_HEIGHT_THRESHOLD;
                        promise = _this.partService.setPanelHidden(true);
                        startY = Math.min(_this.sidebarHeight - _this.statusbarHeight - _this.titlebarHeight, e.currentY + dragCompensation);
                        _this.panelHeight = _this.startPanelHeight; // when restoring panel, restore to the panel height we started from
                    }
                    else {
                        _this.panelHeight = Math.max(_this.partLayoutInfo.panel.minHeight, newSashHeight); // Panel can not become smaller than MIN_PART_HEIGHT
                        doLayout = newSashHeight >= _this.partLayoutInfo.panel.minHeight;
                    }
                }
                else {
                    if (startY - e.currentY >= _this.partLayoutInfo.panel.minHeight) {
                        _this.startPanelHeight = 0;
                        _this.panelHeight = _this.partLayoutInfo.panel.minHeight;
                        promise = _this.partService.setPanelHidden(false);
                    }
                }
                if (doLayout) {
                    promise.done(function () { return _this.layout(); }, errors.onUnexpectedError);
                }
            });
            this.sashX.addListener('end', function () {
                _this.storageService.store(WorkbenchLayout.sashXWidthSettingsKey, _this.sidebarWidth, storage_1.StorageScope.GLOBAL);
            });
            this.sashY.addListener('end', function () {
                _this.storageService.store(WorkbenchLayout.sashYHeightSettingsKey, _this.panelHeight, storage_1.StorageScope.GLOBAL);
            });
            this.sashY.addListener('reset', function () {
                _this.panelHeight = _this.sidebarHeight * DEFAULT_PANEL_HEIGHT_COEFFICIENT;
                _this.storageService.store(WorkbenchLayout.sashYHeightSettingsKey, _this.panelHeight, storage_1.StorageScope.GLOBAL);
                _this.partService.setPanelHidden(false).done(function () { return _this.layout(); }, errors.onUnexpectedError);
            });
            this.sashX.addListener('reset', function () {
                var activeViewlet = _this.viewletService.getActiveViewlet();
                var optimalWidth = activeViewlet && activeViewlet.getOptimalWidth();
                _this.sidebarWidth = Math.max(MIN_SIDEBAR_PART_WIDTH, optimalWidth || 0);
                _this.storageService.store(WorkbenchLayout.sashXWidthSettingsKey, _this.sidebarWidth, storage_1.StorageScope.GLOBAL);
                _this.partService.setSideBarHidden(false).done(function () { return _this.layout(); }, errors.onUnexpectedError);
            });
        };
        WorkbenchLayout.prototype.onEditorsChanged = function () {
            // Make sure that we layout properly in case we detect that the sidebar or panel is large enought to cause
            // multiple opened editors to go below minimal size. The fix is to trigger a layout for any editor
            // input change that falls into this category.
            if (this.workbenchSize && (this.sidebarWidth || this.panelHeight)) {
                var visibleEditors = this.editorService.getVisibleEditors().length;
                if (visibleEditors > 1) {
                    var sidebarOverflow = this.layoutEditorGroupsVertically && (this.workbenchSize.width - this.sidebarWidth < visibleEditors * MIN_EDITOR_PART_WIDTH);
                    var panelOverflow = !this.layoutEditorGroupsVertically && (this.workbenchSize.height - this.panelHeight < visibleEditors * MIN_EDITOR_PART_HEIGHT);
                    if (sidebarOverflow || panelOverflow) {
                        this.layout();
                    }
                }
            }
        };
        WorkbenchLayout.prototype.onGroupOrientationChanged = function () {
            var newLayoutEditorGroupsVertically = (this.editorGroupService.getGroupOrientation() !== 'horizontal');
            var doLayout = this.layoutEditorGroupsVertically !== newLayoutEditorGroupsVertically;
            this.layoutEditorGroupsVertically = newLayoutEditorGroupsVertically;
            if (doLayout) {
                this.layout();
            }
        };
        WorkbenchLayout.prototype.layout = function (options) {
            this.workbenchSize = this.parent.getClientArea();
            var isActivityBarHidden = !this.partService.isVisible(partService_1.Parts.ACTIVITYBAR_PART);
            var isTitlebarHidden = !this.partService.isVisible(partService_1.Parts.TITLEBAR_PART);
            var isPanelHidden = !this.partService.isVisible(partService_1.Parts.PANEL_PART);
            var isStatusbarHidden = !this.partService.isVisible(partService_1.Parts.STATUSBAR_PART);
            var isSidebarHidden = !this.partService.isVisible(partService_1.Parts.SIDEBAR_PART);
            var sidebarPosition = this.partService.getSideBarPosition();
            // Sidebar
            var sidebarWidth;
            if (isSidebarHidden) {
                sidebarWidth = 0;
            }
            else if (this.sidebarWidth !== -1) {
                sidebarWidth = Math.max(this.partLayoutInfo.sidebar.minWidth, this.sidebarWidth);
            }
            else {
                sidebarWidth = this.workbenchSize.width / 5;
                this.sidebarWidth = sidebarWidth;
            }
            this.statusbarHeight = isStatusbarHidden ? 0 : this.partLayoutInfo.statusbar.height;
            this.titlebarHeight = isTitlebarHidden ? 0 : this.partLayoutInfo.titlebar.height / browser_1.getZoomFactor(); // adjust for zoom prevention
            var previousMaxPanelHeight = this.sidebarHeight - MIN_EDITOR_PART_HEIGHT;
            this.sidebarHeight = this.workbenchSize.height - this.statusbarHeight - this.titlebarHeight;
            var sidebarSize = new builder_1.Dimension(sidebarWidth, this.sidebarHeight);
            // Activity Bar
            this.activitybarWidth = isActivityBarHidden ? 0 : this.partLayoutInfo.activitybar.width;
            var activityBarSize = new builder_1.Dimension(this.activitybarWidth, sidebarSize.height);
            // Panel part
            var panelHeight;
            var editorCountForHeight = this.editorGroupService.getGroupOrientation() === 'horizontal' ? this.editorGroupService.getStacksModel().groups.length : 1;
            var maxPanelHeight = sidebarSize.height - editorCountForHeight * MIN_EDITOR_PART_HEIGHT;
            if (isPanelHidden) {
                panelHeight = 0;
            }
            else if (this.panelHeight === previousMaxPanelHeight) {
                panelHeight = maxPanelHeight;
            }
            else if (this.panelHeight > 0) {
                panelHeight = Math.min(maxPanelHeight, Math.max(this.partLayoutInfo.panel.minHeight, this.panelHeight));
            }
            else {
                panelHeight = sidebarSize.height * DEFAULT_PANEL_HEIGHT_COEFFICIENT;
            }
            if (options && options.toggleMaximizedPanel) {
                panelHeight = this.panelMaximized ? Math.max(this.partLayoutInfo.panel.minHeight, Math.min(this.panelHeightBeforeMaximized, maxPanelHeight)) : maxPanelHeight;
            }
            this.panelMaximized = panelHeight === maxPanelHeight;
            if (panelHeight / maxPanelHeight < 0.7) {
                // Remember the previous height only if the panel size is not too large.
                // To get a nice minimize effect even if a user dragged the panel sash to maximum.
                this.panelHeightBeforeMaximized = panelHeight;
            }
            var panelDimension = new builder_1.Dimension(this.workbenchSize.width - sidebarSize.width - activityBarSize.width, panelHeight);
            this.panelWidth = panelDimension.width;
            // Editor
            var editorSize = {
                width: 0,
                height: 0,
                remainderLeft: 0,
                remainderRight: 0
            };
            editorSize.width = panelDimension.width;
            editorSize.height = sidebarSize.height - panelDimension.height;
            // Sidebar hidden
            if (isSidebarHidden) {
                editorSize.width = this.workbenchSize.width - activityBarSize.width;
                if (sidebarPosition === partService_1.Position.LEFT) {
                    editorSize.remainderLeft = Math.round((this.workbenchSize.width - editorSize.width + activityBarSize.width) / 2);
                    editorSize.remainderRight = this.workbenchSize.width - editorSize.width - editorSize.remainderLeft;
                }
                else {
                    editorSize.remainderRight = Math.round((this.workbenchSize.width - editorSize.width + activityBarSize.width) / 2);
                    editorSize.remainderLeft = this.workbenchSize.width - editorSize.width - editorSize.remainderRight;
                }
            }
            // Assert Sidebar and Editor Size to not overflow
            var editorMinWidth = this.partLayoutInfo.editor.minWidth;
            var editorMinHeight = this.partLayoutInfo.editor.minHeight;
            var visibleEditorCount = this.editorService.getVisibleEditors().length;
            if (visibleEditorCount > 1) {
                if (this.layoutEditorGroupsVertically) {
                    editorMinWidth *= visibleEditorCount; // when editors layout vertically, multiply the min editor width by number of visible editors
                }
                else {
                    editorMinHeight *= visibleEditorCount; // when editors layout horizontally, multiply the min editor height by number of visible editors
                }
            }
            if (editorSize.width < editorMinWidth) {
                var diff = editorMinWidth - editorSize.width;
                editorSize.width = editorMinWidth;
                panelDimension.width = editorMinWidth;
                sidebarSize.width -= diff;
                sidebarSize.width = Math.max(MIN_SIDEBAR_PART_WIDTH, sidebarSize.width);
            }
            if (editorSize.height < editorMinHeight) {
                var diff = editorMinHeight - editorSize.height;
                editorSize.height = editorMinHeight;
                panelDimension.height -= diff;
                panelDimension.height = Math.max(MIN_PANEL_PART_HEIGHT, panelDimension.height);
            }
            if (!isSidebarHidden) {
                this.sidebarWidth = sidebarSize.width;
                this.storageService.store(WorkbenchLayout.sashXWidthSettingsKey, this.sidebarWidth, storage_1.StorageScope.GLOBAL);
            }
            if (!isPanelHidden) {
                this.panelHeight = panelDimension.height;
                this.storageService.store(WorkbenchLayout.sashYHeightSettingsKey, this.panelHeight, storage_1.StorageScope.GLOBAL);
            }
            // Workbench
            this.workbenchContainer
                .position(0, 0, 0, 0, 'relative')
                .size(this.workbenchSize.width, this.workbenchSize.height);
            // Bug on Chrome: Sometimes Chrome wants to scroll the workbench container on layout changes. The fix is to reset scrolling in this case.
            var workbenchContainer = this.workbenchContainer.getHTMLElement();
            if (workbenchContainer.scrollTop > 0) {
                workbenchContainer.scrollTop = 0;
            }
            if (workbenchContainer.scrollLeft > 0) {
                workbenchContainer.scrollLeft = 0;
            }
            // Title Part
            if (isTitlebarHidden) {
                this.titlebar.getContainer().hide();
            }
            else {
                this.titlebar.getContainer().show();
            }
            // Editor Part and Panel part
            this.editor.getContainer().size(editorSize.width, editorSize.height);
            this.panel.getContainer().size(panelDimension.width, panelDimension.height);
            var editorBottom = this.statusbarHeight + panelDimension.height;
            if (isSidebarHidden) {
                this.editor.getContainer().position(this.titlebarHeight, editorSize.remainderRight, editorBottom, editorSize.remainderLeft);
                this.panel.getContainer().position(editorSize.height + this.titlebarHeight, editorSize.remainderRight, this.statusbarHeight, editorSize.remainderLeft);
            }
            else if (sidebarPosition === partService_1.Position.LEFT) {
                this.editor.getContainer().position(this.titlebarHeight, 0, editorBottom, sidebarSize.width + activityBarSize.width);
                this.panel.getContainer().position(editorSize.height + this.titlebarHeight, 0, this.statusbarHeight, sidebarSize.width + activityBarSize.width);
            }
            else {
                this.editor.getContainer().position(this.titlebarHeight, sidebarSize.width, editorBottom, 0);
                this.panel.getContainer().position(editorSize.height + this.titlebarHeight, sidebarSize.width, this.statusbarHeight, 0);
            }
            // Activity Bar Part
            this.activitybar.getContainer().size(null, activityBarSize.height);
            if (sidebarPosition === partService_1.Position.LEFT) {
                this.activitybar.getContainer().getHTMLElement().style.right = '';
                this.activitybar.getContainer().position(this.titlebarHeight, null, 0, 0);
            }
            else {
                this.activitybar.getContainer().getHTMLElement().style.left = '';
                this.activitybar.getContainer().position(this.titlebarHeight, 0, 0, null);
            }
            if (isActivityBarHidden) {
                this.activitybar.getContainer().hide();
            }
            else {
                this.activitybar.getContainer().show();
            }
            // Sidebar Part
            this.sidebar.getContainer().size(sidebarSize.width, sidebarSize.height);
            if (sidebarPosition === partService_1.Position.LEFT) {
                this.sidebar.getContainer().position(this.titlebarHeight, editorSize.width, 0, activityBarSize.width);
            }
            else {
                this.sidebar.getContainer().position(this.titlebarHeight, null, 0, editorSize.width);
            }
            // Statusbar Part
            this.statusbar.getContainer().position(this.workbenchSize.height - this.statusbarHeight);
            if (isStatusbarHidden) {
                this.statusbar.getContainer().hide();
            }
            else {
                this.statusbar.getContainer().show();
            }
            // Quick open
            this.quickopen.layout(this.workbenchSize);
            // Sashes
            this.sashX.layout();
            this.sashY.layout();
            // Propagate to Part Layouts
            this.titlebar.layout(new builder_1.Dimension(this.workbenchSize.width, this.titlebarHeight));
            this.editor.layout(new builder_1.Dimension(editorSize.width, editorSize.height));
            this.sidebar.layout(sidebarSize);
            this.panel.layout(panelDimension);
            this.activitybar.layout(activityBarSize);
            // Propagate to Context View
            this.contextViewService.layout();
        };
        WorkbenchLayout.prototype.getVerticalSashTop = function (sash) {
            return this.titlebarHeight;
        };
        WorkbenchLayout.prototype.getVerticalSashLeft = function (sash) {
            var isSidebarVisible = this.partService.isVisible(partService_1.Parts.SIDEBAR_PART);
            var sidebarPosition = this.partService.getSideBarPosition();
            if (sidebarPosition === partService_1.Position.LEFT) {
                return isSidebarVisible ? this.sidebarWidth + this.activitybarWidth : this.activitybarWidth;
            }
            return isSidebarVisible ? this.workbenchSize.width - this.sidebarWidth - this.activitybarWidth : this.workbenchSize.width - this.activitybarWidth;
        };
        WorkbenchLayout.prototype.getVerticalSashHeight = function (sash) {
            return this.sidebarHeight;
        };
        WorkbenchLayout.prototype.getHorizontalSashTop = function (sash) {
            // Horizontal sash should be a bit lower than the editor area, thus add 2px #5524
            return 2 + (this.partService.isVisible(partService_1.Parts.PANEL_PART) ? this.sidebarHeight - this.panelHeight + this.titlebarHeight : this.sidebarHeight + this.titlebarHeight);
        };
        WorkbenchLayout.prototype.getHorizontalSashLeft = function (sash) {
            return this.partService.getSideBarPosition() === partService_1.Position.LEFT ? this.getVerticalSashLeft(sash) : 0;
        };
        WorkbenchLayout.prototype.getHorizontalSashWidth = function (sash) {
            return this.panelWidth;
        };
        WorkbenchLayout.prototype.isPanelMaximized = function () {
            return this.panelMaximized;
        };
        // change part size along the main axis
        WorkbenchLayout.prototype.resizePart = function (part, sizeChange) {
            var visibleEditors = this.editorService.getVisibleEditors().length;
            var sizeChangePxWidth = this.workbenchSize.width * (sizeChange / 100);
            var sizeChangePxHeight = this.workbenchSize.height * (sizeChange / 100);
            var doLayout = false;
            var newSashSize = 0;
            switch (part) {
                case partService_1.Parts.SIDEBAR_PART:
                    newSashSize = this.sidebarWidth + sizeChangePxWidth;
                    this.sidebarWidth = Math.max(this.partLayoutInfo.sidebar.minWidth, newSashSize); // Sidebar can not become smaller than MIN_PART_WIDTH
                    if (this.layoutEditorGroupsVertically && (this.workbenchSize.width - this.sidebarWidth < visibleEditors * MIN_EDITOR_PART_WIDTH)) {
                        this.sidebarWidth = (this.workbenchSize.width - visibleEditors * MIN_EDITOR_PART_WIDTH);
                    }
                    doLayout = true;
                    break;
                case partService_1.Parts.PANEL_PART:
                    newSashSize = this.panelHeight + sizeChangePxHeight;
                    this.panelHeight = Math.max(this.partLayoutInfo.panel.minHeight, newSashSize);
                    doLayout = true;
                    break;
                case partService_1.Parts.EDITOR_PART:
                    // If we have one editor we can cheat and resize sidebar with the negative delta
                    var visibleEditorCount = this.editorService.getVisibleEditors().length;
                    if (visibleEditorCount === 1) {
                        this.sidebarWidth = this.sidebarWidth - sizeChangePxWidth;
                        doLayout = true;
                    }
                    else {
                        var stacks = this.editorGroupService.getStacksModel();
                        var activeGroup = stacks.positionOfGroup(stacks.activeGroup);
                        this.editorGroupService.resizeGroup(activeGroup, sizeChangePxWidth);
                        doLayout = false;
                    }
            }
            if (doLayout) {
                this.layout();
            }
        };
        WorkbenchLayout.prototype.dispose = function () {
            if (this.toUnbind) {
                lifecycle_1.dispose(this.toUnbind);
                this.toUnbind = null;
            }
        };
        WorkbenchLayout.sashXWidthSettingsKey = 'workbench.sidebar.width';
        WorkbenchLayout.sashYHeightSettingsKey = 'workbench.panel.height';
        WorkbenchLayout = __decorate([
            __param(4, storage_1.IStorageService),
            __param(5, contextView_1.IContextViewService),
            __param(6, editorService_1.IWorkbenchEditorService),
            __param(7, groupService_1.IEditorGroupService),
            __param(8, partService_1.IPartService),
            __param(9, viewlet_1.IViewletService),
            __param(10, themeService_1.IThemeService)
        ], WorkbenchLayout);
        return WorkbenchLayout;
    }());
    exports.WorkbenchLayout = WorkbenchLayout;
});
//# sourceMappingURL=layout.js.map