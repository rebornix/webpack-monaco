define(["require", "exports", "vs/nls", "vs/platform/configuration/common/configurationRegistry", "vs/platform/registry/common/platform", "vs/platform/instantiation/common/instantiation"], function (require, exports, nls, configurationRegistry_1, platform_1, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ICrashReporterService = instantiation_1.createDecorator('crashReporterService');
    exports.TELEMETRY_SECTION_ID = 'telemetry';
    var configurationRegistry = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration);
    configurationRegistry.registerConfiguration({
        'id': exports.TELEMETRY_SECTION_ID,
        'order': 110,
        title: nls.localize('telemetryConfigurationTitle', "Telemetry"),
        'type': 'object',
        'properties': {
            'telemetry.enableCrashReporter': {
                'type': 'boolean',
                'description': nls.localize('telemetry.enableCrashReporting', "Enable crash reports to be sent to Microsoft.\nThis option requires restart to take effect."),
                'default': true
            }
        }
    });
    exports.NullCrashReporterService = {
        _serviceBrand: undefined,
        getChildProcessStartOptions: function (processName) { return undefined; }
    };
});
//# sourceMappingURL=crashReporterService.js.map