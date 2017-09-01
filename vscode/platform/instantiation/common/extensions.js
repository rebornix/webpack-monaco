define(["require", "exports", "./descriptors"], function (require, exports, descriptors_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Services = 'di.services';
    var _registry = [];
    function registerSingleton(id, ctor) {
        _registry.push({ id: id, descriptor: new descriptors_1.SyncDescriptor(ctor) });
    }
    exports.registerSingleton = registerSingleton;
    function getServices() {
        return _registry;
    }
    exports.getServices = getServices;
});
//# sourceMappingURL=extensions.js.map