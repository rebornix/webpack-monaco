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
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/common/errors", "vs/base/browser/dom", "vs/base/common/platform", "vs/base/common/mime", "vs/base/common/labels", "vs/base/common/actions", "vs/platform/editor/common/editor", "vs/workbench/common/editor", "vs/base/browser/keyboardEvent", "vs/workbench/browser/labels", "vs/base/browser/ui/actionbar/actionbar", "vs/workbench/services/editor/common/editorService", "vs/platform/contextview/browser/contextView", "vs/workbench/services/group/common/groupService", "vs/platform/message/common/message", "vs/platform/telemetry/common/telemetry", "vs/platform/instantiation/common/instantiation", "vs/platform/keybinding/common/keybinding", "vs/platform/contextkey/common/contextkey", "vs/platform/actions/common/actions", "vs/platform/windows/common/windows", "vs/workbench/browser/parts/editor/titleControl", "vs/platform/quickOpen/common/quickOpen", "vs/base/common/lifecycle", "vs/base/browser/ui/scrollbar/scrollableElement", "vs/base/common/scrollable", "vs/base/browser/dnd", "vs/base/common/map", "vs/workbench/services/editor/browser/editorService", "vs/platform/instantiation/common/serviceCollection", "vs/platform/theme/common/themeService", "vs/workbench/common/theme", "vs/platform/theme/common/colorRegistry", "vs/platform/files/common/files", "vs/platform/workspaces/common/workspaces", "vs/css!./media/tabstitle"], function (require, exports, nls, winjs_base_1, errors, DOM, platform_1, mime_1, labels_1, actions_1, editor_1, editor_2, keyboardEvent_1, labels_2, actionbar_1, editorService_1, contextView_1, groupService_1, message_1, telemetry_1, instantiation_1, keybinding_1, contextkey_1, actions_2, windows_1, titleControl_1, quickOpen_1, lifecycle_1, scrollableElement_1, scrollable_1, dnd_1, map_1, editorService_2, serviceCollection_1, themeService_1, theme_1, colorRegistry_1, files_1, workspaces_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TabsTitleControl = (function (_super) {
        __extends(TabsTitleControl, _super);
        function TabsTitleControl(contextMenuService, instantiationService, editorService, editorGroupService, contextKeyService, keybindingService, telemetryService, messageService, menuService, quickOpenService, windowService, windowsService, themeService, fileService, workspacesService) {
            var _this = _super.call(this, contextMenuService, instantiationService, editorService, editorGroupService, contextKeyService, keybindingService, telemetryService, messageService, menuService, quickOpenService, themeService) || this;
            _this.windowService = windowService;
            _this.windowsService = windowsService;
            _this.fileService = fileService;
            _this.workspacesService = workspacesService;
            _this.tabDisposeables = [];
            _this.editorLabels = [];
            return _this;
        }
        TabsTitleControl.prototype.initActions = function (services) {
            _super.prototype.initActions.call(this, this.createScopedInstantiationService());
        };
        TabsTitleControl.prototype.createScopedInstantiationService = function () {
            var _this = this;
            var stacks = this.editorGroupService.getStacksModel();
            var delegatingEditorService = this.instantiationService.createInstance(editorService_2.DelegatingWorkbenchEditorService);
            // We create a scoped instantiation service to override the behaviour when closing an inactive editor
            // Specifically we want to move focus back to the editor when an inactive editor is closed from anywhere
            // in the tabs title control (e.g. mouse middle click, context menu on tab). This is only needed for
            // the inactive editors because closing the active one will always cause a tab switch that sets focus.
            // We also want to block the tabs container to reveal the currently active tab because that makes it very
            // hard to close multiple inactive tabs next to each other.
            delegatingEditorService.setEditorCloseHandler(function (position, editor) {
                var group = stacks.groupAt(position);
                if (group && stacks.isActive(group) && !group.isActive(editor)) {
                    _this.editorGroupService.focusGroup(group);
                }
                _this.blockRevealActiveTab = true;
                return winjs_base_1.TPromise.as(void 0);
            });
            return this.instantiationService.createChild(new serviceCollection_1.ServiceCollection([editorService_1.IWorkbenchEditorService, delegatingEditorService]));
        };
        TabsTitleControl.prototype.setContext = function (group) {
            _super.prototype.setContext.call(this, group);
            this.editorActionsToolbar.context = { group: group };
        };
        TabsTitleControl.prototype.create = function (parent) {
            var _this = this;
            _super.prototype.create.call(this, parent);
            this.titleContainer = parent;
            // Tabs Container
            this.tabsContainer = document.createElement('div');
            this.tabsContainer.setAttribute('role', 'tablist');
            DOM.addClass(this.tabsContainer, 'tabs-container');
            // Forward scrolling inside the container to our custom scrollbar
            this.toUnbind.push(DOM.addDisposableListener(this.tabsContainer, DOM.EventType.SCROLL, function (e) {
                if (DOM.hasClass(_this.tabsContainer, 'scroll')) {
                    _this.scrollbar.setScrollPosition({
                        scrollLeft: _this.tabsContainer.scrollLeft // during DND the  container gets scrolled so we need to update the custom scrollbar
                    });
                }
            }));
            // New file when double clicking on tabs container (but not tabs)
            this.toUnbind.push(DOM.addDisposableListener(this.tabsContainer, DOM.EventType.DBLCLICK, function (e) {
                var target = e.target;
                if (target instanceof HTMLElement && target.className.indexOf('tabs-container') === 0) {
                    DOM.EventHelper.stop(e);
                    var group = _this.context;
                    if (group) {
                        _this.editorService.openEditor({ options: { pinned: true, index: group.count /* always at the end */ } }).done(null, errors.onUnexpectedError); // untitled are always pinned
                    }
                }
            }));
            // Custom Scrollbar
            this.scrollbar = new scrollableElement_1.ScrollableElement(this.tabsContainer, {
                horizontal: scrollable_1.ScrollbarVisibility.Auto,
                vertical: scrollable_1.ScrollbarVisibility.Hidden,
                scrollYToX: true,
                useShadows: false,
                horizontalScrollbarSize: 3
            });
            this.scrollbar.onScroll(function (e) {
                _this.tabsContainer.scrollLeft = e.scrollLeft;
            });
            this.titleContainer.appendChild(this.scrollbar.getDomNode());
            // Drag over
            this.toUnbind.push(DOM.addDisposableListener(this.tabsContainer, DOM.EventType.DRAG_OVER, function (e) {
                DOM.addClass(_this.tabsContainer, 'scroll'); // enable support to scroll while dragging
                var target = e.target;
                if (target instanceof HTMLElement && target.className.indexOf('tabs-container') === 0) {
                    _this.updateDropFeedback(_this.tabsContainer, true);
                }
            }));
            // Drag leave
            this.toUnbind.push(DOM.addDisposableListener(this.tabsContainer, DOM.EventType.DRAG_LEAVE, function (e) {
                _this.updateDropFeedback(_this.tabsContainer, false);
                DOM.removeClass(_this.tabsContainer, 'scroll');
            }));
            // Drag end
            this.toUnbind.push(DOM.addDisposableListener(this.tabsContainer, DOM.EventType.DRAG_END, function (e) {
                _this.updateDropFeedback(_this.tabsContainer, false);
                DOM.removeClass(_this.tabsContainer, 'scroll');
            }));
            // Drop onto tabs container
            this.toUnbind.push(DOM.addDisposableListener(this.tabsContainer, DOM.EventType.DROP, function (e) {
                _this.updateDropFeedback(_this.tabsContainer, false);
                DOM.removeClass(_this.tabsContainer, 'scroll');
                var target = e.target;
                if (target instanceof HTMLElement && target.className.indexOf('tabs-container') === 0) {
                    var group = _this.context;
                    if (group) {
                        var targetPosition = _this.stacks.positionOfGroup(group);
                        var targetIndex = group.count;
                        _this.onDrop(e, group, targetPosition, targetIndex);
                    }
                }
            }));
            // Editor Actions Container
            var editorActionsContainer = document.createElement('div');
            DOM.addClass(editorActionsContainer, 'editor-actions');
            this.titleContainer.appendChild(editorActionsContainer);
            // Editor Actions Toolbar
            this.createEditorActionsToolBar(editorActionsContainer);
        };
        TabsTitleControl.prototype.updateDropFeedback = function (element, isDND, index) {
            var isTab = (typeof index === 'number');
            var isActiveTab = isTab && this.context && this.context.isActive(this.context.getEditor(index));
            // Background
            var noDNDBackgroundColor = isTab ? this.getColor(isActiveTab ? theme_1.TAB_ACTIVE_BACKGROUND : theme_1.TAB_INACTIVE_BACKGROUND) : null;
            element.style.backgroundColor = isDND ? this.getColor(theme_1.EDITOR_DRAG_AND_DROP_BACKGROUND) : noDNDBackgroundColor;
            // Outline
            var activeContrastBorderColor = this.getColor(colorRegistry_1.activeContrastBorder);
            if (activeContrastBorderColor && isDND) {
                element.style.outlineWidth = '2px';
                element.style.outlineStyle = 'dashed';
                element.style.outlineColor = activeContrastBorderColor;
                element.style.outlineOffset = isTab ? '-5px' : '-3px';
            }
            else {
                element.style.outlineWidth = null;
                element.style.outlineStyle = null;
                element.style.outlineColor = activeContrastBorderColor;
                element.style.outlineOffset = null;
            }
        };
        TabsTitleControl.prototype.allowDragging = function (element) {
            return (element.className === 'tabs-container');
        };
        TabsTitleControl.prototype.doUpdate = function () {
            var _this = this;
            if (!this.context) {
                return;
            }
            var group = this.context;
            // Tabs container activity state
            var isGroupActive = this.stacks.isActive(group);
            if (isGroupActive) {
                DOM.addClass(this.titleContainer, 'active');
            }
            else {
                DOM.removeClass(this.titleContainer, 'active');
            }
            // Compute labels and protect against duplicates
            var editorsOfGroup = this.context.getEditors();
            var labels = this.getUniqueTabLabels(editorsOfGroup);
            // Tab label and styles
            editorsOfGroup.forEach(function (editor, index) {
                var tabContainer = _this.tabsContainer.children[index];
                if (tabContainer instanceof HTMLElement) {
                    var isPinned = group.isPinned(index);
                    var isTabActive = group.isActive(editor);
                    var isDirty = editor.isDirty();
                    var label = labels[index];
                    var name_1 = label.name;
                    var description = label.hasAmbiguousName && label.description ? label.description : '';
                    var title = label.title || '';
                    // Container
                    tabContainer.setAttribute('aria-label', name_1 + ", tab");
                    tabContainer.title = title;
                    tabContainer.style.borderLeftColor = (index !== 0) ? (_this.getColor(theme_1.TAB_BORDER) || _this.getColor(colorRegistry_1.contrastBorder)) : null;
                    tabContainer.style.borderRightColor = (index === editorsOfGroup.length - 1) ? (_this.getColor(theme_1.TAB_BORDER) || _this.getColor(colorRegistry_1.contrastBorder)) : null;
                    tabContainer.style.outlineColor = _this.getColor(colorRegistry_1.activeContrastBorder);
                    var tabOptions_1 = _this.editorGroupService.getTabOptions();
                    ['off', 'left'].forEach(function (option) {
                        var domAction = tabOptions_1.tabCloseButton === option ? DOM.addClass : DOM.removeClass;
                        domAction(tabContainer, "close-button-" + option);
                    });
                    // Label
                    var tabLabel = _this.editorLabels[index];
                    tabLabel.setLabel({ name: name_1, description: description, resource: editor_2.toResource(editor, { supportSideBySide: true }) }, { extraClasses: ['tab-label'], italic: !isPinned });
                    // Active state
                    if (isTabActive) {
                        DOM.addClass(tabContainer, 'active');
                        tabContainer.setAttribute('aria-selected', 'true');
                        tabContainer.style.backgroundColor = _this.getColor(theme_1.TAB_ACTIVE_BACKGROUND);
                        tabLabel.element.style.color = _this.getColor(isGroupActive ? theme_1.TAB_ACTIVE_FOREGROUND : theme_1.TAB_UNFOCUSED_ACTIVE_FOREGROUND);
                        // Use boxShadow for the active tab border because if we also have a editor group header
                        // color, the two colors would collide and the tab border never shows up.
                        // see https://github.com/Microsoft/vscode/issues/33111
                        var activeTabBorderColor = _this.getColor(isGroupActive ? theme_1.TAB_ACTIVE_BORDER : theme_1.TAB_UNFOCUSED_ACTIVE_BORDER);
                        if (activeTabBorderColor) {
                            tabContainer.style.boxShadow = activeTabBorderColor + " 0 -1px inset";
                        }
                        else {
                            tabContainer.style.boxShadow = null;
                        }
                        _this.activeTab = tabContainer;
                    }
                    else {
                        DOM.removeClass(tabContainer, 'active');
                        tabContainer.setAttribute('aria-selected', 'false');
                        tabContainer.style.backgroundColor = _this.getColor(theme_1.TAB_INACTIVE_BACKGROUND);
                        tabLabel.element.style.color = _this.getColor(isGroupActive ? theme_1.TAB_INACTIVE_FOREGROUND : theme_1.TAB_UNFOCUSED_INACTIVE_FOREGROUND);
                        tabContainer.style.boxShadow = null;
                    }
                    // Dirty State
                    if (isDirty) {
                        DOM.addClass(tabContainer, 'dirty');
                    }
                    else {
                        DOM.removeClass(tabContainer, 'dirty');
                    }
                }
            });
            // Update Editor Actions Toolbar
            this.updateEditorActionsToolbar();
            // Ensure the active tab is always revealed
            this.layout();
        };
        TabsTitleControl.prototype.getUniqueTabLabels = function (editors) {
            var labels = [];
            var mapLabelToDuplicates = new Map();
            var mapLabelAndDescriptionToDuplicates = new Map();
            // Build labels and descriptions for each editor
            editors.forEach(function (editor) {
                var name = editor.getName();
                var description = editor.getDescription();
                if (mapLabelAndDescriptionToDuplicates.has("" + name + description)) {
                    description = editor.getDescription(true); // try verbose description if name+description already exists
                }
                var item = {
                    name: name,
                    description: description,
                    title: editor.getTitle(editor_1.Verbosity.LONG)
                };
                labels.push(item);
                map_1.getOrSet(mapLabelToDuplicates, item.name, []).push(item);
                if (typeof description === 'string') {
                    map_1.getOrSet(mapLabelAndDescriptionToDuplicates, "" + item.name + item.description, []).push(item);
                }
            });
            // Mark duplicates and shorten their descriptions
            mapLabelToDuplicates.forEach(function (duplicates) {
                if (duplicates.length > 1) {
                    duplicates = duplicates.filter(function (d) {
                        // we could have items with equal label and description. in that case it does not make much
                        // sense to produce a shortened version of the label, so we ignore those kind of items
                        return typeof d.description === 'string' && mapLabelAndDescriptionToDuplicates.get("" + d.name + d.description).length === 1;
                    });
                    if (duplicates.length > 1) {
                        var shortenedDescriptions_1 = labels_1.shorten(duplicates.map(function (duplicate) { return duplicate.description; }));
                        duplicates.forEach(function (duplicate, i) {
                            duplicate.description = shortenedDescriptions_1[i];
                            duplicate.hasAmbiguousName = true;
                        });
                    }
                }
            });
            return labels;
        };
        TabsTitleControl.prototype.doRefresh = function () {
            var group = this.context;
            var editor = group && group.activeEditor;
            if (!editor) {
                this.clearTabs();
                this.clearEditorActionsToolbar();
                return; // return early if we are being closed
            }
            // Handle Tabs
            this.handleTabs(group.count);
            DOM.removeClass(this.titleContainer, 'empty');
            // Update Tabs
            this.doUpdate();
        };
        TabsTitleControl.prototype.clearTabs = function () {
            DOM.clearNode(this.tabsContainer);
            this.tabDisposeables = lifecycle_1.dispose(this.tabDisposeables);
            this.editorLabels = [];
            DOM.addClass(this.titleContainer, 'empty');
        };
        TabsTitleControl.prototype.handleTabs = function (tabsNeeded) {
            var tabs = this.tabsContainer.children;
            var tabsCount = tabs.length;
            // Nothing to do if count did not change
            if (tabsCount === tabsNeeded) {
                return;
            }
            // We need more tabs: create new ones
            if (tabsCount < tabsNeeded) {
                for (var i = tabsCount; i < tabsNeeded; i++) {
                    this.tabsContainer.appendChild(this.createTab(i));
                }
            }
            else {
                for (var i = 0; i < tabsCount - tabsNeeded; i++) {
                    this.tabsContainer.lastChild.remove();
                    this.editorLabels.pop();
                    this.tabDisposeables.pop().dispose();
                }
            }
        };
        TabsTitleControl.prototype.createTab = function (index) {
            var _this = this;
            // Tab Container
            var tabContainer = document.createElement('div');
            tabContainer.draggable = true;
            tabContainer.tabIndex = 0;
            tabContainer.setAttribute('role', 'presentation'); // cannot use role "tab" here due to https://github.com/Microsoft/vscode/issues/8659
            DOM.addClass(tabContainer, 'tab');
            // Tab Editor Label
            var editorLabel = this.instantiationService.createInstance(labels_2.EditorLabel, tabContainer, void 0);
            this.editorLabels.push(editorLabel);
            // Tab Close
            var tabCloseContainer = document.createElement('div');
            DOM.addClass(tabCloseContainer, 'tab-close');
            tabContainer.appendChild(tabCloseContainer);
            var bar = new actionbar_1.ActionBar(tabCloseContainer, { ariaLabel: nls.localize('araLabelTabActions', "Tab actions"), actionRunner: new TabActionRunner(function () { return _this.context; }, index) });
            bar.push(this.closeEditorAction, { icon: true, label: false, keybinding: this.getKeybindingLabel(this.closeEditorAction) });
            // Eventing
            var disposable = this.hookTabListeners(tabContainer, index);
            this.tabDisposeables.push(lifecycle_1.combinedDisposable([disposable, bar, editorLabel]));
            return tabContainer;
        };
        TabsTitleControl.prototype.layout = function () {
            if (!this.activeTab) {
                return;
            }
            var visibleContainerWidth = this.tabsContainer.offsetWidth;
            var totalContainerWidth = this.tabsContainer.scrollWidth;
            // Update scrollbar
            this.scrollbar.setScrollDimensions({
                width: visibleContainerWidth,
                scrollWidth: totalContainerWidth
            });
            // Return now if we are blocked to reveal the active tab and clear flag
            if (this.blockRevealActiveTab) {
                this.blockRevealActiveTab = false;
                return;
            }
            // Reveal the active one
            var containerScrollPosX = this.tabsContainer.scrollLeft;
            var activeTabPosX = this.activeTab.offsetLeft;
            var activeTabWidth = this.activeTab.offsetWidth;
            var activeTabFits = activeTabWidth <= visibleContainerWidth;
            // Tab is overflowing to the right: Scroll minimally until the element is fully visible to the right
            // Note: only try to do this if we actually have enough width to give to show the tab fully!
            if (activeTabFits && containerScrollPosX + visibleContainerWidth < activeTabPosX + activeTabWidth) {
                this.scrollbar.setScrollPosition({
                    scrollLeft: containerScrollPosX + ((activeTabPosX + activeTabWidth) /* right corner of tab */ - (containerScrollPosX + visibleContainerWidth) /* right corner of view port */)
                });
            }
            else if (containerScrollPosX > activeTabPosX || !activeTabFits) {
                this.scrollbar.setScrollPosition({
                    scrollLeft: this.activeTab.offsetLeft
                });
            }
        };
        TabsTitleControl.prototype.hookTabListeners = function (tab, index) {
            var _this = this;
            var disposables = [];
            // Open on Click
            disposables.push(DOM.addDisposableListener(tab, DOM.EventType.MOUSE_DOWN, function (e) {
                tab.blur();
                var _a = _this.toTabContext(index), editor = _a.editor, position = _a.position;
                if (e.button === 0 /* Left Button */ && !_this.isTabActionBar((e.target || e.srcElement))) {
                    setTimeout(function () { return _this.editorService.openEditor(editor, null, position).done(null, errors.onUnexpectedError); }); // timeout to keep focus in editor after mouse up
                }
            }));
            // Close on mouse middle click
            disposables.push(DOM.addDisposableListener(tab, DOM.EventType.MOUSE_UP, function (e) {
                DOM.EventHelper.stop(e);
                tab.blur();
                if (e.button === 1 /* Middle Button*/ && !_this.isTabActionBar((e.target || e.srcElement))) {
                    _this.closeEditorAction.run(_this.toTabContext(index)).done(null, errors.onUnexpectedError);
                }
            }));
            // Context menu on Shift+F10
            disposables.push(DOM.addDisposableListener(tab, DOM.EventType.KEY_DOWN, function (e) {
                var event = new keyboardEvent_1.StandardKeyboardEvent(e);
                if (event.shiftKey && event.keyCode === 68 /* F10 */) {
                    DOM.EventHelper.stop(e);
                    var _a = _this.toTabContext(index), group = _a.group, editor = _a.editor;
                    _this.onContextMenu({ group: group, editor: editor }, e, tab);
                }
            }));
            // Keyboard accessibility
            disposables.push(DOM.addDisposableListener(tab, DOM.EventType.KEY_UP, function (e) {
                var event = new keyboardEvent_1.StandardKeyboardEvent(e);
                var handled = false;
                var _a = _this.toTabContext(index), group = _a.group, position = _a.position, editor = _a.editor;
                // Run action on Enter/Space
                if (event.equals(3 /* Enter */) || event.equals(10 /* Space */)) {
                    handled = true;
                    _this.editorService.openEditor(editor, null, position).done(null, errors.onUnexpectedError);
                }
                else if ([15 /* LeftArrow */, 17 /* RightArrow */, 16 /* UpArrow */, 18 /* DownArrow */, 14 /* Home */, 13 /* End */].some(function (kb) { return event.equals(kb); })) {
                    var targetIndex = void 0;
                    if (event.equals(15 /* LeftArrow */) || event.equals(16 /* UpArrow */)) {
                        targetIndex = index - 1;
                    }
                    else if (event.equals(17 /* RightArrow */) || event.equals(18 /* DownArrow */)) {
                        targetIndex = index + 1;
                    }
                    else if (event.equals(14 /* Home */)) {
                        targetIndex = 0;
                    }
                    else {
                        targetIndex = group.count - 1;
                    }
                    var target = group.getEditor(targetIndex);
                    if (target) {
                        handled = true;
                        _this.editorService.openEditor(target, { preserveFocus: true }, position).done(null, errors.onUnexpectedError);
                        _this.tabsContainer.childNodes[targetIndex].focus();
                    }
                }
                if (handled) {
                    DOM.EventHelper.stop(e, true);
                }
                // moving in the tabs container can have an impact on scrolling position, so we need to update the custom scrollbar
                _this.scrollbar.setScrollPosition({
                    scrollLeft: _this.tabsContainer.scrollLeft
                });
            }));
            // Pin on double click
            disposables.push(DOM.addDisposableListener(tab, DOM.EventType.DBLCLICK, function (e) {
                DOM.EventHelper.stop(e);
                var _a = _this.toTabContext(index), group = _a.group, editor = _a.editor;
                _this.editorGroupService.pinEditor(group, editor);
            }));
            // Context menu
            disposables.push(DOM.addDisposableListener(tab, DOM.EventType.CONTEXT_MENU, function (e) {
                DOM.EventHelper.stop(e, true);
                var _a = _this.toTabContext(index), group = _a.group, editor = _a.editor;
                _this.onContextMenu({ group: group, editor: editor }, e, tab);
            }, true /* use capture to fix https://github.com/Microsoft/vscode/issues/19145 */));
            // Drag start
            disposables.push(DOM.addDisposableListener(tab, DOM.EventType.DRAG_START, function (e) {
                var _a = _this.toTabContext(index), group = _a.group, editor = _a.editor;
                _this.onEditorDragStart({ editor: editor, group: group });
                e.dataTransfer.effectAllowed = 'copyMove';
                // Insert transfer accordingly
                var fileResource = editor_2.toResource(editor, { supportSideBySide: true, filter: 'file' });
                if (fileResource) {
                    var resource = fileResource.toString();
                    e.dataTransfer.setData('URL', resource); // enables cross window DND of tabs
                    e.dataTransfer.setData('DownloadURL', [mime_1.MIME_BINARY, editor.getName(), resource].join(':')); // enables support to drag a tab as file to desktop
                    e.dataTransfer.setData('text/plain', labels_1.getPathLabel(resource)); // enables dropping tab resource path into text controls
                }
            }));
            // We need to keep track of DRAG_ENTER and DRAG_LEAVE events because a tab is not just a div without children,
            // it contains a label and a close button. HTML gives us DRAG_ENTER and DRAG_LEAVE events when hovering over
            // these children and this can cause flicker of the drop feedback. The workaround is to count the events and only
            // remove the drop feedback when the counter is 0 (see https://github.com/Microsoft/vscode/issues/14470)
            var counter = 0;
            // Drag over
            disposables.push(DOM.addDisposableListener(tab, DOM.EventType.DRAG_ENTER, function (e) {
                counter++;
                _this.updateDropFeedback(tab, true, index);
            }));
            // Drag leave
            disposables.push(DOM.addDisposableListener(tab, DOM.EventType.DRAG_LEAVE, function (e) {
                counter--;
                if (counter === 0) {
                    _this.updateDropFeedback(tab, false, index);
                }
            }));
            // Drag end
            disposables.push(DOM.addDisposableListener(tab, DOM.EventType.DRAG_END, function (e) {
                counter = 0;
                _this.updateDropFeedback(tab, false, index);
                _this.onEditorDragEnd();
            }));
            // Drop
            disposables.push(DOM.addDisposableListener(tab, DOM.EventType.DROP, function (e) {
                counter = 0;
                _this.updateDropFeedback(tab, false, index);
                var _a = _this.toTabContext(index), group = _a.group, position = _a.position;
                _this.onDrop(e, group, position, index);
            }));
            return lifecycle_1.combinedDisposable(disposables);
        };
        TabsTitleControl.prototype.isTabActionBar = function (element) {
            return !!DOM.findParentWithClass(element, 'monaco-action-bar', 'tab');
        };
        TabsTitleControl.prototype.toTabContext = function (index) {
            var group = this.context;
            var position = this.stacks.positionOfGroup(group);
            var editor = group.getEditor(index);
            return { group: group, position: position, editor: editor };
        };
        TabsTitleControl.prototype.onDrop = function (e, group, targetPosition, targetIndex) {
            this.updateDropFeedback(this.tabsContainer, false);
            DOM.removeClass(this.tabsContainer, 'scroll');
            // Local DND
            var draggedEditor = TabsTitleControl.getDraggedEditor();
            if (draggedEditor) {
                DOM.EventHelper.stop(e, true);
                // Move editor to target position and index
                if (this.isMoveOperation(e, draggedEditor.group, group)) {
                    this.editorGroupService.moveEditor(draggedEditor.editor, draggedEditor.group, group, { index: targetIndex });
                }
                else {
                    this.editorService.openEditor(draggedEditor.editor, { pinned: true, index: targetIndex }, targetPosition).done(null, errors.onUnexpectedError);
                }
                this.onEditorDragEnd();
            }
            else {
                this.handleExternalDrop(e, targetPosition, targetIndex);
            }
        };
        TabsTitleControl.prototype.handleExternalDrop = function (e, targetPosition, targetIndex) {
            var _this = this;
            var droppedResources = dnd_1.extractResources(e).filter(function (r) { return r.resource.scheme === 'file' || r.resource.scheme === 'untitled'; });
            if (droppedResources.length) {
                DOM.EventHelper.stop(e, true);
                titleControl_1.handleWorkspaceExternalDrop(droppedResources, this.fileService, this.messageService, this.windowsService, this.windowService, this.workspacesService).then(function (handled) {
                    if (handled) {
                        return;
                    }
                    // Add external ones to recently open list
                    var externalResources = droppedResources.filter(function (d) { return d.isExternal; }).map(function (d) { return d.resource; });
                    if (externalResources.length) {
                        _this.windowsService.addRecentlyOpened(externalResources.map(function (resource) { return resource.fsPath; }));
                    }
                    // Open in Editor
                    _this.windowService.focusWindow()
                        .then(function () { return _this.editorService.openEditors(droppedResources.map(function (d) {
                        return {
                            input: { resource: d.resource, options: { pinned: true, index: targetIndex } },
                            position: targetPosition
                        };
                    })); }).then(function () {
                        _this.editorGroupService.focusGroup(targetPosition);
                    }).done(null, errors.onUnexpectedError);
                });
            }
        };
        TabsTitleControl.prototype.isMoveOperation = function (e, source, target) {
            var isCopy = (e.ctrlKey && !platform_1.isMacintosh) || (e.altKey && platform_1.isMacintosh);
            return !isCopy || source.id === target.id;
        };
        TabsTitleControl = __decorate([
            __param(0, contextView_1.IContextMenuService),
            __param(1, instantiation_1.IInstantiationService),
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, groupService_1.IEditorGroupService),
            __param(4, contextkey_1.IContextKeyService),
            __param(5, keybinding_1.IKeybindingService),
            __param(6, telemetry_1.ITelemetryService),
            __param(7, message_1.IMessageService),
            __param(8, actions_2.IMenuService),
            __param(9, quickOpen_1.IQuickOpenService),
            __param(10, windows_1.IWindowService),
            __param(11, windows_1.IWindowsService),
            __param(12, themeService_1.IThemeService),
            __param(13, files_1.IFileService),
            __param(14, workspaces_1.IWorkspacesService)
        ], TabsTitleControl);
        return TabsTitleControl;
    }(titleControl_1.TitleControl));
    exports.TabsTitleControl = TabsTitleControl;
    var TabActionRunner = (function (_super) {
        __extends(TabActionRunner, _super);
        function TabActionRunner(group, index) {
            var _this = _super.call(this) || this;
            _this.group = group;
            _this.index = index;
            return _this;
        }
        TabActionRunner.prototype.run = function (action, context) {
            var group = this.group();
            if (!group) {
                return winjs_base_1.TPromise.as(void 0);
            }
            return _super.prototype.run.call(this, action, { group: group, editor: group.getEditor(this.index) });
        };
        return TabActionRunner;
    }(actions_1.ActionRunner));
    themeService_1.registerThemingParticipant(function (theme, collector) {
        // Styling with Outline color (e.g. high contrast theme)
        var activeContrastBorderColor = theme.getColor(colorRegistry_1.activeContrastBorder);
        if (activeContrastBorderColor) {
            collector.addRule("\n\t\t\t.monaco-workbench > .part.editor > .content > .one-editor-silo > .container > .title .tabs-container > .tab.active,\n\t\t\t.monaco-workbench > .part.editor > .content > .one-editor-silo > .container > .title .tabs-container > .tab.active:hover  {\n\t\t\t\toutline: 1px solid;\n\t\t\t\toutline-offset: -5px;\n\t\t\t}\n\n\t\t\t.monaco-workbench > .part.editor > .content > .one-editor-silo > .container > .title .tabs-container > .tab:hover  {\n\t\t\t\toutline: 1px dashed;\n\t\t\t\toutline-offset: -5px;\n\t\t\t}\n\n\t\t\t.monaco-workbench > .part.editor > .content > .one-editor-silo > .container > .title .tabs-container > .tab.active > .tab-close .action-label,\n\t\t\t.monaco-workbench > .part.editor > .content > .one-editor-silo > .container > .title .tabs-container > .tab.active:hover > .tab-close .action-label,\n\t\t\t.monaco-workbench > .part.editor > .content > .one-editor-silo > .container > .title .tabs-container > .tab.dirty > .tab-close .action-label,\n\t\t\t.monaco-workbench > .part.editor > .content > .one-editor-silo > .container > .title .tabs-container > .tab:hover > .tab-close .action-label {\n\t\t\t\topacity: 1 !important;\n\t\t\t}\n\t\t");
        }
    });
});
//# sourceMappingURL=tabsTitleControl.js.map