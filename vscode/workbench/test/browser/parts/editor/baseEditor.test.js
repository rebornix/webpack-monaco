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
define(["require", "exports", "assert", "vs/workbench/browser/parts/editor/baseEditor", "vs/workbench/common/editor", "vs/platform/instantiation/test/common/instantiationServiceMock", "vs/platform/registry/common/platform", "vs/platform/instantiation/common/descriptors", "vs/platform/telemetry/common/telemetry", "vs/platform/telemetry/common/telemetryUtils", "vs/editor/common/modes/modesRegistry", "vs/workbench/test/workbenchTestServices", "vs/workbench/common/editor/resourceEditorInput", "vs/platform/theme/test/common/testThemeService"], function (require, exports, assert, baseEditor_1, editor_1, instantiationServiceMock_1, Platform, descriptors_1, telemetry_1, telemetryUtils_1, modesRegistry_1, workbenchTestServices_1, resourceEditorInput_1, testThemeService_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var NullThemeService = new testThemeService_1.TestThemeService();
    var EditorRegistry = Platform.Registry.as(editor_1.Extensions.Editors);
    var MyEditor = (function (_super) {
        __extends(MyEditor, _super);
        function MyEditor(id, telemetryService) {
            return _super.call(this, id, telemetryUtils_1.NullTelemetryService, NullThemeService) || this;
        }
        MyEditor.prototype.getId = function () {
            return 'myEditor';
        };
        MyEditor.prototype.layout = function () {
        };
        MyEditor.prototype.createEditor = function () {
        };
        MyEditor = __decorate([
            __param(1, telemetry_1.ITelemetryService)
        ], MyEditor);
        return MyEditor;
    }(baseEditor_1.BaseEditor));
    exports.MyEditor = MyEditor;
    var MyOtherEditor = (function (_super) {
        __extends(MyOtherEditor, _super);
        function MyOtherEditor(id, telemetryService) {
            return _super.call(this, id, telemetryUtils_1.NullTelemetryService, NullThemeService) || this;
        }
        MyOtherEditor.prototype.getId = function () {
            return 'myOtherEditor';
        };
        MyOtherEditor.prototype.layout = function () {
        };
        MyOtherEditor.prototype.createEditor = function () {
        };
        MyOtherEditor = __decorate([
            __param(1, telemetry_1.ITelemetryService)
        ], MyOtherEditor);
        return MyOtherEditor;
    }(baseEditor_1.BaseEditor));
    exports.MyOtherEditor = MyOtherEditor;
    var MyInputFactory = (function () {
        function MyInputFactory() {
        }
        MyInputFactory.prototype.serialize = function (input) {
            return input.toString();
        };
        MyInputFactory.prototype.deserialize = function (instantiationService, raw) {
            return {};
        };
        return MyInputFactory;
    }());
    var MyInput = (function (_super) {
        __extends(MyInput, _super);
        function MyInput() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MyInput.prototype.getPreferredEditorId = function (ids) {
            return ids[1];
        };
        MyInput.prototype.getTypeId = function () {
            return '';
        };
        MyInput.prototype.resolve = function (refresh) {
            return null;
        };
        return MyInput;
    }(editor_1.EditorInput));
    var MyOtherInput = (function (_super) {
        __extends(MyOtherInput, _super);
        function MyOtherInput() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MyOtherInput.prototype.getTypeId = function () {
            return '';
        };
        MyOtherInput.prototype.resolve = function (refresh) {
            return null;
        };
        return MyOtherInput;
    }(editor_1.EditorInput));
    var MyResourceInput = (function (_super) {
        __extends(MyResourceInput, _super);
        function MyResourceInput() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return MyResourceInput;
    }(resourceEditorInput_1.ResourceEditorInput));
    suite('Workbench BaseEditor', function () {
        test('BaseEditor API', function (done) {
            var e = new MyEditor('id', telemetryUtils_1.NullTelemetryService);
            var input = new MyOtherInput();
            var options = new editor_1.EditorOptions();
            assert(!e.isVisible());
            assert(!e.input);
            assert(!e.options);
            e.setInput(input, options).then(function () {
                assert.strictEqual(input, e.input);
                assert.strictEqual(options, e.options);
                e.setVisible(true);
                assert(e.isVisible());
                input.onDispose(function () {
                    assert(false);
                });
                e.dispose();
                e.clearInput();
                e.setVisible(false);
                assert(!e.isVisible());
                assert(!e.input);
                assert(!e.options);
                assert(!e.getControl());
            }).done(function () { return done(); });
        });
        test('EditorDescriptor', function () {
            var d = new baseEditor_1.EditorDescriptor('id', 'name', 'vs/workbench/test/browser/parts/editor/baseEditor.test', 'MyClass');
            assert.strictEqual(d.getId(), 'id');
            assert.strictEqual(d.getName(), 'name');
        });
        test('Editor Registration', function () {
            var d1 = new baseEditor_1.EditorDescriptor('id1', 'name', 'vs/workbench/test/browser/parts/editor/baseEditor.test', 'MyClass');
            var d2 = new baseEditor_1.EditorDescriptor('id2', 'name', 'vs/workbench/test/browser/parts/editor/baseEditor.test', 'MyOtherClass');
            var oldEditorsCnt = EditorRegistry.getEditors().length;
            var oldInputCnt = EditorRegistry.getEditorInputs().length;
            EditorRegistry.registerEditor(d1, new descriptors_1.SyncDescriptor(MyInput));
            EditorRegistry.registerEditor(d2, [new descriptors_1.SyncDescriptor(MyInput), new descriptors_1.SyncDescriptor(MyOtherInput)]);
            assert.equal(EditorRegistry.getEditors().length, oldEditorsCnt + 2);
            assert.equal(EditorRegistry.getEditorInputs().length, oldInputCnt + 3);
            assert.strictEqual(EditorRegistry.getEditor(new MyInput()), d2);
            assert.strictEqual(EditorRegistry.getEditor(new MyOtherInput()), d2);
            assert.strictEqual(EditorRegistry.getEditorById('id1'), d1);
            assert.strictEqual(EditorRegistry.getEditorById('id2'), d2);
            assert(!EditorRegistry.getEditorById('id3'));
        });
        test('Editor Lookup favors specific class over superclass (match on specific class)', function (done) {
            var d1 = new baseEditor_1.EditorDescriptor('id1', 'name', 'vs/workbench/test/browser/parts/editor/baseEditor.test', 'MyEditor');
            var d2 = new baseEditor_1.EditorDescriptor('id2', 'name', 'vs/workbench/test/browser/parts/editor/baseEditor.test', 'MyOtherEditor');
            var oldEditors = EditorRegistry.getEditors();
            EditorRegistry.setEditors([]);
            EditorRegistry.registerEditor(d2, new descriptors_1.SyncDescriptor(resourceEditorInput_1.ResourceEditorInput));
            EditorRegistry.registerEditor(d1, new descriptors_1.SyncDescriptor(MyResourceInput));
            var inst = new instantiationServiceMock_1.TestInstantiationService();
            inst.createInstance(EditorRegistry.getEditor(inst.createInstance(MyResourceInput, 'fake', '', '', modesRegistry_1.PLAINTEXT_MODE_ID, false)), 'id').then(function (editor) {
                assert.strictEqual(editor.getId(), 'myEditor');
                return inst.createInstance(EditorRegistry.getEditor(inst.createInstance(resourceEditorInput_1.ResourceEditorInput, 'fake', '', '', modesRegistry_1.PLAINTEXT_MODE_ID, false)), 'id').then(function (editor) {
                    assert.strictEqual(editor.getId(), 'myOtherEditor');
                    EditorRegistry.setEditors(oldEditors);
                });
            }).done(function () { return done(); });
        });
        test('Editor Lookup favors specific class over superclass (match on super class)', function (done) {
            var d1 = new baseEditor_1.EditorDescriptor('id1', 'name', 'vs/workbench/test/browser/parts/editor/baseEditor.test', 'MyOtherEditor');
            var oldEditors = EditorRegistry.getEditors();
            EditorRegistry.setEditors([]);
            EditorRegistry.registerEditor(d1, new descriptors_1.SyncDescriptor(resourceEditorInput_1.ResourceEditorInput));
            var inst = new instantiationServiceMock_1.TestInstantiationService();
            inst.createInstance(EditorRegistry.getEditor(inst.createInstance(MyResourceInput, 'fake', '', '', modesRegistry_1.PLAINTEXT_MODE_ID, false)), 'id').then(function (editor) {
                assert.strictEqual('myOtherEditor', editor.getId());
                EditorRegistry.setEditors(oldEditors);
            }).done(function () { return done(); });
        });
        test('Editor Input Factory', function () {
            EditorRegistry.setInstantiationService(workbenchTestServices_1.workbenchInstantiationService());
            EditorRegistry.registerEditorInputFactory('myInputId', MyInputFactory);
            var factory = EditorRegistry.getEditorInputFactory('myInputId');
            assert(factory);
        });
        return {
            MyEditor: MyEditor,
            MyOtherEditor: MyOtherEditor
        };
    });
});
//# sourceMappingURL=baseEditor.test.js.map