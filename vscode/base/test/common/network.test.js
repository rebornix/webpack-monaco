define(["require", "exports", "assert", "vs/base/common/uri"], function (require, exports, assert, uri_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function assertUrl(raw, scheme, domain, port, path, queryString, fragmentId) {
        // check for equivalent behaviour
        var uri = uri_1.default.parse(raw);
        assert.equal(uri.scheme, scheme);
        assert.equal(uri.authority, port ? domain + ':' + port : domain);
        assert.equal(uri.path, path);
        assert.equal(uri.query, queryString);
        assert.equal(uri.fragment, fragmentId);
    }
    suite('Network', function () {
        test('urls', function () {
            assertUrl('http://www.test.com:8000/this/that/theother.html?query=foo#hash', 'http', 'www.test.com', '8000', '/this/that/theother.html', 'query=foo', 'hash');
            assertUrl('http://www.test.com:8000/this/that/theother.html?query=foo', 'http', 'www.test.com', '8000', '/this/that/theother.html', 'query=foo', '');
            assertUrl('http://www.test.com:8000/this/that/theother.html#hash', 'http', 'www.test.com', '8000', '/this/that/theother.html', '', 'hash');
            assertUrl('http://www.test.com:8000/#hash', 'http', 'www.test.com', '8000', '/', '', 'hash');
            assertUrl('http://www.test.com:8000#hash', 'http', 'www.test.com', '8000', '', '', 'hash');
            assertUrl('http://www.test.com/#hash', 'http', 'www.test.com', '', '/', '', 'hash');
            assertUrl('http://www.test.com#hash', 'http', 'www.test.com', '', '', '', 'hash');
            assertUrl('http://www.test.com:8000/this/that/theother.html', 'http', 'www.test.com', '8000', '/this/that/theother.html', '', '');
            assertUrl('http://www.test.com:8000/', 'http', 'www.test.com', '8000', '/', '', '');
            assertUrl('http://www.test.com:8000', 'http', 'www.test.com', '8000', '', '', '');
            assertUrl('http://www.test.com/', 'http', 'www.test.com', '', '/', '', '');
            assertUrl('//www.test.com/', '', 'www.test.com', '', '/', '', '');
            assertUrl('//www.test.com:8000/this/that/theother.html?query=foo#hash', '', 'www.test.com', '8000', '/this/that/theother.html', 'query=foo', 'hash');
            assertUrl('//www.test.com/this/that/theother.html?query=foo#hash', '', 'www.test.com', '', '/this/that/theother.html', 'query=foo', 'hash');
            assertUrl('https://www.test.com:8000/this/that/theother.html?query=foo#hash', 'https', 'www.test.com', '8000', '/this/that/theother.html', 'query=foo', 'hash');
            assertUrl('f12://www.test.com:8000/this/that/theother.html?query=foo#hash', 'f12', 'www.test.com', '8000', '/this/that/theother.html', 'query=foo', 'hash');
            assertUrl('inmemory://model/0', 'inmemory', 'model', '', '/0', '', '');
            assertUrl('file:///c/far/boo/file.cs', 'file', '', '', '/c/far/boo/file.cs', '', '');
        });
    });
});
//# sourceMappingURL=network.test.js.map