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
define(["require", "exports", "vs/platform/node/product", "vs/platform/environment/common/environment", "vs/platform/extensions/common/extensions", "vs/platform/instantiation/common/instantiation", "vs/platform/message/common/message", "vs/platform/lifecycle/common/lifecycle", "vs/platform/storage/common/storage", "vs/workbench/services/timer/common/timerService", "vs/platform/windows/common/windows", "vs/platform/telemetry/common/telemetry", "vs/workbench/common/contributions", "vs/platform/registry/common/platform", "vs/workbench/electron-browser/actions", "vs/base/common/winjs.base", "path", "vs/nls", "vs/base/common/event", "vs/base/common/platform", "vs/base/node/pfs", "os", "vs/base/node/profiler", "vs/base/node/id"], function (require, exports, product_1, environment_1, extensions_1, instantiation_1, message_1, lifecycle_1, storage_1, timerService_1, windows_1, telemetry_1, contributions_1, platform_1, actions_1, winjs_base_1, path_1, nls_1, event_1, platform_2, pfs_1, os_1, profiler_1, id_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ProfilingHint = (function () {
        function ProfilingHint(_windowsService, _timerService, _messageService, _envService, _storageService, _telemetryService) {
            var _this = this;
            this._windowsService = _windowsService;
            this._timerService = _timerService;
            this._messageService = _messageService;
            this._envService = _envService;
            this._storageService = _storageService;
            this._telemetryService = _telemetryService;
            setTimeout(function () { return _this._checkTimersAndSuggestToProfile(); }, 5000);
        }
        ProfilingHint.prototype.getId = function () {
            return 'performance.ProfilingHint';
        };
        ProfilingHint.prototype._checkTimersAndSuggestToProfile = function () {
            // Only initial startups, not when already profiling
            if (!this._timerService.isInitialStartup || this._envService.args['prof-startup']) {
                return;
            }
            // Check that we have some data about this
            // OS version to which we can compare this startup.
            // Then only go for startups between the 90 and
            // 95th percentile.
            if (!Array.isArray(ProfilingHint._myPercentiles)) {
                return;
            }
            var _a = ProfilingHint._myPercentiles, p80 = _a[0], p90 = _a[1];
            var ellapsed = this._timerService.startupMetrics.ellapsed;
            if (ellapsed < p80 || ellapsed > p90) {
                return;
            }
            // Ignore virtual machines and only ask users
            // to profile with a certain propability
            if (id_1.virtualMachineHint.value() >= .5 || Math.ceil(Math.random() * 1000) !== 1) {
                return;
            }
            // Don't ask for the stable version, only
            // ask once per version/build
            if (this._envService.appQuality === 'stable') {
                // don't ask in stable
                return;
            }
            var mementoKey = "performance.didPromptToProfile." + product_1.default.commit;
            var value = this._storageService.get(mementoKey, storage_1.StorageScope.GLOBAL, undefined);
            if (value !== undefined) {
                // only ask once per version
                return;
            }
            var profile = this._messageService.confirm({
                type: 'info',
                message: nls_1.localize('slow', "Slow startup detected"),
                detail: nls_1.localize('slow.detail', "Sorry that you just had a slow startup. Please restart '{0}' with profiling enabled, share the profiles with us, and we will work hard to make startup great again.", this._envService.appNameLong),
                primaryButton: 'Restart and profile'
            });
            this._telemetryService.publicLog('profileStartupInvite', {
                acceptedInvite: profile
            });
            if (profile) {
                this._storageService.store(mementoKey, 'didProfile', storage_1.StorageScope.GLOBAL);
                this._windowsService.relaunch({ addArgs: ['--prof-startup'] });
            }
            else {
                this._storageService.store(mementoKey, 'didReject', storage_1.StorageScope.GLOBAL);
            }
        };
        // p95 to p95 by os&release
        ProfilingHint._percentiles = (_a = {},
            _a['Windows_6.3.9600'] = [35782, 35782],
            _a['Windows_6.1.7601'] = [11160, 18366],
            _a['Windows_10.0.16199'] = [10423, 17222],
            _a['Windows_10.0.16193'] = [7503, 11033],
            _a['Windows_10.0.16188'] = [8544, 8807],
            _a['Windows_10.0.15063'] = [11085, 16837],
            _a['Windows_10.0.14393'] = [12585, 32662],
            _a['Windows_10.0.10586'] = [7047, 10944],
            _a['Windows_10.0.10240'] = [16176, 16176],
            _a['Mac_16.7.0'] = [2192, 4050],
            _a['Mac_16.6.0'] = [8043, 10608],
            _a['Mac_16.5.0'] = [4912, 11348],
            _a['Mac_16.4.0'] = [3900, 4200],
            _a['Mac_16.3.0'] = [7327, 7327],
            _a['Mac_16.1.0'] = [6090, 6555],
            _a['Mac_16.0.0'] = [32574, 32574],
            _a['Mac_15.6.0'] = [16082, 17469],
            _a['Linux_4.9.0-3-amd64'] = [2092, 2197],
            _a['Linux_4.9.0-2-amd64'] = [9779, 9779],
            _a['Linux_4.8.0-52-generic'] = [12803, 13257],
            _a['Linux_4.8.0-51-generic'] = [2670, 2797],
            _a['Linux_4.8.0-040800-generic'] = [3954, 3954],
            _a['Linux_4.4.0-78-generic'] = [4218, 5891],
            _a['Linux_4.4.0-77-generic'] = [6166, 6166],
            _a['Linux_4.11.2'] = [1323, 1323],
            _a['Linux_4.10.15-200.fc25.x86_64'] = [9270, 9480],
            _a['Linux_4.10.13-1-ARCH'] = [7116, 8511],
            _a['Linux_4.10.11-100.fc24.x86_64'] = [1845, 1845],
            _a['Linux_4.10.0-21-generic'] = [14805, 16050],
            _a['Linux_3.19.0-84-generic'] = [4840, 4840],
            _a['Linux_3.11.10-29-desktop'] = [1637, 2891],
            _a);
        ProfilingHint._myPercentiles = ProfilingHint._percentiles[platform_2.Platform[platform_2.platform] + "_" + os_1.release()];
        ProfilingHint = __decorate([
            __param(0, windows_1.IWindowsService),
            __param(1, timerService_1.ITimerService),
            __param(2, message_1.IMessageService),
            __param(3, environment_1.IEnvironmentService),
            __param(4, storage_1.IStorageService),
            __param(5, telemetry_1.ITelemetryService)
        ], ProfilingHint);
        return ProfilingHint;
    }());
    var StartupProfiler = (function () {
        function StartupProfiler(_windowsService, _messageService, _environmentService, _instantiationService, lifecycleService, extensionService) {
            var _this = this;
            this._windowsService = _windowsService;
            this._messageService = _messageService;
            this._environmentService = _environmentService;
            this._instantiationService = _instantiationService;
            // wait for everything to be ready
            winjs_base_1.TPromise.join([
                extensionService.onReady(),
                event_1.toPromise(event_1.filterEvent(lifecycleService.onDidChangePhase, function (phase) { return phase === lifecycle_1.LifecyclePhase.Running; })),
            ]).then(function () {
                _this._stopProfiling();
            });
        }
        StartupProfiler.prototype.getId = function () {
            return 'performance.StartupProfiler';
        };
        StartupProfiler.prototype._stopProfiling = function () {
            var _this = this;
            var profileStartup = this._environmentService.profileStartup;
            if (!profileStartup) {
                return;
            }
            profiler_1.stopProfiling(profileStartup.dir, profileStartup.prefix).then(function () {
                pfs_1.readdir(profileStartup.dir).then(function (files) {
                    return files.filter(function (value) { return value.indexOf(profileStartup.prefix) === 0; });
                }).then(function (files) {
                    var profileFiles = files.reduce(function (prev, cur) { return "" + prev + path_1.join(profileStartup.dir, cur) + "\n"; }, '\n');
                    var primaryButton = _this._messageService.confirm({
                        type: 'info',
                        message: nls_1.localize('prof.message', "Successfully created profiles."),
                        detail: nls_1.localize('prof.detail', "Please create an issue and manually attach the following files:\n{0}", profileFiles),
                        primaryButton: nls_1.localize('prof.restartAndFileIssue', "Create Issue and Restart"),
                        secondaryButton: nls_1.localize('prof.restart', "Restart")
                    });
                    if (primaryButton) {
                        var action = _this._instantiationService.createInstance(actions_1.ReportPerformanceIssueAction, actions_1.ReportPerformanceIssueAction.ID, actions_1.ReportPerformanceIssueAction.LABEL);
                        winjs_base_1.TPromise.join([
                            _this._windowsService.showItemInFolder(path_1.join(profileStartup.dir, files[0])),
                            action.run(":warning: Make sure to **attach** these files from your *home*-directory: :warning:\n" + files.map(function (file) { return "-`" + file + "`"; }).join('\n'))
                        ]).then(function () {
                            // keep window stable until restart is selected
                            _this._messageService.confirm({
                                type: 'info',
                                message: nls_1.localize('prof.thanks', "Thanks for helping us."),
                                detail: nls_1.localize('prof.detail.restart', "A final restart is required to continue to use '{0}'. Again, thank you for your contribution.", _this._environmentService.appNameLong),
                                primaryButton: nls_1.localize('prof.restart', "Restart"),
                                secondaryButton: null
                            });
                            // now we are ready to restart
                            _this._windowsService.relaunch({ removeArgs: ['--prof-startup'] });
                        });
                    }
                    else {
                        // simply restart
                        _this._windowsService.relaunch({ removeArgs: ['--prof-startup'] });
                    }
                });
            });
        };
        StartupProfiler = __decorate([
            __param(0, windows_1.IWindowsService),
            __param(1, message_1.IMessageService),
            __param(2, environment_1.IEnvironmentService),
            __param(3, instantiation_1.IInstantiationService),
            __param(4, lifecycle_1.ILifecycleService),
            __param(5, extensions_1.IExtensionService)
        ], StartupProfiler);
        return StartupProfiler;
    }());
    var registry = platform_1.Registry.as(contributions_1.Extensions.Workbench);
    registry.registerWorkbenchContribution(ProfilingHint);
    registry.registerWorkbenchContribution(StartupProfiler);
    var _a;
});
//# sourceMappingURL=performance.contribution.js.map