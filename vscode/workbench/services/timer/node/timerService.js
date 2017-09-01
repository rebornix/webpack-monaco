define(["require", "exports", "vs/base/node/id", "vs/base/node/startupTimers", "os"], function (require, exports, id_1, startupTimers_1, os) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TimerService = (function () {
        function TimerService(initData, isEmptyWorkbench) {
            this.isEmptyWorkbench = isEmptyWorkbench;
            this.start = initData.start;
            this.appReady = initData.appReady;
            this.windowLoad = initData.windowLoad;
            this.beforeLoadWorkbenchMain = initData.beforeLoadWorkbenchMain;
            this.afterLoadWorkbenchMain = initData.afterLoadWorkbenchMain;
            this.isInitialStartup = initData.isInitialStartup;
            this.hasAccessibilitySupport = initData.hasAccessibilitySupport;
        }
        Object.defineProperty(TimerService.prototype, "startupMetrics", {
            get: function () {
                if (!this._startupMetrics) {
                    this._computeStartupMetrics();
                }
                return this._startupMetrics;
            },
            enumerable: true,
            configurable: true
        });
        TimerService.prototype._computeStartupMetrics = function () {
            var now = Date.now();
            var initialStartup = !!this.isInitialStartup;
            var start = initialStartup ? this.start : this.windowLoad;
            var totalmem;
            var freemem;
            var cpus;
            var platform;
            var release;
            var arch;
            var loadavg;
            var meminfo;
            var isVMLikelyhood;
            try {
                totalmem = os.totalmem();
                freemem = os.freemem();
                platform = os.platform();
                release = os.release();
                arch = os.arch();
                loadavg = os.loadavg();
                meminfo = process.getProcessMemoryInfo();
                isVMLikelyhood = Math.round((id_1.virtualMachineHint.value() * 100));
                var rawCpus = os.cpus();
                if (rawCpus && rawCpus.length > 0) {
                    cpus = { count: rawCpus.length, speed: rawCpus[0].speed, model: rawCpus[0].model };
                }
            }
            catch (error) {
                console.error(error); // be on the safe side with these hardware method calls
            }
            // fill in startup timers we have until now
            var timers2 = Object.create(null);
            for (var _i = 0, _a = startupTimers_1.ticks(); _i < _a.length; _i++) {
                var tick = _a[_i];
                timers2[tick.name] = tick.duration;
            }
            this._startupMetrics = {
                version: 1,
                ellapsed: this.workbenchStarted - start,
                timers: {
                    ellapsedExtensions: this.afterExtensionLoad - this.beforeExtensionLoad,
                    ellapsedExtensionsReady: this.afterExtensionLoad - start,
                    ellapsedRequire: this.afterLoadWorkbenchMain - this.beforeLoadWorkbenchMain,
                    ellapsedViewletRestore: this.restoreViewletDuration,
                    ellapsedEditorRestore: this.restoreEditorsDuration,
                    ellapsedWorkbench: this.workbenchStarted - this.beforeWorkbenchOpen,
                    ellapsedWindowLoadToRequire: this.beforeLoadWorkbenchMain - this.windowLoad,
                    ellapsedTimersToTimersComputed: Date.now() - now
                },
                timers2: timers2,
                platform: platform,
                release: release,
                arch: arch,
                totalmem: totalmem,
                freemem: freemem,
                meminfo: meminfo,
                cpus: cpus,
                loadavg: loadavg,
                initialStartup: initialStartup,
                isVMLikelyhood: isVMLikelyhood,
                hasAccessibilitySupport: !!this.hasAccessibilitySupport,
                emptyWorkbench: this.isEmptyWorkbench
            };
            if (initialStartup) {
                this._startupMetrics.timers.ellapsedAppReady = this.appReady - this.start;
                this._startupMetrics.timers.ellapsedWindowLoad = this.windowLoad - this.appReady;
            }
        };
        return TimerService;
    }());
    exports.TimerService = TimerService;
});
//# sourceMappingURL=timerService.js.map