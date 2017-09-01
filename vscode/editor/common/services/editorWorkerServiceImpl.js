var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/async", "vs/base/common/lifecycle", "vs/base/common/winjs.base", "vs/base/common/worker/simpleWorker", "vs/base/worker/defaultWorkerFactory", "vs/editor/common/modes", "vs/editor/common/services/modelService", "vs/editor/common/services/editorSimpleWorker", "vs/editor/common/modes/languageConfigurationRegistry", "vs/editor/common/services/resourceConfiguration", "vs/editor/common/services/modeService"], function (require, exports, async_1, lifecycle_1, winjs_base_1, simpleWorker_1, defaultWorkerFactory_1, modes, modelService_1, editorSimpleWorker_1, languageConfigurationRegistry_1, resourceConfiguration_1, modeService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Stop syncing a model to the worker if it was not needed for 1 min.
     */
    var STOP_SYNC_MODEL_DELTA_TIME_MS = 60 * 1000;
    /**
     * Stop the worker if it was not needed for 5 min.
     */
    var STOP_WORKER_DELTA_TIME_MS = 5 * 60 * 1000;
    function canSyncModel(modelService, resource) {
        var model = modelService.getModel(resource);
        if (!model) {
            return false;
        }
        if (model.isTooLargeForTokenization()) {
            return false;
        }
        return true;
    }
    var EditorWorkerServiceImpl = (function (_super) {
        __extends(EditorWorkerServiceImpl, _super);
        function EditorWorkerServiceImpl(modelService, configurationService, modeService) {
            var _this = _super.call(this) || this;
            _this._modelService = modelService;
            _this._workerManager = _this._register(new WorkerManager(_this._modelService));
            // todo@joh make sure this happens only once
            _this._register(modes.LinkProviderRegistry.register('*', {
                provideLinks: function (model, token) {
                    if (!canSyncModel(_this._modelService, model.uri)) {
                        return winjs_base_1.TPromise.as([]); // File too large
                    }
                    return async_1.wireCancellationToken(token, _this._workerManager.withWorker().then(function (client) { return client.computeLinks(model.uri); }));
                }
            }));
            _this._register(modes.SuggestRegistry.register('*', new WordBasedCompletionItemProvider(_this._workerManager, configurationService, modeService, _this._modelService)));
            return _this;
        }
        EditorWorkerServiceImpl.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        EditorWorkerServiceImpl.prototype.canComputeDiff = function (original, modified) {
            return (canSyncModel(this._modelService, original) && canSyncModel(this._modelService, modified));
        };
        EditorWorkerServiceImpl.prototype.computeDiff = function (original, modified, ignoreTrimWhitespace) {
            return this._workerManager.withWorker().then(function (client) { return client.computeDiff(original, modified, ignoreTrimWhitespace); });
        };
        EditorWorkerServiceImpl.prototype.canComputeDirtyDiff = function (original, modified) {
            return (canSyncModel(this._modelService, original) && canSyncModel(this._modelService, modified));
        };
        EditorWorkerServiceImpl.prototype.computeDirtyDiff = function (original, modified, ignoreTrimWhitespace) {
            return this._workerManager.withWorker().then(function (client) { return client.computeDirtyDiff(original, modified, ignoreTrimWhitespace); });
        };
        EditorWorkerServiceImpl.prototype.computeMoreMinimalEdits = function (resource, edits, ranges) {
            if (!Array.isArray(edits) || edits.length === 0) {
                return winjs_base_1.TPromise.as(edits);
            }
            else {
                if (!canSyncModel(this._modelService, resource)) {
                    return winjs_base_1.TPromise.as(edits); // File too large
                }
                return this._workerManager.withWorker().then(function (client) { return client.computeMoreMinimalEdits(resource, edits, ranges); });
            }
        };
        EditorWorkerServiceImpl.prototype.canNavigateValueSet = function (resource) {
            return (canSyncModel(this._modelService, resource));
        };
        EditorWorkerServiceImpl.prototype.navigateValueSet = function (resource, range, up) {
            return this._workerManager.withWorker().then(function (client) { return client.navigateValueSet(resource, range, up); });
        };
        EditorWorkerServiceImpl = __decorate([
            __param(0, modelService_1.IModelService),
            __param(1, resourceConfiguration_1.ITextResourceConfigurationService),
            __param(2, modeService_1.IModeService)
        ], EditorWorkerServiceImpl);
        return EditorWorkerServiceImpl;
    }(lifecycle_1.Disposable));
    exports.EditorWorkerServiceImpl = EditorWorkerServiceImpl;
    var WordBasedCompletionItemProvider = (function () {
        function WordBasedCompletionItemProvider(workerManager, configurationService, modeService, modelService) {
            this._workerManager = workerManager;
            this._configurationService = configurationService;
            this._modeService = modeService;
            this._modelService = modelService;
        }
        WordBasedCompletionItemProvider.prototype.provideCompletionItems = function (model, position) {
            var wordBasedSuggestions = this._configurationService.getConfiguration(model.uri, position, 'editor').wordBasedSuggestions;
            if (!wordBasedSuggestions) {
                return undefined;
            }
            if (!canSyncModel(this._modelService, model.uri)) {
                return undefined; // File too large
            }
            return this._workerManager.withWorker().then(function (client) { return client.textualSuggest(model.uri, position); });
        };
        return WordBasedCompletionItemProvider;
    }());
    var WorkerManager = (function (_super) {
        __extends(WorkerManager, _super);
        function WorkerManager(modelService) {
            var _this = _super.call(this) || this;
            _this._modelService = modelService;
            _this._editorWorkerClient = null;
            var stopWorkerInterval = _this._register(new async_1.IntervalTimer());
            stopWorkerInterval.cancelAndSet(function () { return _this._checkStopIdleWorker(); }, Math.round(STOP_WORKER_DELTA_TIME_MS / 2));
            _this._register(_this._modelService.onModelRemoved(function (_) { return _this._checkStopEmptyWorker(); }));
            return _this;
        }
        WorkerManager.prototype.dispose = function () {
            if (this._editorWorkerClient) {
                this._editorWorkerClient.dispose();
                this._editorWorkerClient = null;
            }
            _super.prototype.dispose.call(this);
        };
        /**
         * Check if the model service has no more models and stop the worker if that is the case.
         */
        WorkerManager.prototype._checkStopEmptyWorker = function () {
            if (!this._editorWorkerClient) {
                return;
            }
            var models = this._modelService.getModels();
            if (models.length === 0) {
                // There are no more models => nothing possible for me to do
                this._editorWorkerClient.dispose();
                this._editorWorkerClient = null;
            }
        };
        /**
         * Check if the worker has been idle for a while and then stop it.
         */
        WorkerManager.prototype._checkStopIdleWorker = function () {
            if (!this._editorWorkerClient) {
                return;
            }
            var timeSinceLastWorkerUsedTime = (new Date()).getTime() - this._lastWorkerUsedTime;
            if (timeSinceLastWorkerUsedTime > STOP_WORKER_DELTA_TIME_MS) {
                this._editorWorkerClient.dispose();
                this._editorWorkerClient = null;
            }
        };
        WorkerManager.prototype.withWorker = function () {
            this._lastWorkerUsedTime = (new Date()).getTime();
            if (!this._editorWorkerClient) {
                this._editorWorkerClient = new EditorWorkerClient(this._modelService, 'editorWorkerService');
            }
            return winjs_base_1.TPromise.as(this._editorWorkerClient);
        };
        return WorkerManager;
    }(lifecycle_1.Disposable));
    var EditorModelManager = (function (_super) {
        __extends(EditorModelManager, _super);
        function EditorModelManager(proxy, modelService, keepIdleModels) {
            var _this = _super.call(this) || this;
            _this._syncedModels = Object.create(null);
            _this._syncedModelsLastUsedTime = Object.create(null);
            _this._proxy = proxy;
            _this._modelService = modelService;
            if (!keepIdleModels) {
                var timer = new async_1.IntervalTimer();
                timer.cancelAndSet(function () { return _this._checkStopModelSync(); }, Math.round(STOP_SYNC_MODEL_DELTA_TIME_MS / 2));
                _this._register(timer);
            }
            return _this;
        }
        EditorModelManager.prototype.dispose = function () {
            for (var modelUrl in this._syncedModels) {
                lifecycle_1.dispose(this._syncedModels[modelUrl]);
            }
            this._syncedModels = Object.create(null);
            this._syncedModelsLastUsedTime = Object.create(null);
            _super.prototype.dispose.call(this);
        };
        EditorModelManager.prototype.esureSyncedResources = function (resources) {
            for (var i = 0; i < resources.length; i++) {
                var resource = resources[i];
                var resourceStr = resource.toString();
                if (!this._syncedModels[resourceStr]) {
                    this._beginModelSync(resource);
                }
                if (this._syncedModels[resourceStr]) {
                    this._syncedModelsLastUsedTime[resourceStr] = (new Date()).getTime();
                }
            }
        };
        EditorModelManager.prototype._checkStopModelSync = function () {
            var currentTime = (new Date()).getTime();
            var toRemove = [];
            for (var modelUrl in this._syncedModelsLastUsedTime) {
                var elapsedTime = currentTime - this._syncedModelsLastUsedTime[modelUrl];
                if (elapsedTime > STOP_SYNC_MODEL_DELTA_TIME_MS) {
                    toRemove.push(modelUrl);
                }
            }
            for (var i = 0; i < toRemove.length; i++) {
                this._stopModelSync(toRemove[i]);
            }
        };
        EditorModelManager.prototype._beginModelSync = function (resource) {
            var _this = this;
            var model = this._modelService.getModel(resource);
            if (!model) {
                return;
            }
            if (model.isTooLargeForTokenization()) {
                return;
            }
            var modelUrl = resource.toString();
            this._proxy.acceptNewModel({
                url: model.uri.toString(),
                lines: model.getLinesContent(),
                EOL: model.getEOL(),
                versionId: model.getVersionId()
            });
            var toDispose = [];
            toDispose.push(model.onDidChangeContent(function (e) {
                _this._proxy.acceptModelChanged(modelUrl.toString(), e);
            }));
            toDispose.push(model.onWillDispose(function () {
                _this._stopModelSync(modelUrl);
            }));
            toDispose.push({
                dispose: function () {
                    _this._proxy.acceptRemovedModel(modelUrl);
                }
            });
            this._syncedModels[modelUrl] = toDispose;
        };
        EditorModelManager.prototype._stopModelSync = function (modelUrl) {
            var toDispose = this._syncedModels[modelUrl];
            delete this._syncedModels[modelUrl];
            delete this._syncedModelsLastUsedTime[modelUrl];
            lifecycle_1.dispose(toDispose);
        };
        return EditorModelManager;
    }(lifecycle_1.Disposable));
    var SynchronousWorkerClient = (function () {
        function SynchronousWorkerClient(instance) {
            this._instance = instance;
            this._proxyObj = winjs_base_1.TPromise.as(this._instance);
        }
        SynchronousWorkerClient.prototype.dispose = function () {
            this._instance.dispose();
            this._instance = null;
            this._proxyObj = null;
        };
        SynchronousWorkerClient.prototype.getProxyObject = function () {
            return new async_1.ShallowCancelThenPromise(this._proxyObj);
        };
        return SynchronousWorkerClient;
    }());
    var EditorWorkerClient = (function (_super) {
        __extends(EditorWorkerClient, _super);
        function EditorWorkerClient(modelService, label) {
            var _this = _super.call(this) || this;
            _this._modelService = modelService;
            _this._workerFactory = new defaultWorkerFactory_1.DefaultWorkerFactory(label);
            _this._worker = null;
            _this._modelManager = null;
            return _this;
        }
        EditorWorkerClient.prototype._getOrCreateWorker = function () {
            if (!this._worker) {
                try {
                    this._worker = this._register(new simpleWorker_1.SimpleWorkerClient(this._workerFactory, 'vs/editor/common/services/editorSimpleWorker'));
                }
                catch (err) {
                    simpleWorker_1.logOnceWebWorkerWarning(err);
                    this._worker = new SynchronousWorkerClient(new editorSimpleWorker_1.EditorSimpleWorkerImpl());
                }
            }
            return this._worker;
        };
        EditorWorkerClient.prototype._getProxy = function () {
            var _this = this;
            return new async_1.ShallowCancelThenPromise(this._getOrCreateWorker().getProxyObject().then(null, function (err) {
                simpleWorker_1.logOnceWebWorkerWarning(err);
                _this._worker = new SynchronousWorkerClient(new editorSimpleWorker_1.EditorSimpleWorkerImpl());
                return _this._getOrCreateWorker().getProxyObject();
            }));
        };
        EditorWorkerClient.prototype._getOrCreateModelManager = function (proxy) {
            if (!this._modelManager) {
                this._modelManager = this._register(new EditorModelManager(proxy, this._modelService, false));
            }
            return this._modelManager;
        };
        EditorWorkerClient.prototype._withSyncedResources = function (resources) {
            var _this = this;
            return this._getProxy().then(function (proxy) {
                _this._getOrCreateModelManager(proxy).esureSyncedResources(resources);
                return proxy;
            });
        };
        EditorWorkerClient.prototype.computeDiff = function (original, modified, ignoreTrimWhitespace) {
            return this._withSyncedResources([original, modified]).then(function (proxy) {
                return proxy.computeDiff(original.toString(), modified.toString(), ignoreTrimWhitespace);
            });
        };
        EditorWorkerClient.prototype.computeDirtyDiff = function (original, modified, ignoreTrimWhitespace) {
            return this._withSyncedResources([original, modified]).then(function (proxy) {
                return proxy.computeDirtyDiff(original.toString(), modified.toString(), ignoreTrimWhitespace);
            });
        };
        EditorWorkerClient.prototype.computeMoreMinimalEdits = function (resource, edits, ranges) {
            return this._withSyncedResources([resource]).then(function (proxy) {
                return proxy.computeMoreMinimalEdits(resource.toString(), edits, ranges);
            });
        };
        EditorWorkerClient.prototype.computeLinks = function (resource) {
            return this._withSyncedResources([resource]).then(function (proxy) {
                return proxy.computeLinks(resource.toString());
            });
        };
        EditorWorkerClient.prototype.textualSuggest = function (resource, position) {
            var _this = this;
            return this._withSyncedResources([resource]).then(function (proxy) {
                var model = _this._modelService.getModel(resource);
                if (!model) {
                    return null;
                }
                var wordDefRegExp = languageConfigurationRegistry_1.LanguageConfigurationRegistry.getWordDefinition(model.getLanguageIdentifier().id);
                var wordDef = wordDefRegExp.source;
                var wordDefFlags = (wordDefRegExp.global ? 'g' : '') + (wordDefRegExp.ignoreCase ? 'i' : '') + (wordDefRegExp.multiline ? 'm' : '');
                return proxy.textualSuggest(resource.toString(), position, wordDef, wordDefFlags);
            });
        };
        EditorWorkerClient.prototype.navigateValueSet = function (resource, range, up) {
            var _this = this;
            return this._withSyncedResources([resource]).then(function (proxy) {
                var model = _this._modelService.getModel(resource);
                if (!model) {
                    return null;
                }
                var wordDefRegExp = languageConfigurationRegistry_1.LanguageConfigurationRegistry.getWordDefinition(model.getLanguageIdentifier().id);
                var wordDef = wordDefRegExp.source;
                var wordDefFlags = (wordDefRegExp.global ? 'g' : '') + (wordDefRegExp.ignoreCase ? 'i' : '') + (wordDefRegExp.multiline ? 'm' : '');
                return proxy.navigateValueSet(resource.toString(), range, up, wordDef, wordDefFlags);
            });
        };
        return EditorWorkerClient;
    }(lifecycle_1.Disposable));
    exports.EditorWorkerClient = EditorWorkerClient;
});
//# sourceMappingURL=editorWorkerServiceImpl.js.map