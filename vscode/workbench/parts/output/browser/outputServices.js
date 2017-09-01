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
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/strings", "vs/base/common/event", "vs/base/common/arrays", "vs/base/common/uri", "vs/base/common/lifecycle", "vs/platform/instantiation/common/instantiation", "vs/platform/storage/common/storage", "vs/platform/registry/common/platform", "vs/workbench/common/editor", "vs/workbench/parts/output/common/output", "vs/workbench/services/panel/common/panelService", "vs/editor/common/services/modelService", "vs/platform/workspace/common/workspace", "vs/workbench/parts/output/common/outputLinkProvider", "vs/editor/common/services/resolverService", "vs/editor/common/services/modeService", "vs/base/common/async", "vs/editor/common/core/editOperation", "vs/editor/common/core/position"], function (require, exports, winjs_base_1, strings, event_1, arrays_1, uri_1, lifecycle_1, instantiation_1, storage_1, platform_1, editor_1, output_1, panelService_1, modelService_1, workspace_1, outputLinkProvider_1, resolverService_1, modeService_1, async_1, editOperation_1, position_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OUTPUT_ACTIVE_CHANNEL_KEY = 'output.activechannel';
    var BufferedContent = (function () {
        function BufferedContent() {
            this.data = [];
            this.dataIds = [];
            this.idPool = 0;
            this.length = 0;
        }
        BufferedContent.prototype.append = function (content) {
            this.data.push(content);
            this.dataIds.push(++this.idPool);
            this.length += content.length;
            this.trim();
        };
        BufferedContent.prototype.clear = function () {
            this.data.length = 0;
            this.dataIds.length = 0;
            this.length = 0;
        };
        BufferedContent.prototype.trim = function () {
            if (this.length < output_1.MAX_OUTPUT_LENGTH * 1.2) {
                return;
            }
            while (this.length > output_1.MAX_OUTPUT_LENGTH) {
                this.dataIds.shift();
                var removed = this.data.shift();
                this.length -= removed.length;
            }
        };
        BufferedContent.prototype.getDelta = function (previousDelta) {
            var idx = -1;
            if (previousDelta) {
                idx = arrays_1.binarySearch(this.dataIds, previousDelta.id, function (a, b) { return a - b; });
            }
            var id = this.idPool;
            if (idx >= 0) {
                var value = strings.removeAnsiEscapeCodes(this.data.slice(idx + 1).join(''));
                return { value: value, id: id, append: true };
            }
            else {
                var value = strings.removeAnsiEscapeCodes(this.data.join(''));
                return { value: value, id: id };
            }
        };
        return BufferedContent;
    }());
    exports.BufferedContent = BufferedContent;
    var OutputService = (function () {
        function OutputService(storageService, instantiationService, panelService, contextService, modelService, textModelResolverService) {
            this.storageService = storageService;
            this.instantiationService = instantiationService;
            this.panelService = panelService;
            this.receivedOutput = new Map();
            this.channels = new Map();
            this._onOutput = new event_1.Emitter();
            this._onOutputChannel = new event_1.Emitter();
            this._onActiveOutputChannel = new event_1.Emitter();
            var channels = this.getChannels();
            this.activeChannelId = this.storageService.get(OUTPUT_ACTIVE_CHANNEL_KEY, storage_1.StorageScope.WORKSPACE, channels && channels.length > 0 ? channels[0].id : null);
            this._outputLinkDetector = instantiationService.createInstance(outputLinkProvider_1.OutputLinkProvider);
            this._outputContentProvider = instantiationService.createInstance(OutputContentProvider, this);
            // Register as text model content provider for output
            textModelResolverService.registerTextModelContentProvider(output_1.OUTPUT_SCHEME, this._outputContentProvider);
        }
        Object.defineProperty(OutputService.prototype, "onOutput", {
            get: function () {
                return this._onOutput.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OutputService.prototype, "onOutputChannel", {
            get: function () {
                return this._onOutputChannel.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OutputService.prototype, "onActiveOutputChannel", {
            get: function () {
                return this._onActiveOutputChannel.event;
            },
            enumerable: true,
            configurable: true
        });
        OutputService.prototype.getChannel = function (id) {
            var _this = this;
            if (!this.channels.has(id)) {
                var channelData = platform_1.Registry.as(output_1.Extensions.OutputChannels).getChannel(id);
                var self_1 = this;
                this.channels.set(id, {
                    id: id,
                    label: channelData ? channelData.label : id,
                    getOutput: function (before) {
                        return self_1.getOutput(id, before);
                    },
                    get scrollLock() {
                        return self_1._outputContentProvider.scrollLock(id);
                    },
                    set scrollLock(value) {
                        self_1._outputContentProvider.setScrollLock(id, value);
                    },
                    append: function (output) { return _this.append(id, output); },
                    show: function (preserveFocus) { return _this.showOutput(id, preserveFocus); },
                    clear: function () { return _this.clearOutput(id); },
                    dispose: function () { return _this.removeOutput(id); }
                });
            }
            return this.channels.get(id);
        };
        OutputService.prototype.getChannels = function () {
            return platform_1.Registry.as(output_1.Extensions.OutputChannels).getChannels();
        };
        OutputService.prototype.append = function (channelId, output) {
            // Initialize
            if (!this.receivedOutput.has(channelId)) {
                this.receivedOutput.set(channelId, new BufferedContent());
                this._onOutputChannel.fire(channelId); // emit event that we have a new channel
            }
            // Store
            if (output) {
                var channel = this.receivedOutput.get(channelId);
                channel.append(output);
            }
            this._onOutput.fire({ channelId: channelId, isClear: false });
        };
        OutputService.prototype.getActiveChannel = function () {
            return this.getChannel(this.activeChannelId);
        };
        OutputService.prototype.getOutput = function (channelId, previousDelta) {
            if (this.receivedOutput.has(channelId)) {
                return this.receivedOutput.get(channelId).getDelta(previousDelta);
            }
            return undefined;
        };
        OutputService.prototype.clearOutput = function (channelId) {
            if (this.receivedOutput.has(channelId)) {
                this.receivedOutput.get(channelId).clear();
                this._onOutput.fire({ channelId: channelId, isClear: true });
            }
        };
        OutputService.prototype.removeOutput = function (channelId) {
            this.receivedOutput.delete(channelId);
            platform_1.Registry.as(output_1.Extensions.OutputChannels).removeChannel(channelId);
            if (this.activeChannelId === channelId) {
                var channels = this.getChannels();
                this.activeChannelId = channels.length ? channels[0].id : undefined;
                if (this._outputPanel && this.activeChannelId) {
                    this._outputPanel.setInput(output_1.OutputEditors.getInstance(this.instantiationService, this.getChannel(this.activeChannelId)), editor_1.EditorOptions.create({ preserveFocus: true }));
                }
                this._onActiveOutputChannel.fire(this.activeChannelId);
            }
            this._onOutputChannel.fire(channelId);
        };
        OutputService.prototype.showOutput = function (channelId, preserveFocus) {
            var _this = this;
            var panel = this.panelService.getActivePanel();
            if (this.activeChannelId === channelId && panel && panel.getId() === output_1.OUTPUT_PANEL_ID) {
                return winjs_base_1.TPromise.as(panel);
            }
            this.activeChannelId = channelId;
            this.storageService.store(OUTPUT_ACTIVE_CHANNEL_KEY, this.activeChannelId, storage_1.StorageScope.WORKSPACE);
            this._onActiveOutputChannel.fire(channelId); // emit event that a new channel is active
            return this.panelService.openPanel(output_1.OUTPUT_PANEL_ID, !preserveFocus).then(function (outputPanel) {
                _this._outputPanel = outputPanel;
                return outputPanel && outputPanel.setInput(output_1.OutputEditors.getInstance(_this.instantiationService, _this.getChannel(_this.activeChannelId)), editor_1.EditorOptions.create({ preserveFocus: preserveFocus })).
                    then(function () { return outputPanel; });
            });
        };
        OutputService = __decorate([
            __param(0, storage_1.IStorageService),
            __param(1, instantiation_1.IInstantiationService),
            __param(2, panelService_1.IPanelService),
            __param(3, workspace_1.IWorkspaceContextService),
            __param(4, modelService_1.IModelService),
            __param(5, resolverService_1.ITextModelService)
        ], OutputService);
        return OutputService;
    }());
    exports.OutputService = OutputService;
    var OutputContentProvider = (function () {
        function OutputContentProvider(outputService, modelService, modeService, panelService) {
            this.outputService = outputService;
            this.modelService = modelService;
            this.modeService = modeService;
            this.panelService = panelService;
            this.bufferedOutput = new Map();
            this.channelIdsWithScrollLock = new Set();
            this.appendOutputScheduler = Object.create(null);
            this.toDispose = [];
            this.registerListeners();
        }
        OutputContentProvider.prototype.registerListeners = function () {
            var _this = this;
            this.toDispose.push(this.outputService.onOutput(function (e) { return _this.onOutputReceived(e); }));
            this.toDispose.push(this.outputService.onActiveOutputChannel(function (channel) { return _this.scheduleOutputAppend(channel); }));
            this.toDispose.push(this.panelService.onDidPanelOpen(function (panel) {
                if (panel.getId() === output_1.OUTPUT_PANEL_ID) {
                    _this.appendOutput();
                }
            }));
        };
        OutputContentProvider.prototype.onOutputReceived = function (e) {
            var model = this.getModel(e.channelId);
            if (!model) {
                return; // only react if we have a known model
            }
            // Append to model
            if (e.isClear) {
                model.setValue('');
            }
            else {
                this.scheduleOutputAppend(e.channelId);
            }
        };
        OutputContentProvider.prototype.getModel = function (channel) {
            return this.modelService.getModel(uri_1.default.from({ scheme: output_1.OUTPUT_SCHEME, path: channel }));
        };
        OutputContentProvider.prototype.scheduleOutputAppend = function (channel) {
            var _this = this;
            if (!this.isVisible(channel)) {
                return; // only if the output channel is visible
            }
            var scheduler = this.appendOutputScheduler[channel];
            if (!scheduler) {
                scheduler = new async_1.RunOnceScheduler(function () {
                    if (_this.isVisible(channel)) {
                        _this.appendOutput(channel);
                    }
                }, OutputContentProvider.OUTPUT_DELAY);
                this.appendOutputScheduler[channel] = scheduler;
                this.toDispose.push(scheduler);
            }
            if (scheduler.isScheduled()) {
                return; // only if not already scheduled
            }
            scheduler.schedule();
        };
        OutputContentProvider.prototype.appendOutput = function (channel) {
            if (!channel) {
                var activeChannel = this.outputService.getActiveChannel();
                channel = activeChannel && activeChannel.id;
            }
            if (!channel) {
                return; // return if we do not have a valid channel to append to
            }
            var model = this.getModel(channel);
            if (!model) {
                return; // only react if we have a known model
            }
            var bufferedOutput = this.bufferedOutput.get(channel);
            var newOutput = this.outputService.getChannel(channel).getOutput(bufferedOutput);
            if (!newOutput) {
                model.setValue('');
                return;
            }
            this.bufferedOutput.set(channel, newOutput);
            // just fill in the full (trimmed) output if we exceed max length
            if (!newOutput.append) {
                model.setValue(newOutput.value);
            }
            else {
                var lastLine = model.getLineCount();
                var lastLineMaxColumn = model.getLineMaxColumn(lastLine);
                model.applyEdits([editOperation_1.EditOperation.insert(new position_1.Position(lastLine, lastLineMaxColumn), newOutput.value)]);
            }
            if (!this.channelIdsWithScrollLock.has(channel)) {
                // reveal last line
                var panel = this.panelService.getActivePanel();
                panel.revealLastLine();
            }
        };
        OutputContentProvider.prototype.isVisible = function (channel) {
            var panel = this.panelService.getActivePanel();
            return panel && panel.getId() === output_1.OUTPUT_PANEL_ID && this.outputService.getActiveChannel().id === channel;
        };
        OutputContentProvider.prototype.scrollLock = function (channelId) {
            return this.channelIdsWithScrollLock.has(channelId);
        };
        OutputContentProvider.prototype.setScrollLock = function (channelId, value) {
            if (value) {
                this.channelIdsWithScrollLock.add(channelId);
            }
            else {
                this.channelIdsWithScrollLock.delete(channelId);
            }
        };
        OutputContentProvider.prototype.provideTextContent = function (resource) {
            var output = this.outputService.getChannel(resource.fsPath).getOutput();
            var content = output ? output.value : '';
            var codeEditorModel = this.modelService.getModel(resource);
            if (!codeEditorModel) {
                codeEditorModel = this.modelService.createModel(content, this.modeService.getOrCreateMode(output_1.OUTPUT_MIME), resource);
            }
            return winjs_base_1.TPromise.as(codeEditorModel);
        };
        OutputContentProvider.prototype.dispose = function () {
            this.toDispose = lifecycle_1.dispose(this.toDispose);
        };
        OutputContentProvider.OUTPUT_DELAY = 300;
        OutputContentProvider = __decorate([
            __param(1, modelService_1.IModelService),
            __param(2, modeService_1.IModeService),
            __param(3, panelService_1.IPanelService)
        ], OutputContentProvider);
        return OutputContentProvider;
    }());
});
//# sourceMappingURL=outputServices.js.map