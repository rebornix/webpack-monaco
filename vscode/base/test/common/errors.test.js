define(["require", "exports", "assert", "vs/base/common/errorMessage"], function (require, exports, assert, errorMessage_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('Errors', function () {
        test('Get Error Message', function () {
            assert.strictEqual(errorMessage_1.toErrorMessage('Foo Bar'), 'Foo Bar');
            assert.strictEqual(errorMessage_1.toErrorMessage(new Error('Foo Bar')), 'Foo Bar');
            var error = new Error();
            error.status = 404;
            error.statusText = 'Not Found';
            assert.strictEqual(errorMessage_1.toErrorMessage(error), 'Not Found (HTTP 404)');
            error = new Error();
            error.detail = {};
            error.detail.exception = {};
            error.detail.exception.message = 'Foo Bar';
            assert.strictEqual(errorMessage_1.toErrorMessage(error), 'Foo Bar');
            error = new Error();
            error.detail = {};
            error.detail.error = {};
            error.detail.error.status = 404;
            error.detail.error.statusText = 'Not Found';
            assert.strictEqual(errorMessage_1.toErrorMessage(error), 'Not Found (HTTP 404)');
            error = new Error();
            error.detail = {};
            error.detail.error = [];
            var foo = {};
            error.detail.error.push(foo);
            foo.status = 404;
            foo.statusText = 'Not Found';
            assert.strictEqual(errorMessage_1.toErrorMessage(error), 'Not Found (HTTP 404)');
            assert(errorMessage_1.toErrorMessage());
            assert(errorMessage_1.toErrorMessage(null));
            assert(errorMessage_1.toErrorMessage({}));
        });
    });
});
//# sourceMappingURL=errors.test.js.map