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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/browser/builder", "vs/base/common/uri", "vs/base/common/async", "vs/base/common/errors", "vs/base/common/labels", "vs/base/common/paths", "vs/base/common/glob", "vs/workbench/browser/actions", "vs/base/common/decorators", "vs/base/parts/tree/browser/treeImpl", "vs/workbench/parts/files/common/files", "vs/platform/files/common/files", "vs/workbench/parts/files/browser/fileActions", "vs/workbench/parts/files/browser/views/explorerViewer", "vs/workbench/common/editor", "vs/workbench/common/editor/diffEditorInput", "vs/workbench/services/group/common/groupService", "vs/base/browser/dom", "vs/workbench/browser/viewlet", "vs/workbench/parts/views/browser/views", "vs/workbench/parts/files/common/explorerModel", "vs/platform/list/browser/listService", "vs/workbench/services/editor/common/editorService", "vs/workbench/services/part/common/partService", "vs/platform/workspace/common/workspace", "vs/platform/configuration/common/configuration", "vs/platform/keybinding/common/keybinding", "vs/platform/instantiation/common/instantiation", "vs/platform/progress/common/progress", "vs/platform/contextview/browser/contextView", "vs/platform/message/common/message", "vs/platform/contextkey/common/contextkey", "vs/workbench/common/resources", "vs/workbench/services/themes/common/workbenchThemeService", "vs/base/common/platform", "vs/platform/environment/common/environment", "vs/platform/theme/common/styler", "vs/base/browser/ui/splitview/splitview"], function (require, exports, nls, winjs_base_1, builder_1, uri_1, async_1, errors, labels, paths, glob, actions_1, decorators_1, treeImpl_1, files_1, files_2, fileActions_1, explorerViewer_1, editor_1, diffEditorInput_1, groupService_1, DOM, viewlet_1, views_1, explorerModel_1, listService_1, editorService_1, partService_1, workspace_1, configuration_1, keybinding_1, instantiation_1, progress_1, contextView_1, message_1, contextkey_1, resources_1, workbenchThemeService_1, platform_1, environment_1, styler_1, splitview_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExplorerView = (function (_super) {
        __extends(ExplorerView, _super);
        function ExplorerView(initialSize, options, messageService, contextMenuService, instantiationService, editorGroupService, contextService, progressService, listService, editorService, fileService, partService, keybindingService, contextKeyService, configurationService, themeService, environmentService) {
            var _this = _super.call(this, initialSize, __assign({}, options, { ariaHeaderLabel: nls.localize('explorerSection', "Files Explorer Section"), sizing: splitview_1.ViewSizing.Flexible }), keybindingService, contextMenuService) || this;
            _this.messageService = messageService;
            _this.instantiationService = instantiationService;
            _this.editorGroupService = editorGroupService;
            _this.contextService = contextService;
            _this.progressService = progressService;
            _this.listService = listService;
            _this.editorService = editorService;
            _this.fileService = fileService;
            _this.partService = partService;
            _this.configurationService = configurationService;
            _this.themeService = themeService;
            _this.environmentService = environmentService;
            _this.id = ExplorerView.ID;
            _this.settings = options.viewletSettings;
            _this.viewletState = options.viewletState;
            _this.actionRunner = options.actionRunner;
            _this.autoReveal = true;
            _this.explorerRefreshDelayer = new async_1.ThrottledDelayer(ExplorerView.EXPLORER_FILE_CHANGES_REFRESH_DELAY);
            _this.explorerImportDelayer = new async_1.ThrottledDelayer(ExplorerView.EXPLORER_IMPORT_REFRESH_DELAY);
            _this.resourceContext = instantiationService.createInstance(resources_1.ResourceContextKey);
            _this.folderContext = files_1.ExplorerFolderContext.bindTo(contextKeyService);
            _this.filesExplorerFocusedContext = files_1.FilesExplorerFocusedContext.bindTo(contextKeyService);
            _this.explorerFocusedContext = files_1.ExplorerFocusedContext.bindTo(contextKeyService);
            _this.fileEventsFilter = instantiationService.createInstance(resources_1.ResourceGlobMatcher, function (root) { return _this.getFileEventsExcludes(root); }, function (expression) { return glob.parse(expression); });
            return _this;
        }
        ExplorerView.prototype.getFileEventsExcludes = function (root) {
            var scope = root ? { resource: root } : void 0;
            var configuration = this.configurationService.getConfiguration(undefined, scope);
            return (configuration && configuration.files && configuration.files.exclude) || Object.create(null);
        };
        ExplorerView.prototype.renderHeader = function (container) {
            var _this = this;
            var titleDiv = builder_1.$('div.title').appendTo(container);
            var titleSpan = builder_1.$('span').appendTo(titleDiv);
            var setHeader = function () {
                var workspace = _this.contextService.getWorkspace();
                var title = workspace.roots.map(function (root) { return labels.getPathLabel(root.fsPath, void 0, _this.environmentService); }).join();
                titleSpan.text(_this.name).title(title);
            };
            this.toDispose.push(this.contextService.onDidChangeWorkspaceName(function () { return setHeader(); }));
            setHeader();
            _super.prototype.renderHeader.call(this, container);
        };
        Object.defineProperty(ExplorerView.prototype, "name", {
            get: function () {
                return this.contextService.getWorkspace().name;
            },
            set: function (value) {
                // noop
            },
            enumerable: true,
            configurable: true
        });
        ExplorerView.prototype.renderBody = function (container) {
            var _this = this;
            this.treeContainer = _super.prototype.renderViewTree.call(this, container);
            DOM.addClass(this.treeContainer, 'explorer-folders-view');
            DOM.addClass(this.treeContainer, 'show-file-icons');
            this.tree = this.createViewer(builder_1.$(this.treeContainer));
            if (this.toolBar) {
                this.toolBar.setActions(actions_1.prepareActions(this.getActions()), this.getSecondaryActions())();
            }
            var onFileIconThemeChange = function (fileIconTheme) {
                DOM.toggleClass(_this.treeContainer, 'align-icons-and-twisties', fileIconTheme.hasFileIcons && !fileIconTheme.hasFolderIcons);
            };
            this.toDispose.push(this.themeService.onDidFileIconThemeChange(onFileIconThemeChange));
            this.toDispose.push(this.contextService.onDidChangeWorkspaceRoots(function () { return _this.refreshFromEvent(); }));
            onFileIconThemeChange(this.themeService.getFileIconTheme());
        };
        ExplorerView.prototype.getActions = function () {
            var actions = [];
            actions.push(this.instantiationService.createInstance(fileActions_1.NewFileAction, this.getViewer(), null));
            actions.push(this.instantiationService.createInstance(fileActions_1.NewFolderAction, this.getViewer(), null));
            actions.push(this.instantiationService.createInstance(fileActions_1.RefreshViewExplorerAction, this, 'explorer-action refresh-explorer'));
            actions.push(this.instantiationService.createInstance(viewlet_1.CollapseAction, this.getViewer(), true, 'explorer-action collapse-explorer'));
            // Set Order
            for (var i = 0; i < actions.length; i++) {
                var action = actions[i];
                action.order = 10 * (i + 1);
            }
            return actions;
        };
        ExplorerView.prototype.create = function () {
            var _this = this;
            // Update configuration
            var configuration = this.configurationService.getConfiguration();
            this.onConfigurationUpdated(configuration);
            // Load and Fill Viewer
            return this.doRefresh().then(function () {
                // When the explorer viewer is loaded, listen to changes to the editor input
                _this.toDispose.push(_this.editorGroupService.onEditorsChanged(function () { return _this.onEditorsChanged(); }));
                // Also handle configuration updates
                _this.toDispose.push(_this.configurationService.onDidUpdateConfiguration(function (e) { return _this.onConfigurationUpdated(_this.configurationService.getConfiguration(), true); }));
            });
        };
        ExplorerView.prototype.onEditorsChanged = function () {
            if (!this.autoReveal) {
                return; // do not touch selection or focus if autoReveal === false
            }
            var clearSelection = true;
            var clearFocus = false;
            // Handle files
            var activeFile = this.getActiveFile();
            if (activeFile) {
                // Always remember last opened file
                this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE] = activeFile.toString();
                // Select file if input is inside workspace
                if (this.isVisible() && this.contextService.isInsideWorkspace(activeFile)) {
                    var selection = this.hasSelection(activeFile);
                    if (!selection) {
                        this.select(activeFile).done(null, errors.onUnexpectedError);
                    }
                    clearSelection = false;
                }
            }
            // Handle closed or untitled file (convince explorer to not reopen any file when getting visible)
            var activeInput = this.editorService.getActiveEditorInput();
            if (!activeInput || editor_1.toResource(activeInput, { supportSideBySide: true, filter: 'untitled' })) {
                this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE] = void 0;
                clearFocus = true;
            }
            // Otherwise clear
            if (clearSelection) {
                this.explorerViewer.clearSelection();
            }
            if (clearFocus) {
                this.explorerViewer.clearFocus();
            }
        };
        ExplorerView.prototype.onConfigurationUpdated = function (configuration, refresh) {
            if (this.isDisposed) {
                return; // guard against possible race condition when config change causes recreate of views
            }
            this.autoReveal = configuration && configuration.explorer && configuration.explorer.autoReveal;
            // Push down config updates to components of viewer
            var needsRefresh = false;
            if (this.filter) {
                needsRefresh = this.filter.updateConfiguration();
            }
            var configSortOrder = configuration && configuration.explorer && configuration.explorer.sortOrder || 'default';
            if (this.sortOrder !== configSortOrder) {
                this.sortOrder = configSortOrder;
                needsRefresh = true;
            }
            // Refresh viewer as needed
            if (refresh && needsRefresh) {
                this.doRefresh().done(null, errors.onUnexpectedError);
            }
        };
        ExplorerView.prototype.focusBody = function () {
            var keepFocus = false;
            // Make sure the current selected element is revealed
            if (this.explorerViewer) {
                if (this.autoReveal) {
                    var selection = this.explorerViewer.getSelection();
                    if (selection.length > 0) {
                        this.reveal(selection[0], 0.5).done(null, errors.onUnexpectedError);
                    }
                }
                // Pass Focus to Viewer
                this.explorerViewer.DOMFocus();
                keepFocus = true;
            }
            // Open the focused element in the editor if there is currently no file opened
            var activeFile = this.getActiveFile();
            if (!activeFile) {
                this.openFocusedElement(keepFocus);
            }
        };
        ExplorerView.prototype.setVisible = function (visible) {
            var _this = this;
            return _super.prototype.setVisible.call(this, visible).then(function () {
                // Show
                if (visible) {
                    // If a refresh was requested and we are now visible, run it
                    var refreshPromise = winjs_base_1.TPromise.as(null);
                    if (_this.shouldRefresh) {
                        refreshPromise = _this.doRefresh();
                        _this.shouldRefresh = false; // Reset flag
                    }
                    if (!_this.autoReveal) {
                        return refreshPromise; // do not react to setVisible call if autoReveal === false
                    }
                    // Always select the current navigated file in explorer if input is file editor input
                    // unless autoReveal is set to false
                    var activeFile_1 = _this.getActiveFile();
                    if (activeFile_1) {
                        return refreshPromise.then(function () {
                            return _this.select(activeFile_1);
                        });
                    }
                    // Return now if the workbench has not yet been created - in this case the workbench takes care of restoring last used editors
                    if (!_this.partService.isCreated()) {
                        return winjs_base_1.TPromise.as(null);
                    }
                    // Otherwise restore last used file: By lastActiveFileResource
                    var lastActiveFileResource = void 0;
                    if (_this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE]) {
                        lastActiveFileResource = uri_1.default.parse(_this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE]);
                    }
                    if (lastActiveFileResource && _this.isCreated && _this.model.findClosest(lastActiveFileResource)) {
                        _this.editorService.openEditor({ resource: lastActiveFileResource, options: { revealIfVisible: true } }).done(null, errors.onUnexpectedError);
                        return refreshPromise;
                    }
                    // Otherwise restore last used file: By Explorer selection
                    return refreshPromise.then(function () {
                        _this.openFocusedElement();
                    });
                }
                return void 0;
            });
        };
        ExplorerView.prototype.openFocusedElement = function (preserveFocus) {
            var stat = this.explorerViewer.getFocus();
            if (stat && !stat.isDirectory) {
                this.editorService.openEditor({ resource: stat.resource, options: { preserveFocus: preserveFocus, revealIfVisible: true } }).done(null, errors.onUnexpectedError);
            }
        };
        ExplorerView.prototype.getActiveFile = function () {
            var input = this.editorService.getActiveEditorInput();
            // ignore diff editor inputs (helps to get out of diffing when returning to explorer)
            if (input instanceof diffEditorInput_1.DiffEditorInput) {
                return null;
            }
            // check for files
            return editor_1.toResource(input, { supportSideBySide: true, filter: 'file' });
        };
        Object.defineProperty(ExplorerView.prototype, "isCreated", {
            get: function () {
                return !!(this.explorerViewer && this.explorerViewer.getInput());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExplorerView.prototype, "model", {
            get: function () {
                return this.instantiationService.createInstance(explorerModel_1.Model);
            },
            enumerable: true,
            configurable: true
        });
        ExplorerView.prototype.createViewer = function (container) {
            var _this = this;
            var dataSource = this.instantiationService.createInstance(explorerViewer_1.FileDataSource);
            var renderer = this.instantiationService.createInstance(explorerViewer_1.FileRenderer, this.viewletState);
            var controller = this.instantiationService.createInstance(explorerViewer_1.FileController, this.viewletState);
            var sorter = this.instantiationService.createInstance(explorerViewer_1.FileSorter);
            this.filter = this.instantiationService.createInstance(explorerViewer_1.FileFilter);
            var dnd = this.instantiationService.createInstance(explorerViewer_1.FileDragAndDrop);
            var accessibilityProvider = this.instantiationService.createInstance(explorerViewer_1.FileAccessibilityProvider);
            this.explorerViewer = new treeImpl_1.Tree(container.getHTMLElement(), {
                dataSource: dataSource,
                renderer: renderer,
                controller: controller,
                sorter: sorter,
                filter: this.filter,
                dnd: dnd,
                accessibilityProvider: accessibilityProvider
            }, {
                autoExpandSingleChildren: true,
                ariaLabel: nls.localize('treeAriaLabel', "Files Explorer"),
                twistiePixels: 12,
                showTwistie: false,
                keyboardSupport: false
            });
            // Theme styler
            this.toDispose.push(styler_1.attachListStyler(this.explorerViewer, this.themeService));
            // Register to list service
            this.toDispose.push(this.listService.register(this.explorerViewer, [this.explorerFocusedContext, this.filesExplorerFocusedContext]));
            // Update Viewer based on File Change Events
            this.toDispose.push(this.fileService.onAfterOperation(function (e) { return _this.onFileOperation(e); }));
            this.toDispose.push(this.fileService.onFileChanges(function (e) { return _this.onFileChanges(e); }));
            // Update resource context based on focused element
            this.toDispose.push(this.explorerViewer.addListener('focus', function (e) {
                _this.resourceContext.set(e.focus && e.focus.resource);
                _this.folderContext.set(e.focus && e.focus.isDirectory);
            }));
            // Open when selecting via keyboard
            this.toDispose.push(this.explorerViewer.addListener('selection', function (event) {
                if (event && event.payload && event.payload.origin === 'keyboard') {
                    var element = _this.tree.getSelection();
                    if (Array.isArray(element) && element[0] instanceof explorerModel_1.FileStat) {
                        if (element[0].isDirectory) {
                            _this.explorerViewer.toggleExpansion(element[0]);
                        }
                        controller.openEditor(element[0], { pinned: false, sideBySide: false, preserveFocus: false });
                    }
                }
            }));
            return this.explorerViewer;
        };
        ExplorerView.prototype.getOptimalWidth = function () {
            var parentNode = this.explorerViewer.getHTMLElement();
            var childNodes = [].slice.call(parentNode.querySelectorAll('.explorer-item > a'));
            return DOM.getLargestChildWidth(parentNode, childNodes);
        };
        ExplorerView.prototype.onFileOperation = function (e) {
            var _this = this;
            if (!this.isCreated) {
                return; // ignore if not yet created
            }
            // Add
            if (e.operation === files_2.FileOperation.CREATE || e.operation === files_2.FileOperation.IMPORT || e.operation === files_2.FileOperation.COPY) {
                var addedElement_1 = e.target;
                var parentResource = uri_1.default.file(paths.dirname(addedElement_1.resource.fsPath));
                var parents = this.model.findAll(parentResource);
                if (parents.length) {
                    // Add the new file to its parent (Model)
                    parents.forEach(function (p) {
                        // We have to check if the parent is resolved #29177
                        (p.isDirectoryResolved ? winjs_base_1.TPromise.as(null) : _this.fileService.resolveFile(p.resource)).then(function (stat) {
                            if (stat) {
                                var modelStat = explorerModel_1.FileStat.create(stat, p.root);
                                explorerModel_1.FileStat.mergeLocalWithDisk(modelStat, p);
                            }
                            var childElement = explorerModel_1.FileStat.create(addedElement_1, p.root);
                            p.removeChild(childElement); // make sure to remove any previous version of the file if any
                            p.addChild(childElement);
                            // Refresh the Parent (View)
                            _this.explorerViewer.refresh(p).then(function () {
                                return _this.reveal(childElement, 0.5).then(function () {
                                    // Focus new element
                                    _this.explorerViewer.setFocus(childElement);
                                });
                            }).done(null, errors.onUnexpectedError);
                        });
                    });
                }
            }
            else if (e.operation === files_2.FileOperation.MOVE) {
                var oldResource = e.resource;
                var newElement_1 = e.target;
                var oldParentResource = uri_1.default.file(paths.dirname(oldResource.fsPath));
                var newParentResource = uri_1.default.file(paths.dirname(newElement_1.resource.fsPath));
                // Only update focus if renamed/moved element is selected
                var restoreFocus_1 = false;
                var focus_1 = this.explorerViewer.getFocus();
                if (focus_1 && focus_1.resource && focus_1.resource.toString() === oldResource.toString()) {
                    restoreFocus_1 = true;
                }
                // Handle Rename
                if (oldParentResource && newParentResource && oldParentResource.toString() === newParentResource.toString()) {
                    var modelElements = this.model.findAll(oldResource);
                    modelElements.forEach(function (modelElement) {
                        // Rename File (Model)
                        modelElement.rename(newElement_1);
                        // Update Parent (View)
                        _this.explorerViewer.refresh(modelElement.parent).done(function () {
                            // Select in Viewer if set
                            if (restoreFocus_1) {
                                _this.explorerViewer.setFocus(modelElement);
                            }
                        }, errors.onUnexpectedError);
                    });
                }
                else if (oldParentResource && newParentResource) {
                    var newParents_1 = this.model.findAll(newParentResource);
                    var modelElements = this.model.findAll(oldResource);
                    if (newParents_1.length && modelElements.length) {
                        // Move in Model
                        modelElements.forEach(function (modelElement, index) {
                            var oldParent = modelElement.parent;
                            modelElement.move(newParents_1[index], function (callback) {
                                // Update old parent
                                _this.explorerViewer.refresh(oldParent).done(callback, errors.onUnexpectedError);
                            }, function () {
                                // Update new parent
                                _this.explorerViewer.refresh(newParents_1[index], true).done(function () { return _this.explorerViewer.expand(newParents_1[index]); }, errors.onUnexpectedError);
                            });
                        });
                    }
                }
            }
            else if (e.operation === files_2.FileOperation.DELETE) {
                var modelElements = this.model.findAll(e.resource);
                modelElements.forEach(function (element) {
                    if (element.parent) {
                        var parent_1 = element.parent;
                        // Remove Element from Parent (Model)
                        parent_1.removeChild(element);
                        // Refresh Parent (View)
                        var restoreFocus_2 = _this.explorerViewer.isDOMFocused();
                        _this.explorerViewer.refresh(parent_1).done(function () {
                            // Ensure viewer has keyboard focus if event originates from viewer
                            if (restoreFocus_2) {
                                _this.explorerViewer.DOMFocus();
                            }
                        }, errors.onUnexpectedError);
                    }
                });
            }
        };
        ExplorerView.prototype.onFileChanges = function (e) {
            var _this = this;
            // Ensure memento state does not capture a deleted file (we run this from a timeout because
            // delete events can result in UI activity that will fill the memento again when multiple
            // editors are closing)
            setTimeout(function () {
                var lastActiveResource = _this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE];
                if (lastActiveResource && e.contains(uri_1.default.parse(lastActiveResource), files_2.FileChangeType.DELETED)) {
                    _this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE] = null;
                }
            });
            // Check if an explorer refresh is necessary (delayed to give internal events a chance to react first)
            // Note: there is no guarantee when the internal events are fired vs real ones. Code has to deal with the fact that one might
            // be fired first over the other or not at all.
            setTimeout(function () {
                if (!_this.shouldRefresh && _this.shouldRefreshFromEvent(e)) {
                    _this.refreshFromEvent();
                }
            }, ExplorerView.EXPLORER_FILE_CHANGES_REACT_DELAY);
        };
        ExplorerView.prototype.shouldRefreshFromEvent = function (e) {
            // Filter to the ones we care
            e = this.filterFileEvents(e);
            if (!this.isCreated) {
                return false;
            }
            if (e.gotAdded()) {
                var added = e.getAdded();
                // Check added: Refresh if added file/folder is not part of resolved root and parent is part of it
                var ignoredPaths = {};
                for (var i = 0; i < added.length; i++) {
                    var change = added[i];
                    if (!this.contextService.isInsideWorkspace(change.resource)) {
                        continue; // out of workspace file
                    }
                    // Find parent
                    var parent_2 = paths.dirname(change.resource.fsPath);
                    // Continue if parent was already determined as to be ignored
                    if (ignoredPaths[parent_2]) {
                        continue;
                    }
                    // Compute if parent is visible and added file not yet part of it
                    var parentStat = this.model.findClosest(uri_1.default.file(parent_2));
                    if (parentStat && parentStat.isDirectoryResolved && !this.model.findClosest(change.resource)) {
                        return true;
                    }
                    // Keep track of path that can be ignored for faster lookup
                    if (!parentStat || !parentStat.isDirectoryResolved) {
                        ignoredPaths[parent_2] = true;
                    }
                }
            }
            if (e.gotDeleted()) {
                var deleted = e.getDeleted();
                // Check deleted: Refresh if deleted file/folder part of resolved root
                for (var j = 0; j < deleted.length; j++) {
                    var del = deleted[j];
                    if (!this.contextService.isInsideWorkspace(del.resource)) {
                        continue; // out of workspace file
                    }
                    if (this.model.findClosest(del.resource)) {
                        return true;
                    }
                }
            }
            if (this.sortOrder === files_1.SortOrderConfiguration.MODIFIED && e.gotUpdated()) {
                var updated = e.getUpdated();
                // Check updated: Refresh if updated file/folder part of resolved root
                for (var j = 0; j < updated.length; j++) {
                    var upd = updated[j];
                    if (!this.contextService.isInsideWorkspace(upd.resource)) {
                        continue; // out of workspace file
                    }
                    if (this.model.findClosest(upd.resource)) {
                        return true;
                    }
                }
            }
            return false;
        };
        ExplorerView.prototype.filterFileEvents = function (e) {
            var _this = this;
            return new files_2.FileChangesEvent(e.changes.filter(function (change) {
                if (!_this.contextService.isInsideWorkspace(change.resource)) {
                    return false; // exclude changes for resources outside of workspace
                }
                if (_this.fileEventsFilter.matches(change.resource)) {
                    return false; // excluded via files.exclude setting
                }
                return true;
            }));
        };
        ExplorerView.prototype.refreshFromEvent = function () {
            var _this = this;
            if (this.isVisible()) {
                this.explorerRefreshDelayer.trigger(function () {
                    if (!_this.explorerViewer.getHighlight()) {
                        return _this.doRefresh();
                    }
                    return winjs_base_1.TPromise.as(null);
                }).done(null, errors.onUnexpectedError);
            }
            else {
                this.shouldRefresh = true;
            }
        };
        /**
         * Refresh the contents of the explorer to get up to date data from the disk about the file structure.
         */
        ExplorerView.prototype.refresh = function () {
            var _this = this;
            if (!this.explorerViewer || this.explorerViewer.getHighlight()) {
                return winjs_base_1.TPromise.as(null);
            }
            // Focus
            this.explorerViewer.DOMFocus();
            // Find resource to focus from active editor input if set
            var resourceToFocus;
            if (this.autoReveal) {
                resourceToFocus = this.getActiveFile();
                if (!resourceToFocus) {
                    var selection = this.explorerViewer.getSelection();
                    if (selection && selection.length === 1) {
                        resourceToFocus = selection[0].resource;
                    }
                }
            }
            return this.doRefresh().then(function () {
                if (resourceToFocus) {
                    return _this.select(resourceToFocus, true);
                }
                return winjs_base_1.TPromise.as(null);
            });
        };
        ExplorerView.prototype.doRefresh = function () {
            var _this = this;
            var targetsToResolve = [];
            this.model.roots.forEach(function (root) {
                var rootAndTargets = { root: root, resource: root.resource, options: { resolveTo: [] } };
                targetsToResolve.push(rootAndTargets);
            });
            var targetsToExpand = [];
            if (this.settings[ExplorerView.MEMENTO_EXPANDED_FOLDER_RESOURCES]) {
                targetsToExpand = this.settings[ExplorerView.MEMENTO_EXPANDED_FOLDER_RESOURCES].map(function (e) { return uri_1.default.parse(e); });
            }
            else if (this.contextService.hasFolderWorkspace() || (this.contextService.hasMultiFolderWorkspace() && this.model.roots.length === 1)) {
                targetsToExpand = this.model.roots.map(function (root) { return root.resource; }); // always expand single folder workspace and multi folder workspace with only 1 root
            }
            // First time refresh: Receive target through active editor input or selection and also include settings from previous session
            if (!this.isCreated) {
                var activeFile = this.getActiveFile();
                if (activeFile) {
                    var root_1 = this.contextService.getRoot(activeFile);
                    if (root_1) {
                        var found = targetsToResolve.filter(function (t) { return t.root.resource.toString() === root_1.toString(); }).pop();
                        found.options.resolveTo.push(activeFile);
                    }
                }
                targetsToExpand.forEach(function (toExpand) {
                    var root = _this.contextService.getRoot(toExpand);
                    if (root) {
                        var found = targetsToResolve.filter(function (ttr) { return ttr.resource.toString() === root.toString(); }).pop();
                        found.options.resolveTo.push(toExpand);
                    }
                });
            }
            else {
                targetsToResolve.forEach(function (t) {
                    _this.getResolvedDirectories(t.root, t.options.resolveTo);
                });
            }
            // Load Root Stat with given target path configured
            var promise = this.fileService.resolveFiles(targetsToResolve).then(function (results) {
                // Convert to model
                var modelStats = results.map(function (result, index) {
                    if (result.success) {
                        return explorerModel_1.FileStat.create(result.stat, targetsToResolve[index].root, targetsToResolve[index].options.resolveTo);
                    }
                    return explorerModel_1.FileStat.create({
                        resource: targetsToResolve[index].resource,
                        name: paths.basename(targetsToResolve[index].resource.fsPath),
                        mtime: 0,
                        etag: undefined,
                        isDirectory: true,
                        hasChildren: false
                    }, targetsToResolve[index].root);
                });
                // Subsequent refresh: Merge stat into our local model and refresh tree
                modelStats.forEach(function (modelStat, index) { return explorerModel_1.FileStat.mergeLocalWithDisk(modelStat, _this.model.roots[index]); });
                var input = _this.contextService.hasFolderWorkspace() ? _this.model.roots[0] : _this.model;
                if (input === _this.explorerViewer.getInput()) {
                    return _this.explorerViewer.refresh();
                }
                // Preserve expanded elements if tree input changed.
                // If it is a brand new tree just expand elements from memento
                var expanded = _this.explorerViewer.getExpandedElements();
                var statsToExpand = expanded.length ? [_this.model.roots[0]].concat(expanded) :
                    targetsToExpand.map(function (expand) { return _this.model.findClosest(expand); });
                // Display roots only when multi folder workspace
                // Make sure to expand all folders that where expanded in the previous session
                return _this.explorerViewer.setInput(input).then(function () { return _this.explorerViewer.expandAll(statsToExpand); });
            }, function (e) { return winjs_base_1.TPromise.wrapError(e); });
            this.progressService.showWhile(promise, this.partService.isCreated() ? 800 : 3200 /* less ugly initial startup */);
            return promise;
        };
        /**
         * Given a stat, fills an array of path that make all folders below the stat that are resolved directories.
         */
        ExplorerView.prototype.getResolvedDirectories = function (stat, resolvedDirectories) {
            if (stat.isDirectoryResolved) {
                if (!stat.isRoot) {
                    // Drop those path which are parents of the current one
                    for (var i = resolvedDirectories.length - 1; i >= 0; i--) {
                        var resource = resolvedDirectories[i];
                        if (paths.isEqualOrParent(stat.resource.fsPath, resource.fsPath, !platform_1.isLinux /* ignorecase */)) {
                            resolvedDirectories.splice(i);
                        }
                    }
                    // Add to the list of path to resolve
                    resolvedDirectories.push(stat.resource);
                }
                // Recurse into children
                for (var i = 0; i < stat.children.length; i++) {
                    var child = stat.children[i];
                    this.getResolvedDirectories(child, resolvedDirectories);
                }
            }
        };
        /**
         * Selects and reveal the file element provided by the given resource if its found in the explorer. Will try to
         * resolve the path from the disk in case the explorer is not yet expanded to the file yet.
         */
        ExplorerView.prototype.select = function (resource, reveal) {
            var _this = this;
            if (reveal === void 0) { reveal = this.autoReveal; }
            // Require valid path
            if (!resource) {
                return winjs_base_1.TPromise.as(null);
            }
            // If path already selected, just reveal and return
            var selection = this.hasSelection(resource);
            if (selection) {
                return reveal ? this.reveal(selection, 0.5) : winjs_base_1.TPromise.as(null);
            }
            // First try to get the stat object from the input to avoid a roundtrip
            if (!this.isCreated) {
                return winjs_base_1.TPromise.as(null);
            }
            var fileStat = this.model.findClosest(resource);
            if (fileStat) {
                return this.doSelect(fileStat, reveal);
            }
            // Stat needs to be resolved first and then revealed
            var options = { resolveTo: [resource] };
            var rootUri = this.contextService.getRoot(resource) || this.model.roots[0].resource;
            return this.fileService.resolveFile(rootUri, options).then(function (stat) {
                // Convert to model
                var root = _this.model.roots.filter(function (r) { return r.resource.toString() === rootUri.toString(); }).pop();
                var modelStat = explorerModel_1.FileStat.create(stat, root, options.resolveTo);
                // Update Input with disk Stat
                explorerModel_1.FileStat.mergeLocalWithDisk(modelStat, root);
                // Select and Reveal
                return _this.explorerViewer.refresh(root).then(function () { return _this.doSelect(root.find(resource), reveal); });
            }, function (e) { _this.messageService.show(message_1.Severity.Error, e); });
        };
        ExplorerView.prototype.hasSelection = function (resource) {
            var currentSelection = this.explorerViewer.getSelection();
            for (var i = 0; i < currentSelection.length; i++) {
                if (currentSelection[i].resource.toString() === resource.toString()) {
                    return currentSelection[i];
                }
            }
            return null;
        };
        ExplorerView.prototype.doSelect = function (fileStat, reveal) {
            var _this = this;
            if (!fileStat) {
                return winjs_base_1.TPromise.as(null);
            }
            // Special case: we are asked to reveal and select an element that is not visible
            // In this case we take the parent element so that we are at least close to it.
            if (!this.filter.isVisible(this.tree, fileStat)) {
                fileStat = fileStat.parent;
                if (!fileStat) {
                    return winjs_base_1.TPromise.as(null);
                }
            }
            // Reveal depending on flag
            var revealPromise;
            if (reveal) {
                revealPromise = this.reveal(fileStat, 0.5);
            }
            else {
                revealPromise = winjs_base_1.TPromise.as(null);
            }
            return revealPromise.then(function () {
                if (!fileStat.isDirectory) {
                    _this.explorerViewer.setSelection([fileStat]); // Since folders can not be opened, only select files
                }
                _this.explorerViewer.setFocus(fileStat);
            });
        };
        ExplorerView.prototype.shutdown = function () {
            // Keep list of expanded folders to restore on next load
            if (this.isCreated) {
                var expanded = this.explorerViewer.getExpandedElements()
                    .filter(function (e) { return e instanceof explorerModel_1.FileStat; })
                    .map(function (e) { return e.resource.toString(); });
                if (expanded.length) {
                    this.settings[ExplorerView.MEMENTO_EXPANDED_FOLDER_RESOURCES] = expanded;
                }
                else {
                    delete this.settings[ExplorerView.MEMENTO_EXPANDED_FOLDER_RESOURCES];
                }
            }
            // Clean up last focused if not set
            if (!this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE]) {
                delete this.settings[ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE];
            }
            _super.prototype.shutdown.call(this);
        };
        ExplorerView.prototype.dispose = function () {
            if (this.toolBar) {
                this.toolBar.dispose();
            }
            _super.prototype.dispose.call(this);
        };
        ExplorerView.ID = 'workbench.explorer.fileView';
        ExplorerView.EXPLORER_FILE_CHANGES_REACT_DELAY = 500; // delay in ms to react to file changes to give our internal events a chance to react first
        ExplorerView.EXPLORER_FILE_CHANGES_REFRESH_DELAY = 100; // delay in ms to refresh the explorer from disk file changes
        ExplorerView.EXPLORER_IMPORT_REFRESH_DELAY = 300; // delay in ms to refresh the explorer from imports
        ExplorerView.MEMENTO_LAST_ACTIVE_FILE_RESOURCE = 'explorer.memento.lastActiveFileResource';
        ExplorerView.MEMENTO_EXPANDED_FOLDER_RESOURCES = 'explorer.memento.expandedFolderResources';
        __decorate([
            decorators_1.memoize
        ], ExplorerView.prototype, "model", null);
        ExplorerView = __decorate([
            __param(2, message_1.IMessageService),
            __param(3, contextView_1.IContextMenuService),
            __param(4, instantiation_1.IInstantiationService),
            __param(5, groupService_1.IEditorGroupService),
            __param(6, workspace_1.IWorkspaceContextService),
            __param(7, progress_1.IProgressService),
            __param(8, listService_1.IListService),
            __param(9, editorService_1.IWorkbenchEditorService),
            __param(10, files_2.IFileService),
            __param(11, partService_1.IPartService),
            __param(12, keybinding_1.IKeybindingService),
            __param(13, contextkey_1.IContextKeyService),
            __param(14, configuration_1.IConfigurationService),
            __param(15, workbenchThemeService_1.IWorkbenchThemeService),
            __param(16, environment_1.IEnvironmentService)
        ], ExplorerView);
        return ExplorerView;
    }(views_1.CollapsibleView));
    exports.ExplorerView = ExplorerView;
});
//# sourceMappingURL=explorerView.js.map