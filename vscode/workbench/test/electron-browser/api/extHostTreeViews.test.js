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
define(["require", "exports", "assert", "vs/base/common/event", "vs/workbench/api/node/extHostTreeViews", "vs/workbench/api/node/extHostCommands", "vs/workbench/api/node/extHost.protocol", "./testThreadService", "vs/workbench/api/node/extHostHeapService", "vs/platform/instantiation/test/common/instantiationServiceMock", "vs/workbench/api/electron-browser/mainThreadCommands", "vs/workbench/test/electron-browser/api/mock"], function (require, exports, assert, event_1, extHostTreeViews_1, extHostCommands_1, extHost_protocol_1, testThreadService_1, extHostHeapService_1, instantiationServiceMock_1, mainThreadCommands_1, mock_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('ExtHostConfiguration', function () {
        var RecordingShape = (function (_super) {
            __extends(RecordingShape, _super);
            function RecordingShape() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.onRefresh = new event_1.Emitter();
                return _this;
            }
            RecordingShape.prototype.$registerView = function (treeViewId) {
            };
            RecordingShape.prototype.$refresh = function (viewId, itemHandles) {
                this.onRefresh.fire(itemHandles);
            };
            return RecordingShape;
        }(mock_1.mock()));
        ;
        var testObject;
        var target;
        var onDidChangeTreeData;
        setup(function () {
            var threadService = new testThreadService_1.TestThreadService();
            // Use IInstantiationService to get typechecking when instantiating
            var inst;
            {
                var instantiationService = new instantiationServiceMock_1.TestInstantiationService();
                inst = instantiationService;
            }
            threadService.setTestInstance(extHost_protocol_1.MainContext.MainThreadCommands, inst.createInstance(mainThreadCommands_1.MainThreadCommands, threadService));
            target = new RecordingShape();
            testObject = new extHostTreeViews_1.ExtHostTreeViews(target, new extHostCommands_1.ExtHostCommands(threadService, new extHostHeapService_1.ExtHostHeapService()));
            onDidChangeTreeData = new event_1.Emitter();
            testObject.registerTreeDataProvider('testDataProvider', aTreeDataProvider());
            testObject.$getElements('testDataProvider').then(function (elements) {
                for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                    var element = elements_1[_i];
                    testObject.$getChildren('testDataProvider', element.handle);
                }
            });
        });
        test('refresh calls are throttled on roots', function (done) {
            target.onRefresh.event(function (actuals) {
                assert.equal(0, actuals.length);
                done();
            });
            onDidChangeTreeData.fire();
            onDidChangeTreeData.fire();
            onDidChangeTreeData.fire();
            onDidChangeTreeData.fire();
        });
        test('refresh calls are throttled on elements', function (done) {
            target.onRefresh.event(function (actuals) {
                assert.deepEqual([1, 2], actuals);
                done();
            });
            onDidChangeTreeData.fire('a');
            onDidChangeTreeData.fire('b');
            onDidChangeTreeData.fire('b');
            onDidChangeTreeData.fire('a');
        });
        test('refresh calls are throttled on unknown elements', function (done) {
            target.onRefresh.event(function (actuals) {
                assert.deepEqual([1, 2], actuals);
                done();
            });
            onDidChangeTreeData.fire('a');
            onDidChangeTreeData.fire('b');
            onDidChangeTreeData.fire('g');
            onDidChangeTreeData.fire('a');
        });
        test('refresh calls are throttled on unknown elements and root', function (done) {
            target.onRefresh.event(function (actuals) {
                assert.equal(0, actuals.length);
                done();
            });
            onDidChangeTreeData.fire('a');
            onDidChangeTreeData.fire('b');
            onDidChangeTreeData.fire('g');
            onDidChangeTreeData.fire('');
        });
        test('refresh calls are throttled on elements and root', function (done) {
            target.onRefresh.event(function (actuals) {
                assert.equal(0, actuals.length);
                done();
            });
            onDidChangeTreeData.fire('a');
            onDidChangeTreeData.fire('b');
            onDidChangeTreeData.fire();
            onDidChangeTreeData.fire('a');
        });
        function aTreeDataProvider() {
            return {
                getChildren: function (element) {
                    if (!element) {
                        return ['a', 'b'];
                    }
                    if (element === 'a') {
                        return ['aa', 'ab'];
                    }
                    if (element === 'b') {
                        return ['ba', 'bb'];
                    }
                    return [];
                },
                getTreeItem: function (element) {
                    return {
                        label: element
                    };
                },
                onDidChangeTreeData: onDidChangeTreeData.event
            };
        }
    });
});
//# sourceMappingURL=extHostTreeViews.test.js.map