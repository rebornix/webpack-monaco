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
define(["require", "exports", "vs/base/common/winjs.base", "vs/nls", "vs/base/common/lifecycle", "vs/base/common/objects", "vs/base/browser/dom", "vs/base/common/uri", "vs/base/common/mime", "vs/base/common/functional", "vs/base/common/paths", "vs/base/common/errors", "vs/base/common/types", "vs/base/common/actions", "vs/base/common/comparers", "vs/base/browser/ui/inputbox/inputBox", "vs/base/common/platform", "vs/base/common/glob", "vs/workbench/browser/labels", "vs/workbench/browser/actions", "vs/workbench/services/textfile/common/textfiles", "vs/platform/files/common/files", "vs/base/common/map", "vs/workbench/parts/files/browser/fileActions", "vs/base/parts/tree/browser/tree", "vs/base/parts/tree/browser/treeDnd", "vs/base/parts/tree/browser/treeDefaults", "vs/workbench/parts/files/common/explorerModel", "vs/workbench/services/editor/common/editorService", "vs/workbench/services/part/common/partService", "vs/platform/workspace/common/workspace", "vs/platform/configuration/common/configuration", "vs/platform/contextkey/common/contextkey", "vs/platform/contextview/browser/contextView", "vs/platform/instantiation/common/instantiation", "vs/platform/message/common/message", "vs/platform/progress/common/progress", "vs/platform/telemetry/common/telemetry", "vs/platform/actions/common/actions", "vs/platform/actions/browser/menuItemActionItem", "vs/workbench/services/backup/common/backup", "vs/platform/theme/common/styler", "vs/platform/theme/common/themeService", "vs/platform/windows/common/windows", "vs/workbench/services/workspace/common/workspaceEditing", "vs/base/common/arrays", "vs/platform/environment/common/environment", "vs/base/common/labels"], function (require, exports, winjs_base_1, nls, lifecycle, objects, DOM, uri_1, mime_1, functional_1, paths, errors, types_1, actions_1, comparers, inputBox_1, platform_1, glob, labels_1, actions_2, textfiles_1, files_1, map_1, fileActions_1, tree_1, treeDnd_1, treeDefaults_1, explorerModel_1, editorService_1, partService_1, workspace_1, configuration_1, contextkey_1, contextView_1, instantiation_1, message_1, progress_1, telemetry_1, actions_3, menuItemActionItem_1, backup_1, styler_1, themeService_1, windows_1, workspaceEditing_1, arrays_1, environment_1, labels_2) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var FileDataSource = (function () {
        function FileDataSource(progressService, messageService, fileService, partService, contextService) {
            this.progressService = progressService;
            this.messageService = messageService;
            this.fileService = fileService;
            this.partService = partService;
            this.contextService = contextService;
        }
        FileDataSource.prototype.getId = function (tree, stat) {
            if (stat instanceof explorerModel_1.Model) {
                return 'model';
            }
            return stat.root.resource.toString() + ":" + stat.getId();
        };
        FileDataSource.prototype.hasChildren = function (tree, stat) {
            return stat instanceof explorerModel_1.Model || (stat instanceof explorerModel_1.FileStat && stat.isDirectory);
        };
        FileDataSource.prototype.getChildren = function (tree, stat) {
            var _this = this;
            if (stat instanceof explorerModel_1.Model) {
                return winjs_base_1.TPromise.as(stat.roots);
            }
            // Return early if stat is already resolved
            if (stat.isDirectoryResolved) {
                return winjs_base_1.TPromise.as(stat.children);
            }
            else {
                // Resolve
                var promise = this.fileService.resolveFile(stat.resource, { resolveSingleChildDescendants: true }).then(function (dirStat) {
                    // Convert to view model
                    var modelDirStat = explorerModel_1.FileStat.create(dirStat, stat.root);
                    // Add children to folder
                    for (var i = 0; i < modelDirStat.children.length; i++) {
                        stat.addChild(modelDirStat.children[i]);
                    }
                    stat.isDirectoryResolved = true;
                    return stat.children;
                }, function (e) {
                    _this.messageService.show(message_1.Severity.Error, e);
                    return []; // we could not resolve any children because of an error
                });
                this.progressService.showWhile(promise, this.partService.isCreated() ? 800 : 3200 /* less ugly initial startup */);
                return promise;
            }
        };
        FileDataSource.prototype.getParent = function (tree, stat) {
            if (!stat) {
                return winjs_base_1.TPromise.as(null); // can be null if nothing selected in the tree
            }
            // Return if root reached
            if (tree.getInput() === stat) {
                return winjs_base_1.TPromise.as(null);
            }
            // Return if parent already resolved
            if (stat instanceof explorerModel_1.FileStat && stat.parent) {
                return winjs_base_1.TPromise.as(stat.parent);
            }
            // We never actually resolve the parent from the disk for performance reasons. It wouldnt make
            // any sense to resolve parent by parent with requests to walk up the chain. Instead, the explorer
            // makes sure to properly resolve a deep path to a specific file and merges the result with the model.
            return winjs_base_1.TPromise.as(null);
        };
        FileDataSource = __decorate([
            __param(0, progress_1.IProgressService),
            __param(1, message_1.IMessageService),
            __param(2, files_1.IFileService),
            __param(3, partService_1.IPartService),
            __param(4, workspace_1.IWorkspaceContextService)
        ], FileDataSource);
        return FileDataSource;
    }());
    exports.FileDataSource = FileDataSource;
    var FileActionProvider = (function (_super) {
        __extends(FileActionProvider, _super);
        function FileActionProvider(state) {
            var _this = _super.call(this) || this;
            _this.state = state;
            return _this;
        }
        FileActionProvider.prototype.hasActions = function (tree, stat) {
            if (stat instanceof explorerModel_1.NewStatPlaceholder) {
                return false;
            }
            return _super.prototype.hasActions.call(this, tree, stat);
        };
        FileActionProvider.prototype.getActions = function (tree, stat) {
            if (stat instanceof explorerModel_1.NewStatPlaceholder) {
                return winjs_base_1.TPromise.as([]);
            }
            return _super.prototype.getActions.call(this, tree, stat);
        };
        FileActionProvider.prototype.hasSecondaryActions = function (tree, stat) {
            if (stat instanceof explorerModel_1.NewStatPlaceholder) {
                return false;
            }
            return _super.prototype.hasSecondaryActions.call(this, tree, stat);
        };
        FileActionProvider.prototype.getSecondaryActions = function (tree, stat) {
            if (stat instanceof explorerModel_1.NewStatPlaceholder) {
                return winjs_base_1.TPromise.as([]);
            }
            return _super.prototype.getSecondaryActions.call(this, tree, stat);
        };
        FileActionProvider.prototype.runAction = function (tree, stat, arg, context) {
            var _this = this;
            if (context === void 0) { context = {}; }
            context = objects.mixin({
                viewletState: this.state,
                stat: stat
            }, context);
            if (!types_1.isString(arg)) {
                var action = arg;
                if (action.enabled) {
                    return action.run(context);
                }
                return null;
            }
            var id = arg;
            var promise = this.hasActions(tree, stat) ? this.getActions(tree, stat) : winjs_base_1.TPromise.as([]);
            return promise.then(function (actions) {
                for (var i = 0, len = actions.length; i < len; i++) {
                    if (actions[i].id === id && actions[i].enabled) {
                        return actions[i].run(context);
                    }
                }
                promise = _this.hasSecondaryActions(tree, stat) ? _this.getSecondaryActions(tree, stat) : winjs_base_1.TPromise.as([]);
                return promise.then(function (actions) {
                    for (var i = 0, len = actions.length; i < len; i++) {
                        if (actions[i].id === id && actions[i].enabled) {
                            return actions[i].run(context);
                        }
                    }
                    return null;
                });
            });
        };
        return FileActionProvider;
    }(actions_2.ContributableActionProvider));
    exports.FileActionProvider = FileActionProvider;
    var FileViewletState = (function () {
        function FileViewletState() {
            this._actionProvider = new FileActionProvider(this);
            this.editableStats = new map_1.ResourceMap();
        }
        Object.defineProperty(FileViewletState.prototype, "actionProvider", {
            get: function () {
                return this._actionProvider;
            },
            enumerable: true,
            configurable: true
        });
        FileViewletState.prototype.getEditableData = function (stat) {
            return this.editableStats.get(stat.resource);
        };
        FileViewletState.prototype.setEditable = function (stat, editableData) {
            if (editableData) {
                this.editableStats.set(stat.resource, editableData);
            }
        };
        FileViewletState.prototype.clearEditable = function (stat) {
            this.editableStats.delete(stat.resource);
        };
        return FileViewletState;
    }());
    exports.FileViewletState = FileViewletState;
    var ActionRunner = (function (_super) {
        __extends(ActionRunner, _super);
        function ActionRunner(state) {
            var _this = _super.call(this) || this;
            _this.viewletState = state;
            return _this;
        }
        ActionRunner.prototype.run = function (action, context) {
            return _super.prototype.run.call(this, action, { viewletState: this.viewletState });
        };
        return ActionRunner;
    }(actions_1.ActionRunner));
    exports.ActionRunner = ActionRunner;
    // Explorer Renderer
    var FileRenderer = (function () {
        function FileRenderer(state, contextViewService, instantiationService, themeService) {
            this.contextViewService = contextViewService;
            this.instantiationService = instantiationService;
            this.themeService = themeService;
            this.state = state;
        }
        FileRenderer.prototype.getHeight = function (tree, element) {
            return FileRenderer.ITEM_HEIGHT;
        };
        FileRenderer.prototype.getTemplateId = function (tree, element) {
            return FileRenderer.FILE_TEMPLATE_ID;
        };
        FileRenderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
            templateData.label.dispose();
        };
        FileRenderer.prototype.renderTemplate = function (tree, templateId, container) {
            var label = this.instantiationService.createInstance(labels_1.FileLabel, container, void 0);
            return { label: label, container: container };
        };
        FileRenderer.prototype.renderElement = function (tree, stat, templateId, templateData) {
            var editableData = this.state.getEditableData(stat);
            // File Label
            if (!editableData) {
                templateData.label.element.style.display = 'block';
                var extraClasses = ['explorer-item'];
                templateData.label.setFile(stat.resource, { hidePath: true, fileKind: stat.isRoot ? files_1.FileKind.ROOT_FOLDER : stat.isDirectory ? files_1.FileKind.FOLDER : files_1.FileKind.FILE, extraClasses: extraClasses });
            }
            else {
                templateData.label.element.style.display = 'none';
                this.renderInputBox(templateData.container, tree, stat, editableData);
            }
        };
        FileRenderer.prototype.renderInputBox = function (container, tree, stat, editableData) {
            var _this = this;
            // Use a file label only for the icon next to the input box
            var label = this.instantiationService.createInstance(labels_1.FileLabel, container, void 0);
            var extraClasses = ['explorer-item', 'explorer-item-edited'];
            var fileKind = stat.isRoot ? files_1.FileKind.ROOT_FOLDER : (stat.isDirectory || (stat instanceof explorerModel_1.NewStatPlaceholder && stat.isDirectoryPlaceholder())) ? files_1.FileKind.FOLDER : files_1.FileKind.FILE;
            var labelOptions = { hidePath: true, hideLabel: true, fileKind: fileKind, extraClasses: extraClasses };
            label.setFile(stat.resource, labelOptions);
            // Input field for name
            var inputBox = new inputBox_1.InputBox(label.element, this.contextViewService, {
                validationOptions: {
                    validation: editableData.validator,
                    showMessage: true
                },
                ariaLabel: nls.localize('fileInputAriaLabel', "Type file name. Press Enter to confirm or Escape to cancel.")
            });
            var styler = styler_1.attachInputBoxStyler(inputBox, this.themeService);
            var parent = paths.dirname(stat.resource.fsPath);
            inputBox.onDidChange(function (value) {
                label.setFile(uri_1.default.file(paths.join(parent, value)), labelOptions); // update label icon while typing!
            });
            var value = stat.name || '';
            var lastDot = value.lastIndexOf('.');
            inputBox.value = value;
            inputBox.select({ start: 0, end: lastDot > 0 && !stat.isDirectory ? lastDot : value.length });
            inputBox.focus();
            var done = functional_1.once(function (commit) {
                tree.clearHighlight();
                if (commit && inputBox.value) {
                    _this.state.actionProvider.runAction(tree, stat, editableData.action, { value: inputBox.value });
                }
                var restoreFocus = document.activeElement === inputBox.inputElement; // https://github.com/Microsoft/vscode/issues/20269
                setTimeout(function () {
                    if (restoreFocus) {
                        tree.DOMFocus();
                    }
                    lifecycle.dispose(toDispose);
                    container.removeChild(label.element);
                }, 0);
            });
            var toDispose = [
                inputBox,
                DOM.addStandardDisposableListener(inputBox.inputElement, DOM.EventType.KEY_DOWN, function (e) {
                    if (e.equals(3 /* Enter */)) {
                        if (inputBox.validate()) {
                            done(true);
                        }
                    }
                    else if (e.equals(9 /* Escape */)) {
                        done(false);
                    }
                }),
                DOM.addDisposableListener(inputBox.inputElement, DOM.EventType.BLUR, function () {
                    done(inputBox.isInputValid());
                }),
                label,
                styler
            ];
        };
        FileRenderer.ITEM_HEIGHT = 22;
        FileRenderer.FILE_TEMPLATE_ID = 'file';
        FileRenderer = __decorate([
            __param(1, contextView_1.IContextViewService),
            __param(2, instantiation_1.IInstantiationService),
            __param(3, themeService_1.IThemeService)
        ], FileRenderer);
        return FileRenderer;
    }());
    exports.FileRenderer = FileRenderer;
    // Explorer Accessibility Provider
    var FileAccessibilityProvider = (function () {
        function FileAccessibilityProvider() {
        }
        FileAccessibilityProvider.prototype.getAriaLabel = function (tree, stat) {
            return nls.localize('filesExplorerViewerAriaLabel', "{0}, Files Explorer", stat.name);
        };
        return FileAccessibilityProvider;
    }());
    exports.FileAccessibilityProvider = FileAccessibilityProvider;
    // Explorer Controller
    var FileController = (function (_super) {
        __extends(FileController, _super);
        function FileController(state, editorService, contextMenuService, instantiationService, telemetryService, contextService, menuService, contextKeyService) {
            var _this = _super.call(this, { clickBehavior: treeDefaults_1.ClickBehavior.ON_MOUSE_UP /* do not change to not break DND */, keyboardSupport: false /* handled via IListService */ }) || this;
            _this.editorService = editorService;
            _this.contextMenuService = contextMenuService;
            _this.instantiationService = instantiationService;
            _this.telemetryService = telemetryService;
            _this.contextService = contextService;
            _this.contributedContextMenu = menuService.createMenu(actions_3.MenuId.ExplorerContext, contextKeyService);
            _this.state = state;
            return _this;
        }
        FileController.prototype.onLeftClick = function (tree, stat, event, origin) {
            if (origin === void 0) { origin = 'mouse'; }
            var payload = { origin: origin };
            var isDoubleClick = (origin === 'mouse' && event.detail === 2);
            // Handle Highlight Mode
            if (tree.getHighlight()) {
                // Cancel Event
                event.preventDefault();
                event.stopPropagation();
                tree.clearHighlight(payload);
                return false;
            }
            // Handle root
            if (stat instanceof explorerModel_1.Model) {
                tree.clearFocus(payload);
                tree.clearSelection(payload);
                return false;
            }
            // Cancel Event
            var isMouseDown = event && event.browserEvent && event.browserEvent.type === 'mousedown';
            if (!isMouseDown) {
                event.preventDefault(); // we cannot preventDefault onMouseDown because this would break DND otherwise
            }
            event.stopPropagation();
            // Set DOM focus
            tree.DOMFocus();
            // Expand / Collapse
            tree.toggleExpansion(stat, event.altKey);
            // Allow to unselect
            if (event.shiftKey && !(stat instanceof explorerModel_1.NewStatPlaceholder)) {
                var selection = tree.getSelection();
                if (selection && selection.length > 0 && selection[0] === stat) {
                    tree.clearSelection(payload);
                }
            }
            else if (!(stat instanceof explorerModel_1.NewStatPlaceholder)) {
                var preserveFocus = !isDoubleClick;
                tree.setFocus(stat, payload);
                if (isDoubleClick) {
                    event.preventDefault(); // focus moves to editor, we need to prevent default
                }
                tree.setSelection([stat], payload);
                if (!stat.isDirectory) {
                    this.openEditor(stat, { preserveFocus: preserveFocus, sideBySide: event && (event.ctrlKey || event.metaKey), pinned: isDoubleClick });
                }
            }
            return true;
        };
        FileController.prototype.onContextMenu = function (tree, stat, event) {
            var _this = this;
            if (event.target && event.target.tagName && event.target.tagName.toLowerCase() === 'input') {
                return false;
            }
            event.preventDefault();
            event.stopPropagation();
            tree.setFocus(stat);
            if (!this.state.actionProvider.hasSecondaryActions(tree, stat)) {
                return true;
            }
            var anchor = { x: event.posx + 1, y: event.posy };
            this.contextMenuService.showContextMenu({
                getAnchor: function () { return anchor; },
                getActions: function () {
                    return _this.state.actionProvider.getSecondaryActions(tree, stat).then(function (actions) {
                        menuItemActionItem_1.fillInActions(_this.contributedContextMenu, stat instanceof explorerModel_1.FileStat ? { arg: stat.resource } : null, actions);
                        return actions;
                    });
                },
                getActionItem: this.state.actionProvider.getActionItem.bind(this.state.actionProvider, tree, stat),
                getActionsContext: function (event) {
                    return {
                        viewletState: _this.state,
                        stat: stat,
                        event: event
                    };
                },
                onHide: function (wasCancelled) {
                    if (wasCancelled) {
                        tree.DOMFocus();
                    }
                }
            });
            return true;
        };
        FileController.prototype.openEditor = function (stat, options) {
            if (stat && !stat.isDirectory) {
                this.telemetryService.publicLog('workbenchActionExecuted', { id: 'workbench.files.openFile', from: 'explorer' });
                this.editorService.openEditor({ resource: stat.resource, options: options }, options.sideBySide).done(null, errors.onUnexpectedError);
            }
        };
        FileController = __decorate([
            __param(1, editorService_1.IWorkbenchEditorService),
            __param(2, contextView_1.IContextMenuService),
            __param(3, instantiation_1.IInstantiationService),
            __param(4, telemetry_1.ITelemetryService),
            __param(5, workspace_1.IWorkspaceContextService),
            __param(6, actions_3.IMenuService),
            __param(7, contextkey_1.IContextKeyService)
        ], FileController);
        return FileController;
    }(treeDefaults_1.DefaultController));
    exports.FileController = FileController;
    // Explorer Sorter
    var FileSorter = (function () {
        function FileSorter(configurationService) {
            this.configurationService = configurationService;
            this.toDispose = [];
            this.onConfigurationUpdated(configurationService.getConfiguration());
            this.registerListeners();
        }
        FileSorter.prototype.registerListeners = function () {
            var _this = this;
            this.toDispose.push(this.configurationService.onDidUpdateConfiguration(function (e) { return _this.onConfigurationUpdated(_this.configurationService.getConfiguration()); }));
        };
        FileSorter.prototype.onConfigurationUpdated = function (configuration) {
            this.sortOrder = configuration && configuration.explorer && configuration.explorer.sortOrder || 'default';
        };
        FileSorter.prototype.compare = function (tree, statA, statB) {
            // Do not sort roots
            if (statA.isRoot) {
                return -1;
            }
            if (statB.isRoot) {
                return 1;
            }
            // Sort Directories
            switch (this.sortOrder) {
                case 'type':
                    if (statA.isDirectory && !statB.isDirectory) {
                        return -1;
                    }
                    if (statB.isDirectory && !statA.isDirectory) {
                        return 1;
                    }
                    if (statA.isDirectory && statB.isDirectory) {
                        return comparers.compareFileNames(statA.name, statB.name);
                    }
                    break;
                case 'filesFirst':
                    if (statA.isDirectory && !statB.isDirectory) {
                        return 1;
                    }
                    if (statB.isDirectory && !statA.isDirectory) {
                        return -1;
                    }
                    break;
                default:/* 'default', 'modified' */ 
                    if (statA.isDirectory && !statB.isDirectory) {
                        return -1;
                    }
                    if (statB.isDirectory && !statA.isDirectory) {
                        return 1;
                    }
                    break;
            }
            // Sort "New File/Folder" placeholders
            if (statA instanceof explorerModel_1.NewStatPlaceholder) {
                return -1;
            }
            if (statB instanceof explorerModel_1.NewStatPlaceholder) {
                return 1;
            }
            // Sort Files
            switch (this.sortOrder) {
                case 'type':
                    return comparers.compareFileExtensions(statA.name, statB.name);
                case 'modified':
                    if (statA.mtime !== statB.mtime) {
                        return statA.mtime < statB.mtime ? 1 : -1;
                    }
                    return comparers.compareFileNames(statA.name, statB.name);
                default:/* 'default', 'mixed', 'filesFirst' */ 
                    return comparers.compareFileNames(statA.name, statB.name);
            }
        };
        FileSorter = __decorate([
            __param(0, configuration_1.IConfigurationService)
        ], FileSorter);
        return FileSorter;
    }());
    exports.FileSorter = FileSorter;
    // Explorer Filter
    var FileFilter = (function () {
        function FileFilter(contextService, configurationService) {
            var _this = this;
            this.contextService = contextService;
            this.configurationService = configurationService;
            this.hiddenExpressionPerRoot = new Map();
            this.contextService.onDidChangeWorkspaceRoots(function () { return _this.updateConfiguration(); });
        }
        FileFilter.prototype.updateConfiguration = function () {
            var _this = this;
            var needsRefresh = false;
            this.contextService.getWorkspace().roots.forEach(function (root) {
                var configuration = _this.configurationService.getConfiguration(undefined, { resource: root });
                var excludesConfig = (configuration && configuration.files && configuration.files.exclude) || Object.create(null);
                needsRefresh = needsRefresh || !objects.equals(_this.hiddenExpressionPerRoot.get(root.toString()), excludesConfig);
                _this.hiddenExpressionPerRoot.set(root.toString(), objects.clone(excludesConfig)); // do not keep the config, as it gets mutated under our hoods
            });
            return needsRefresh;
        };
        FileFilter.prototype.isVisible = function (tree, stat) {
            return this.doIsVisible(stat);
        };
        FileFilter.prototype.doIsVisible = function (stat) {
            if (stat instanceof explorerModel_1.NewStatPlaceholder) {
                return true; // always visible
            }
            // Workaround for O(N^2) complexity (https://github.com/Microsoft/vscode/issues/9962)
            var siblings = stat.parent && stat.parent.children && stat.parent.children;
            if (siblings && siblings.length > FileFilter.MAX_SIBLINGS_FILTER_THRESHOLD) {
                siblings = void 0;
            }
            // Hide those that match Hidden Patterns
            var siblingsFn = function () { return siblings && siblings.map(function (c) { return c.name; }); };
            var expression = this.hiddenExpressionPerRoot.get(stat.root.resource.toString()) || Object.create(null);
            if (glob.match(expression, paths.normalize(paths.relative(stat.root.resource.fsPath, stat.resource.fsPath), true), siblingsFn)) {
                return false; // hidden through pattern
            }
            return true;
        };
        FileFilter.MAX_SIBLINGS_FILTER_THRESHOLD = 2000;
        FileFilter = __decorate([
            __param(0, workspace_1.IWorkspaceContextService),
            __param(1, configuration_1.IConfigurationService)
        ], FileFilter);
        return FileFilter;
    }());
    exports.FileFilter = FileFilter;
    // Explorer Drag And Drop Controller
    var FileDragAndDrop = (function (_super) {
        __extends(FileDragAndDrop, _super);
        function FileDragAndDrop(messageService, contextService, progressService, fileService, configurationService, instantiationService, textFileService, backupFileService, windowService, workspaceEditingService, environmentService) {
            var _this = _super.call(this, function (stat) { return _this.statToResource(stat); }) || this;
            _this.messageService = messageService;
            _this.contextService = contextService;
            _this.progressService = progressService;
            _this.fileService = fileService;
            _this.configurationService = configurationService;
            _this.instantiationService = instantiationService;
            _this.textFileService = textFileService;
            _this.backupFileService = backupFileService;
            _this.windowService = windowService;
            _this.workspaceEditingService = workspaceEditingService;
            _this.environmentService = environmentService;
            _this.toDispose = [];
            _this.onConfigurationUpdated(configurationService.getConfiguration());
            _this.registerListeners();
            return _this;
        }
        FileDragAndDrop.prototype.statToResource = function (stat) {
            if (stat.isRoot) {
                return null; // Can not move root folder
            }
            if (stat.isDirectory) {
                return uri_1.default.from({ scheme: 'folder', path: stat.resource.fsPath }); // indicates that we are dragging a folder
            }
            return stat.resource;
        };
        FileDragAndDrop.prototype.registerListeners = function () {
            var _this = this;
            this.toDispose.push(this.configurationService.onDidUpdateConfiguration(function (e) { return _this.onConfigurationUpdated(_this.configurationService.getConfiguration()); }));
        };
        FileDragAndDrop.prototype.onConfigurationUpdated = function (config) {
            this.dropEnabled = config && config.explorer && config.explorer.enableDragAndDrop;
        };
        FileDragAndDrop.prototype.onDragStart = function (tree, data, originalEvent) {
            var sources = data.getData();
            var source = null;
            if (sources.length > 0) {
                source = sources[0];
            }
            // When dragging folders, make sure to collapse them to free up some space
            if (source && source.isDirectory && tree.isExpanded(source)) {
                tree.collapse(source, false);
            }
            // Apply some datatransfer types to allow for dragging the element outside of the application
            if (source) {
                if (!source.isDirectory) {
                    originalEvent.dataTransfer.setData('DownloadURL', [mime_1.MIME_BINARY, source.name, source.resource.toString()].join(':'));
                }
                originalEvent.dataTransfer.setData('text/plain', labels_2.getPathLabel(source.resource));
            }
        };
        FileDragAndDrop.prototype.onDragOver = function (tree, data, target, originalEvent) {
            if (!this.dropEnabled) {
                return tree_1.DRAG_OVER_REJECT;
            }
            var isCopy = originalEvent && ((originalEvent.ctrlKey && !platform_1.isMacintosh) || (originalEvent.altKey && platform_1.isMacintosh));
            var fromDesktop = data instanceof treeDnd_1.DesktopDragAndDropData;
            // Desktop DND
            if (fromDesktop) {
                var dragData = data.getData();
                var types = dragData.types;
                var typesArray = [];
                for (var i = 0; i < types.length; i++) {
                    typesArray.push(types[i]);
                }
                if (typesArray.length === 0 || !typesArray.some(function (type) { return type === 'Files'; })) {
                    return tree_1.DRAG_OVER_REJECT;
                }
            }
            else if (data instanceof treeDnd_1.ExternalElementsDragAndDropData) {
                return tree_1.DRAG_OVER_REJECT;
            }
            else {
                if (target instanceof explorerModel_1.Model) {
                    return tree_1.DRAG_OVER_REJECT;
                }
                var sources = data.getData();
                if (!Array.isArray(sources)) {
                    return tree_1.DRAG_OVER_REJECT;
                }
                if (sources.some(function (source) {
                    if (source instanceof explorerModel_1.NewStatPlaceholder) {
                        return true; // NewStatPlaceholders can not be moved
                    }
                    if (source.resource.toString() === target.resource.toString()) {
                        return true; // Can not move anything onto itself
                    }
                    if (!isCopy && paths.isEqual(paths.dirname(source.resource.fsPath), target.resource.fsPath)) {
                        return true; // Can not move a file to the same parent unless we copy
                    }
                    if (paths.isEqualOrParent(target.resource.fsPath, source.resource.fsPath, !platform_1.isLinux /* ignorecase */)) {
                        return true; // Can not move a parent folder into one of its children
                    }
                    return false;
                })) {
                    return tree_1.DRAG_OVER_REJECT;
                }
            }
            // All (target = model)
            if (target instanceof explorerModel_1.Model) {
                return this.contextService.hasMultiFolderWorkspace() ? tree_1.DRAG_OVER_ACCEPT_BUBBLE_DOWN_COPY(false) : tree_1.DRAG_OVER_REJECT; // can only drop folders to workspace
            }
            else {
                if (target.isDirectory) {
                    return fromDesktop || isCopy ? tree_1.DRAG_OVER_ACCEPT_BUBBLE_DOWN_COPY(true) : tree_1.DRAG_OVER_ACCEPT_BUBBLE_DOWN(true);
                }
                var workspace = this.contextService.getWorkspace();
                if (workspace && workspace.roots.every(function (r) { return r.toString() !== target.resource.toString(); })) {
                    return fromDesktop || isCopy ? tree_1.DRAG_OVER_ACCEPT_BUBBLE_UP_COPY : tree_1.DRAG_OVER_ACCEPT_BUBBLE_UP;
                }
            }
            return tree_1.DRAG_OVER_REJECT;
        };
        FileDragAndDrop.prototype.drop = function (tree, data, target, originalEvent) {
            var promise = winjs_base_1.TPromise.as(null);
            // Desktop DND (Import file)
            if (data instanceof treeDnd_1.DesktopDragAndDropData) {
                promise = this.handleExternalDrop(tree, data, target, originalEvent);
            }
            else {
                if (target instanceof explorerModel_1.FileStat) {
                    promise = this.handleExplorerDrop(tree, data, target, originalEvent);
                }
            }
            this.progressService.showWhile(promise, 800);
            promise.done(null, errors.onUnexpectedError);
        };
        FileDragAndDrop.prototype.handleExternalDrop = function (tree, data, target, originalEvent) {
            var _this = this;
            var fileList = data.getData().files;
            var filePaths = [];
            for (var i = 0; i < fileList.length; i++) {
                filePaths.push(fileList[i].path);
            }
            // Check for dropped external files to be folders
            return this.fileService.resolveFiles(filePaths.map(function (filePath) { return { resource: uri_1.default.file(filePath) }; })).then(function (result) {
                // Pass focus to window
                _this.windowService.focusWindow();
                // Handle folders by adding to workspace if we are in workspace context
                var folders = result.filter(function (result) { return result.stat.isDirectory; }).map(function (result) { return result.stat.resource; });
                if (folders.length > 0) {
                    if (_this.environmentService.appQuality === 'stable') {
                        return void 0; // TODO@Ben multi root
                    }
                    if (_this.contextService.hasMultiFolderWorkspace()) {
                        return _this.workspaceEditingService.addRoots(folders);
                    }
                    // If we are in single-folder context, ask for confirmation to create a workspace
                    var result_1 = _this.messageService.confirm({
                        message: folders.length > 1 ? nls.localize('dropFolders', "Do you want to add the folders to the workspace?") : nls.localize('dropFolder', "Do you want to add the folder to the workspace?"),
                        type: 'question',
                        primaryButton: folders.length > 1 ? nls.localize('addFolders', "&&Add Folders") : nls.localize('addFolder', "&&Add Folder")
                    });
                    if (result_1) {
                        var currentRoots = _this.contextService.getWorkspace().roots;
                        var newRoots = currentRoots.concat(folders);
                        return _this.windowService.createAndOpenWorkspace(arrays_1.distinct(newRoots.map(function (root) { return root.fsPath; })));
                    }
                }
                else if (target instanceof explorerModel_1.FileStat) {
                    var importAction = _this.instantiationService.createInstance(fileActions_1.ImportFileAction, tree, target, null);
                    return importAction.run({
                        input: { paths: filePaths }
                    });
                }
                return void 0;
            });
        };
        FileDragAndDrop.prototype.handleExplorerDrop = function (tree, data, target, originalEvent) {
            var _this = this;
            var source = data.getData()[0];
            var isCopy = (originalEvent.ctrlKey && !platform_1.isMacintosh) || (originalEvent.altKey && platform_1.isMacintosh);
            return tree.expand(target).then(function () {
                // Reuse duplicate action if user copies
                if (isCopy) {
                    return _this.instantiationService.createInstance(fileActions_1.DuplicateFileAction, tree, source, target).run();
                }
                var dirtyMoved = [];
                // Success: load all files that are dirty again to restore their dirty contents
                // Error: discard any backups created during the process
                var onSuccess = function () { return winjs_base_1.TPromise.join(dirtyMoved.map(function (t) { return _this.textFileService.models.loadOrCreate(t); })); };
                var onError = function (error, showError) {
                    if (showError) {
                        _this.messageService.show(message_1.Severity.Error, error);
                    }
                    return winjs_base_1.TPromise.join(dirtyMoved.map(function (d) { return _this.backupFileService.discardResourceBackup(d); }));
                };
                // 1. check for dirty files that are being moved and backup to new target
                var dirty = _this.textFileService.getDirty().filter(function (d) { return paths.isEqualOrParent(d.fsPath, source.resource.fsPath, !platform_1.isLinux /* ignorecase */); });
                return winjs_base_1.TPromise.join(dirty.map(function (d) {
                    var moved;
                    // If the dirty file itself got moved, just reparent it to the target folder
                    if (paths.isEqual(source.resource.fsPath, d.fsPath)) {
                        moved = uri_1.default.file(paths.join(target.resource.fsPath, source.name));
                    }
                    else {
                        moved = uri_1.default.file(paths.join(target.resource.fsPath, d.fsPath.substr(source.parent.resource.fsPath.length + 1)));
                    }
                    dirtyMoved.push(moved);
                    var model = _this.textFileService.models.get(d);
                    return _this.backupFileService.backupResource(moved, model.getValue(), model.getVersionId());
                }))
                    .then(function () { return _this.textFileService.revertAll(dirty, { soft: true /* do not attempt to load content from disk */ }); })
                    .then(function () {
                    var targetResource = uri_1.default.file(paths.join(target.resource.fsPath, source.name));
                    var didHandleConflict = false;
                    return _this.fileService.moveFile(source.resource, targetResource).then(null, function (error) {
                        // Conflict
                        if (error.fileOperationResult === files_1.FileOperationResult.FILE_MOVE_CONFLICT) {
                            didHandleConflict = true;
                            var confirm_1 = {
                                message: nls.localize('confirmOverwriteMessage', "'{0}' already exists in the destination folder. Do you want to replace it?", source.name),
                                detail: nls.localize('irreversible', "This action is irreversible!"),
                                primaryButton: nls.localize({ key: 'replaceButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Replace"),
                                type: 'warning'
                            };
                            // Move with overwrite if the user confirms
                            if (_this.messageService.confirm(confirm_1)) {
                                var targetDirty = _this.textFileService.getDirty().filter(function (d) { return paths.isEqualOrParent(d.fsPath, targetResource.fsPath, !platform_1.isLinux /* ignorecase */); });
                                // Make sure to revert all dirty in target first to be able to overwrite properly
                                return _this.textFileService.revertAll(targetDirty, { soft: true /* do not attempt to load content from disk */ }).then(function () {
                                    // Then continue to do the move operation
                                    return _this.fileService.moveFile(source.resource, targetResource, true).then(onSuccess, function (error) { return onError(error, true); });
                                });
                            }
                            return onError();
                        }
                        return onError(error, true);
                    });
                })
                    .then(onSuccess, onError);
            }, errors.onUnexpectedError);
        };
        FileDragAndDrop = __decorate([
            __param(0, message_1.IMessageService),
            __param(1, workspace_1.IWorkspaceContextService),
            __param(2, progress_1.IProgressService),
            __param(3, files_1.IFileService),
            __param(4, configuration_1.IConfigurationService),
            __param(5, instantiation_1.IInstantiationService),
            __param(6, textfiles_1.ITextFileService),
            __param(7, backup_1.IBackupFileService),
            __param(8, windows_1.IWindowService),
            __param(9, workspaceEditing_1.IWorkspaceEditingService),
            __param(10, environment_1.IEnvironmentService)
        ], FileDragAndDrop);
        return FileDragAndDrop;
    }(treeDnd_1.SimpleFileResourceDragAndDrop));
    exports.FileDragAndDrop = FileDragAndDrop;
});
//# sourceMappingURL=explorerViewer.js.map