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
define(["require", "exports", "vs/platform/instantiation/common/serviceCollection", "vs/platform/instantiation/common/instantiationService", "vs/platform/contextkey/common/contextkey", "vs/platform/keybinding/test/common/mockKeybindingService", "vs/editor/common/commonCodeEditor", "vs/editor/common/model/model", "vs/editor/test/common/mocks/testConfiguration"], function (require, exports, serviceCollection_1, instantiationService_1, contextkey_1, mockKeybindingService_1, commonCodeEditor_1, model_1, testConfiguration_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MockCodeEditor = (function (_super) {
        __extends(MockCodeEditor, _super);
        function MockCodeEditor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MockCodeEditor.prototype._createConfiguration = function (options) {
            return new testConfiguration_1.TestConfiguration(options);
        };
        MockCodeEditor.prototype.layout = function (dimension) { };
        MockCodeEditor.prototype.focus = function () { };
        MockCodeEditor.prototype.isFocused = function () { return true; };
        MockCodeEditor.prototype.hasWidgetFocus = function () { return true; };
        ;
        MockCodeEditor.prototype._enableEmptySelectionClipboard = function () { return false; };
        MockCodeEditor.prototype._scheduleAtNextAnimationFrame = function (callback) { throw new Error('Notimplemented'); };
        MockCodeEditor.prototype._createView = function () { };
        MockCodeEditor.prototype._registerDecorationType = function (key, options, parentTypeKey) { throw new Error('NotImplemented'); };
        MockCodeEditor.prototype._removeDecorationType = function (key) { throw new Error('NotImplemented'); };
        MockCodeEditor.prototype._resolveDecorationOptions = function (typeKey, writable) { throw new Error('NotImplemented'); };
        // --- test utils
        MockCodeEditor.prototype.getCursor = function () {
            return this.cursor;
        };
        MockCodeEditor.prototype.registerAndInstantiateContribution = function (ctor) {
            var r = this._instantiationService.createInstance(ctor, this);
            this._contributions[r.getId()] = r;
            return r;
        };
        MockCodeEditor.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this.model) {
                this.model.dispose();
            }
            this._contextKeyService.dispose();
        };
        return MockCodeEditor;
    }(commonCodeEditor_1.CommonCodeEditor));
    exports.MockCodeEditor = MockCodeEditor;
    var MockScopeLocation = (function () {
        function MockScopeLocation() {
            this.parentElement = null;
        }
        MockScopeLocation.prototype.setAttribute = function (attr, value) { };
        MockScopeLocation.prototype.removeAttribute = function (attr) { };
        MockScopeLocation.prototype.hasAttribute = function (attr) { return false; };
        MockScopeLocation.prototype.getAttribute = function (attr) { return undefined; };
        return MockScopeLocation;
    }());
    exports.MockScopeLocation = MockScopeLocation;
    function withMockCodeEditor(text, options, callback) {
        // create a model if necessary and remember it in order to dispose it.
        var modelToDispose = null;
        if (!options.model) {
            modelToDispose = model_1.Model.createFromString(text.join('\n'));
            options.model = modelToDispose;
        }
        var editor = _mockCodeEditor(options);
        callback(editor, editor.getCursor());
        if (modelToDispose) {
            modelToDispose.dispose();
        }
        editor.dispose();
    }
    exports.withMockCodeEditor = withMockCodeEditor;
    function mockCodeEditor(text, options) {
        // TODO: who owns this model now?
        if (!options.model) {
            options.model = model_1.Model.createFromString(text.join('\n'));
        }
        return _mockCodeEditor(options);
    }
    exports.mockCodeEditor = mockCodeEditor;
    function _mockCodeEditor(options) {
        var contextKeyService = new mockKeybindingService_1.MockContextKeyService();
        var services = options.serviceCollection || new serviceCollection_1.ServiceCollection();
        services.set(contextkey_1.IContextKeyService, contextKeyService);
        var instantiationService = new instantiationService_1.InstantiationService(services);
        var editor = new MockCodeEditor(new MockScopeLocation(), options, instantiationService, contextKeyService);
        editor.setModel(options.model);
        return editor;
    }
});
//# sourceMappingURL=mockCodeEditor.js.map