define(["require", "exports", "assert", "vs/platform/configuration/common/configuration", "vs/platform/configuration/common/configurationRegistry", "vs/platform/registry/common/platform"], function (require, exports, assert, configuration_1, configurationRegistry_1, platform_1) {
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
        test('simple merge', function () {
            var base = { 'a': 1, 'b': 2 };
            configuration_1.merge(base, { 'a': 3, 'c': 4 }, true);
            assert.deepEqual(base, { 'a': 3, 'b': 2, 'c': 4 });
            base = { 'a': 1, 'b': 2 };
            configuration_1.merge(base, { 'a': 3, 'c': 4 }, false);
            assert.deepEqual(base, { 'a': 1, 'b': 2, 'c': 4 });
        });
        test('Recursive merge', function () {
            var base = { 'a': { 'b': 1 } };
            configuration_1.merge(base, { 'a': { 'b': 2 } }, true);
            assert.deepEqual(base, { 'a': { 'b': 2 } });
        });
        test('simple merge using configuration', function () {
            var base = new configuration_1.ConfigurationModel({ 'a': 1, 'b': 2 });
            var add = new configuration_1.ConfigurationModel({ 'a': 3, 'c': 4 });
            var result = base.merge(add);
            assert.deepEqual(result.contents, { 'a': 3, 'b': 2, 'c': 4 });
        });
        test('Recursive merge using config models', function () {
            var base = new configuration_1.ConfigurationModel({ 'a': { 'b': 1 } });
            var add = new configuration_1.ConfigurationModel({ 'a': { 'b': 2 } });
            var result = base.merge(add);
            assert.deepEqual(result.contents, { 'a': { 'b': 2 } });
        });
        test('Test contents while getting an existing property', function () {
            var testObject = new configuration_1.ConfigurationModel({ 'a': 1 });
            assert.deepEqual(testObject.getContentsFor('a'), 1);
            testObject = new configuration_1.ConfigurationModel({ 'a': { 'b': 1 } });
            assert.deepEqual(testObject.getContentsFor('a'), { 'b': 1 });
        });
        test('Test contents are undefined for non existing properties', function () {
            var testObject = new configuration_1.ConfigurationModel({ awesome: true });
            assert.deepEqual(testObject.getContentsFor('unknownproperty'), undefined);
        });
        test('Test override gives all content merged with overrides', function () {
            var testObject = new configuration_1.ConfigurationModel({ 'a': 1, 'c': 1 }, [], [{ identifiers: ['b'], contents: { 'a': 2 } }]);
            assert.deepEqual(testObject.override('b').contents, { 'a': 2, 'c': 1 });
        });
    });
});
//# sourceMappingURL=configuration.test.js.map