/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/nls", "vs/base/common/strings", "vs/platform/instantiation/common/instantiation", "vs/platform/configuration/common/configuration", "vs/platform/configuration/common/configurationRegistry", "vs/base/common/winjs.base", "vs/base/common/lifecycle", "vs/base/common/objects", "vs/platform/registry/common/platform"], function (require, exports, nls_1, strings_1, instantiation_1, configuration_1, configurationRegistry_1, winjs_base_1, lifecycle_1, objects_1, platform_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TelemetryService = (function () {
        function TelemetryService(config, _configurationService) {
            this._configurationService = _configurationService;
            this._disposables = [];
            this._cleanupPatterns = [];
            this._appender = config.appender;
            this._commonProperties = config.commonProperties || winjs_base_1.TPromise.as({});
            this._piiPaths = config.piiPaths || [];
            this._userOptIn = typeof config.userOptIn === 'undefined' ? true : config.userOptIn;
            // static cleanup patterns for:
            // #1 `file:///DANGEROUS/PATH/resources/app/Useful/Information`
            // #2 // Any other file path that doesn't match the approved form above should be cleaned.
            // #3 "Error: ENOENT; no such file or directory" is often followed with PII, clean it
            this._cleanupPatterns.push([/file:\/\/\/.*?\/resources\/app\//gi, ''], [/file:\/\/\/.*/gi, ''], [/ENOENT: no such file or directory.*?\'([^\']+)\'/gi, 'ENOENT: no such file or directory']);
            for (var _i = 0, _a = this._piiPaths; _i < _a.length; _i++) {
                var piiPath = _a[_i];
                this._cleanupPatterns.push([new RegExp(strings_1.escapeRegExpCharacters(piiPath), 'gi'), '']);
            }
            if (this._configurationService) {
                this._updateUserOptIn();
                this._configurationService.onDidUpdateConfiguration(this._updateUserOptIn, this, this._disposables);
                this.publicLog('optInStatus', { optIn: this._userOptIn });
            }
        }
        TelemetryService.prototype._updateUserOptIn = function () {
            var config = this._configurationService.getConfiguration(TELEMETRY_SECTION_ID);
            this._userOptIn = config ? config.enableTelemetry : this._userOptIn;
        };
        Object.defineProperty(TelemetryService.prototype, "isOptedIn", {
            get: function () {
                return this._userOptIn;
            },
            enumerable: true,
            configurable: true
        });
        TelemetryService.prototype.getTelemetryInfo = function () {
            return this._commonProperties.then(function (values) {
                // well known properties
                var sessionId = values['sessionID'];
                var instanceId = values['common.instanceId'];
                var machineId = values['common.machineId'];
                return { sessionId: sessionId, instanceId: instanceId, machineId: machineId };
            });
        };
        TelemetryService.prototype.dispose = function () {
            this._disposables = lifecycle_1.dispose(this._disposables);
        };
        TelemetryService.prototype.publicLog = function (eventName, data) {
            var _this = this;
            // don't send events when the user is optout
            if (!this._userOptIn) {
                return winjs_base_1.TPromise.as(undefined);
            }
            return this._commonProperties.then(function (values) {
                // (first) add common properties
                data = objects_1.mixin(data, values);
                // (last) remove all PII from data
                data = objects_1.cloneAndChange(data, function (value) {
                    if (typeof value === 'string') {
                        return _this._cleanupInfo(value);
                    }
                    return undefined;
                });
                _this._appender.log(eventName, data);
            }, function (err) {
                // unsure what to do now...
                console.error(err);
            });
        };
        TelemetryService.prototype._cleanupInfo = function (stack) {
            // sanitize with configured cleanup patterns
            for (var _i = 0, _a = this._cleanupPatterns; _i < _a.length; _i++) {
                var tuple = _a[_i];
                var regexp = tuple[0], replaceValue = tuple[1];
                stack = stack.replace(regexp, replaceValue);
            }
            return stack;
        };
        TelemetryService.IDLE_START_EVENT_NAME = 'UserIdleStart';
        TelemetryService.IDLE_STOP_EVENT_NAME = 'UserIdleStop';
        TelemetryService = __decorate([
            __param(1, instantiation_1.optional(configuration_1.IConfigurationService))
        ], TelemetryService);
        return TelemetryService;
    }());
    exports.TelemetryService = TelemetryService;
    var TELEMETRY_SECTION_ID = 'telemetry';
    platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).registerConfiguration({
        'id': TELEMETRY_SECTION_ID,
        'order': 110,
        'type': 'object',
        'title': nls_1.localize('telemetryConfigurationTitle', "Telemetry"),
        'properties': {
            'telemetry.enableTelemetry': {
                'type': 'boolean',
                'description': nls_1.localize('telemetry.enableTelemetry', "Enable usage data and errors to be sent to Microsoft."),
                'default': true
            }
        }
    });
});
//# sourceMappingURL=telemetryService.js.map