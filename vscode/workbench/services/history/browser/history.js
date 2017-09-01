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
define(["require", "exports", "vs/base/common/errors", "vs/base/common/uri", "vs/workbench/common/editor", "vs/workbench/services/editor/common/editorService", "vs/platform/files/common/files", "vs/editor/common/core/selection", "vs/platform/workspace/common/workspace", "vs/base/common/lifecycle", "vs/platform/storage/common/storage", "vs/platform/lifecycle/common/lifecycle", "vs/platform/registry/common/platform", "vs/base/common/event", "vs/platform/configuration/common/configuration", "vs/workbench/services/group/common/groupService", "vs/platform/windows/common/windows", "vs/editor/common/services/codeEditorService", "vs/platform/search/common/search", "vs/base/common/glob", "vs/platform/instantiation/common/instantiation", "vs/workbench/common/resources"], function (require, exports, errors, uri_1, editor_1, editorService_1, files_1, selection_1, workspace_1, lifecycle_1, storage_1, lifecycle_2, platform_1, event_1, configuration_1, groupService_1, windows_1, codeEditorService_1, search_1, glob_1, instantiation_1, resources_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Stores the selection & view state of an editor and allows to compare it to other selection states.
     */
    var EditorState = (function () {
        function EditorState(_editorInput, _selection) {
            this._editorInput = _editorInput;
            this._selection = _selection;
        }
        Object.defineProperty(EditorState.prototype, "editorInput", {
            get: function () {
                return this._editorInput;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorState.prototype, "selection", {
            get: function () {
                return this._selection;
            },
            enumerable: true,
            configurable: true
        });
        EditorState.prototype.justifiesNewPushState = function (other, event) {
            if (!this._editorInput.matches(other._editorInput)) {
                return true; // push different editor inputs
            }
            if (!selection_1.Selection.isISelection(this._selection) || !selection_1.Selection.isISelection(other._selection)) {
                return true; // unknown selections
            }
            if (event && event.source === 'api') {
                return true; // always let API source win (e.g. "Go to definition" should add a history entry)
            }
            var myLineNumber = Math.min(this._selection.selectionStartLineNumber, this._selection.positionLineNumber);
            var otherLineNumber = Math.min(other._selection.selectionStartLineNumber, other._selection.positionLineNumber);
            if (Math.abs(myLineNumber - otherLineNumber) < EditorState.EDITOR_SELECTION_THRESHOLD) {
                return false; // ignore selection changes in the range of EditorState.EDITOR_SELECTION_THRESHOLD lines
            }
            return true;
        };
        EditorState.EDITOR_SELECTION_THRESHOLD = 5; // number of lines to move in editor to justify for new state
        return EditorState;
    }());
    exports.EditorState = EditorState;
    var BaseHistoryService = (function () {
        function BaseHistoryService(editorGroupService, editorService) {
            var _this = this;
            this.editorGroupService = editorGroupService;
            this.editorService = editorService;
            this.toUnbind = [];
            this.activeEditorListeners = [];
            // Listeners
            this.toUnbind.push(this.editorGroupService.onEditorsChanged(function () { return _this.onEditorsChanged(); }));
        }
        BaseHistoryService.prototype.onEditorsChanged = function () {
            var _this = this;
            // Dispose old listeners
            lifecycle_1.dispose(this.activeEditorListeners);
            this.activeEditorListeners = [];
            var activeEditor = this.editorService.getActiveEditor();
            // Propagate to history
            this.handleActiveEditorChange(activeEditor);
            // Apply listener for selection changes if this is a text editor
            var control = codeEditorService_1.getCodeEditor(activeEditor);
            if (control) {
                this.activeEditorListeners.push(control.onDidChangeCursorPosition(function (event) {
                    _this.handleEditorSelectionChangeEvent(activeEditor, event);
                }));
            }
        };
        BaseHistoryService.prototype.dispose = function () {
            this.toUnbind = lifecycle_1.dispose(this.toUnbind);
        };
        return BaseHistoryService;
    }());
    exports.BaseHistoryService = BaseHistoryService;
    var HistoryService = (function (_super) {
        __extends(HistoryService, _super);
        function HistoryService(editorService, editorGroupService, contextService, storageService, configurationService, lifecycleService, fileService, windowService, instantiationService) {
            var _this = _super.call(this, editorGroupService, editorService) || this;
            _this.contextService = contextService;
            _this.storageService = storageService;
            _this.configurationService = configurationService;
            _this.lifecycleService = lifecycleService;
            _this.fileService = fileService;
            _this.windowService = windowService;
            _this.instantiationService = instantiationService;
            _this.index = -1;
            _this.stack = [];
            _this.recentlyClosedFiles = [];
            _this.loaded = false;
            _this.registry = platform_1.Registry.as(editor_1.Extensions.Editors);
            _this.resourceFilter = instantiationService.createInstance(resources_1.ResourceGlobMatcher, function (root) { return _this.getExcludes(root); }, function (expression) { return glob_1.parse(expression); });
            _this.registerListeners();
            return _this;
        }
        HistoryService.prototype.getExcludes = function (root) {
            var scope = root ? { resource: root } : void 0;
            return search_1.getExcludes(this.configurationService.getConfiguration(void 0, scope));
        };
        HistoryService.prototype.registerListeners = function () {
            var _this = this;
            this.toUnbind.push(this.lifecycleService.onShutdown(function (reason) { return _this.save(); }));
            this.toUnbind.push(this.editorGroupService.onEditorOpenFail(function (editor) { return _this.remove(editor); }));
            this.toUnbind.push(this.editorGroupService.getStacksModel().onEditorClosed(function (event) { return _this.onEditorClosed(event); }));
            this.toUnbind.push(this.fileService.onFileChanges(function (e) { return _this.onFileChanges(e); }));
            this.toUnbind.push(this.resourceFilter.onExpressionChange(function () { return _this.handleExcludesChange(); }));
        };
        HistoryService.prototype.onFileChanges = function (e) {
            if (e.gotDeleted()) {
                this.remove(e); // remove from history files that got deleted or moved
            }
        };
        HistoryService.prototype.onEditorClosed = function (event) {
            // Track closing of pinned editor to support to reopen closed editors
            if (event.pinned) {
                var file = editor_1.toResource(event.editor, { filter: 'file' }); // we only support files to reopen
                if (file) {
                    // Remove all inputs matching and add as last recently closed
                    this.removeFromRecentlyClosedFiles(event.editor);
                    this.recentlyClosedFiles.push({ resource: file, index: event.index });
                    // Bounding
                    if (this.recentlyClosedFiles.length > HistoryService.MAX_RECENTLY_CLOSED_EDITORS) {
                        this.recentlyClosedFiles.shift();
                    }
                }
            }
        };
        HistoryService.prototype.reopenLastClosedEditor = function () {
            this.ensureHistoryLoaded();
            var stacks = this.editorGroupService.getStacksModel();
            var lastClosedFile = this.recentlyClosedFiles.pop();
            while (lastClosedFile && this.isFileOpened(lastClosedFile.resource, stacks.activeGroup)) {
                lastClosedFile = this.recentlyClosedFiles.pop(); // pop until we find a file that is not opened
            }
            if (lastClosedFile) {
                this.editorService.openEditor({ resource: lastClosedFile.resource, options: { pinned: true, index: lastClosedFile.index } });
            }
        };
        HistoryService.prototype.forward = function (acrossEditors) {
            if (this.stack.length > this.index + 1) {
                if (acrossEditors) {
                    this.doForwardAcrossEditors();
                }
                else {
                    this.doForwardInEditors();
                }
            }
        };
        HistoryService.prototype.doForwardInEditors = function () {
            this.index++;
            this.navigate();
        };
        HistoryService.prototype.doForwardAcrossEditors = function () {
            var currentIndex = this.index;
            var currentEntry = this.stack[this.index];
            // Find the next entry that does not match our current entry
            while (this.stack.length > currentIndex + 1) {
                currentIndex++;
                var previousEntry = this.stack[currentIndex];
                if (!this.matches(currentEntry.input, previousEntry.input)) {
                    this.index = currentIndex;
                    this.navigate(true /* across editors */);
                    break;
                }
            }
        };
        HistoryService.prototype.back = function (acrossEditors) {
            if (this.index > 0) {
                if (acrossEditors) {
                    this.doBackAcrossEditors();
                }
                else {
                    this.doBackInEditors();
                }
            }
        };
        HistoryService.prototype.doBackInEditors = function () {
            this.index--;
            this.navigate();
        };
        HistoryService.prototype.doBackAcrossEditors = function () {
            var currentIndex = this.index;
            var currentEntry = this.stack[this.index];
            // Find the next previous entry that does not match our current entry
            while (currentIndex > 0) {
                currentIndex--;
                var previousEntry = this.stack[currentIndex];
                if (!this.matches(currentEntry.input, previousEntry.input)) {
                    this.index = currentIndex;
                    this.navigate(true /* across editors */);
                    break;
                }
            }
        };
        HistoryService.prototype.clear = function () {
            this.ensureHistoryLoaded();
            this.index = -1;
            this.stack.splice(0);
            this.history = [];
            this.recentlyClosedFiles = [];
        };
        HistoryService.prototype.navigate = function (acrossEditors) {
            var _this = this;
            var entry = this.stack[this.index];
            var options = entry.options;
            if (options && !acrossEditors /* ignore line/col options when going across editors */) {
                options.revealIfOpened = true;
            }
            else {
                options = { revealIfOpened: true };
            }
            this.navigatingInStack = true;
            var openEditorPromise;
            if (entry.input instanceof editor_1.EditorInput) {
                openEditorPromise = this.editorService.openEditor(entry.input, options);
            }
            else {
                openEditorPromise = this.editorService.openEditor({ resource: entry.input.resource, options: options });
            }
            openEditorPromise.done(function () {
                _this.navigatingInStack = false;
            }, function (error) {
                _this.navigatingInStack = false;
                errors.onUnexpectedError(error);
            });
        };
        HistoryService.prototype.handleEditorSelectionChangeEvent = function (editor, event) {
            this.handleEditorEventInStack(editor, event);
        };
        HistoryService.prototype.handleActiveEditorChange = function (editor) {
            this.handleEditorEventInHistory(editor);
            this.handleEditorEventInStack(editor);
        };
        HistoryService.prototype.handleEditorEventInHistory = function (editor) {
            var _this = this;
            var input = editor ? editor.input : void 0;
            // Ensure we have at least a name to show and not configured to exclude input
            if (!input || !input.getName() || !this.include(input)) {
                return;
            }
            this.ensureHistoryLoaded();
            var historyInput = this.preferResourceInput(input);
            // Remove any existing entry and add to the beginning
            this.removeFromHistory(input);
            this.history.unshift(historyInput);
            // Respect max entries setting
            if (this.history.length > HistoryService.MAX_HISTORY_ITEMS) {
                this.history.pop();
            }
            // Remove this from the history unless the history input is a resource
            // that can easily be restored even when the input gets disposed
            if (historyInput instanceof editor_1.EditorInput) {
                var onceDispose = event_1.once(historyInput.onDispose);
                onceDispose(function () {
                    _this.removeFromHistory(input);
                });
            }
        };
        HistoryService.prototype.include = function (input) {
            if (input instanceof editor_1.EditorInput) {
                return true; // include any non files
            }
            var resourceInput = input;
            return !this.resourceFilter.matches(resourceInput.resource);
        };
        HistoryService.prototype.handleExcludesChange = function () {
            this.removeExcludedFromHistory();
        };
        HistoryService.prototype.remove = function (arg1) {
            this.removeFromHistory(arg1);
            this.removeFromStack(arg1);
            this.removeFromRecentlyClosedFiles(arg1);
            this.removeFromRecentlyOpened(arg1);
        };
        HistoryService.prototype.removeExcludedFromHistory = function () {
            var _this = this;
            this.ensureHistoryLoaded();
            this.history = this.history.filter(function (e) { return _this.include(e); });
        };
        HistoryService.prototype.removeFromHistory = function (arg1) {
            var _this = this;
            this.ensureHistoryLoaded();
            this.history = this.history.filter(function (e) { return !_this.matches(arg1, e); });
        };
        HistoryService.prototype.handleEditorEventInStack = function (editor, event) {
            var control = codeEditorService_1.getCodeEditor(editor);
            // treat editor changes that happen as part of stack navigation specially
            // we do not want to add a new stack entry as a matter of navigating the
            // stack but we need to keep our currentFileEditorState up to date with
            // the navigtion that occurs.
            if (this.navigatingInStack) {
                if (control && editor.input) {
                    this.currentFileEditorState = new EditorState(editor.input, control.getSelection());
                }
                else {
                    this.currentFileEditorState = null; // we navigated to a non file editor
                }
                return;
            }
            if (control && editor.input) {
                this.handleTextEditorEvent(editor, control, event);
                return;
            }
            this.currentFileEditorState = null; // at this time we have no active file editor view state
            if (editor && editor.input) {
                this.handleNonTextEditorEvent(editor);
            }
        };
        HistoryService.prototype.handleTextEditorEvent = function (editor, editorControl, event) {
            var stateCandidate = new EditorState(editor.input, editorControl.getSelection());
            if (!this.currentFileEditorState || this.currentFileEditorState.justifiesNewPushState(stateCandidate, event)) {
                this.currentFileEditorState = stateCandidate;
                var options = void 0;
                var selection = editorControl.getSelection();
                if (selection) {
                    options = {
                        selection: { startLineNumber: selection.startLineNumber, startColumn: selection.startColumn }
                    };
                }
                this.add(editor.input, options, true /* from event */);
            }
        };
        HistoryService.prototype.handleNonTextEditorEvent = function (editor) {
            var currentStack = this.stack[this.index];
            if (currentStack && this.matches(editor.input, currentStack.input)) {
                return; // do not push same editor input again
            }
            this.add(editor.input, void 0, true /* from event */);
        };
        HistoryService.prototype.add = function (input, options, fromEvent) {
            if (!this.navigatingInStack) {
                this.addToStack(input, options, fromEvent);
            }
        };
        HistoryService.prototype.addToStack = function (input, options, fromEvent) {
            var _this = this;
            // Overwrite an entry in the stack if we have a matching input that comes
            // with editor options to indicate that this entry is more specific. Also
            // prevent entries that have the exact same options. Finally, Overwrite
            // entries if it came from an event and we detect that the change came in
            // very fast which indicates that it was not coming in from a user change
            // but rather rapid programmatic changes. We just take the last of the changes
            // to not cause too many entries on the stack.
            var replace = false;
            if (this.stack[this.index]) {
                var currentEntry = this.stack[this.index];
                if (this.matches(input, currentEntry.input) && (this.sameOptions(currentEntry.options, options) || (fromEvent && Date.now() - currentEntry.timestamp < HistoryService.MERGE_EVENT_CHANGES_THRESHOLD))) {
                    replace = true;
                }
            }
            var stackInput = this.preferResourceInput(input);
            var entry = { input: stackInput, options: options, timestamp: fromEvent ? Date.now() : void 0 };
            // If we are not at the end of history, we remove anything after
            if (this.stack.length > this.index + 1) {
                this.stack = this.stack.slice(0, this.index + 1);
            }
            // Replace at current position
            if (replace) {
                this.stack[this.index] = entry;
            }
            else {
                this.index++;
                this.stack.splice(this.index, 0, entry);
                // Check for limit
                if (this.stack.length > HistoryService.MAX_STACK_ITEMS) {
                    this.stack.shift(); // remove first and dispose
                    if (this.index > 0) {
                        this.index--;
                    }
                }
            }
            // Remove this from the stack unless the stack input is a resource
            // that can easily be restored even when the input gets disposed
            if (stackInput instanceof editor_1.EditorInput) {
                var onceDispose = event_1.once(stackInput.onDispose);
                onceDispose(function () {
                    _this.removeFromStack(input);
                });
            }
        };
        HistoryService.prototype.preferResourceInput = function (input) {
            var file = editor_1.toResource(input, { filter: 'file' });
            if (file) {
                return { resource: file };
            }
            return input;
        };
        HistoryService.prototype.sameOptions = function (optionsA, optionsB) {
            if (!optionsA && !optionsB) {
                return true;
            }
            if ((!optionsA && optionsB) || (optionsA && !optionsB)) {
                return false;
            }
            var s1 = optionsA.selection;
            var s2 = optionsB.selection;
            if (!s1 && !s2) {
                return true;
            }
            if ((!s1 && s2) || (s1 && !s2)) {
                return false;
            }
            return s1.startLineNumber === s2.startLineNumber; // we consider the history entry same if we are on the same line
        };
        HistoryService.prototype.removeFromStack = function (arg1) {
            var _this = this;
            this.stack = this.stack.filter(function (e) { return !_this.matches(arg1, e.input); });
            this.index = this.stack.length - 1; // reset index
        };
        HistoryService.prototype.removeFromRecentlyClosedFiles = function (arg1) {
            var _this = this;
            this.recentlyClosedFiles = this.recentlyClosedFiles.filter(function (e) { return !_this.matchesFile(e.resource, arg1); });
        };
        HistoryService.prototype.removeFromRecentlyOpened = function (arg1) {
            if (arg1 instanceof editor_1.EditorInput || arg1 instanceof files_1.FileChangesEvent) {
                return; // for now do not delete from file events since recently open are likely out of workspace files for which there are no delete events
            }
            var input = arg1;
            this.windowService.removeFromRecentlyOpened([input.resource.fsPath]);
        };
        HistoryService.prototype.isFileOpened = function (resource, group) {
            var _this = this;
            if (!group) {
                return false;
            }
            if (!group.contains(resource)) {
                return false; // fast check
            }
            return group.getEditors().some(function (e) { return _this.matchesFile(resource, e); });
        };
        HistoryService.prototype.matches = function (arg1, inputB) {
            if (arg1 instanceof files_1.FileChangesEvent) {
                if (inputB instanceof editor_1.EditorInput) {
                    return false; // we only support this for IResourceInput
                }
                var resourceInputB_1 = inputB;
                return arg1.contains(resourceInputB_1.resource, files_1.FileChangeType.DELETED);
            }
            if (arg1 instanceof editor_1.EditorInput && inputB instanceof editor_1.EditorInput) {
                return arg1.matches(inputB);
            }
            if (arg1 instanceof editor_1.EditorInput) {
                return this.matchesFile(inputB.resource, arg1);
            }
            if (inputB instanceof editor_1.EditorInput) {
                return this.matchesFile(arg1.resource, inputB);
            }
            var resourceInputA = arg1;
            var resourceInputB = inputB;
            return resourceInputA && resourceInputB && resourceInputA.resource.toString() === resourceInputB.resource.toString();
        };
        HistoryService.prototype.matchesFile = function (resource, arg2) {
            if (arg2 instanceof files_1.FileChangesEvent) {
                return arg2.contains(resource, files_1.FileChangeType.DELETED);
            }
            if (arg2 instanceof editor_1.EditorInput) {
                var file = editor_1.toResource(arg2, { filter: 'file' });
                return file && file.toString() === resource.toString();
            }
            var resourceInput = arg2;
            return resourceInput && resourceInput.resource.toString() === resource.toString();
        };
        HistoryService.prototype.getHistory = function () {
            this.ensureHistoryLoaded();
            return this.history.slice(0);
        };
        HistoryService.prototype.ensureHistoryLoaded = function () {
            if (!this.loaded) {
                this.loadHistory();
            }
            this.loaded = true;
        };
        HistoryService.prototype.save = function () {
            if (!this.history) {
                return; // nothing to save because history was not used
            }
            var entries = this.history.map(function (input) {
                if (input instanceof editor_1.EditorInput) {
                    return void 0; // only file resource inputs are serializable currently
                }
                return { resourceJSON: input.resource.toJSON() };
            }).filter(function (serialized) { return !!serialized; });
            this.storageService.store(HistoryService.STORAGE_KEY, JSON.stringify(entries), storage_1.StorageScope.WORKSPACE);
        };
        HistoryService.prototype.loadHistory = function () {
            var entries = [];
            var entriesRaw = this.storageService.get(HistoryService.STORAGE_KEY, storage_1.StorageScope.WORKSPACE);
            if (entriesRaw) {
                entries = JSON.parse(entriesRaw);
            }
            this.history = entries.map(function (entry) {
                var serializedFileInput = entry;
                if (serializedFileInput.resource || serializedFileInput.resourceJSON) {
                    return { resource: !!serializedFileInput.resourceJSON ? uri_1.default.revive(serializedFileInput.resourceJSON) : uri_1.default.parse(serializedFileInput.resource) };
                }
                return void 0;
            }).filter(function (input) { return !!input; });
        };
        HistoryService.prototype.getLastActiveWorkspaceRoot = function () {
            if (!this.contextService.hasWorkspace()) {
                return void 0;
            }
            var history = this.getHistory();
            for (var i = 0; i < history.length; i++) {
                var input = history[i];
                if (input instanceof editor_1.EditorInput) {
                    continue;
                }
                var resourceInput = input;
                var resourceWorkspace = this.contextService.getRoot(resourceInput.resource);
                if (resourceWorkspace) {
                    return resourceWorkspace;
                }
            }
            // fallback to first workspace
            return this.contextService.getWorkspace().roots[0];
        };
        HistoryService.STORAGE_KEY = 'history.entries';
        HistoryService.MAX_HISTORY_ITEMS = 200;
        HistoryService.MAX_STACK_ITEMS = 20;
        HistoryService.MAX_RECENTLY_CLOSED_EDITORS = 20;
        HistoryService.MERGE_EVENT_CHANGES_THRESHOLD = 100;
        HistoryService = __decorate([
            __param(0, editorService_1.IWorkbenchEditorService),
            __param(1, groupService_1.IEditorGroupService),
            __param(2, workspace_1.IWorkspaceContextService),
            __param(3, storage_1.IStorageService),
            __param(4, configuration_1.IConfigurationService),
            __param(5, lifecycle_2.ILifecycleService),
            __param(6, files_1.IFileService),
            __param(7, windows_1.IWindowsService),
            __param(8, instantiation_1.IInstantiationService)
        ], HistoryService);
        return HistoryService;
    }(BaseHistoryService));
    exports.HistoryService = HistoryService;
});
//# sourceMappingURL=history.js.map