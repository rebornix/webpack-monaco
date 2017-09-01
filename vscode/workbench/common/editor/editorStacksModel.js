/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/event", "vs/workbench/common/editor", "vs/platform/storage/common/storage", "vs/platform/instantiation/common/instantiation", "vs/platform/configuration/common/configuration", "vs/platform/lifecycle/common/lifecycle", "vs/base/common/lifecycle", "vs/platform/registry/common/platform", "vs/platform/editor/common/editor", "vs/base/common/map"], function (require, exports, event_1, editor_1, storage_1, instantiation_1, configuration_1, lifecycle_1, lifecycle_2, platform_1, editor_2, map_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var EditorGroup = (function () {
        function EditorGroup(arg1, instantiationService, configurationService) {
            this.instantiationService = instantiationService;
            this.configurationService = configurationService;
            this._id = EditorGroup.IDS++;
            this.editors = [];
            this.mru = [];
            this.toDispose = [];
            this.mapResourceToEditorCount = new map_1.ResourceMap();
            this.onConfigurationUpdated(configurationService.getConfiguration());
            this._onEditorActivated = new event_1.Emitter();
            this._onEditorOpened = new event_1.Emitter();
            this._onEditorClosed = new event_1.Emitter();
            this._onEditorDisposed = new event_1.Emitter();
            this._onEditorDirty = new event_1.Emitter();
            this._onEditorLabelChange = new event_1.Emitter();
            this._onEditorMoved = new event_1.Emitter();
            this._onEditorPinned = new event_1.Emitter();
            this._onEditorUnpinned = new event_1.Emitter();
            this._onEditorStateChanged = new event_1.Emitter();
            this._onEditorsStructureChanged = new event_1.Emitter();
            this.toDispose.push(this._onEditorActivated, this._onEditorOpened, this._onEditorClosed, this._onEditorDisposed, this._onEditorDirty, this._onEditorLabelChange, this._onEditorMoved, this._onEditorPinned, this._onEditorUnpinned, this._onEditorStateChanged, this._onEditorsStructureChanged);
            if (typeof arg1 === 'object') {
                this.deserialize(arg1);
            }
            else {
                this._label = arg1;
            }
            this.registerListeners();
        }
        EditorGroup.prototype.registerListeners = function () {
            var _this = this;
            this.toDispose.push(this.configurationService.onDidUpdateConfiguration(function (e) { return _this.onConfigurationUpdated(_this.configurationService.getConfiguration()); }));
        };
        EditorGroup.prototype.onConfigurationUpdated = function (config) {
            if (config && config.workbench && config.workbench.editor) {
                this.editorOpenPositioning = config.workbench.editor.openPositioning;
            }
        };
        Object.defineProperty(EditorGroup.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorGroup.prototype, "label", {
            get: function () {
                return this._label;
            },
            set: function (label) {
                this._label = label;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorGroup.prototype, "count", {
            get: function () {
                return this.editors.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorGroup.prototype, "onEditorActivated", {
            get: function () {
                return this._onEditorActivated.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorGroup.prototype, "onEditorOpened", {
            get: function () {
                return this._onEditorOpened.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorGroup.prototype, "onEditorClosed", {
            get: function () {
                return this._onEditorClosed.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorGroup.prototype, "onEditorDisposed", {
            get: function () {
                return this._onEditorDisposed.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorGroup.prototype, "onEditorDirty", {
            get: function () {
                return this._onEditorDirty.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorGroup.prototype, "onEditorLabelChange", {
            get: function () {
                return this._onEditorLabelChange.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorGroup.prototype, "onEditorMoved", {
            get: function () {
                return this._onEditorMoved.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorGroup.prototype, "onEditorPinned", {
            get: function () {
                return this._onEditorPinned.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorGroup.prototype, "onEditorUnpinned", {
            get: function () {
                return this._onEditorUnpinned.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorGroup.prototype, "onEditorStateChanged", {
            get: function () {
                return this._onEditorStateChanged.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorGroup.prototype, "onEditorsStructureChanged", {
            get: function () {
                return this._onEditorsStructureChanged.event;
            },
            enumerable: true,
            configurable: true
        });
        EditorGroup.prototype.getEditors = function (mru) {
            return mru ? this.mru.slice(0) : this.editors.slice(0);
        };
        EditorGroup.prototype.getEditor = function (arg1) {
            if (typeof arg1 === 'number') {
                return this.editors[arg1];
            }
            var resource = arg1;
            if (!this.contains(resource)) {
                return null; // fast check for resource opened or not
            }
            for (var i = 0; i < this.editors.length; i++) {
                var editor = this.editors[i];
                var editorResource = editor_1.toResource(editor, { supportSideBySide: true });
                if (editorResource && editorResource.toString() === resource.toString()) {
                    return editor;
                }
            }
            return null;
        };
        Object.defineProperty(EditorGroup.prototype, "activeEditor", {
            get: function () {
                return this.active;
            },
            enumerable: true,
            configurable: true
        });
        EditorGroup.prototype.isActive = function (editor) {
            return this.matches(this.active, editor);
        };
        Object.defineProperty(EditorGroup.prototype, "previewEditor", {
            get: function () {
                return this.preview;
            },
            enumerable: true,
            configurable: true
        });
        EditorGroup.prototype.isPreview = function (editor) {
            return this.matches(this.preview, editor);
        };
        EditorGroup.prototype.openEditor = function (editor, options) {
            var index = this.indexOf(editor);
            var makePinned = options && options.pinned;
            var makeActive = (options && options.active) || !this.activeEditor || (!makePinned && this.matches(this.preview, this.activeEditor));
            // New editor
            if (index === -1) {
                var targetIndex = void 0;
                var indexOfActive = this.indexOf(this.active);
                // Insert into specific position
                if (options && typeof options.index === 'number') {
                    targetIndex = options.index;
                }
                else if (this.editorOpenPositioning === editor_1.EditorOpenPositioning.FIRST) {
                    targetIndex = 0;
                }
                else if (this.editorOpenPositioning === editor_1.EditorOpenPositioning.LAST) {
                    targetIndex = this.editors.length;
                }
                else if (this.editorOpenPositioning === editor_1.EditorOpenPositioning.LEFT) {
                    if (indexOfActive === 0 || !this.editors.length) {
                        targetIndex = 0; // to the left becoming first editor in list
                    }
                    else {
                        targetIndex = indexOfActive; // to the left of active editor
                    }
                }
                else {
                    targetIndex = indexOfActive + 1;
                }
                // Insert into our list of editors if pinned or we have no preview editor
                if (makePinned || !this.preview) {
                    this.splice(targetIndex, false, editor);
                }
                // Handle preview
                if (!makePinned) {
                    // Replace existing preview with this editor if we have a preview
                    if (this.preview) {
                        var indexOfPreview = this.indexOf(this.preview);
                        if (targetIndex > indexOfPreview) {
                            targetIndex--; // accomodate for the fact that the preview editor closes
                        }
                        this.replaceEditor(this.preview, editor, targetIndex, !makeActive);
                    }
                    this.preview = editor;
                }
                // Listeners
                this.hookEditorListeners(editor);
                // Event
                this.fireEvent(this._onEditorOpened, editor, true);
                // Handle active
                if (makeActive) {
                    this.setActive(editor);
                }
            }
            else {
                // Pin it
                if (makePinned) {
                    this.pin(editor);
                }
                // Activate it
                if (makeActive) {
                    this.setActive(editor);
                }
                // Respect index
                if (options && typeof options.index === 'number') {
                    this.moveEditor(editor, options.index);
                }
            }
        };
        EditorGroup.prototype.hookEditorListeners = function (editor) {
            var _this = this;
            var unbind = [];
            // Re-emit disposal of editor input as our own event
            var onceDispose = event_1.once(editor.onDispose);
            unbind.push(onceDispose(function () {
                if (_this.indexOf(editor) >= 0) {
                    _this._onEditorDisposed.fire(editor);
                }
            }));
            // Re-Emit dirty state changes
            unbind.push(editor.onDidChangeDirty(function () {
                _this.fireEvent(_this._onEditorDirty, editor, false);
            }));
            // Re-Emit label changes
            unbind.push(editor.onDidChangeLabel(function () {
                _this.fireEvent(_this._onEditorLabelChange, editor, false);
            }));
            // Clean up dispose listeners once the editor gets closed
            unbind.push(this.onEditorClosed(function (event) {
                if (event.editor.matches(editor)) {
                    lifecycle_2.dispose(unbind);
                }
            }));
        };
        EditorGroup.prototype.replaceEditor = function (toReplace, replaceWidth, replaceIndex, openNext) {
            if (openNext === void 0) { openNext = true; }
            var event = this.doCloseEditor(toReplace, openNext); // optimization to prevent multiple setActive() in one call
            // We want to first add the new editor into our model before emitting the close event because
            // firing the close event can trigger a dispose on the same editor that is now being added.
            // This can lead into opening a disposed editor which is not what we want.
            this.splice(replaceIndex, false, replaceWidth);
            if (event) {
                this.fireEvent(this._onEditorClosed, event, true);
            }
        };
        EditorGroup.prototype.closeEditor = function (editor, openNext) {
            if (openNext === void 0) { openNext = true; }
            var event = this.doCloseEditor(editor, openNext);
            if (event) {
                this.fireEvent(this._onEditorClosed, event, true);
            }
        };
        EditorGroup.prototype.doCloseEditor = function (editor, openNext) {
            if (openNext === void 0) { openNext = true; }
            var index = this.indexOf(editor);
            if (index === -1) {
                return null; // not found
            }
            // Active Editor closed
            if (openNext && this.matches(this.active, editor)) {
                // More than one editor
                if (this.mru.length > 1) {
                    this.setActive(this.mru[1]); // active editor is always first in MRU, so pick second editor after as new active
                }
                else {
                    this.active = null;
                }
            }
            // Preview Editor closed
            var pinned = true;
            if (this.matches(this.preview, editor)) {
                this.preview = null;
                pinned = false;
            }
            // Remove from arrays
            this.splice(index, true);
            // Event
            return { editor: editor, pinned: pinned, index: index, group: this };
        };
        EditorGroup.prototype.closeEditors = function (except, direction) {
            var _this = this;
            var index = this.indexOf(except);
            if (index === -1) {
                return; // not found
            }
            // Close to the left
            if (direction === editor_2.Direction.LEFT) {
                for (var i = index - 1; i >= 0; i--) {
                    this.closeEditor(this.editors[i]);
                }
            }
            else if (direction === editor_2.Direction.RIGHT) {
                for (var i = this.editors.length - 1; i > index; i--) {
                    this.closeEditor(this.editors[i]);
                }
            }
            else {
                this.mru.filter(function (e) { return !_this.matches(e, except); }).forEach(function (e) { return _this.closeEditor(e); });
            }
        };
        EditorGroup.prototype.closeAllEditors = function () {
            var _this = this;
            // Optimize: close all non active editors first to produce less upstream work
            this.mru.filter(function (e) { return !_this.matches(e, _this.active); }).forEach(function (e) { return _this.closeEditor(e); });
            this.closeEditor(this.active);
        };
        EditorGroup.prototype.moveEditor = function (editor, toIndex) {
            var index = this.indexOf(editor);
            if (index < 0) {
                return;
            }
            // Move
            this.editors.splice(index, 1);
            this.editors.splice(toIndex, 0, editor);
            // Event
            this.fireEvent(this._onEditorMoved, editor, true);
        };
        EditorGroup.prototype.setActive = function (editor) {
            var index = this.indexOf(editor);
            if (index === -1) {
                return; // not found
            }
            if (this.matches(this.active, editor)) {
                return; // already active
            }
            this.active = editor;
            // Bring to front in MRU list
            this.setMostRecentlyUsed(editor);
            // Event
            this.fireEvent(this._onEditorActivated, editor, false);
        };
        EditorGroup.prototype.pin = function (editor) {
            var index = this.indexOf(editor);
            if (index === -1) {
                return; // not found
            }
            if (!this.isPreview(editor)) {
                return; // can only pin a preview editor
            }
            // Convert the preview editor to be a pinned editor
            this.preview = null;
            // Event
            this.fireEvent(this._onEditorPinned, editor, false);
        };
        EditorGroup.prototype.unpin = function (editor) {
            var index = this.indexOf(editor);
            if (index === -1) {
                return; // not found
            }
            if (!this.isPinned(editor)) {
                return; // can only unpin a pinned editor
            }
            // Set new
            var oldPreview = this.preview;
            this.preview = editor;
            // Event
            this.fireEvent(this._onEditorUnpinned, editor, false);
            // Close old preview editor if any
            this.closeEditor(oldPreview);
        };
        EditorGroup.prototype.isPinned = function (arg1) {
            var editor;
            var index;
            if (typeof arg1 === 'number') {
                editor = this.editors[arg1];
                index = arg1;
            }
            else {
                editor = arg1;
                index = this.indexOf(editor);
            }
            if (index === -1 || !editor) {
                return false; // editor not found
            }
            if (!this.preview) {
                return true; // no preview editor
            }
            return !this.matches(this.preview, editor);
        };
        EditorGroup.prototype.fireEvent = function (emitter, arg2, isStructuralChange) {
            emitter.fire(arg2);
            if (isStructuralChange) {
                this._onEditorsStructureChanged.fire(arg2 instanceof editor_1.EditorInput ? arg2 : arg2.editor);
            }
            else {
                this._onEditorStateChanged.fire(arg2 instanceof editor_1.EditorInput ? arg2 : arg2.editor);
            }
        };
        EditorGroup.prototype.splice = function (index, del, editor) {
            var editorToDeleteOrReplace = this.editors[index];
            var args = [index, del ? 1 : 0];
            if (editor) {
                args.push(editor);
            }
            // Perform on editors array
            this.editors.splice.apply(this.editors, args);
            // Add
            if (!del && editor) {
                this.mru.push(editor); // make it LRU editor
                this.updateResourceMap(editor, false /* add */); // add new to resource map
            }
            else {
                var indexInMRU = this.indexOf(editorToDeleteOrReplace, this.mru);
                // Remove
                if (del && !editor) {
                    this.mru.splice(indexInMRU, 1); // remove from MRU
                    this.updateResourceMap(editorToDeleteOrReplace, true /* delete */); // remove from resource map
                }
                else {
                    this.mru.splice(indexInMRU, 1, editor); // replace MRU at location
                    this.updateResourceMap(editor, false /* add */); // add new to resource map
                    this.updateResourceMap(editorToDeleteOrReplace, true /* delete */); // remove replaced from resource map
                }
            }
        };
        EditorGroup.prototype.updateResourceMap = function (editor, remove) {
            var resource = editor_1.toResource(editor, { supportSideBySide: true });
            if (resource) {
                // It is possible to have the same resource opened twice (once as normal input and once as diff input)
                // So we need to do ref counting on the resource to provide the correct picture
                var counter = this.mapResourceToEditorCount.get(resource) || 0;
                var newCounter = void 0;
                if (remove) {
                    if (counter > 1) {
                        newCounter = counter - 1;
                    }
                }
                else {
                    newCounter = counter + 1;
                }
                this.mapResourceToEditorCount.set(resource, newCounter);
            }
        };
        EditorGroup.prototype.indexOf = function (candidate, editors) {
            if (editors === void 0) { editors = this.editors; }
            if (!candidate) {
                return -1;
            }
            for (var i = 0; i < editors.length; i++) {
                if (this.matches(editors[i], candidate)) {
                    return i;
                }
            }
            return -1;
        };
        EditorGroup.prototype.contains = function (editorOrResource) {
            if (editorOrResource instanceof editor_1.EditorInput) {
                return this.indexOf(editorOrResource) >= 0;
            }
            var counter = this.mapResourceToEditorCount.get(editorOrResource);
            return typeof counter === 'number' && counter > 0;
        };
        EditorGroup.prototype.setMostRecentlyUsed = function (editor) {
            var index = this.indexOf(editor);
            if (index === -1) {
                return; // editor not found
            }
            var mruIndex = this.indexOf(editor, this.mru);
            // Remove old index
            this.mru.splice(mruIndex, 1);
            // Set editor to front
            this.mru.unshift(editor);
        };
        EditorGroup.prototype.matches = function (editorA, editorB) {
            return !!editorA && !!editorB && editorA.matches(editorB);
        };
        EditorGroup.prototype.serialize = function () {
            var _this = this;
            var registry = platform_1.Registry.as(editor_1.Extensions.Editors);
            // Serialize all editor inputs so that we can store them.
            // Editors that cannot be serialized need to be ignored
            // from mru, active and preview if any.
            var serializableEditors = [];
            var serializedEditors = [];
            var serializablePreviewIndex;
            this.editors.forEach(function (e) {
                var factory = registry.getEditorInputFactory(e.getTypeId());
                if (factory) {
                    var value = factory.serialize(e);
                    if (typeof value === 'string') {
                        serializedEditors.push({ id: e.getTypeId(), value: value });
                        serializableEditors.push(e);
                        if (_this.preview === e) {
                            serializablePreviewIndex = serializableEditors.length - 1;
                        }
                    }
                }
            });
            var serializableMru = this.mru.map(function (e) { return _this.indexOf(e, serializableEditors); }).filter(function (i) { return i >= 0; });
            return {
                label: this.label,
                editors: serializedEditors,
                mru: serializableMru,
                preview: serializablePreviewIndex,
            };
        };
        EditorGroup.prototype.deserialize = function (data) {
            var _this = this;
            var registry = platform_1.Registry.as(editor_1.Extensions.Editors);
            this._label = data.label;
            this.editors = data.editors.map(function (e) {
                var factory = registry.getEditorInputFactory(e.id);
                if (factory) {
                    var editor = factory.deserialize(_this.instantiationService, e.value);
                    _this.hookEditorListeners(editor);
                    _this.updateResourceMap(editor, false /* add */);
                    return editor;
                }
                return null;
            }).filter(function (e) { return !!e; });
            this.mru = data.mru.map(function (i) { return _this.editors[i]; });
            this.active = this.mru[0];
            this.preview = this.editors[data.preview];
        };
        EditorGroup.prototype.dispose = function () {
            lifecycle_2.dispose(this.toDispose);
        };
        EditorGroup.IDS = 0;
        EditorGroup = __decorate([
            __param(1, instantiation_1.IInstantiationService),
            __param(2, configuration_1.IConfigurationService)
        ], EditorGroup);
        return EditorGroup;
    }());
    exports.EditorGroup = EditorGroup;
    var EditorStacksModel = (function () {
        function EditorStacksModel(restoreFromStorage, storageService, lifecycleService, instantiationService) {
            this.restoreFromStorage = restoreFromStorage;
            this.storageService = storageService;
            this.lifecycleService = lifecycleService;
            this.instantiationService = instantiationService;
            this.toDispose = [];
            this._groups = [];
            this.groupToIdentifier = Object.create(null);
            this._onGroupOpened = new event_1.Emitter();
            this._onGroupClosed = new event_1.Emitter();
            this._onGroupActivated = new event_1.Emitter();
            this._onGroupDeactivated = new event_1.Emitter();
            this._onGroupMoved = new event_1.Emitter();
            this._onGroupRenamed = new event_1.Emitter();
            this._onModelChanged = new event_1.Emitter();
            this._onEditorDisposed = new event_1.Emitter();
            this._onEditorDirty = new event_1.Emitter();
            this._onEditorLabelChange = new event_1.Emitter();
            this._onEditorOpened = new event_1.Emitter();
            this._onWillCloseEditor = new event_1.Emitter();
            this._onEditorClosed = new event_1.Emitter();
            this.toDispose.push(this._onGroupOpened, this._onGroupClosed, this._onGroupActivated, this._onGroupDeactivated, this._onGroupMoved, this._onGroupRenamed, this._onModelChanged, this._onEditorDisposed, this._onEditorDirty, this._onEditorLabelChange, this._onEditorClosed, this._onWillCloseEditor);
            this.registerListeners();
        }
        EditorStacksModel.prototype.registerListeners = function () {
            var _this = this;
            this.toDispose.push(this.lifecycleService.onShutdown(function (reason) { return _this.onShutdown(); }));
        };
        Object.defineProperty(EditorStacksModel.prototype, "onGroupOpened", {
            get: function () {
                return this._onGroupOpened.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorStacksModel.prototype, "onGroupClosed", {
            get: function () {
                return this._onGroupClosed.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorStacksModel.prototype, "onGroupActivated", {
            get: function () {
                return this._onGroupActivated.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorStacksModel.prototype, "onGroupDeactivated", {
            get: function () {
                return this._onGroupDeactivated.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorStacksModel.prototype, "onGroupMoved", {
            get: function () {
                return this._onGroupMoved.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorStacksModel.prototype, "onGroupRenamed", {
            get: function () {
                return this._onGroupRenamed.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorStacksModel.prototype, "onModelChanged", {
            get: function () {
                return this._onModelChanged.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorStacksModel.prototype, "onEditorDisposed", {
            get: function () {
                return this._onEditorDisposed.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorStacksModel.prototype, "onEditorDirty", {
            get: function () {
                return this._onEditorDirty.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorStacksModel.prototype, "onEditorLabelChange", {
            get: function () {
                return this._onEditorLabelChange.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorStacksModel.prototype, "onEditorOpened", {
            get: function () {
                return this._onEditorOpened.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorStacksModel.prototype, "onWillCloseEditor", {
            get: function () {
                return this._onWillCloseEditor.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorStacksModel.prototype, "onEditorClosed", {
            get: function () {
                return this._onEditorClosed.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorStacksModel.prototype, "groups", {
            get: function () {
                this.ensureLoaded();
                return this._groups.slice(0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditorStacksModel.prototype, "activeGroup", {
            get: function () {
                this.ensureLoaded();
                return this._activeGroup;
            },
            enumerable: true,
            configurable: true
        });
        EditorStacksModel.prototype.isActive = function (group) {
            return this.activeGroup === group;
        };
        EditorStacksModel.prototype.getGroup = function (id) {
            this.ensureLoaded();
            return this.groupToIdentifier[id];
        };
        EditorStacksModel.prototype.openGroup = function (label, activate, index) {
            if (activate === void 0) { activate = true; }
            this.ensureLoaded();
            var group = this.doCreateGroup(label);
            // Direct index provided
            if (typeof index === 'number') {
                this._groups[index] = group;
            }
            else if (!this._activeGroup) {
                this._groups.push(group);
            }
            else {
                this._groups.splice(this.indexOf(this._activeGroup) + 1, 0, group);
            }
            // Event
            this.fireEvent(this._onGroupOpened, group, true);
            // Activate if we are first or set to activate groups
            if (!this._activeGroup || activate) {
                this.setActive(group);
            }
            return group;
        };
        EditorStacksModel.prototype.renameGroup = function (group, label) {
            this.ensureLoaded();
            if (group.label !== label) {
                group.label = label;
                this.fireEvent(this._onGroupRenamed, group, false);
            }
        };
        EditorStacksModel.prototype.closeGroup = function (group) {
            this.ensureLoaded();
            var index = this.indexOf(group);
            if (index < 0) {
                return; // group does not exist
            }
            // Active group closed: Find a new active one to the right
            if (group === this._activeGroup) {
                // More than one group
                if (this._groups.length > 1) {
                    var newActiveGroup = void 0;
                    if (this._groups.length > index + 1) {
                        newActiveGroup = this._groups[index + 1]; // make next group to the right active
                    }
                    else {
                        newActiveGroup = this._groups[index - 1]; // make next group to the left active
                    }
                    this.setActive(newActiveGroup);
                }
                else {
                    this._activeGroup = null;
                }
            }
            // Close Editors in Group first and dispose then
            group.closeAllEditors();
            group.dispose();
            // Splice from groups
            this._groups.splice(index, 1);
            this.groupToIdentifier[group.id] = void 0;
            // Events
            this.fireEvent(this._onGroupClosed, group, true);
            for (var i = index; i < this._groups.length; i++) {
                this.fireEvent(this._onGroupMoved, this._groups[i], true); // send move event for groups to the right that moved to the left into the closed group position
            }
        };
        EditorStacksModel.prototype.closeGroups = function (except) {
            var _this = this;
            this.ensureLoaded();
            // Optimize: close all non active groups first to produce less upstream work
            this.groups.filter(function (g) { return g !== _this._activeGroup && g !== except; }).forEach(function (g) { return _this.closeGroup(g); });
            // Close active unless configured to skip
            if (this._activeGroup !== except) {
                this.closeGroup(this._activeGroup);
            }
        };
        EditorStacksModel.prototype.setActive = function (group) {
            this.ensureLoaded();
            if (this._activeGroup === group) {
                return;
            }
            var oldActiveGroup = this._activeGroup;
            this._activeGroup = group;
            this.fireEvent(this._onGroupActivated, group, false);
            if (oldActiveGroup) {
                this.fireEvent(this._onGroupDeactivated, oldActiveGroup, false);
            }
        };
        EditorStacksModel.prototype.moveGroup = function (group, toIndex) {
            this.ensureLoaded();
            var index = this.indexOf(group);
            if (index < 0) {
                return;
            }
            // Move
            this._groups.splice(index, 1);
            this._groups.splice(toIndex, 0, group);
            // Event
            for (var i = Math.min(index, toIndex); i <= Math.max(index, toIndex) && i < this._groups.length; i++) {
                this.fireEvent(this._onGroupMoved, this._groups[i], true); // send move event for groups to the right that moved to the left into the closed group position
            }
        };
        EditorStacksModel.prototype.indexOf = function (group) {
            return this._groups.indexOf(group);
        };
        EditorStacksModel.prototype.findGroup = function (editor, activeOnly) {
            var _this = this;
            var groupsToCheck = (this.activeGroup ? [this.activeGroup] : []).concat(this.groups.filter(function (g) { return g !== _this.activeGroup; }));
            var _loop_1 = function (i) {
                var group = groupsToCheck[i];
                var editorsToCheck = (group.activeEditor ? [group.activeEditor] : []).concat(group.getEditors().filter(function (e) { return e !== group.activeEditor; }));
                for (var j = 0; j < editorsToCheck.length; j++) {
                    var editorToCheck = editorsToCheck[j];
                    if ((!activeOnly || group.isActive(editorToCheck)) && editor.matches(editorToCheck)) {
                        return { value: group };
                    }
                }
            };
            for (var i = 0; i < groupsToCheck.length; i++) {
                var state_1 = _loop_1(i);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            return void 0;
        };
        EditorStacksModel.prototype.positionOfGroup = function (group) {
            return this.indexOf(group);
        };
        EditorStacksModel.prototype.groupAt = function (position) {
            this.ensureLoaded();
            return this._groups[position];
        };
        EditorStacksModel.prototype.next = function (jumpGroups, cycleAtEnd) {
            if (cycleAtEnd === void 0) { cycleAtEnd = true; }
            this.ensureLoaded();
            if (!this.activeGroup) {
                return null;
            }
            var index = this.activeGroup.indexOf(this.activeGroup.activeEditor);
            // Return next in group
            if (index + 1 < this.activeGroup.count) {
                return { group: this.activeGroup, editor: this.activeGroup.getEditor(index + 1) };
            }
            // Return first if we are not jumping groups
            if (!jumpGroups) {
                if (!cycleAtEnd) {
                    return null;
                }
                return { group: this.activeGroup, editor: this.activeGroup.getEditor(0) };
            }
            // Return first in next group
            var indexOfGroup = this.indexOf(this.activeGroup);
            var nextGroup = this.groups[indexOfGroup + 1];
            if (nextGroup) {
                return { group: nextGroup, editor: nextGroup.getEditor(0) };
            }
            // Return null if we are not cycling at the end
            if (!cycleAtEnd) {
                return null;
            }
            // Return first in first group
            var firstGroup = this.groups[0];
            return { group: firstGroup, editor: firstGroup.getEditor(0) };
        };
        EditorStacksModel.prototype.previous = function (jumpGroups, cycleAtStart) {
            if (cycleAtStart === void 0) { cycleAtStart = true; }
            this.ensureLoaded();
            if (!this.activeGroup) {
                return null;
            }
            var index = this.activeGroup.indexOf(this.activeGroup.activeEditor);
            // Return previous in group
            if (index > 0) {
                return { group: this.activeGroup, editor: this.activeGroup.getEditor(index - 1) };
            }
            // Return last if we are not jumping groups
            if (!jumpGroups) {
                if (!cycleAtStart) {
                    return null;
                }
                return { group: this.activeGroup, editor: this.activeGroup.getEditor(this.activeGroup.count - 1) };
            }
            // Return last in previous group
            var indexOfGroup = this.indexOf(this.activeGroup);
            var previousGroup = this.groups[indexOfGroup - 1];
            if (previousGroup) {
                return { group: previousGroup, editor: previousGroup.getEditor(previousGroup.count - 1) };
            }
            // Return null if we are not cycling at the start
            if (!cycleAtStart) {
                return null;
            }
            // Return last in last group
            var lastGroup = this.groups[this.groups.length - 1];
            return { group: lastGroup, editor: lastGroup.getEditor(lastGroup.count - 1) };
        };
        EditorStacksModel.prototype.save = function () {
            var serialized = this.serialize();
            if (serialized.groups.length) {
                this.storageService.store(EditorStacksModel.STORAGE_KEY, JSON.stringify(serialized), storage_1.StorageScope.WORKSPACE);
            }
            else {
                this.storageService.remove(EditorStacksModel.STORAGE_KEY, storage_1.StorageScope.WORKSPACE);
            }
        };
        EditorStacksModel.prototype.serialize = function () {
            // Exclude now empty groups (can happen if an editor cannot be serialized)
            var serializableGroups = this._groups.map(function (g) { return g.serialize(); }).filter(function (g) { return g.editors.length > 0; });
            // Only consider active index if we do not have empty groups
            var serializableActiveIndex;
            if (serializableGroups.length > 0) {
                if (serializableGroups.length === this._groups.length) {
                    serializableActiveIndex = this.indexOf(this._activeGroup);
                }
                else {
                    serializableActiveIndex = 0;
                }
            }
            return {
                groups: serializableGroups,
                active: serializableActiveIndex
            };
        };
        EditorStacksModel.prototype.fireEvent = function (emitter, group, isStructuralChange) {
            emitter.fire(group);
            this._onModelChanged.fire({ group: group, structural: isStructuralChange });
        };
        EditorStacksModel.prototype.ensureLoaded = function () {
            if (!this.loaded) {
                this.loaded = true;
                this.load();
            }
        };
        EditorStacksModel.prototype.load = function () {
            var _this = this;
            if (!this.restoreFromStorage) {
                return; // do not load from last session if the user explicitly asks to open a set of files
            }
            var modelRaw = this.storageService.get(EditorStacksModel.STORAGE_KEY, storage_1.StorageScope.WORKSPACE);
            if (modelRaw) {
                var serialized = JSON.parse(modelRaw);
                var invalidId = this.doValidate(serialized);
                if (invalidId) {
                    console.warn("Ignoring invalid stacks model (Error code: " + invalidId + "): " + JSON.stringify(serialized));
                    console.warn(serialized);
                    return;
                }
                this._groups = serialized.groups.map(function (s) { return _this.doCreateGroup(s); });
                this._activeGroup = this._groups[serialized.active];
            }
        };
        EditorStacksModel.prototype.doValidate = function (serialized) {
            if (!serialized.groups.length && typeof serialized.active === 'number') {
                return 1; // Invalid active (we have no groups, but an active one)
            }
            if (serialized.groups.length && !serialized.groups[serialized.active]) {
                return 2; // Invalid active (we cannot find the active one in group)
            }
            if (serialized.groups.length > 3) {
                return 3; // Too many groups
            }
            if (serialized.groups.some(function (g) { return !g.editors.length; })) {
                return 4; // Some empty groups
            }
            if (serialized.groups.some(function (g) { return g.editors.length !== g.mru.length; })) {
                return 5; // MRU out of sync with editors
            }
            if (serialized.groups.some(function (g) { return typeof g.preview === 'number' && !g.editors[g.preview]; })) {
                return 6; // Invalid preview editor
            }
            if (serialized.groups.some(function (g) { return !g.label; })) {
                return 7; // Group without label
            }
            return 0;
        };
        EditorStacksModel.prototype.doCreateGroup = function (arg1) {
            var _this = this;
            var group = this.instantiationService.createInstance(EditorGroup, arg1);
            this.groupToIdentifier[group.id] = group;
            // Funnel editor changes in the group through our event aggregator
            var unbind = [];
            unbind.push(group.onEditorsStructureChanged(function (editor) { return _this._onModelChanged.fire({ group: group, editor: editor, structural: true }); }));
            unbind.push(group.onEditorStateChanged(function (editor) { return _this._onModelChanged.fire({ group: group, editor: editor }); }));
            unbind.push(group.onEditorOpened(function (editor) { return _this._onEditorOpened.fire({ editor: editor, group: group }); }));
            unbind.push(group.onEditorClosed(function (event) {
                _this._onWillCloseEditor.fire(event);
                _this.handleOnEditorClosed(event);
                _this._onEditorClosed.fire(event);
            }));
            unbind.push(group.onEditorDisposed(function (editor) { return _this._onEditorDisposed.fire({ editor: editor, group: group }); }));
            unbind.push(group.onEditorDirty(function (editor) { return _this._onEditorDirty.fire({ editor: editor, group: group }); }));
            unbind.push(group.onEditorLabelChange(function (editor) { return _this._onEditorLabelChange.fire({ editor: editor, group: group }); }));
            unbind.push(this.onGroupClosed(function (g) {
                if (g === group) {
                    lifecycle_2.dispose(unbind);
                }
            }));
            return group;
        };
        EditorStacksModel.prototype.handleOnEditorClosed = function (event) {
            var _this = this;
            var editor = event.editor;
            var editorsToClose = [editor];
            // Include both sides of side by side editors when being closed and not opened multiple times
            if (editor instanceof editor_1.SideBySideEditorInput && !this.isOpen(editor)) {
                editorsToClose.push(editor.master, editor.details);
            }
            // Close the editor when it is no longer open in any group including diff editors
            editorsToClose.forEach(function (editorToClose) {
                var resource = editor_1.toResource(editorToClose); // prefer resource to not close right-hand side editors of a diff editor
                if (!_this.isOpen(resource || editorToClose)) {
                    editorToClose.close();
                }
            });
        };
        EditorStacksModel.prototype.isOpen = function (editorOrResource) {
            return this._groups.some(function (group) { return group.contains(editorOrResource); });
        };
        EditorStacksModel.prototype.count = function (editor) {
            return this._groups.filter(function (group) { return group.contains(editor); }).length;
        };
        EditorStacksModel.prototype.onShutdown = function () {
            this.save();
            lifecycle_2.dispose(this.toDispose);
        };
        EditorStacksModel.prototype.validate = function () {
            var serialized = this.serialize();
            var invalidId = this.doValidate(serialized);
            if (invalidId) {
                console.warn("Ignoring invalid stacks model (Error code: " + invalidId + "): " + JSON.stringify(serialized));
                console.warn(serialized);
            }
            else {
                console.log('Stacks Model OK!');
            }
        };
        EditorStacksModel.prototype.toString = function () {
            var _this = this;
            this.ensureLoaded();
            var lines = [];
            if (!this.groups.length) {
                return '<No Groups>';
            }
            this.groups.forEach(function (g) {
                var label = "Group: " + g.label;
                if (_this._activeGroup === g) {
                    label = label + " [active]";
                }
                lines.push(label);
                g.getEditors().forEach(function (e) {
                    var label = "\t" + e.getName();
                    if (g.previewEditor === e) {
                        label = label + " [preview]";
                    }
                    if (g.activeEditor === e) {
                        label = label + " [active]";
                    }
                    lines.push(label);
                });
            });
            return lines.join('\n');
        };
        EditorStacksModel.STORAGE_KEY = 'editorStacks.model';
        EditorStacksModel = __decorate([
            __param(1, storage_1.IStorageService),
            __param(2, lifecycle_1.ILifecycleService),
            __param(3, instantiation_1.IInstantiationService)
        ], EditorStacksModel);
        return EditorStacksModel;
    }());
    exports.EditorStacksModel = EditorStacksModel;
});
//# sourceMappingURL=editorStacksModel.js.map