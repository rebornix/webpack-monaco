define(["require", "exports", "vs/nls", "vs/platform/instantiation/common/instantiation", "vs/platform/configuration/common/configurationRegistry", "vs/platform/registry/common/platform"], function (require, exports, nls_1, instantiation_1, configurationRegistry_1, platform_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IRequestService = instantiation_1.createDecorator('requestService2');
    platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration)
        .registerConfiguration({
        id: 'http',
        order: 15,
        title: nls_1.localize('httpConfigurationTitle', "HTTP"),
        type: 'object',
        properties: {
            'http.proxy': {
                type: 'string',
                pattern: '^https?://([^:]*(:[^@]*)?@)?([^:]+)(:\\d+)?/?$|^$',
                description: nls_1.localize('proxy', "The proxy setting to use. If not set will be taken from the http_proxy and https_proxy environment variables")
            },
            'http.proxyStrictSSL': {
                type: 'boolean',
                default: true,
                description: nls_1.localize('strictSSL', "Whether the proxy server certificate should be verified against the list of supplied CAs.")
            },
            'http.proxyAuthorization': {
                type: ['null', 'string'],
                default: null,
                description: nls_1.localize('proxyAuthorization', "The value to send as the 'Proxy-Authorization' header for every network request.")
            }
        }
    });
});
//# sourceMappingURL=request.js.map