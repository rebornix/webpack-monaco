define(["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var IdGenerator = (function () {
        function IdGenerator(prefix) {
            this._prefix = prefix;
            this._lastId = 0;
        }
        IdGenerator.prototype.nextId = function () {
            return this._prefix + (++this._lastId);
        };
        return IdGenerator;
    }());
    exports.IdGenerator = IdGenerator;
    exports.defaultGenerator = new IdGenerator('id#');
});
//# sourceMappingURL=idGenerator.js.map