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
define(["require", "exports", "assert", "vs/base/common/uri", "vs/workbench/api/node/extHostWorkspace", "vs/workbench/api/node/extHostConfiguration", "vs/base/common/winjs.base", "vs/workbench/services/configuration/common/configurationEditing", "vs/platform/configuration/common/configuration", "./testThreadService", "vs/workbench/test/electron-browser/api/mock"], function (require, exports, assert, uri_1, extHostWorkspace_1, extHostConfiguration_1, winjs_base_1, configurationEditing_1, configuration_1, testThreadService_1, mock_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('ExtHostConfiguration', function () {
        var RecordingShape = (function (_super) {
            __extends(RecordingShape, _super);
            function RecordingShape() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            RecordingShape.prototype.$updateConfigurationOption = function (target, key, value) {
                this.lastArgs = [target, key, value];
                return winjs_base_1.TPromise.as(void 0);
            };
            return RecordingShape;
        }(mock_1.mock()));
        ;
        function createExtHostConfiguration(contents, shape) {
            if (contents === void 0) { contents = Object.create(null); }
            if (!shape) {
                shape = new (function (_super) {
                    __extends(class_1, _super);
                    function class_1() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    return class_1;
                }(mock_1.mock()));
            }
            return new extHostConfiguration_1.ExtHostConfiguration(shape, new extHostWorkspace_1.ExtHostWorkspace(new testThreadService_1.TestThreadService(), null), {
                defaults: new configuration_1.ConfigurationModel(contents),
                user: new configuration_1.ConfigurationModel(contents),
                workspace: new configuration_1.ConfigurationModel(),
                folders: Object.create(null)
            });
        }
        test('getConfiguration fails regression test 1.7.1 -> 1.8 #15552', function () {
            var extHostConfig = createExtHostConfiguration({
                'search': {
                    'exclude': {
                        '**/node_modules': true
                    }
                }
            });
            assert.equal(extHostConfig.getConfiguration('search.exclude')['**/node_modules'], true);
            assert.equal(extHostConfig.getConfiguration('search.exclude').get('**/node_modules'), true);
            assert.equal(extHostConfig.getConfiguration('search').get('exclude')['**/node_modules'], true);
            assert.equal(extHostConfig.getConfiguration('search.exclude').has('**/node_modules'), true);
            assert.equal(extHostConfig.getConfiguration('search').has('exclude.**/node_modules'), true);
        });
        test('has/get', function () {
            var all = createExtHostConfiguration({
                'farboo': {
                    'config0': true,
                    'nested': {
                        'config1': 42,
                        'config2': 'Das Pferd frisst kein Reis.'
                    },
                    'config4': ''
                }
            });
            var config = all.getConfiguration('farboo');
            assert.ok(config.has('config0'));
            assert.equal(config.get('config0'), true);
            assert.equal(config.get('config4'), '');
            assert.equal(config['config0'], true);
            assert.equal(config['config4'], '');
            assert.ok(config.has('nested.config1'));
            assert.equal(config.get('nested.config1'), 42);
            assert.ok(config.has('nested.config2'));
            assert.equal(config.get('nested.config2'), 'Das Pferd frisst kein Reis.');
            assert.ok(config.has('nested'));
            assert.deepEqual(config.get('nested'), { config1: 42, config2: 'Das Pferd frisst kein Reis.' });
        });
        test('inspect in no workspace context', function () {
            var testObject = new extHostConfiguration_1.ExtHostConfiguration(new (function (_super) {
                __extends(class_2, _super);
                function class_2() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return class_2;
            }(mock_1.mock())), new extHostWorkspace_1.ExtHostWorkspace(new testThreadService_1.TestThreadService(), null), {
                defaults: new configuration_1.ConfigurationModel({
                    'editor': {
                        'wordWrap': 'off'
                    }
                }, ['editor.wordWrap']),
                user: new configuration_1.ConfigurationModel({
                    'editor': {
                        'wordWrap': 'on'
                    }
                }, ['editor.wordWrap']),
                workspace: new configuration_1.ConfigurationModel({}, []),
                folders: Object.create(null)
            });
            var actual = testObject.getConfiguration().inspect('editor.wordWrap');
            assert.equal(actual.defaultValue, 'off');
            assert.equal(actual.globalValue, 'on');
            assert.equal(actual.workspaceValue, undefined);
            assert.equal(actual.workspaceFolderValue, undefined);
            actual = testObject.getConfiguration('editor').inspect('wordWrap');
            assert.equal(actual.defaultValue, 'off');
            assert.equal(actual.globalValue, 'on');
            assert.equal(actual.workspaceValue, undefined);
            assert.equal(actual.workspaceFolderValue, undefined);
        });
        test('inspect in single root context', function () {
            var workspaceUri = uri_1.default.file('foo');
            var folders = Object.create(null);
            var workspace = new configuration_1.ConfigurationModel({
                'editor': {
                    'wordWrap': 'bounded'
                }
            }, ['editor.wordWrap']);
            folders[workspaceUri.toString()] = workspace;
            var testObject = new extHostConfiguration_1.ExtHostConfiguration(new (function (_super) {
                __extends(class_3, _super);
                function class_3() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return class_3;
            }(mock_1.mock())), new extHostWorkspace_1.ExtHostWorkspace(new testThreadService_1.TestThreadService(), {
                'id': 'foo',
                'roots': [uri_1.default.file('foo')],
                'name': 'foo'
            }), {
                defaults: new configuration_1.ConfigurationModel({
                    'editor': {
                        'wordWrap': 'off'
                    }
                }, ['editor.wordWrap']),
                user: new configuration_1.ConfigurationModel({
                    'editor': {
                        'wordWrap': 'on'
                    }
                }, ['editor.wordWrap']),
                workspace: workspace,
                folders: folders
            });
            var actual1 = testObject.getConfiguration().inspect('editor.wordWrap');
            assert.equal(actual1.defaultValue, 'off');
            assert.equal(actual1.globalValue, 'on');
            assert.equal(actual1.workspaceValue, 'bounded');
            assert.equal(actual1.workspaceFolderValue, undefined);
            actual1 = testObject.getConfiguration('editor').inspect('wordWrap');
            assert.equal(actual1.defaultValue, 'off');
            assert.equal(actual1.globalValue, 'on');
            assert.equal(actual1.workspaceValue, 'bounded');
            assert.equal(actual1.workspaceFolderValue, undefined);
            var actual2 = testObject.getConfiguration(null, workspaceUri).inspect('editor.wordWrap');
            assert.equal(actual2.defaultValue, 'off');
            assert.equal(actual2.globalValue, 'on');
            assert.equal(actual2.workspaceValue, 'bounded');
            assert.equal(actual2.workspaceFolderValue, 'bounded');
            actual2 = testObject.getConfiguration('editor', workspaceUri).inspect('wordWrap');
            assert.equal(actual2.defaultValue, 'off');
            assert.equal(actual2.globalValue, 'on');
            assert.equal(actual2.workspaceValue, 'bounded');
            assert.equal(actual2.workspaceFolderValue, 'bounded');
        });
        test('inspect in multi root context', function () {
            var workspace = new configuration_1.ConfigurationModel({
                'editor': {
                    'wordWrap': 'bounded'
                }
            }, ['editor.wordWrap']);
            var firstRoot = uri_1.default.file('foo1');
            var secondRoot = uri_1.default.file('foo2');
            var thirdRoot = uri_1.default.file('foo3');
            var folders = Object.create(null);
            folders[firstRoot.toString()] = new configuration_1.ConfigurationModel({
                'editor': {
                    'wordWrap': 'off',
                    'lineNumbers': 'relative'
                }
            }, ['editor.wordWrap']);
            folders[secondRoot.toString()] = new configuration_1.ConfigurationModel({
                'editor': {
                    'wordWrap': 'on'
                }
            }, ['editor.wordWrap']);
            folders[thirdRoot.toString()] = new configuration_1.ConfigurationModel({}, []);
            var testObject = new extHostConfiguration_1.ExtHostConfiguration(new (function (_super) {
                __extends(class_4, _super);
                function class_4() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return class_4;
            }(mock_1.mock())), new extHostWorkspace_1.ExtHostWorkspace(new testThreadService_1.TestThreadService(), {
                'id': 'foo',
                'roots': [firstRoot, secondRoot],
                'name': 'foo'
            }), {
                defaults: new configuration_1.ConfigurationModel({
                    'editor': {
                        'wordWrap': 'off',
                        'lineNumbers': 'on'
                    }
                }, ['editor.wordWrap']),
                user: new configuration_1.ConfigurationModel({
                    'editor': {
                        'wordWrap': 'on'
                    }
                }, ['editor.wordWrap']),
                workspace: workspace,
                folders: folders
            });
            var actual1 = testObject.getConfiguration().inspect('editor.wordWrap');
            assert.equal(actual1.defaultValue, 'off');
            assert.equal(actual1.globalValue, 'on');
            assert.equal(actual1.workspaceValue, 'bounded');
            assert.equal(actual1.workspaceFolderValue, undefined);
            actual1 = testObject.getConfiguration('editor').inspect('wordWrap');
            assert.equal(actual1.defaultValue, 'off');
            assert.equal(actual1.globalValue, 'on');
            assert.equal(actual1.workspaceValue, 'bounded');
            assert.equal(actual1.workspaceFolderValue, undefined);
            actual1 = testObject.getConfiguration('editor').inspect('lineNumbers');
            assert.equal(actual1.defaultValue, 'on');
            assert.equal(actual1.globalValue, undefined);
            assert.equal(actual1.workspaceValue, undefined);
            assert.equal(actual1.workspaceFolderValue, undefined);
            var actual2 = testObject.getConfiguration(null, firstRoot).inspect('editor.wordWrap');
            assert.equal(actual2.defaultValue, 'off');
            assert.equal(actual2.globalValue, 'on');
            assert.equal(actual2.workspaceValue, 'bounded');
            assert.equal(actual2.workspaceFolderValue, 'off');
            actual2 = testObject.getConfiguration('editor', firstRoot).inspect('wordWrap');
            assert.equal(actual2.defaultValue, 'off');
            assert.equal(actual2.globalValue, 'on');
            assert.equal(actual2.workspaceValue, 'bounded');
            assert.equal(actual2.workspaceFolderValue, 'off');
            actual2 = testObject.getConfiguration('editor', firstRoot).inspect('lineNumbers');
            assert.equal(actual2.defaultValue, 'on');
            assert.equal(actual2.globalValue, undefined);
            assert.equal(actual2.workspaceValue, undefined);
            assert.equal(actual2.workspaceFolderValue, 'relative');
            actual2 = testObject.getConfiguration(null, secondRoot).inspect('editor.wordWrap');
            assert.equal(actual2.defaultValue, 'off');
            assert.equal(actual2.globalValue, 'on');
            assert.equal(actual2.workspaceValue, 'bounded');
            assert.equal(actual2.workspaceFolderValue, 'on');
            actual2 = testObject.getConfiguration('editor', secondRoot).inspect('wordWrap');
            assert.equal(actual2.defaultValue, 'off');
            assert.equal(actual2.globalValue, 'on');
            assert.equal(actual2.workspaceValue, 'bounded');
            assert.equal(actual2.workspaceFolderValue, 'on');
            actual2 = testObject.getConfiguration(null, thirdRoot).inspect('editor.wordWrap');
            assert.equal(actual2.defaultValue, 'off');
            assert.equal(actual2.globalValue, 'on');
            assert.equal(actual2.workspaceValue, 'bounded');
            assert.ok(Object.keys(actual2).indexOf('workspaceFolderValue') !== -1);
            assert.equal(actual2.workspaceFolderValue, undefined);
            actual2 = testObject.getConfiguration('editor', thirdRoot).inspect('wordWrap');
            assert.equal(actual2.defaultValue, 'off');
            assert.equal(actual2.globalValue, 'on');
            assert.equal(actual2.workspaceValue, 'bounded');
            assert.ok(Object.keys(actual2).indexOf('workspaceFolderValue') !== -1);
            assert.equal(actual2.workspaceFolderValue, undefined);
        });
        test('getConfiguration vs get', function () {
            var all = createExtHostConfiguration({
                'farboo': {
                    'config0': true,
                    'config4': 38
                }
            });
            var config = all.getConfiguration('farboo.config0');
            assert.equal(config.get(''), undefined);
            assert.equal(config.has(''), false);
            config = all.getConfiguration('farboo');
            assert.equal(config.get('config0'), true);
            assert.equal(config.has('config0'), true);
        });
        test('getConfiguration vs get', function () {
            var all = createExtHostConfiguration({
                'farboo': {
                    'config0': true,
                    'config4': 38
                }
            });
            var config = all.getConfiguration('farboo.config0');
            assert.equal(config.get(''), undefined);
            assert.equal(config.has(''), false);
            config = all.getConfiguration('farboo');
            assert.equal(config.get('config0'), true);
            assert.equal(config.has('config0'), true);
        });
        test('name vs property', function () {
            var all = createExtHostConfiguration({
                'farboo': {
                    'get': 'get-prop'
                }
            });
            var config = all.getConfiguration('farboo');
            assert.ok(config.has('get'));
            assert.equal(config.get('get'), 'get-prop');
            assert.deepEqual(config['get'], config.get);
            assert.throws(function () { return config['get'] = 'get-prop'; });
        });
        test('update: no target passes null', function () {
            var shape = new RecordingShape();
            var allConfig = createExtHostConfiguration({
                'foo': {
                    'bar': 1,
                    'far': 1
                }
            }, shape);
            var config = allConfig.getConfiguration('foo');
            config.update('bar', 42);
            assert.equal(shape.lastArgs[0], null);
        });
        test('update/section to key', function () {
            var shape = new RecordingShape();
            var allConfig = createExtHostConfiguration({
                'foo': {
                    'bar': 1,
                    'far': 1
                }
            }, shape);
            var config = allConfig.getConfiguration('foo');
            config.update('bar', 42, true);
            assert.equal(shape.lastArgs[0], configurationEditing_1.ConfigurationTarget.USER);
            assert.equal(shape.lastArgs[1], 'foo.bar');
            assert.equal(shape.lastArgs[2], 42);
            config = allConfig.getConfiguration('');
            config.update('bar', 42, true);
            assert.equal(shape.lastArgs[1], 'bar');
            config.update('foo.bar', 42, true);
            assert.equal(shape.lastArgs[1], 'foo.bar');
        });
        test('update, what is #15834', function () {
            var shape = new RecordingShape();
            var allConfig = createExtHostConfiguration({
                'editor': {
                    'formatOnSave': true
                }
            }, shape);
            allConfig.getConfiguration('editor').update('formatOnSave', { extensions: ['ts'] });
            assert.equal(shape.lastArgs[1], 'editor.formatOnSave');
            assert.deepEqual(shape.lastArgs[2], { extensions: ['ts'] });
        });
        test('update/error-state not OK', function () {
            var shape = new (function (_super) {
                __extends(class_5, _super);
                function class_5() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_5.prototype.$updateConfigurationOption = function (target, key, value) {
                    return winjs_base_1.TPromise.wrapError(new configurationEditing_1.ConfigurationEditingError('Unknown Key', configurationEditing_1.ConfigurationEditingErrorCode.ERROR_UNKNOWN_KEY)); // something !== OK
                };
                return class_5;
            }(mock_1.mock()));
            return createExtHostConfiguration({}, shape)
                .getConfiguration('')
                .update('', true, false)
                .then(function () { return assert.ok(false); }, function (err) { });
        });
    });
});
//# sourceMappingURL=extHostConfiguration.test.js.map