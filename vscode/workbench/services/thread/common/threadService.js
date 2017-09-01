define(["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ProxyIdentifier = (function () {
        function ProxyIdentifier(isMain, id) {
            this.isMain = isMain;
            this.id = id;
        }
        return ProxyIdentifier;
    }());
    exports.ProxyIdentifier = ProxyIdentifier;
    function createMainContextProxyIdentifier(identifier) {
        return new ProxyIdentifier(true, 'm' + identifier);
    }
    exports.createMainContextProxyIdentifier = createMainContextProxyIdentifier;
    function createExtHostContextProxyIdentifier(identifier) {
        return new ProxyIdentifier(false, 'e' + identifier);
    }
    exports.createExtHostContextProxyIdentifier = createExtHostContextProxyIdentifier;
});
//# sourceMappingURL=threadService.js.map