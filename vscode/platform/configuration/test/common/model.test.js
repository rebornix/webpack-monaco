define(["require", "exports", "assert", "vs/platform/configuration/common/model", "vs/platform/configuration/common/configurationRegistry", "vs/platform/registry/common/platform"], function (require, exports, assert, model_1, configurationRegistry_1, platform_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('Configuration', function () {
        suiteSetup(function () {
            platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).registerConfiguration({
                'id': 'a',
                'order': 1,
                'title': 'a',
                'type': 'object',
                'properties': {
                    'a': {
                        'description': 'a',
                        'type': 'boolean',
                        'default': true,
                        'overridable': true
                    }
                }
            });
        });
        test('simple merge using models', function () {
            var base = new model_1.CustomConfigurationModel(JSON.stringify({ 'a': 1, 'b': 2 }));
            var add = new model_1.CustomConfigurationModel(JSON.stringify({ 'a': 3, 'c': 4 }));
            var result = base.merge(add);
            assert.deepEqual(result.contents, { 'a': 3, 'b': 2, 'c': 4 });
        });
        test('simple merge with an undefined contents', function () {
            var base = new model_1.CustomConfigurationModel(JSON.stringify({ 'a': 1, 'b': 2 }));
            var add = new model_1.CustomConfigurationModel(null);
            var result = base.merge(add);
            assert.deepEqual(result.contents, { 'a': 1, 'b': 2 });
            base = new model_1.CustomConfigurationModel(null);
            add = new model_1.CustomConfigurationModel(JSON.stringify({ 'a': 1, 'b': 2 }));
            result = base.merge(add);
            assert.deepEqual(result.contents, { 'a': 1, 'b': 2 });
            base = new model_1.CustomConfigurationModel(null);
            add = new model_1.CustomConfigurationModel(null);
            result = base.merge(add);
            assert.deepEqual(result.contents, {});
        });
        test('Recursive merge using config models', function () {
            var base = new model_1.CustomConfigurationModel(JSON.stringify({ 'a': { 'b': 1 } }));
            var add = new model_1.CustomConfigurationModel(JSON.stringify({ 'a': { 'b': 2 } }));
            var result = base.merge(add);
            assert.deepEqual(result.contents, { 'a': { 'b': 2 } });
        });
        test('Test contents while getting an existing property', function () {
            var testObject = new model_1.CustomConfigurationModel(JSON.stringify({ 'a': 1 }));
            assert.deepEqual(testObject.getContentsFor('a'), 1);
            testObject = new model_1.CustomConfigurationModel(JSON.stringify({ 'a': { 'b': 1 } }));
            assert.deepEqual(testObject.getContentsFor('a'), { 'b': 1 });
        });
        test('Test contents are undefined for non existing properties', function () {
            var testObject = new model_1.CustomConfigurationModel(JSON.stringify({
                awesome: true
            }));
            assert.deepEqual(testObject.getContentsFor('unknownproperty'), undefined);
        });
        test('Test contents are undefined for undefined config', function () {
            var testObject = new model_1.CustomConfigurationModel(null);
            assert.deepEqual(testObject.getContentsFor('unknownproperty'), undefined);
        });
        test('Test configWithOverrides gives all content merged with overrides', function () {
            var testObject = new model_1.CustomConfigurationModel(JSON.stringify({ 'a': 1, 'c': 1, '[b]': { 'a': 2 } }));
            assert.deepEqual(testObject.override('b').contents, { 'a': 2, 'c': 1, '[b]': { 'a': 2 } });
        });
        test('Test configWithOverrides gives empty contents', function () {
            var testObject = new model_1.CustomConfigurationModel(null);
            assert.deepEqual(testObject.override('b').contents, {});
        });
        test('Test update with empty data', function () {
            var testObject = new model_1.CustomConfigurationModel();
            testObject.update('');
            assert.deepEqual(testObject.contents, {});
            assert.deepEqual(testObject.keys, []);
            testObject.update(null);
            assert.deepEqual(testObject.contents, {});
            assert.deepEqual(testObject.keys, []);
            testObject.update(undefined);
            assert.deepEqual(testObject.contents, {});
            assert.deepEqual(testObject.keys, []);
        });
        test('Test registering the same property again', function () {
            platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).registerConfiguration({
                'id': 'a',
                'order': 1,
                'title': 'a',
                'type': 'object',
                'properties': {
                    'a': {
                        'description': 'a',
                        'type': 'boolean',
                        'default': false,
                    }
                }
            });
            assert.equal(true, new model_1.DefaultConfigurationModel().getContentsFor('a'));
        });
        test('Test registering the language property', function () {
            platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).registerConfiguration({
                'id': '[a]',
                'order': 1,
                'title': 'a',
                'type': 'object',
                'properties': {
                    '[a]': {
                        'description': 'a',
                        'type': 'boolean',
                        'default': false,
                    }
                }
            });
            assert.equal(undefined, new model_1.DefaultConfigurationModel().getContentsFor('[a]'));
        });
    });
});
//# sourceMappingURL=model.test.js.map