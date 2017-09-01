/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/winjs.base"], function (require, exports, winjs_base_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TelemetryAppenderChannel = (function () {
        function TelemetryAppenderChannel(appender) {
            this.appender = appender;
        }
        TelemetryAppenderChannel.prototype.call = function (command, _a) {
            var eventName = _a.eventName, data = _a.data;
            this.appender.log(eventName, data);
            return winjs_base_1.TPromise.as(null);
        };
        return TelemetryAppenderChannel;
    }());
    exports.TelemetryAppenderChannel = TelemetryAppenderChannel;
    var TelemetryAppenderClient = (function () {
        function TelemetryAppenderClient(channel) {
            this.channel = channel;
        }
        TelemetryAppenderClient.prototype.log = function (eventName, data) {
            return this.channel.call('log', { eventName: eventName, data: data });
        };
        TelemetryAppenderClient.prototype.dispose = function () {
            // TODO
        };
        return TelemetryAppenderClient;
    }());
    exports.TelemetryAppenderClient = TelemetryAppenderClient;
});
//# sourceMappingURL=telemetryIpc.js.map