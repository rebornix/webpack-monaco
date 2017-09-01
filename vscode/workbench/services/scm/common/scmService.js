/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/lifecycle", "vs/base/common/event"], function (require, exports, lifecycle_1, event_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var SCMInput = (function () {
        function SCMInput() {
            this._value = '';
            this._onDidChange = new event_1.Emitter();
        }
        Object.defineProperty(SCMInput.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                this._value = value;
                this._onDidChange.fire(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SCMInput.prototype, "onDidChange", {
            get: function () { return this._onDidChange.event; },
            enumerable: true,
            configurable: true
        });
        return SCMInput;
    }());
    var SCMRepository = (function () {
        function SCMRepository(provider, disposable) {
            this.provider = provider;
            this.disposable = disposable;
            this._onDidFocus = new event_1.Emitter();
            this.onDidFocus = this._onDidFocus.event;
            this.input = new SCMInput();
        }
        SCMRepository.prototype.focus = function () {
            this._onDidFocus.fire();
        };
        SCMRepository.prototype.dispose = function () {
            this.disposable.dispose();
            this.provider.dispose();
        };
        return SCMRepository;
    }());
    var SCMService = (function () {
        function SCMService() {
            this._providerIds = new Set();
            this._repositories = [];
            this._onDidAddProvider = new event_1.Emitter();
            this._onDidRemoveProvider = new event_1.Emitter();
            this._onDidChangeProvider = new event_1.Emitter();
        }
        Object.defineProperty(SCMService.prototype, "repositories", {
            get: function () { return this._repositories.slice(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SCMService.prototype, "onDidAddRepository", {
            get: function () { return this._onDidAddProvider.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SCMService.prototype, "onDidRemoveRepository", {
            get: function () { return this._onDidRemoveProvider.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SCMService.prototype, "onDidChangeRepository", {
            get: function () { return this._onDidChangeProvider.event; },
            enumerable: true,
            configurable: true
        });
        SCMService.prototype.registerSCMProvider = function (provider) {
            var _this = this;
            if (this._providerIds.has(provider.id)) {
                throw new Error("SCM Provider " + provider.id + " already exists.");
            }
            this._providerIds.add(provider.id);
            var disposable = lifecycle_1.toDisposable(function () {
                var index = _this._repositories.indexOf(repository);
                if (index < 0) {
                    return;
                }
                _this._providerIds.delete(provider.id);
                _this._repositories.splice(index, 1);
                _this._onDidRemoveProvider.fire(repository);
            });
            var repository = new SCMRepository(provider, disposable);
            this._repositories.push(repository);
            this._onDidAddProvider.fire(repository);
            return repository;
        };
        return SCMService;
    }());
    exports.SCMService = SCMService;
});
//# sourceMappingURL=scmService.js.map