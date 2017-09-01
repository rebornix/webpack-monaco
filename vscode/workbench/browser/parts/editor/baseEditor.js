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
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/types", "vs/platform/registry/common/platform", "vs/workbench/browser/panel", "vs/workbench/common/editor", "vs/platform/instantiation/common/descriptors"], function (require, exports, winjs_base_1, types, platform_1, panel_1, editor_1, descriptors_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * The base class of editors in the workbench. Editors register themselves for specific editor inputs.
     * Editors are layed out in the editor part of the workbench. Only one editor can be open at a time.
     * Each editor has a minimized representation that is good enough to provide some information about the
     * state of the editor data.
     * The workbench will keep an editor alive after it has been created and show/hide it based on
     * user interaction. The lifecycle of a editor goes in the order create(), setVisible(true|false),
     * layout(), setInput(), focus(), dispose(). During use of the workbench, a editor will often receive a
     * clearInput, setVisible, layout and focus call, but only one create and dispose call.
     *
     * This class is only intended to be subclassed and not instantiated.
     */
    var BaseEditor = (function (_super) {
        __extends(BaseEditor, _super);
        function BaseEditor(id, telemetryService, themeService) {
            return _super.call(this, id, telemetryService, themeService) || this;
        }
        Object.defineProperty(BaseEditor.prototype, "input", {
            get: function () {
                return this._input;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseEditor.prototype, "options", {
            get: function () {
                return this._options;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Note: Clients should not call this method, the workbench calls this
         * method. Calling it otherwise may result in unexpected behavior.
         *
         * Sets the given input with the options to the part. An editor has to deal with the
         * situation that the same input is being set with different options.
         */
        BaseEditor.prototype.setInput = function (input, options) {
            this._input = input;
            this._options = options;
            return winjs_base_1.TPromise.as(null);
        };
        /**
         * Called to indicate to the editor that the input should be cleared and resources associated with the
         * input should be freed.
         */
        BaseEditor.prototype.clearInput = function () {
            this._input = null;
            this._options = null;
        };
        BaseEditor.prototype.create = function (parent) {
            var res = _super.prototype.create.call(this, parent);
            // Create Editor
            this.createEditor(parent);
            return res;
        };
        BaseEditor.prototype.setVisible = function (visible, position) {
            if (position === void 0) { position = null; }
            var promise = _super.prototype.setVisible.call(this, visible);
            // Propagate to Editor
            this.setEditorVisible(visible, position);
            return promise;
        };
        BaseEditor.prototype.setEditorVisible = function (visible, position) {
            if (position === void 0) { position = null; }
            this._position = position;
        };
        /**
         * Called when the position of the editor changes while it is visible.
         */
        BaseEditor.prototype.changePosition = function (position) {
            this._position = position;
        };
        Object.defineProperty(BaseEditor.prototype, "position", {
            /**
             * The position this editor is showing in or null if none.
             */
            get: function () {
                return this._position;
            },
            enumerable: true,
            configurable: true
        });
        BaseEditor.prototype.dispose = function () {
            this._input = null;
            this._options = null;
            // Super Dispose
            _super.prototype.dispose.call(this);
        };
        return BaseEditor;
    }(panel_1.Panel));
    exports.BaseEditor = BaseEditor;
    /**
     * A lightweight descriptor of an editor. The descriptor is deferred so that heavy editors
     * can load lazily in the workbench.
     */
    var EditorDescriptor = (function (_super) {
        __extends(EditorDescriptor, _super);
        function EditorDescriptor(id, name, moduleId, ctorName) {
            var _this = _super.call(this, moduleId, ctorName) || this;
            _this.id = id;
            _this.name = name;
            return _this;
        }
        EditorDescriptor.prototype.getId = function () {
            return this.id;
        };
        EditorDescriptor.prototype.getName = function () {
            return this.name;
        };
        EditorDescriptor.prototype.describes = function (obj) {
            return obj instanceof BaseEditor && obj.getId() === this.id;
        };
        return EditorDescriptor;
    }(descriptors_1.AsyncDescriptor));
    exports.EditorDescriptor = EditorDescriptor;
    var INPUT_DESCRIPTORS_PROPERTY = '__$inputDescriptors';
    var EditorRegistry = (function () {
        function EditorRegistry() {
            this.editorInputFactoryConstructors = Object.create(null);
            this.editorInputFactoryInstances = Object.create(null);
            this.editors = [];
        }
        EditorRegistry.prototype.setInstantiationService = function (service) {
            this.instantiationService = service;
            for (var key in this.editorInputFactoryConstructors) {
                var element = this.editorInputFactoryConstructors[key];
                this.createEditorInputFactory(key, element);
            }
            this.editorInputFactoryConstructors = {};
        };
        EditorRegistry.prototype.createEditorInputFactory = function (editorInputId, ctor) {
            var instance = this.instantiationService.createInstance(ctor);
            this.editorInputFactoryInstances[editorInputId] = instance;
        };
        EditorRegistry.prototype.registerEditor = function (descriptor, editorInputDescriptor) {
            // Support both non-array and array parameter
            var inputDescriptors = [];
            if (!types.isArray(editorInputDescriptor)) {
                inputDescriptors.push(editorInputDescriptor);
            }
            else {
                inputDescriptors = editorInputDescriptor;
            }
            // Register (Support multiple Editors per Input)
            descriptor[INPUT_DESCRIPTORS_PROPERTY] = inputDescriptors;
            this.editors.push(descriptor);
        };
        EditorRegistry.prototype.getEditor = function (input) {
            var _this = this;
            var findEditorDescriptors = function (input, byInstanceOf) {
                var matchingDescriptors = [];
                for (var i = 0; i < _this.editors.length; i++) {
                    var editor = _this.editors[i];
                    var inputDescriptors = editor[INPUT_DESCRIPTORS_PROPERTY];
                    for (var j = 0; j < inputDescriptors.length; j++) {
                        var inputClass = inputDescriptors[j].ctor;
                        // Direct check on constructor type (ignores prototype chain)
                        if (!byInstanceOf && input.constructor === inputClass) {
                            matchingDescriptors.push(editor);
                            break;
                        }
                        else if (byInstanceOf && input instanceof inputClass) {
                            matchingDescriptors.push(editor);
                            break;
                        }
                    }
                }
                // If no descriptors found, continue search using instanceof and prototype chain
                if (!byInstanceOf && matchingDescriptors.length === 0) {
                    return findEditorDescriptors(input, true);
                }
                if (byInstanceOf) {
                    return matchingDescriptors;
                }
                return matchingDescriptors;
            };
            var descriptors = findEditorDescriptors(input);
            if (descriptors && descriptors.length > 0) {
                // Ask the input for its preferred Editor
                var preferredEditorId = input.getPreferredEditorId(descriptors.map(function (d) { return d.getId(); }));
                if (preferredEditorId) {
                    return this.getEditorById(preferredEditorId);
                }
                // Otherwise, first come first serve
                return descriptors[0];
            }
            return null;
        };
        EditorRegistry.prototype.getEditorById = function (editorId) {
            for (var i = 0; i < this.editors.length; i++) {
                var editor = this.editors[i];
                if (editor.getId() === editorId) {
                    return editor;
                }
            }
            return null;
        };
        EditorRegistry.prototype.getEditors = function () {
            return this.editors.slice(0);
        };
        EditorRegistry.prototype.setEditors = function (editorsToSet) {
            this.editors = editorsToSet;
        };
        EditorRegistry.prototype.getEditorInputs = function () {
            var inputClasses = [];
            for (var i = 0; i < this.editors.length; i++) {
                var editor = this.editors[i];
                var editorInputDescriptors = editor[INPUT_DESCRIPTORS_PROPERTY];
                inputClasses.push.apply(inputClasses, editorInputDescriptors.map(function (descriptor) { return descriptor.ctor; }));
            }
            return inputClasses;
        };
        EditorRegistry.prototype.registerFileInputFactory = function (factory) {
            this.fileInputFactory = factory;
        };
        EditorRegistry.prototype.getFileInputFactory = function () {
            return this.fileInputFactory;
        };
        EditorRegistry.prototype.registerEditorInputFactory = function (editorInputId, ctor) {
            if (!this.instantiationService) {
                this.editorInputFactoryConstructors[editorInputId] = ctor;
            }
            else {
                this.createEditorInputFactory(editorInputId, ctor);
            }
        };
        EditorRegistry.prototype.getEditorInputFactory = function (editorInputId) {
            return this.editorInputFactoryInstances[editorInputId];
        };
        return EditorRegistry;
    }());
    platform_1.Registry.add(editor_1.Extensions.Editors, new EditorRegistry());
});
//# sourceMappingURL=baseEditor.js.map