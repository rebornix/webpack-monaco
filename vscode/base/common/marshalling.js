define(["require", "exports", "vs/base/common/uri"], function (require, exports, uri_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function stringify(obj) {
        return JSON.stringify(obj, replacer);
    }
    exports.stringify = stringify;
    function parse(text) {
        return JSON.parse(text, reviver);
    }
    exports.parse = parse;
    function replacer(key, value) {
        // URI is done via toJSON-member
        if (value instanceof RegExp) {
            return {
                $mid: 2,
                source: value.source,
                flags: (value.global ? 'g' : '') + (value.ignoreCase ? 'i' : '') + (value.multiline ? 'm' : ''),
            };
        }
        return value;
    }
    function reviver(key, value) {
        var marshallingConst;
        if (value !== void 0 && value !== null) {
            marshallingConst = value.$mid;
        }
        switch (marshallingConst) {
            case 1: return uri_1.default.revive(value);
            case 2: return new RegExp(value.source, value.flags);
            default: return value;
        }
    }
});
//# sourceMappingURL=marshalling.js.map