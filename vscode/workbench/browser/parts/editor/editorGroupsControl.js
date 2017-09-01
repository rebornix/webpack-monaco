/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/arrays", "vs/base/common/event", "vs/base/browser/mouseEvent", "vs/base/common/types", "vs/base/browser/builder", "vs/base/browser/ui/sash/sash", "vs/base/browser/ui/progressbar/progressbar", "vs/base/browser/dom", "vs/base/common/errors", "vs/base/common/async", "vs/base/common/platform", "vs/workbench/services/editor/common/editorService", "vs/platform/editor/common/editor", "vs/workbench/services/group/common/groupService", "vs/platform/telemetry/common/telemetry", "vs/platform/instantiation/common/instantiation", "vs/platform/instantiation/common/serviceCollection", "vs/platform/contextkey/common/contextkey", "vs/platform/extensions/common/extensions", "vs/workbench/browser/parts/editor/tabsTitleControl", "vs/workbench/browser/parts/editor/titleControl", "vs/workbench/browser/parts/editor/noTabsTitleControl", "vs/workbench/common/editor", "vs/base/browser/dnd", "vs/platform/windows/common/windows", "vs/editor/common/services/codeEditorService", "vs/platform/theme/common/themeService", "vs/platform/theme/common/colorRegistry", "vs/workbench/common/theme", "vs/platform/theme/common/styler", "vs/platform/message/common/message", "vs/platform/files/common/files", "vs/platform/workspaces/common/workspaces", "vs/css!./media/editorGroupsControl"], function (require, exports, arrays, event_1, mouseEvent_1, types, builder_1, sash_1, progressbar_1, DOM, errors, async_1, platform_1, editorService_1, editor_1, groupService_1, telemetry_1, instantiation_1, serviceCollection_1, contextkey_1, extensions_1, tabsTitleControl_1, titleControl_1, noTabsTitleControl_1, editor_2, dnd_1, windows_1, codeEditorService_1, themeService_1, colorRegistry_1, theme_1, styler_1, message_1, files_1, workspaces_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Rochade;
    (function (Rochade) {
        Rochade[Rochade["NONE"] = 0] = "NONE";
        Rochade[Rochade["TWO_TO_ONE"] = 1] = "TWO_TO_ONE";
        Rochade[Rochade["THREE_TO_TWO"] = 2] = "THREE_TO_TWO";
        Rochade[Rochade["TWO_AND_THREE_TO_ONE"] = 3] = "TWO_AND_THREE_TO_ONE";
    })(Rochade = exports.Rochade || (exports.Rochade = {}));
    var ProgressState;
    (function (ProgressState) {
        ProgressState[ProgressState["INFINITE"] = 0] = "INFINITE";
        ProgressState[ProgressState["DONE"] = 1] = "DONE";
        ProgressState[ProgressState["STOP"] = 2] = "STOP";
    })(ProgressState = exports.ProgressState || (exports.ProgressState = {}));
    /**
     * Helper class to manage multiple side by side editors for the editor part.
     */
    var EditorGroupsControl = (function (_super) {
        __extends(EditorGroupsControl, _super);
        function EditorGroupsControl(parent, groupOrientation, editorService, editorGroupService, telemetryService, contextKeyService, extensionService, instantiationService, windowService, windowsService, themeService, fileService, messageService, workspacesService) {
            var _this = _super.call(this, themeService) || this;
            _this.editorService = editorService;
            _this.editorGroupService = editorGroupService;
            _this.telemetryService = telemetryService;
            _this.contextKeyService = contextKeyService;
            _this.extensionService = extensionService;
            _this.instantiationService = instantiationService;
            _this.windowService = windowService;
            _this.windowsService = windowsService;
            _this.fileService = fileService;
            _this.messageService = messageService;
            _this.workspacesService = workspacesService;
            _this.stacks = editorGroupService.getStacksModel();
            _this.parent = parent;
            _this.dimension = new builder_1.Dimension(0, 0);
            _this.silos = [];
            _this.silosSize = [];
            _this.silosMinimized = [];
            _this.visibleEditors = [];
            _this.visibleEditorFocusTrackers = [];
            _this._onGroupFocusChanged = new event_1.Emitter();
            _this.toUnbind.push(_this._onGroupFocusChanged);
            _this.onStacksChangeScheduler = new async_1.RunOnceScheduler(function () { return _this.handleStacksChanged(); }, 0);
            _this.toUnbind.push(_this.onStacksChangeScheduler);
            _this.stacksChangedBuffer = [];
            _this.updateTabOptions(_this.editorGroupService.getTabOptions());
            var editorGroupOrientation = groupOrientation || 'vertical';
            _this.layoutVertically = (editorGroupOrientation !== 'horizontal');
            _this.create();
            _this.registerListeners();
            return _this;
        }
        Object.defineProperty(EditorGroupsControl.prototype, "totalSize", {
            get: function () {
                if (!this.dimension || !this.dimension.width || !this.dimension.height) {
                    return 0;
                }
                return this.layoutVertically ? this.dimension.width : this.dimension.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorGroupsControl.prototype, "minSize", {
            get: function () {
                return this.layoutVertically ? EditorGroupsControl.MIN_EDITOR_WIDTH : EditorGroupsControl.MIN_EDITOR_HEIGHT;
            },
            enumerable: true,
            configurable: true
        });
        EditorGroupsControl.prototype.isSiloMinimized = function (position) {
            return this.silosSize[position] === this.minSize && this.silosMinimized[position];
        };
        EditorGroupsControl.prototype.enableMinimizedState = function () {
            var _this = this;
            editor_1.POSITIONS.forEach(function (p) { return _this.silosMinimized[p] = _this.silosSize[p] === _this.minSize; });
        };
        EditorGroupsControl.prototype.updateMinimizedState = function () {
            var _this = this;
            editor_1.POSITIONS.forEach(function (p) {
                if (_this.silosSize[p] !== _this.minSize) {
                    _this.silosMinimized[p] = false; // release silo from minimized state if it was sized large enough
                }
            });
        };
        Object.defineProperty(EditorGroupsControl.prototype, "snapToMinimizeThresholdSize", {
            get: function () {
                return this.layoutVertically ? EditorGroupsControl.SNAP_TO_MINIMIZED_THRESHOLD_WIDTH : EditorGroupsControl.SNAP_TO_MINIMIZED_THRESHOLD_HEIGHT;
            },
            enumerable: true,
            configurable: true
        });
        EditorGroupsControl.prototype.registerListeners = function () {
            var _this = this;
            this.toUnbind.push(this.stacks.onModelChanged(function (e) { return _this.onStacksChanged(e); }));
            this.toUnbind.push(this.editorGroupService.onTabOptionsChanged(function (options) { return _this.updateTabOptions(options, true); }));
            this.extensionService.onReady().then(function () { return _this.onExtensionsReady(); });
        };
        EditorGroupsControl.prototype.updateTabOptions = function (tabOptions, refresh) {
            var _this = this;
            var tabCloseButton = this.tabOptions ? this.tabOptions.tabCloseButton : 'right';
            this.tabOptions = tabOptions;
            if (!refresh) {
                return; // return early if no refresh is needed
            }
            // Editor Containers
            editor_1.POSITIONS.forEach(function (position) {
                var titleControl = _this.getTitleAreaControl(position);
                // Title Container
                var titleContainer = builder_1.$(titleControl.getContainer());
                if (_this.tabOptions.showTabs) {
                    titleContainer.addClass('tabs');
                }
                else {
                    titleContainer.removeClass('tabs');
                }
                var showingIcons = titleContainer.hasClass('show-file-icons');
                if (_this.tabOptions.showIcons) {
                    titleContainer.addClass('show-file-icons');
                }
                else {
                    titleContainer.removeClass('show-file-icons');
                }
                // Title Control
                if (titleControl) {
                    var usingTabs = (titleControl instanceof tabsTitleControl_1.TabsTitleControl);
                    // Recreate title when tabs change
                    if (usingTabs !== _this.tabOptions.showTabs) {
                        titleControl.dispose();
                        titleContainer.empty();
                        _this.createTitleControl(_this.stacks.groupAt(position), _this.silos[position], titleContainer, _this.getInstantiationService(position));
                    }
                    else if (showingIcons !== _this.tabOptions.showIcons || tabCloseButton !== _this.tabOptions.tabCloseButton) {
                        titleControl.refresh();
                    }
                }
                // Update Styles
                _this.updateStyles();
            });
        };
        EditorGroupsControl.prototype.onExtensionsReady = function () {
            var _this = this;
            // Up to date title areas
            editor_1.POSITIONS.forEach(function (position) { return _this.getTitleAreaControl(position).update(); });
        };
        EditorGroupsControl.prototype.onStacksChanged = function (e) {
            this.stacksChangedBuffer.push(e);
            this.onStacksChangeScheduler.schedule();
        };
        EditorGroupsControl.prototype.handleStacksChanged = function () {
            var _this = this;
            // Read and reset buffer of events
            var buffer = this.stacksChangedBuffer;
            this.stacksChangedBuffer = [];
            // Up to date context for all title controls
            editor_1.POSITIONS.forEach(function (position) {
                var titleAreaControl = _this.getTitleAreaControl(position);
                var context = _this.stacks.groupAt(position);
                var hasContext = titleAreaControl.hasContext();
                titleAreaControl.setContext(context);
                if (!context && hasContext) {
                    titleAreaControl.refresh(); // clear out the control if the context is no longer present and there was a context
                }
            });
            // Refresh / update if group is visible and has a position
            buffer.forEach(function (e) {
                var position = _this.stacks.positionOfGroup(e.group);
                if (position >= 0) {
                    if (e.structural) {
                        _this.getTitleAreaControl(position).refresh();
                    }
                    else {
                        _this.getTitleAreaControl(position).update();
                    }
                }
            });
        };
        Object.defineProperty(EditorGroupsControl.prototype, "onGroupFocusChanged", {
            get: function () {
                return this._onGroupFocusChanged.event;
            },
            enumerable: true,
            configurable: true
        });
        EditorGroupsControl.prototype.show = function (editor, position, preserveActive, ratio) {
            var visibleEditorCount = this.getVisibleEditorCount();
            // Store into editor bucket
            this.visibleEditors[position] = editor;
            // Store as active unless preserveActive is set
            if (!preserveActive || !this.lastActiveEditor) {
                this.doSetActive(editor, position);
            }
            // Track focus
            this.trackFocus(editor, position);
            // Find target container and build into
            var target = this.silos[position].child();
            editor.getContainer().build(target);
            // Adjust layout according to provided ratios (used when restoring multiple editors at once)
            if (ratio && (ratio.length === 2 || ratio.length === 3)) {
                var hasLayoutInfo = !!this.totalSize;
                // We received ratios but were not layouted yet. So we keep these ratios for when we layout()
                if (!hasLayoutInfo) {
                    this.silosInitialRatio = ratio;
                }
                // Adjust layout: -> [!][!]
                if (ratio.length === 2) {
                    if (hasLayoutInfo) {
                        this.silosSize[position] = this.totalSize * ratio[position];
                    }
                }
                else if (ratio.length === 3) {
                    if (hasLayoutInfo) {
                        this.silosSize[position] = this.totalSize * ratio[position];
                    }
                    if (this.sashTwo.isHidden()) {
                        this.sashTwo.show();
                        this.sashTwo.layout();
                    }
                }
                if (this.sashOne.isHidden()) {
                    this.sashOne.show();
                    this.sashOne.layout();
                }
                if (hasLayoutInfo) {
                    this.layoutContainers();
                }
            }
            else if (visibleEditorCount === 0 && this.dimension) {
                this.silosSize[position] = this.totalSize;
                this.layoutContainers();
            }
            else if (position === editor_1.Position.TWO && this.sashOne.isHidden() && this.sashTwo.isHidden() && this.dimension) {
                this.silosSize[editor_1.Position.ONE] = this.totalSize / 2;
                this.silosSize[editor_1.Position.TWO] = this.totalSize - this.silosSize[editor_1.Position.ONE];
                this.sashOne.show();
                this.sashOne.layout();
                this.layoutContainers();
            }
            else if (position === editor_1.Position.THREE && this.sashTwo.isHidden() && this.dimension) {
                this.silosSize[editor_1.Position.ONE] = this.totalSize / 3;
                this.silosSize[editor_1.Position.TWO] = this.totalSize / 3;
                this.silosSize[editor_1.Position.THREE] = this.totalSize - this.silosSize[editor_1.Position.ONE] - this.silosSize[editor_1.Position.TWO];
                this.sashOne.layout();
                this.sashTwo.show();
                this.sashTwo.layout();
                this.layoutContainers();
            }
            // Show editor container
            editor.getContainer().show();
        };
        EditorGroupsControl.prototype.getVisibleEditorCount = function () {
            return this.visibleEditors.filter(function (v) { return !!v; }).length;
        };
        EditorGroupsControl.prototype.trackFocus = function (editor, position) {
            var _this = this;
            // In case there is a previous tracker on the position, dispose it first
            if (this.visibleEditorFocusTrackers[position]) {
                this.visibleEditorFocusTrackers[position].dispose();
            }
            // Track focus on editor container
            this.visibleEditorFocusTrackers[position] = DOM.trackFocus(editor.getContainer().getHTMLElement());
            this.visibleEditorFocusTrackers[position].addFocusListener(function () {
                _this.onFocusGained(editor);
            });
        };
        EditorGroupsControl.prototype.onFocusGained = function (editor) {
            this.setActive(editor);
        };
        EditorGroupsControl.prototype.setActive = function (editor) {
            var _this = this;
            // Update active editor and position
            if (this.lastActiveEditor !== editor) {
                this.doSetActive(editor, this.visibleEditors.indexOf(editor));
                // Automatically maximize this position if it is minimized
                if (this.isSiloMinimized(this.lastActivePosition)) {
                    // Log this fact in telemetry
                    if (this.telemetryService) {
                        this.telemetryService.publicLog('workbenchEditorMaximized');
                    }
                    var remainingSize_1 = this.totalSize;
                    var layout = false;
                    // Minimize all other positions to min size
                    editor_1.POSITIONS.forEach(function (p) {
                        if (_this.lastActivePosition !== p && !!_this.visibleEditors[p]) {
                            _this.silosSize[p] = _this.minSize;
                            remainingSize_1 -= _this.silosSize[p];
                        }
                    });
                    // Grow focused position if there is more size to spend
                    if (remainingSize_1 > this.minSize) {
                        this.silosSize[this.lastActivePosition] = remainingSize_1;
                        if (!this.sashOne.isHidden()) {
                            this.sashOne.layout();
                        }
                        if (!this.sashTwo.isHidden()) {
                            this.sashTwo.layout();
                        }
                        layout = true;
                    }
                    // Since we triggered a change in minimized/maximized editors, we need
                    // to update our stored state of minimized silos accordingly
                    this.enableMinimizedState();
                    if (layout) {
                        this.layoutContainers();
                    }
                }
                // Re-emit to outside
                this._onGroupFocusChanged.fire();
            }
        };
        EditorGroupsControl.prototype.focusNextNonMinimized = function () {
            var _this = this;
            // If the current focused editor is minimized, try to focus the next largest editor
            if (!types.isUndefinedOrNull(this.lastActivePosition) && this.silosMinimized[this.lastActivePosition]) {
                var candidate_1 = null;
                var currentSize_1 = this.minSize;
                editor_1.POSITIONS.forEach(function (position) {
                    // Skip current active position and check if the editor is larger than min size
                    if (position !== _this.lastActivePosition) {
                        if (_this.visibleEditors[position] && _this.silosSize[position] > currentSize_1) {
                            candidate_1 = position;
                            currentSize_1 = _this.silosSize[position];
                        }
                    }
                });
                // Focus editor if a candidate has been found
                if (!types.isUndefinedOrNull(candidate_1)) {
                    this.editorGroupService.focusGroup(candidate_1);
                }
            }
        };
        EditorGroupsControl.prototype.hide = function (editor, position, layoutAndRochade) {
            var result = Rochade.NONE;
            var visibleEditorCount = this.getVisibleEditorCount();
            var hasEditorInPositionTwo = !!this.visibleEditors[editor_1.Position.TWO];
            var hasEditorInPositionThree = !!this.visibleEditors[editor_1.Position.THREE];
            // If editor is not showing for position, return
            if (editor !== this.visibleEditors[position]) {
                return result;
            }
            // Clear Position
            this.clearPosition(position);
            // Take editor container offdom and hide
            editor.getContainer().offDOM().hide();
            // Adjust layout and rochade if instructed to do so
            if (layoutAndRochade) {
                // Adjust layout: [x] ->
                if (visibleEditorCount === 1) {
                    this.silosSize[position] = 0;
                    this.sashOne.hide();
                    this.sashTwo.hide();
                    this.layoutContainers();
                }
                else if (hasEditorInPositionTwo && !hasEditorInPositionThree) {
                    this.silosSize[editor_1.Position.ONE] = this.totalSize;
                    this.silosSize[editor_1.Position.TWO] = 0;
                    this.sashOne.hide();
                    this.sashTwo.hide();
                    // Move TWO to ONE ([x]|[] -> [])
                    if (position === editor_1.Position.ONE) {
                        this.rochade(editor_1.Position.TWO, editor_1.Position.ONE);
                        result = Rochade.TWO_TO_ONE;
                    }
                    this.layoutContainers();
                }
                else if (hasEditorInPositionTwo && hasEditorInPositionThree) {
                    this.silosSize[editor_1.Position.ONE] = this.totalSize / 2;
                    this.silosSize[editor_1.Position.TWO] = this.totalSize - this.silosSize[editor_1.Position.ONE];
                    this.silosSize[editor_1.Position.THREE] = 0;
                    this.sashOne.layout();
                    this.sashTwo.hide();
                    // Move THREE to TWO ([]|[x]|[] -> [ ]|[ ])
                    if (position === editor_1.Position.TWO) {
                        this.rochade(editor_1.Position.THREE, editor_1.Position.TWO);
                        result = Rochade.THREE_TO_TWO;
                    }
                    else if (position === editor_1.Position.ONE) {
                        this.rochade(editor_1.Position.TWO, editor_1.Position.ONE);
                        this.rochade(editor_1.Position.THREE, editor_1.Position.TWO);
                        result = Rochade.TWO_AND_THREE_TO_ONE;
                    }
                    this.layoutContainers();
                }
            }
            // Automatically pick the next editor as active if any
            if (this.lastActiveEditor === editor) {
                // Clear old
                this.doSetActive(null, null);
                // Find new active position by taking the next one close to the closed one to the left/top
                if (layoutAndRochade) {
                    var newActivePosition = void 0;
                    switch (position) {
                        case editor_1.Position.ONE:
                            newActivePosition = hasEditorInPositionTwo ? editor_1.Position.ONE : null;
                            break;
                        case editor_1.Position.TWO:
                            newActivePosition = editor_1.Position.ONE;
                            break;
                        case editor_1.Position.THREE:
                            newActivePosition = editor_1.Position.TWO;
                            break;
                    }
                    if (!types.isUndefinedOrNull(newActivePosition)) {
                        this.doSetActive(this.visibleEditors[newActivePosition], newActivePosition);
                    }
                }
            }
            return result;
        };
        EditorGroupsControl.prototype.doSetActive = function (editor, newActive) {
            this.lastActivePosition = newActive;
            this.lastActiveEditor = editor;
        };
        EditorGroupsControl.prototype.clearPosition = function (position) {
            // Unregister Listeners
            if (this.visibleEditorFocusTrackers[position]) {
                this.visibleEditorFocusTrackers[position].dispose();
                this.visibleEditorFocusTrackers[position] = null;
            }
            // Clear from active editors
            this.visibleEditors[position] = null;
        };
        EditorGroupsControl.prototype.rochade = function (from, to) {
            // Move container to new position
            var containerFrom = this.silos[from].child();
            containerFrom.appendTo(this.silos[to]);
            var containerTo = this.silos[to].child();
            containerTo.appendTo(this.silos[from]);
            // Inform editor
            var editor = this.visibleEditors[from];
            editor.changePosition(to);
            // Change data structures
            var listeners = this.visibleEditorFocusTrackers[from];
            this.visibleEditorFocusTrackers[to] = listeners;
            this.visibleEditorFocusTrackers[from] = null;
            var minimizedState = this.silosMinimized[from];
            this.silosMinimized[to] = minimizedState;
            this.silosMinimized[from] = null;
            this.visibleEditors[to] = editor;
            this.visibleEditors[from] = null;
            // Update last active position
            if (this.lastActivePosition === from) {
                this.doSetActive(this.lastActiveEditor, to);
            }
        };
        EditorGroupsControl.prototype.move = function (from, to) {
            // Distance 1: Swap Editors
            if (Math.abs(from - to) === 1) {
                // Move containers to new position
                var containerFrom = this.silos[from].child();
                containerFrom.appendTo(this.silos[to]);
                var containerTo = this.silos[to].child();
                containerTo.appendTo(this.silos[from]);
                // Inform Editors
                this.visibleEditors[from].changePosition(to);
                this.visibleEditors[to].changePosition(from);
                // Update last active position accordingly
                if (this.lastActivePosition === from) {
                    this.doSetActive(this.lastActiveEditor, to);
                }
                else if (this.lastActivePosition === to) {
                    this.doSetActive(this.lastActiveEditor, from);
                }
            }
            else {
                // Find new positions
                var newPositionOne = void 0;
                var newPositionTwo = void 0;
                var newPositionThree = void 0;
                if (from === editor_1.Position.ONE) {
                    newPositionOne = editor_1.Position.THREE;
                    newPositionTwo = editor_1.Position.ONE;
                    newPositionThree = editor_1.Position.TWO;
                }
                else {
                    newPositionOne = editor_1.Position.TWO;
                    newPositionTwo = editor_1.Position.THREE;
                    newPositionThree = editor_1.Position.ONE;
                }
                // Move containers to new position
                var containerPos1 = this.silos[editor_1.Position.ONE].child();
                containerPos1.appendTo(this.silos[newPositionOne]);
                var containerPos2 = this.silos[editor_1.Position.TWO].child();
                containerPos2.appendTo(this.silos[newPositionTwo]);
                var containerPos3 = this.silos[editor_1.Position.THREE].child();
                containerPos3.appendTo(this.silos[newPositionThree]);
                // Inform Editors
                this.visibleEditors[editor_1.Position.ONE].changePosition(newPositionOne);
                this.visibleEditors[editor_1.Position.TWO].changePosition(newPositionTwo);
                this.visibleEditors[editor_1.Position.THREE].changePosition(newPositionThree);
                // Update last active position accordingly
                if (this.lastActivePosition === editor_1.Position.ONE) {
                    this.doSetActive(this.lastActiveEditor, newPositionOne);
                }
                else if (this.lastActivePosition === editor_1.Position.TWO) {
                    this.doSetActive(this.lastActiveEditor, newPositionTwo);
                }
                else if (this.lastActivePosition === editor_1.Position.THREE) {
                    this.doSetActive(this.lastActiveEditor, newPositionThree);
                }
            }
            // Change data structures
            arrays.move(this.visibleEditors, from, to);
            arrays.move(this.visibleEditorFocusTrackers, from, to);
            arrays.move(this.silosSize, from, to);
            arrays.move(this.silosMinimized, from, to);
            // Layout
            if (!this.sashOne.isHidden()) {
                this.sashOne.layout();
            }
            if (!this.sashTwo.isHidden()) {
                this.sashTwo.layout();
            }
            this.layoutContainers();
            this.updateStyles();
        };
        EditorGroupsControl.prototype.setGroupOrientation = function (orientation) {
            this.layoutVertically = (orientation !== 'horizontal');
            // Editor Layout
            var verticalLayouting = this.parent.hasClass('vertical-layout');
            if (verticalLayouting !== this.layoutVertically) {
                this.parent.removeClass('vertical-layout', 'horizontal-layout');
                this.parent.addClass(this.layoutVertically ? 'vertical-layout' : 'horizontal-layout');
                this.sashOne.setOrientation(this.layoutVertically ? sash_1.Orientation.VERTICAL : sash_1.Orientation.HORIZONTAL);
                this.sashTwo.setOrientation(this.layoutVertically ? sash_1.Orientation.VERTICAL : sash_1.Orientation.HORIZONTAL);
                // Update styles
                this.updateStyles();
                // Trigger layout
                this.arrangeGroups();
            }
        };
        EditorGroupsControl.prototype.getGroupOrientation = function () {
            return this.layoutVertically ? 'vertical' : 'horizontal';
        };
        EditorGroupsControl.prototype.arrangeGroups = function (arrangement) {
            var _this = this;
            if (!this.dimension) {
                return; // too early
            }
            var availableSize = this.totalSize;
            var visibleEditors = this.getVisibleEditorCount();
            if (visibleEditors <= 1) {
                return; // need more editors
            }
            switch (arrangement) {
                case groupService_1.GroupArrangement.MINIMIZE_OTHERS:
                    // Minimize Others
                    editor_1.POSITIONS.forEach(function (position) {
                        if (_this.visibleEditors[position]) {
                            if (position !== _this.lastActivePosition) {
                                _this.silosSize[position] = _this.minSize;
                                availableSize -= _this.minSize;
                            }
                        }
                    });
                    this.silosSize[this.lastActivePosition] = availableSize;
                    break;
                case groupService_1.GroupArrangement.EVEN:
                    // Even Sizes
                    editor_1.POSITIONS.forEach(function (position) {
                        if (_this.visibleEditors[position]) {
                            _this.silosSize[position] = availableSize / visibleEditors;
                        }
                    });
                    break;
                default:
                    // Minimized editors should remain minimized, others should keep their relative Sizes
                    var oldNonMinimizedTotal_1 = 0;
                    editor_1.POSITIONS.forEach(function (position) {
                        if (_this.visibleEditors[position]) {
                            if (_this.silosMinimized[position]) {
                                _this.silosSize[position] = _this.minSize;
                                availableSize -= _this.minSize;
                            }
                            else {
                                oldNonMinimizedTotal_1 += _this.silosSize[position];
                            }
                        }
                    });
                    // Set size for non-minimized editors
                    var scaleFactor_1 = availableSize / oldNonMinimizedTotal_1;
                    editor_1.POSITIONS.forEach(function (position) {
                        if (_this.visibleEditors[position] && !_this.silosMinimized[position]) {
                            _this.silosSize[position] *= scaleFactor_1;
                        }
                    });
            }
            // Since we triggered a change in minimized/maximized editors, we need
            // to update our stored state of minimized silos accordingly
            this.enableMinimizedState();
            // Layout silos
            this.layoutControl(this.dimension);
        };
        EditorGroupsControl.prototype.getRatio = function () {
            var _this = this;
            var ratio = [];
            if (this.dimension) {
                var fullSize_1 = this.totalSize;
                editor_1.POSITIONS.forEach(function (position) {
                    if (_this.visibleEditors[position]) {
                        ratio.push(_this.silosSize[position] / fullSize_1);
                    }
                });
            }
            return ratio;
        };
        // Resize the editor/group position - changes main axis
        EditorGroupsControl.prototype.resizeGroup = function (position, groupSizeChange) {
            var VISIBLE_EDITORS;
            (function (VISIBLE_EDITORS) {
                VISIBLE_EDITORS[VISIBLE_EDITORS["ONE"] = 1] = "ONE";
                VISIBLE_EDITORS[VISIBLE_EDITORS["TWO"] = 2] = "TWO";
                VISIBLE_EDITORS[VISIBLE_EDITORS["THREE"] = 3] = "THREE";
            })(VISIBLE_EDITORS || (VISIBLE_EDITORS = {}));
            var visibleEditors = this.getVisibleEditorCount();
            if (visibleEditors <= VISIBLE_EDITORS.ONE) {
                return;
            }
            var availableSize = this.totalSize;
            var activeGroupPosition = this.getActivePosition();
            switch (visibleEditors) {
                case VISIBLE_EDITORS.TWO:
                    switch (activeGroupPosition) {
                        case editor_1.Position.ONE:
                            this.silosSize[editor_1.Position.ONE] = this.boundSiloSize(editor_1.Position.ONE, groupSizeChange);
                            this.silosSize[editor_1.Position.TWO] = availableSize - this.silosSize[editor_1.Position.ONE];
                            break;
                        case editor_1.Position.TWO:
                            this.silosSize[editor_1.Position.TWO] = this.boundSiloSize(editor_1.Position.TWO, groupSizeChange);
                            this.silosSize[editor_1.Position.ONE] = availableSize - this.silosSize[editor_1.Position.TWO];
                        default:
                            break;
                    }
                    break;
                case VISIBLE_EDITORS.THREE:
                    switch (activeGroupPosition) {
                        case editor_1.Position.ONE:
                            this.silosSize[editor_1.Position.ONE] = this.boundSiloSize(editor_1.Position.ONE, groupSizeChange);
                            this.distributeRemainingSilosSize(editor_1.Position.TWO, editor_1.Position.THREE, availableSize - this.silosSize[editor_1.Position.ONE]);
                            break;
                        case editor_1.Position.TWO:
                            this.silosSize[editor_1.Position.TWO] = this.boundSiloSize(editor_1.Position.TWO, groupSizeChange);
                            this.distributeRemainingSilosSize(editor_1.Position.ONE, editor_1.Position.THREE, availableSize - this.silosSize[editor_1.Position.TWO]);
                            break;
                        case editor_1.Position.THREE:
                            this.silosSize[editor_1.Position.THREE] = this.boundSiloSize(editor_1.Position.THREE, groupSizeChange);
                            this.distributeRemainingSilosSize(editor_1.Position.ONE, editor_1.Position.TWO, availableSize - this.silosSize[editor_1.Position.THREE]);
                            break;
                        default:
                            break;
                    }
                default:
                    break;
            }
            this.layout(this.dimension);
        };
        EditorGroupsControl.prototype.boundSiloSize = function (siloPosition, sizeChangePx) {
            var visibleEditors = this.getVisibleEditorCount();
            var newSiloSize = 0;
            newSiloSize = Math.max(this.minSize, this.silosSize[siloPosition] + sizeChangePx);
            newSiloSize = Math.min(newSiloSize, (this.totalSize - this.minSize * (visibleEditors - 1)));
            return newSiloSize;
        };
        EditorGroupsControl.prototype.distributeRemainingSilosSize = function (remPosition1, remPosition2, availableSize) {
            var scaleFactor = 0;
            scaleFactor = this.silosSize[remPosition1] / (this.silosSize[remPosition1] + this.silosSize[remPosition2]);
            this.silosSize[remPosition1] = scaleFactor * availableSize;
            this.silosSize[remPosition1] = Math.max(this.silosSize[remPosition1], this.minSize);
            this.silosSize[remPosition1] = Math.min(this.silosSize[remPosition1], (availableSize - this.minSize));
            this.silosSize[remPosition2] = availableSize - this.silosSize[remPosition1];
        };
        EditorGroupsControl.prototype.getActiveEditor = function () {
            return this.lastActiveEditor;
        };
        EditorGroupsControl.prototype.getActivePosition = function () {
            return this.lastActivePosition;
        };
        EditorGroupsControl.prototype.create = function () {
            var _this = this;
            // Store layout as class property
            this.parent.addClass(this.layoutVertically ? 'vertical-layout' : 'horizontal-layout');
            // Allow to drop into container to open
            this.enableDropTarget(this.parent.getHTMLElement());
            // Silo One
            this.silos[editor_1.Position.ONE] = builder_1.$(this.parent).div({ class: 'one-editor-silo editor-one' });
            // Sash One
            this.sashOne = new sash_1.Sash(this.parent.getHTMLElement(), this, { baseSize: 5, orientation: this.layoutVertically ? sash_1.Orientation.VERTICAL : sash_1.Orientation.HORIZONTAL });
            this.toUnbind.push(this.sashOne.addListener('start', function () { return _this.onSashOneDragStart(); }));
            this.toUnbind.push(this.sashOne.addListener('change', function (e) { return _this.onSashOneDrag(e); }));
            this.toUnbind.push(this.sashOne.addListener('end', function () { return _this.onSashOneDragEnd(); }));
            this.toUnbind.push(this.sashOne.addListener('reset', function () { return _this.onSashOneReset(); }));
            this.sashOne.hide();
            // Silo Two
            this.silos[editor_1.Position.TWO] = builder_1.$(this.parent).div({ class: 'one-editor-silo editor-two' });
            // Sash Two
            this.sashTwo = new sash_1.Sash(this.parent.getHTMLElement(), this, { baseSize: 5, orientation: this.layoutVertically ? sash_1.Orientation.VERTICAL : sash_1.Orientation.HORIZONTAL });
            this.toUnbind.push(this.sashTwo.addListener('start', function () { return _this.onSashTwoDragStart(); }));
            this.toUnbind.push(this.sashTwo.addListener('change', function (e) { return _this.onSashTwoDrag(e); }));
            this.toUnbind.push(this.sashTwo.addListener('end', function () { return _this.onSashTwoDragEnd(); }));
            this.toUnbind.push(this.sashTwo.addListener('reset', function () { return _this.onSashTwoReset(); }));
            this.sashTwo.hide();
            // Silo Three
            this.silos[editor_1.Position.THREE] = builder_1.$(this.parent).div({ class: 'one-editor-silo editor-three' });
            // For each position
            editor_1.POSITIONS.forEach(function (position) {
                var silo = _this.silos[position];
                // Containers (they contain everything and can move between silos)
                var container = builder_1.$(silo).div({ 'class': 'container' });
                // InstantiationServices
                var instantiationService = _this.instantiationService.createChild(new serviceCollection_1.ServiceCollection([contextkey_1.IContextKeyService, _this.contextKeyService.createScoped(container.getHTMLElement())]));
                container.setProperty(EditorGroupsControl.INSTANTIATION_SERVICE_KEY, instantiationService); // associate with container
                // Title containers
                var titleContainer = builder_1.$(container).div({ 'class': 'title' });
                if (_this.tabOptions.showTabs) {
                    titleContainer.addClass('tabs');
                }
                if (_this.tabOptions.showIcons) {
                    titleContainer.addClass('show-file-icons');
                }
                _this.hookTitleDragListener(titleContainer);
                // Title Control
                _this.createTitleControl(_this.stacks.groupAt(position), silo, titleContainer, instantiationService);
                // Progress Bar
                var progressBar = new progressbar_1.ProgressBar(builder_1.$(container));
                _this.toUnbind.push(styler_1.attachProgressBarStyler(progressBar, _this.themeService));
                progressBar.getContainer().hide();
                container.setProperty(EditorGroupsControl.PROGRESS_BAR_CONTROL_KEY, progressBar); // associate with container
            });
            // Update Styles
            this.updateStyles();
        };
        EditorGroupsControl.prototype.updateStyles = function () {
            var _this = this;
            _super.prototype.updateStyles.call(this);
            // Editor container colors
            this.silos.forEach(function (silo, index) {
                // Background
                silo.style('background-color', _this.getColor(colorRegistry_1.editorBackground));
                // Border
                silo.style('border-left-color', index > editor_1.Position.ONE ? (_this.getColor(theme_1.EDITOR_GROUP_BORDER) || _this.getColor(colorRegistry_1.contrastBorder)) : null);
                silo.style('border-top-color', index > editor_1.Position.ONE ? (_this.getColor(theme_1.EDITOR_GROUP_BORDER) || _this.getColor(colorRegistry_1.contrastBorder)) : null);
            });
            // Title control
            editor_1.POSITIONS.forEach(function (position) {
                var container = _this.getTitleAreaControl(position).getContainer();
                var borderColor = _this.getColor(theme_1.EDITOR_GROUP_HEADER_TABS_BORDER) || _this.getColor(colorRegistry_1.contrastBorder);
                container.style.backgroundColor = _this.getColor(_this.tabOptions.showTabs ? theme_1.EDITOR_GROUP_HEADER_TABS_BACKGROUND : theme_1.EDITOR_GROUP_HEADER_NO_TABS_BACKGROUND);
                container.style.borderBottomWidth = (borderColor && _this.tabOptions.showTabs) ? '1px' : null;
                container.style.borderBottomStyle = (borderColor && _this.tabOptions.showTabs) ? 'solid' : null;
                container.style.borderBottomColor = _this.tabOptions.showTabs ? borderColor : null;
            });
        };
        EditorGroupsControl.prototype.enableDropTarget = function (node) {
            var _this = this;
            var $this = this;
            var overlayId = 'monaco-workbench-editor-drop-overlay';
            var splitToPropertyKey = 'splitToPosition';
            var stacks = this.editorGroupService.getStacksModel();
            var overlay;
            function cleanUp() {
                if (overlay) {
                    overlay.destroy();
                    overlay = void 0;
                }
                editor_1.POSITIONS.forEach(function (p) {
                    $this.silos[p].removeClass('dragged-over');
                });
            }
            function optionsFromDraggedEditor(identifier) {
                // When moving an editor, try to preserve as much view state as possible by checking
                // for th editor to be a text editor and creating the options accordingly if so
                var options = editor_2.EditorOptions.create({ pinned: true });
                var activeEditor = $this.editorService.getActiveEditor();
                var editor = codeEditorService_1.getCodeEditor(activeEditor);
                if (editor && activeEditor.position === stacks.positionOfGroup(identifier.group) && identifier.editor.matches(activeEditor.input)) {
                    options = editor_2.TextEditorOptions.fromEditor(editor, { pinned: true });
                }
                return options;
            }
            function onDrop(e, position, splitTo) {
                $this.updateFromDropping(node, false);
                cleanUp();
                var editorService = $this.editorService;
                var groupService = $this.editorGroupService;
                var splitEditor = (typeof splitTo === 'number');
                var freeGroup = (stacks.groups.length === 1) ? editor_1.Position.TWO : editor_1.Position.THREE;
                // Check for transfer from title control
                var draggedEditor = titleControl_1.TitleControl.getDraggedEditor();
                if (draggedEditor) {
                    var isCopy = (e.ctrlKey && !platform_1.isMacintosh) || (e.altKey && platform_1.isMacintosh);
                    // Copy editor to new location
                    if (isCopy) {
                        if (splitEditor) {
                            editorService.openEditor(draggedEditor.editor, optionsFromDraggedEditor(draggedEditor), freeGroup).then(function () {
                                if (splitTo !== freeGroup) {
                                    groupService.moveGroup(freeGroup, splitTo);
                                }
                            }).done(null, errors.onUnexpectedError);
                        }
                        else {
                            editorService.openEditor(draggedEditor.editor, optionsFromDraggedEditor(draggedEditor), position).done(null, errors.onUnexpectedError);
                        }
                    }
                    else {
                        var sourcePosition = stacks.positionOfGroup(draggedEditor.group);
                        if (splitEditor) {
                            if (draggedEditor.group.count === 1) {
                                groupService.moveGroup(sourcePosition, splitTo);
                            }
                            else {
                                editorService.openEditor(draggedEditor.editor, optionsFromDraggedEditor(draggedEditor), freeGroup).then(function () {
                                    if (splitTo !== freeGroup) {
                                        groupService.moveGroup(freeGroup, splitTo);
                                    }
                                    groupService.moveEditor(draggedEditor.editor, stacks.positionOfGroup(draggedEditor.group), splitTo);
                                }).done(null, errors.onUnexpectedError);
                            }
                        }
                        else {
                            groupService.moveEditor(draggedEditor.editor, sourcePosition, position);
                        }
                    }
                }
                else {
                    var droppedResources_1 = dnd_1.extractResources(e).filter(function (r) { return r.resource.scheme === 'file' || r.resource.scheme === 'untitled'; });
                    if (droppedResources_1.length) {
                        titleControl_1.handleWorkspaceExternalDrop(droppedResources_1, $this.fileService, $this.messageService, $this.windowsService, $this.windowService, $this.workspacesService).then(function (handled) {
                            if (handled) {
                                return;
                            }
                            // Add external ones to recently open list
                            var externalResources = droppedResources_1.filter(function (d) { return d.isExternal; }).map(function (d) { return d.resource; });
                            if (externalResources.length) {
                                $this.windowsService.addRecentlyOpened(externalResources.map(function (resource) { return resource.fsPath; }));
                            }
                            // Open in Editor
                            $this.windowService.focusWindow()
                                .then(function () { return editorService.openEditors(droppedResources_1.map(function (d) {
                                return {
                                    input: { resource: d.resource, options: { pinned: true } },
                                    position: splitEditor ? freeGroup : position
                                };
                            })); }).then(function () {
                                if (splitEditor && splitTo !== freeGroup) {
                                    groupService.moveGroup(freeGroup, splitTo);
                                }
                                groupService.focusGroup(splitEditor ? splitTo : position);
                            })
                                .done(null, errors.onUnexpectedError);
                        });
                    }
                }
            }
            function positionOverlay(e, groups, position) {
                var target = e.target;
                var overlayIsSplit = typeof overlay.getProperty(splitToPropertyKey) === 'number';
                var isCopy = (e.ctrlKey && !platform_1.isMacintosh) || (e.altKey && platform_1.isMacintosh);
                var draggedEditor = titleControl_1.TitleControl.getDraggedEditor();
                var overlaySize = $this.layoutVertically ? target.clientWidth : target.clientHeight;
                var splitThreshold = overlayIsSplit ? overlaySize / 5 : overlaySize / 10;
                var posOnOverlay = $this.layoutVertically ? e.offsetX : e.offsetY;
                var isOverSplitLeftOrUp = posOnOverlay < splitThreshold;
                var isOverSplitRightOrBottom = posOnOverlay + splitThreshold > overlaySize;
                var splitTarget;
                // No splitting if we reached maximum group count
                if (groups === editor_1.POSITIONS.length) {
                    splitTarget = null;
                }
                else if (!isCopy && draggedEditor && draggedEditor.group.count === 1) {
                    var positionOfDraggedEditor = stacks.positionOfGroup(draggedEditor.group);
                    switch (positionOfDraggedEditor) {
                        case editor_1.Position.ONE:
                            if (position === editor_1.Position.TWO && isOverSplitRightOrBottom) {
                                splitTarget = editor_1.Position.TWO; // allow to move single editor from ONE to TWO
                            }
                            break;
                        case editor_1.Position.TWO:
                            if (position === editor_1.Position.ONE && isOverSplitLeftOrUp) {
                                splitTarget = editor_1.Position.ONE; // allow to move single editor from TWO to ONE
                            }
                            break;
                        default:
                            splitTarget = null; // splitting not allowed
                    }
                }
                else {
                    if (isOverSplitRightOrBottom) {
                        splitTarget = (position === editor_1.Position.ONE) ? editor_1.Position.TWO : editor_1.Position.THREE;
                    }
                    else if (isOverSplitLeftOrUp) {
                        splitTarget = (position === editor_1.Position.ONE) ? editor_1.Position.ONE : editor_1.Position.TWO;
                    }
                }
                // Apply split target
                var canSplit = (typeof splitTarget === 'number');
                if (canSplit) {
                    overlay.setProperty(splitToPropertyKey, splitTarget);
                }
                else {
                    overlay.removeProperty(splitToPropertyKey);
                }
                // Update overlay styles
                if (canSplit && isOverSplitRightOrBottom) {
                    overlay.style($this.layoutVertically ? { left: '50%', width: '50%' } : { top: '50%', height: '50%' });
                }
                else if (canSplit && isOverSplitLeftOrUp) {
                    overlay.style($this.layoutVertically ? { width: '50%' } : { height: '50%' });
                }
                else {
                    if ($this.layoutVertically) {
                        overlay.style({ left: '0', width: '100%' });
                    }
                    else {
                        overlay.style({ top: $this.tabOptions.showTabs ? EditorGroupsControl.EDITOR_TITLE_HEIGHT + "px" : 0, height: $this.tabOptions.showTabs ? "calc(100% - " + EditorGroupsControl.EDITOR_TITLE_HEIGHT + "px" : '100%' });
                    }
                }
                // Make sure the overlay is visible
                overlay.style({ opacity: 1 });
                // Indicate a drag over is happening
                editor_1.POSITIONS.forEach(function (p) {
                    if (p === position) {
                        $this.silos[p].addClass('dragged-over');
                    }
                    else {
                        $this.silos[p].removeClass('dragged-over');
                    }
                });
            }
            function createOverlay(target) {
                if (!overlay) {
                    var containers_1 = $this.visibleEditors.filter(function (e) { return !!e; }).map(function (e) { return e.getContainer(); });
                    containers_1.forEach(function (container, index) {
                        if (container && DOM.isAncestor(target, container.getHTMLElement())) {
                            var activeContrastBorderColor = $this.getColor(colorRegistry_1.activeContrastBorder);
                            overlay = builder_1.$('div').style({
                                top: $this.tabOptions.showTabs ? EditorGroupsControl.EDITOR_TITLE_HEIGHT + "px" : 0,
                                height: $this.tabOptions.showTabs ? "calc(100% - " + EditorGroupsControl.EDITOR_TITLE_HEIGHT + "px" : '100%',
                                backgroundColor: $this.getColor(theme_1.EDITOR_DRAG_AND_DROP_BACKGROUND),
                                outlineColor: activeContrastBorderColor,
                                outlineOffset: activeContrastBorderColor ? '-2px' : null,
                                outlineStyle: activeContrastBorderColor ? 'dashed' : null,
                                outlineWidth: activeContrastBorderColor ? '2px' : null
                            }).id(overlayId);
                            overlay.appendTo(container);
                            overlay.on(DOM.EventType.DROP, function (e) {
                                DOM.EventHelper.stop(e, true);
                                onDrop(e, index, overlay.getProperty(splitToPropertyKey));
                            });
                            overlay.on(DOM.EventType.DRAG_OVER, function (e) {
                                positionOverlay(e, containers_1.length, index);
                            });
                            overlay.on([DOM.EventType.DRAG_LEAVE, DOM.EventType.DRAG_END], function () {
                                cleanUp();
                            });
                            // Under some circumstances we have seen reports where the drop overlay is not being
                            // cleaned up and as such the editor area remains under the overlay so that you cannot
                            // type into the editor anymore. This seems related to using VMs and DND via host and
                            // guest OS, though some users also saw it without VMs.
                            // To protect against this issue we always destroy the overlay as soon as we detect a
                            // mouse event over it. The delay is used to guarantee we are not interfering with the
                            // actual DROP event that can also trigger a mouse over event.
                            overlay.once(DOM.EventType.MOUSE_OVER, function () {
                                setTimeout(function () {
                                    cleanUp();
                                }, 300);
                            });
                        }
                    });
                }
            }
            // let a dropped file open inside Code (only if dropped over editor area)
            this.toUnbind.push(DOM.addDisposableListener(node, DOM.EventType.DROP, function (e) {
                if (e.target === node || DOM.isAncestor(e.target, node)) {
                    DOM.EventHelper.stop(e, true);
                    onDrop(e, editor_1.Position.ONE);
                }
                else {
                    _this.updateFromDropping(node, false);
                }
            }));
            // Drag enter
            var counter = 0; // see https://github.com/Microsoft/vscode/issues/14470
            this.toUnbind.push(DOM.addDisposableListener(node, DOM.EventType.DRAG_ENTER, function (e) {
                if (!titleControl_1.TitleControl.getDraggedEditor()) {
                    // we used to check for the dragged resources here (via dnd.extractResources()) but this
                    // seems to be not possible on Linux and Windows where during DRAG_ENTER the resources
                    // are always undefined up until they are dropped when dragged from the tree. The workaround
                    // is to check for a datatransfer type being set. See https://github.com/Microsoft/vscode/issues/25789
                    if (!e.dataTransfer.types.length) {
                        return; // invalid DND
                    }
                }
                counter++;
                _this.updateFromDropping(node, true);
                var target = e.target;
                if (target) {
                    if (overlay && target.id !== overlayId) {
                        cleanUp(); // somehow we managed to move the mouse quickly out of the current overlay, so destroy it
                    }
                    createOverlay(target);
                    if (overlay) {
                        _this.updateFromDropping(node, false); // if we show an overlay, we can remove the drop feedback from the editor background
                    }
                }
            }));
            // Drag leave
            this.toUnbind.push(DOM.addDisposableListener(node, DOM.EventType.DRAG_LEAVE, function (e) {
                counter--;
                if (counter === 0) {
                    _this.updateFromDropping(node, false);
                }
            }));
            // Drag end (also install globally to be safe)
            [node, window].forEach(function (container) {
                _this.toUnbind.push(DOM.addDisposableListener(container, DOM.EventType.DRAG_END, function (e) {
                    counter = 0;
                    _this.updateFromDropping(node, false);
                    cleanUp();
                }));
            });
        };
        EditorGroupsControl.prototype.createTitleControl = function (context, silo, container, instantiationService) {
            var titleAreaControl = instantiationService.createInstance(this.tabOptions.showTabs ? tabsTitleControl_1.TabsTitleControl : noTabsTitleControl_1.NoTabsTitleControl);
            titleAreaControl.create(container.getHTMLElement());
            titleAreaControl.setContext(context);
            titleAreaControl.refresh(true /* instant */);
            silo.child().setProperty(EditorGroupsControl.TITLE_AREA_CONTROL_KEY, titleAreaControl); // associate with container
        };
        EditorGroupsControl.prototype.findPosition = function (element) {
            var parent = element.parentElement;
            while (parent) {
                for (var i = 0; i < editor_1.POSITIONS.length; i++) {
                    var position = editor_1.POSITIONS[i];
                    if (this.silos[position].getHTMLElement() === parent) {
                        return position;
                    }
                }
                parent = parent.parentElement;
            }
            return null;
        };
        EditorGroupsControl.prototype.hookTitleDragListener = function (titleContainer) {
            var _this = this;
            var wasDragged = false;
            // Allow to reorder positions by dragging the title
            titleContainer.on(DOM.EventType.MOUSE_DOWN, function (e) {
                var position = _this.findPosition(titleContainer.getHTMLElement());
                var titleAreaControl = _this.getTitleAreaControl(position);
                if (!titleAreaControl.allowDragging((e.target || e.srcElement))) {
                    return; // return early if we are not in the drag zone of the title widget
                }
                // Reset flag
                wasDragged = false;
                titleAreaControl.setDragged(false);
                // Return early if there is only one editor active or the user clicked into the toolbar
                if (_this.getVisibleEditorCount() <= 1) {
                    return;
                }
                // Only allow for first mouse button click!
                if (e.button !== 0) {
                    return;
                }
                DOM.EventHelper.stop(e);
                // Overlay the editor area with a div to be able to capture all mouse events
                // Do NOT cover the title area to prevent missing double click events!
                var overlayDiv = builder_1.$('div').style({
                    top: EditorGroupsControl.EDITOR_TITLE_HEIGHT + "px",
                    height: "calc(100% - " + EditorGroupsControl.EDITOR_TITLE_HEIGHT + "px)"
                }).id('monaco-workbench-editor-move-overlay');
                overlayDiv.appendTo(_this.silos[position]);
                // Update flag
                _this.dragging = true;
                var visibleEditorCount = _this.getVisibleEditorCount();
                var mouseDownEvent = new mouseEvent_1.StandardMouseEvent(e);
                var startPos = _this.layoutVertically ? mouseDownEvent.posx : mouseDownEvent.posy;
                var oldNewPos = null;
                _this.silos[position].addClass('drag');
                var $window = builder_1.$(window);
                $window.on(DOM.EventType.MOUSE_MOVE, function (e) {
                    DOM.EventHelper.stop(e, false);
                    var mouseMoveEvent = new mouseEvent_1.StandardMouseEvent(e);
                    var diffPos = (_this.layoutVertically ? mouseMoveEvent.posx : mouseMoveEvent.posy) - startPos;
                    var newPos = null;
                    if (Math.abs(diffPos) > 5) {
                        wasDragged = true;
                    }
                    switch (position) {
                        // [ ! ]|[ ]: Moves only to the right/bottom but not outside of dimension to the right/bottom
                        case editor_1.Position.ONE: {
                            newPos = Math.max(-1 /* 1px border accomodation */, Math.min(diffPos, _this.totalSize - _this.silosSize[editor_1.Position.ONE]));
                            break;
                        }
                        case editor_1.Position.TWO: {
                            // [ ]|[ ! ]: Moves only to the left/top but not outside of dimension to the left/top
                            if (visibleEditorCount === 2) {
                                newPos = Math.min(_this.silosSize[editor_1.Position.ONE], Math.max(-1 /* 1px border accomodation */, _this.silosSize[editor_1.Position.ONE] + diffPos));
                            }
                            else {
                                newPos = Math.min(_this.totalSize - _this.silosSize[editor_1.Position.TWO], Math.max(-1 /* 1px border accomodation */, _this.silosSize[editor_1.Position.ONE] + diffPos));
                            }
                            break;
                        }
                        // [ ]|[ ]|[ ! ]: Moves to the right/bottom but not outside of dimension on the left/top side
                        case editor_1.Position.THREE: {
                            newPos = Math.min(_this.silosSize[editor_1.Position.ONE] + _this.silosSize[editor_1.Position.TWO], Math.max(-1 /* 1px border accomodation */, _this.silosSize[editor_1.Position.ONE] + _this.silosSize[editor_1.Position.TWO] + diffPos));
                            break;
                        }
                    }
                    // Return early if position did not change
                    if (oldNewPos === newPos) {
                        return;
                    }
                    oldNewPos = newPos;
                    // Live drag Feedback
                    var moveTo = _this.findMoveTarget(position, diffPos);
                    switch (position) {
                        case editor_1.Position.ONE: {
                            if (moveTo === editor_1.Position.ONE || moveTo === null) {
                                _this.posSilo(editor_1.Position.TWO, _this.silosSize[editor_1.Position.ONE] + "px", 'auto', '1px');
                                _this.posSilo(editor_1.Position.THREE, 'auto', 0);
                            }
                            else if (moveTo === editor_1.Position.TWO) {
                                _this.posSilo(editor_1.Position.TWO, 0, 'auto', 0);
                                _this.silos[editor_1.Position.TWO].addClass('draggedunder');
                                _this.posSilo(editor_1.Position.THREE, 'auto', 0);
                            }
                            else if (moveTo === editor_1.Position.THREE) {
                                _this.posSilo(editor_1.Position.TWO, 0, 'auto');
                                _this.posSilo(editor_1.Position.THREE, 'auto', _this.silosSize[editor_1.Position.ONE] + "px");
                                _this.silos[editor_1.Position.THREE].addClass('draggedunder');
                            }
                            break;
                        }
                        case editor_1.Position.TWO: {
                            if (moveTo === editor_1.Position.ONE) {
                                _this.posSilo(editor_1.Position.ONE, _this.silosSize[editor_1.Position.TWO] + "px", 'auto');
                                _this.silos[editor_1.Position.ONE].addClass('draggedunder');
                            }
                            else if (moveTo === editor_1.Position.TWO || moveTo === null) {
                                _this.posSilo(editor_1.Position.ONE, 0, 'auto');
                                _this.posSilo(editor_1.Position.THREE, 'auto', 0);
                            }
                            else if (moveTo === editor_1.Position.THREE) {
                                _this.posSilo(editor_1.Position.THREE, 'auto', _this.silosSize[editor_1.Position.TWO] + "px");
                                _this.silos[editor_1.Position.THREE].addClass('draggedunder');
                                _this.posSilo(editor_1.Position.ONE, 0, 'auto');
                            }
                            break;
                        }
                        case editor_1.Position.THREE: {
                            if (moveTo === editor_1.Position.ONE) {
                                _this.posSilo(editor_1.Position.ONE, _this.silosSize[editor_1.Position.THREE] + "px", 'auto');
                                _this.silos[editor_1.Position.ONE].addClass('draggedunder');
                            }
                            else if (moveTo === editor_1.Position.TWO) {
                                _this.posSilo(editor_1.Position.ONE, 0, 'auto');
                                _this.posSilo(editor_1.Position.TWO, _this.silosSize[editor_1.Position.ONE] + _this.silosSize[editor_1.Position.THREE] + "px", 'auto');
                                _this.silos[editor_1.Position.TWO].addClass('draggedunder');
                            }
                            else if (moveTo === editor_1.Position.THREE || moveTo === null) {
                                _this.posSilo(editor_1.Position.ONE, 0, 'auto');
                                _this.posSilo(editor_1.Position.TWO, _this.silosSize[editor_1.Position.ONE] + "px", 'auto');
                            }
                            break;
                        }
                    }
                    // Move the editor to provide feedback to the user and add class
                    if (newPos !== null) {
                        _this.posSilo(position, newPos + "px");
                        _this.updateFromDragging(position, true);
                    }
                }).once(DOM.EventType.MOUSE_UP, function (e) {
                    DOM.EventHelper.stop(e, false);
                    // Destroy overlay
                    overlayDiv.destroy();
                    // Update flag
                    _this.dragging = false;
                    if (wasDragged) {
                        titleAreaControl.setDragged(true);
                    }
                    // Restore styles
                    _this.silos[position].removeClass('drag');
                    _this.updateFromDragging(position, false);
                    editor_1.POSITIONS.forEach(function (p) { return _this.silos[p].removeClass('draggedunder'); });
                    _this.posSilo(editor_1.Position.ONE, 0, 'auto');
                    _this.posSilo(editor_1.Position.TWO, 'auto', 'auto', '1px');
                    _this.posSilo(editor_1.Position.THREE, 'auto', 0);
                    // Find move target
                    var mouseUpEvent = new mouseEvent_1.StandardMouseEvent(e);
                    var diffPos = (_this.layoutVertically ? mouseUpEvent.posx : mouseUpEvent.posy) - startPos;
                    var moveTo = _this.findMoveTarget(position, diffPos);
                    // Move to valid position if any
                    if (moveTo !== null) {
                        _this.editorGroupService.moveGroup(position, moveTo);
                    }
                    else {
                        _this.layoutContainers();
                    }
                    // If not dragging, make editor group active unless already active
                    if (!wasDragged && position !== _this.getActivePosition()) {
                        _this.editorGroupService.focusGroup(position);
                    }
                    $window.off('mousemove');
                });
            });
        };
        EditorGroupsControl.prototype.updateFromDragging = function (position, isDragging) {
            var silo = this.silos[position];
            if (silo.hasClass('dragging') === isDragging) {
                return; // avoid repeated work
            }
            var borderColor = null;
            if (isDragging) {
                this.parent.addClass('dragging');
                silo.addClass('dragging');
                borderColor = this.getColor(theme_1.EDITOR_GROUP_BORDER) || this.getColor(colorRegistry_1.contrastBorder);
            }
            else {
                this.parent.removeClass('dragging');
                silo.removeClass('dragging');
            }
            silo.style(this.layoutVertically ? 'border-left-color' : 'border-top-color', borderColor);
            silo.style(this.layoutVertically ? 'border-right-color' : 'border-bottom-color', borderColor);
            // Back to normal styles once dragging stops
            if (!isDragging) {
                this.updateStyles();
            }
        };
        EditorGroupsControl.prototype.updateFromDropping = function (element, isDropping) {
            var groupCount = this.stacks.groups.length;
            var background = this.getColor(isDropping ? theme_1.EDITOR_DRAG_AND_DROP_BACKGROUND : groupCount > 0 ? theme_1.EDITOR_GROUP_BACKGROUND : null);
            element.style.backgroundColor = background;
            var activeContrastBorderColor = this.getColor(colorRegistry_1.activeContrastBorder);
            element.style.outlineColor = isDropping ? activeContrastBorderColor : null;
            element.style.outlineStyle = isDropping && activeContrastBorderColor ? 'dashed' : null;
            element.style.outlineWidth = isDropping && activeContrastBorderColor ? '2px' : null;
            element.style.outlineOffset = isDropping && activeContrastBorderColor ? '-2px' : null;
        };
        EditorGroupsControl.prototype.posSilo = function (pos, leftTop, rightBottom, borderLeftTopWidth) {
            var style;
            if (this.layoutVertically) {
                style = { left: leftTop };
                if (typeof rightBottom === 'number' || typeof rightBottom === 'string') {
                    style['right'] = rightBottom;
                }
                if (typeof borderLeftTopWidth === 'number' || typeof borderLeftTopWidth === 'string') {
                    style['borderLeftWidth'] = borderLeftTopWidth;
                }
            }
            else {
                style = { top: leftTop };
                if (typeof rightBottom === 'number' || typeof rightBottom === 'string') {
                    style['bottom'] = rightBottom;
                }
                if (typeof borderLeftTopWidth === 'number' || typeof borderLeftTopWidth === 'string') {
                    style['borderTopWidth'] = borderLeftTopWidth;
                }
            }
            this.silos[pos].style(style);
        };
        EditorGroupsControl.prototype.findMoveTarget = function (position, diffPos) {
            var visibleEditorCount = this.getVisibleEditorCount();
            switch (position) {
                case editor_1.Position.ONE: {
                    // [ ! ]|[] -> []|[ ! ]
                    if (visibleEditorCount === 2 && (diffPos >= this.silosSize[editor_1.Position.ONE] / 2 || diffPos >= this.silosSize[editor_1.Position.TWO] / 2)) {
                        return editor_1.Position.TWO;
                    }
                    // [ ! ]|[]|[] -> []|[]|[ ! ]
                    if (visibleEditorCount === 3 && (diffPos >= this.silosSize[editor_1.Position.ONE] / 2 + this.silosSize[editor_1.Position.TWO] || diffPos >= this.silosSize[editor_1.Position.THREE] / 2 + this.silosSize[editor_1.Position.TWO])) {
                        return editor_1.Position.THREE;
                    }
                    // [ ! ]|[]|[] -> []|[ ! ]|[]
                    if (visibleEditorCount === 3 && (diffPos >= this.silosSize[editor_1.Position.ONE] / 2 || diffPos >= this.silosSize[editor_1.Position.TWO] / 2)) {
                        return editor_1.Position.TWO;
                    }
                    break;
                }
                case editor_1.Position.TWO: {
                    if (visibleEditorCount === 2 && diffPos > 0) {
                        return null; // Return early since TWO cannot be moved to the THREE unless there is a THREE position
                    }
                    // []|[ ! ] -> [ ! ]|[]
                    if (visibleEditorCount === 2 && (Math.abs(diffPos) >= this.silosSize[editor_1.Position.TWO] / 2 || Math.abs(diffPos) >= this.silosSize[editor_1.Position.ONE] / 2)) {
                        return editor_1.Position.ONE;
                    }
                    // []|[ ! ]|[] -> [ ! ]|[]|[]
                    if (visibleEditorCount === 3 && ((diffPos < 0 && Math.abs(diffPos) >= this.silosSize[editor_1.Position.TWO] / 2) || (diffPos < 0 && Math.abs(diffPos) >= this.silosSize[editor_1.Position.ONE] / 2))) {
                        return editor_1.Position.ONE;
                    }
                    // []|[ ! ]|[] -> []|[]|[ ! ]
                    if (visibleEditorCount === 3 && ((diffPos > 0 && Math.abs(diffPos) >= this.silosSize[editor_1.Position.TWO] / 2) || (diffPos > 0 && Math.abs(diffPos) >= this.silosSize[editor_1.Position.THREE] / 2))) {
                        return editor_1.Position.THREE;
                    }
                    break;
                }
                case editor_1.Position.THREE: {
                    if (diffPos > 0) {
                        return null; // Return early since THREE cannot be moved more to the THREE
                    }
                    // []|[]|[ ! ] -> [ ! ]|[]|[]
                    if (Math.abs(diffPos) >= this.silosSize[editor_1.Position.THREE] / 2 + this.silosSize[editor_1.Position.TWO] || Math.abs(diffPos) >= this.silosSize[editor_1.Position.ONE] / 2 + this.silosSize[editor_1.Position.TWO]) {
                        return editor_1.Position.ONE;
                    }
                    // []|[]|[ ! ] -> []|[ ! ]|[]
                    if (Math.abs(diffPos) >= this.silosSize[editor_1.Position.THREE] / 2 || Math.abs(diffPos) >= this.silosSize[editor_1.Position.TWO] / 2) {
                        return editor_1.Position.TWO;
                    }
                    break;
                }
            }
            return null;
        };
        EditorGroupsControl.prototype.centerSash = function (a, b) {
            var sumSize = this.silosSize[a] + this.silosSize[b];
            var meanSize = sumSize / 2;
            this.silosSize[a] = meanSize;
            this.silosSize[b] = sumSize - meanSize;
            this.layoutContainers();
        };
        EditorGroupsControl.prototype.onSashOneDragStart = function () {
            this.startSiloOneSize = this.silosSize[editor_1.Position.ONE];
        };
        EditorGroupsControl.prototype.onSashOneDrag = function (e) {
            var oldSiloOneSize = this.silosSize[editor_1.Position.ONE];
            var diffSize = this.layoutVertically ? (e.currentX - e.startX) : (e.currentY - e.startY);
            var newSiloOneSize = this.startSiloOneSize + diffSize;
            // Side-by-Side
            if (this.sashTwo.isHidden()) {
                // []|[      ] : left/top side can not get smaller than the minimal editor size
                if (newSiloOneSize < this.minSize) {
                    newSiloOneSize = this.minSize;
                }
                else if (this.totalSize - newSiloOneSize < this.minSize) {
                    newSiloOneSize = this.totalSize - this.minSize;
                }
                else if (newSiloOneSize - this.snapToMinimizeThresholdSize <= this.minSize) {
                    newSiloOneSize = this.minSize;
                }
                else if (this.totalSize - newSiloOneSize - this.snapToMinimizeThresholdSize <= this.minSize) {
                    newSiloOneSize = this.totalSize - this.minSize;
                }
                this.silosSize[editor_1.Position.ONE] = newSiloOneSize;
                this.silosSize[editor_1.Position.TWO] = this.totalSize - newSiloOneSize;
            }
            else {
                // [!]|[      ]|[  ] : left/top side can not get smaller than the minimal editor size
                if (newSiloOneSize < this.minSize) {
                    newSiloOneSize = this.minSize;
                }
                else if (this.totalSize - newSiloOneSize - this.silosSize[editor_1.Position.THREE] < this.minSize) {
                    // [      ]|[ ]|[!] : right/bottom side can not get smaller than the minimal editor size
                    if (this.totalSize - newSiloOneSize - this.silosSize[editor_1.Position.TWO] < this.minSize) {
                        newSiloOneSize = this.totalSize - (2 * this.minSize);
                        this.silosSize[editor_1.Position.TWO] = this.silosSize[editor_1.Position.THREE] = this.minSize;
                    }
                    else if (this.totalSize - newSiloOneSize - this.silosSize[editor_1.Position.TWO] - this.snapToMinimizeThresholdSize <= this.minSize) {
                        this.silosSize[editor_1.Position.THREE] = this.minSize;
                    }
                    else {
                        this.silosSize[editor_1.Position.THREE] = this.silosSize[editor_1.Position.THREE] - (newSiloOneSize - oldSiloOneSize);
                    }
                    this.sashTwo.layout();
                }
                else if (newSiloOneSize - this.snapToMinimizeThresholdSize <= this.minSize) {
                    newSiloOneSize = this.minSize;
                }
                else if (this.totalSize - this.silosSize[editor_1.Position.THREE] - newSiloOneSize - this.snapToMinimizeThresholdSize <= this.minSize) {
                    newSiloOneSize = this.totalSize - this.silosSize[editor_1.Position.THREE] - this.minSize;
                }
                this.silosSize[editor_1.Position.ONE] = newSiloOneSize;
                this.silosSize[editor_1.Position.TWO] = this.totalSize - this.silosSize[editor_1.Position.ONE] - this.silosSize[editor_1.Position.THREE];
            }
            // We allow silos to turn into minimized state from user dragging the sash,
            // so we need to update our stored state of minimized silos accordingly
            this.enableMinimizedState();
            // Pass on to containers
            this.layoutContainers();
        };
        EditorGroupsControl.prototype.onSashOneDragEnd = function () {
            this.sashOne.layout();
            this.sashTwo.layout(); // Moving sash one might have also moved sash two, so layout() both
            this.focusNextNonMinimized();
        };
        EditorGroupsControl.prototype.onSashOneReset = function () {
            this.centerSash(editor_1.Position.ONE, editor_1.Position.TWO);
            this.sashOne.layout();
        };
        EditorGroupsControl.prototype.onSashTwoDragStart = function () {
            this.startSiloThreeSize = this.silosSize[editor_1.Position.THREE];
        };
        EditorGroupsControl.prototype.onSashTwoDrag = function (e) {
            var oldSiloThreeSize = this.silosSize[editor_1.Position.THREE];
            var diffSize = this.layoutVertically ? (-e.currentX + e.startX) : (-e.currentY + e.startY);
            var newSiloThreeSize = this.startSiloThreeSize + diffSize;
            // [  ]|[      ]|[!] : right/bottom side can not get smaller than the minimal editor size
            if (newSiloThreeSize < this.minSize) {
                newSiloThreeSize = this.minSize;
            }
            else if (this.totalSize - newSiloThreeSize - this.silosSize[editor_1.Position.ONE] < this.minSize) {
                // [!]|[ ]|[    ] : left/top side can not get smaller than the minimal editor size
                if (this.totalSize - newSiloThreeSize - this.silosSize[editor_1.Position.TWO] < this.minSize) {
                    newSiloThreeSize = this.totalSize - (2 * this.minSize);
                    this.silosSize[editor_1.Position.ONE] = this.silosSize[editor_1.Position.TWO] = this.minSize;
                }
                else if (this.totalSize - newSiloThreeSize - this.silosSize[editor_1.Position.TWO] - this.snapToMinimizeThresholdSize <= this.minSize) {
                    this.silosSize[editor_1.Position.ONE] = this.minSize;
                }
                else {
                    this.silosSize[editor_1.Position.ONE] = this.silosSize[editor_1.Position.ONE] - (newSiloThreeSize - oldSiloThreeSize);
                }
                this.sashOne.layout();
            }
            else if (newSiloThreeSize - this.snapToMinimizeThresholdSize <= this.minSize) {
                newSiloThreeSize = this.minSize;
            }
            else if (this.totalSize - this.silosSize[editor_1.Position.ONE] - newSiloThreeSize - this.snapToMinimizeThresholdSize <= this.minSize) {
                newSiloThreeSize = this.totalSize - this.silosSize[editor_1.Position.ONE] - this.minSize;
            }
            this.silosSize[editor_1.Position.THREE] = newSiloThreeSize;
            this.silosSize[editor_1.Position.TWO] = this.totalSize - this.silosSize[editor_1.Position.ONE] - this.silosSize[editor_1.Position.THREE];
            // We allow silos to turn into minimized state from user dragging the sash,
            // so we need to update our stored state of minimized silos accordingly
            this.enableMinimizedState();
            // Pass on to containers
            this.layoutContainers();
        };
        EditorGroupsControl.prototype.onSashTwoDragEnd = function () {
            this.sashOne.layout(); // Moving sash one might have also moved sash two, so layout() both
            this.sashTwo.layout();
            this.focusNextNonMinimized();
        };
        EditorGroupsControl.prototype.onSashTwoReset = function () {
            this.centerSash(editor_1.Position.TWO, editor_1.Position.THREE);
            this.sashTwo.layout();
        };
        EditorGroupsControl.prototype.getVerticalSashTop = function (sash) {
            return 0;
        };
        EditorGroupsControl.prototype.getVerticalSashLeft = function (sash) {
            return sash === this.sashOne ? this.silosSize[editor_1.Position.ONE] : this.silosSize[editor_1.Position.TWO] + this.silosSize[editor_1.Position.ONE];
        };
        EditorGroupsControl.prototype.getVerticalSashHeight = function (sash) {
            return this.dimension.height;
        };
        EditorGroupsControl.prototype.getHorizontalSashTop = function (sash) {
            return sash === this.sashOne ? this.silosSize[editor_1.Position.ONE] : this.silosSize[editor_1.Position.TWO] + this.silosSize[editor_1.Position.ONE];
        };
        EditorGroupsControl.prototype.getHorizontalSashLeft = function (sash) {
            return 0;
        };
        EditorGroupsControl.prototype.getHorizontalSashWidth = function (sash) {
            return this.dimension.width;
        };
        EditorGroupsControl.prototype.isDragging = function () {
            return this.dragging;
        };
        EditorGroupsControl.prototype.layout = function (arg) {
            if (arg instanceof builder_1.Dimension) {
                this.layoutControl(arg);
            }
            else {
                this.layoutEditor(arg);
            }
        };
        EditorGroupsControl.prototype.layoutControl = function (dimension) {
            var _this = this;
            var oldDimension = this.dimension;
            this.dimension = dimension;
            // Use the current dimension in case an editor was opened before we had any dimension
            if (!oldDimension || !oldDimension.width || !oldDimension.height) {
                oldDimension = dimension;
            }
            // Apply to visible editors
            var totalSize = 0;
            // Set preferred dimensions based on ratio to previous dimenions
            var wasInitialRatioRestored = false;
            var oldTotalSize = this.layoutVertically ? oldDimension.width : oldDimension.height;
            editor_1.POSITIONS.forEach(function (position) {
                if (_this.visibleEditors[position]) {
                    // Keep minimized editors in tact by not letting them grow if we have size to give
                    if (!_this.isSiloMinimized(position)) {
                        var siloSizeRatio = void 0;
                        // We have some stored initial ratios when the editor was restored on startup
                        // Use those ratios over anything else but only once.
                        if (_this.silosInitialRatio && types.isNumber(_this.silosInitialRatio[position])) {
                            siloSizeRatio = _this.silosInitialRatio[position];
                            delete _this.silosInitialRatio[position]; // dont use again
                            wasInitialRatioRestored = true;
                        }
                        else {
                            siloSizeRatio = _this.silosSize[position] / oldTotalSize;
                        }
                        _this.silosSize[position] = Math.max(Math.round(_this.totalSize * siloSizeRatio), _this.minSize);
                    }
                    totalSize += _this.silosSize[position];
                }
            });
            // When restoring from an initial ratio state, we treat editors of min-size as
            // minimized, so we need to update our stored state of minimized silos accordingly
            if (wasInitialRatioRestored) {
                this.enableMinimizedState();
            }
            // Compensate for overflow either through rounding error or min editor size
            if (totalSize > 0) {
                var overflow_1 = totalSize - this.totalSize;
                // We have size to give
                if (overflow_1 < 0) {
                    // Find the first position from left/top to right/bottom that is not minimized
                    // to give size. This ensures that minimized editors are left like
                    // that if the user chose this layout.
                    var positionToGive_1 = null;
                    editor_1.POSITIONS.forEach(function (position) {
                        if (_this.visibleEditors[position] && positionToGive_1 === null && !_this.isSiloMinimized(position)) {
                            positionToGive_1 = position;
                        }
                    });
                    if (positionToGive_1 === null) {
                        positionToGive_1 = editor_1.Position.ONE; // maybe all are minimized, so give ONE the extra size
                    }
                    this.silosSize[positionToGive_1] -= overflow_1;
                }
                else if (overflow_1 > 0) {
                    editor_1.POSITIONS.forEach(function (position) {
                        var maxCompensation = _this.silosSize[position] - _this.minSize;
                        if (maxCompensation >= overflow_1) {
                            _this.silosSize[position] -= overflow_1;
                            overflow_1 = 0;
                        }
                        else if (maxCompensation > 0) {
                            _this.silosSize[position] -= maxCompensation;
                            overflow_1 -= maxCompensation;
                        }
                    });
                }
            }
            // Sash positioning
            this.sashOne.layout();
            this.sashTwo.layout();
            // Pass on to Editor Containers
            this.layoutContainers();
        };
        EditorGroupsControl.prototype.layoutContainers = function () {
            var _this = this;
            // Layout containers
            editor_1.POSITIONS.forEach(function (position) {
                var siloWidth = _this.layoutVertically ? _this.silosSize[position] : _this.dimension.width;
                var siloHeight = _this.layoutVertically ? _this.dimension.height : _this.silosSize[position];
                _this.silos[position].size(siloWidth, siloHeight);
            });
            if (this.layoutVertically) {
                this.silos[editor_1.Position.TWO].position(0, null, null, this.silosSize[editor_1.Position.ONE]);
            }
            else {
                this.silos[editor_1.Position.TWO].position(this.silosSize[editor_1.Position.ONE], null, null, 0);
            }
            // Visibility
            editor_1.POSITIONS.forEach(function (position) {
                if (_this.visibleEditors[position] && _this.silos[position].isHidden()) {
                    _this.silos[position].show();
                }
                else if (!_this.visibleEditors[position] && !_this.silos[position].isHidden()) {
                    _this.silos[position].hide();
                }
            });
            // Layout visible editors
            editor_1.POSITIONS.forEach(function (position) {
                _this.layoutEditor(position);
            });
            // Layout title controls
            editor_1.POSITIONS.forEach(function (position) {
                _this.getTitleAreaControl(position).layout();
            });
            // Update minimized state
            this.updateMinimizedState();
        };
        EditorGroupsControl.prototype.layoutEditor = function (position) {
            var editorSize = this.silosSize[position];
            if (editorSize && this.visibleEditors[position]) {
                var editorWidth = this.layoutVertically ? editorSize : this.dimension.width;
                var editorHeight = (this.layoutVertically ? this.dimension.height : this.silosSize[position]) - EditorGroupsControl.EDITOR_TITLE_HEIGHT;
                if (position !== editor_1.Position.ONE) {
                    if (this.layoutVertically) {
                        editorWidth--; // accomodate for 1px left-border in containers TWO, THREE when laying out vertically
                    }
                    else {
                        editorHeight--; // accomodate for 1px top-border in containers TWO, THREE when laying out horizontally
                    }
                }
                this.visibleEditors[position].layout(new builder_1.Dimension(editorWidth, editorHeight));
            }
        };
        EditorGroupsControl.prototype.getInstantiationService = function (position) {
            return this.getFromContainer(position, EditorGroupsControl.INSTANTIATION_SERVICE_KEY);
        };
        EditorGroupsControl.prototype.getProgressBar = function (position) {
            return this.getFromContainer(position, EditorGroupsControl.PROGRESS_BAR_CONTROL_KEY);
        };
        EditorGroupsControl.prototype.getTitleAreaControl = function (position) {
            return this.getFromContainer(position, EditorGroupsControl.TITLE_AREA_CONTROL_KEY);
        };
        EditorGroupsControl.prototype.getFromContainer = function (position, key) {
            var silo = this.silos[position];
            return silo ? silo.child().getProperty(key) : void 0;
        };
        EditorGroupsControl.prototype.updateProgress = function (position, state) {
            var progressbar = this.getProgressBar(position);
            if (!progressbar) {
                return;
            }
            switch (state) {
                case ProgressState.INFINITE:
                    progressbar.infinite().getContainer().show();
                    break;
                case ProgressState.DONE:
                    progressbar.done().getContainer().hide();
                    break;
                case ProgressState.STOP:
                    progressbar.stop().getContainer().hide();
                    break;
            }
        };
        EditorGroupsControl.prototype.dispose = function () {
            var _this = this;
            _super.prototype.dispose.call(this);
            // Positions
            editor_1.POSITIONS.forEach(function (position) {
                _this.clearPosition(position);
            });
            // Controls
            editor_1.POSITIONS.forEach(function (position) {
                _this.getTitleAreaControl(position).dispose();
                _this.getProgressBar(position).dispose();
            });
            // Sash
            this.sashOne.dispose();
            this.sashTwo.dispose();
            // Destroy Container
            this.silos.forEach(function (silo) {
                silo.destroy();
            });
            this.lastActiveEditor = null;
            this.lastActivePosition = null;
            this.visibleEditors = null;
        };
        EditorGroupsControl.TITLE_AREA_CONTROL_KEY = '__titleAreaControl';
        EditorGroupsControl.PROGRESS_BAR_CONTROL_KEY = '__progressBar';
        EditorGroupsControl.INSTANTIATION_SERVICE_KEY = '__instantiationService';
        EditorGroupsControl.MIN_EDITOR_WIDTH = 170;
        EditorGroupsControl.MIN_EDITOR_HEIGHT = 70;
        EditorGroupsControl.EDITOR_TITLE_HEIGHT = 35;
        EditorGroupsControl.SNAP_TO_MINIMIZED_THRESHOLD_WIDTH = 50;
        EditorGroupsControl.SNAP_TO_MINIMIZED_THRESHOLD_HEIGHT = 20;
        EditorGroupsControl = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, groupService_1.IEditorGroupService),
            __param(4, telemetry_1.ITelemetryService),
            __param(5, contextkey_1.IContextKeyService),
            __param(6, extensions_1.IExtensionService),
            __param(7, instantiation_1.IInstantiationService),
            __param(8, windows_1.IWindowService),
            __param(9, windows_1.IWindowsService),
            __param(10, themeService_1.IThemeService),
            __param(11, files_1.IFileService),
            __param(12, message_1.IMessageService),
            __param(13, workspaces_1.IWorkspacesService)
        ], EditorGroupsControl);
        return EditorGroupsControl;
    }(theme_1.Themable));
    exports.EditorGroupsControl = EditorGroupsControl;
});
//# sourceMappingURL=editorGroupsControl.js.map