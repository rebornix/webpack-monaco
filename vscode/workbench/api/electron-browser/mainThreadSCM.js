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
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/uri", "vs/base/common/event", "vs/base/common/objects", "vs/base/common/lifecycle", "vs/workbench/services/scm/common/scm", "vs/platform/instantiation/common/instantiation", "vs/platform/commands/common/commands", "../node/extHost.protocol", "vs/workbench/api/electron-browser/extHostCustomers"], function (require, exports, winjs_base_1, uri_1, event_1, objects_1, lifecycle_1, scm_1, instantiation_1, commands_1, extHost_protocol_1, extHostCustomers_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainThreadSCMResourceGroup = (function () {
        function MainThreadSCMResourceGroup(sourceControlHandle, handle, provider, features, label, id, resources) {
            this.sourceControlHandle = sourceControlHandle;
            this.handle = handle;
            this.provider = provider;
            this.features = features;
            this.label = label;
            this.id = id;
            this.resources = resources;
        }
        MainThreadSCMResourceGroup.prototype.toJSON = function () {
            return {
                $mid: 4,
                sourceControlHandle: this.sourceControlHandle,
                groupHandle: this.handle
            };
        };
        return MainThreadSCMResourceGroup;
    }());
    var MainThreadSCMResource = (function () {
        function MainThreadSCMResource(sourceControlHandle, groupHandle, handle, sourceUri, command, resourceGroup, decorations) {
            this.sourceControlHandle = sourceControlHandle;
            this.groupHandle = groupHandle;
            this.handle = handle;
            this.sourceUri = sourceUri;
            this.command = command;
            this.resourceGroup = resourceGroup;
            this.decorations = decorations;
        }
        MainThreadSCMResource.prototype.toJSON = function () {
            return {
                $mid: 3,
                sourceControlHandle: this.sourceControlHandle,
                groupHandle: this.groupHandle,
                handle: this.handle
            };
        };
        return MainThreadSCMResource;
    }());
    var MainThreadSCMProvider = (function () {
        function MainThreadSCMProvider(proxy, _handle, _contextValue, _label, scmService, commandService) {
            this.proxy = proxy;
            this._handle = _handle;
            this._contextValue = _contextValue;
            this._label = _label;
            this.commandService = commandService;
            this._id = "scm" + MainThreadSCMProvider.ID_HANDLE++;
            this._groups = [];
            this._groupsByHandle = Object.create(null);
            this._onDidChange = new event_1.Emitter();
            this.features = {};
            this._onDidChangeCommitTemplate = new event_1.Emitter();
            this._count = undefined;
        }
        Object.defineProperty(MainThreadSCMProvider.prototype, "id", {
            get: function () { return this._id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainThreadSCMProvider.prototype, "resources", {
            get: function () {
                return this._groups
                    .filter(function (g) { return g.resources.length > 0 || !g.features.hideWhenEmpty; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainThreadSCMProvider.prototype, "onDidChange", {
            get: function () { return this._onDidChange.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainThreadSCMProvider.prototype, "handle", {
            get: function () { return this._handle; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainThreadSCMProvider.prototype, "label", {
            get: function () { return this._label; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainThreadSCMProvider.prototype, "contextValue", {
            get: function () { return this._contextValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainThreadSCMProvider.prototype, "commitTemplate", {
            get: function () { return this.features.commitTemplate; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainThreadSCMProvider.prototype, "acceptInputCommand", {
            get: function () { return this.features.acceptInputCommand; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainThreadSCMProvider.prototype, "statusBarCommands", {
            get: function () { return this.features.statusBarCommands; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainThreadSCMProvider.prototype, "onDidChangeCommitTemplate", {
            get: function () { return this._onDidChangeCommitTemplate.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MainThreadSCMProvider.prototype, "count", {
            get: function () { return this._count; },
            enumerable: true,
            configurable: true
        });
        MainThreadSCMProvider.prototype.$updateSourceControl = function (features) {
            if ('count' in features) {
                this._count = features.count;
            }
            this.features = objects_1.assign(this.features, features);
            this._onDidChange.fire();
            if (typeof features.commitTemplate !== 'undefined') {
                this._onDidChangeCommitTemplate.fire(this.commitTemplate);
            }
        };
        MainThreadSCMProvider.prototype.$registerGroup = function (handle, id, label) {
            var group = new MainThreadSCMResourceGroup(this.handle, handle, this, {}, label, id, []);
            this._groups.push(group);
            this._groupsByHandle[handle] = group;
        };
        MainThreadSCMProvider.prototype.$updateGroup = function (handle, features) {
            var group = this._groupsByHandle[handle];
            if (!group) {
                return;
            }
            group.features = objects_1.assign(group.features, features);
            this._onDidChange.fire();
        };
        MainThreadSCMProvider.prototype.$updateGroupLabel = function (handle, label) {
            var group = this._groupsByHandle[handle];
            if (!group) {
                return;
            }
            group.label = label;
            this._onDidChange.fire();
        };
        MainThreadSCMProvider.prototype.$updateGroupResourceStates = function (groupHandle, resources) {
            var _this = this;
            var group = this._groupsByHandle[groupHandle];
            if (!group) {
                return;
            }
            group.resources = resources.map(function (rawResource) {
                var handle = rawResource[0], sourceUri = rawResource[1], command = rawResource[2], icons = rawResource[3], tooltip = rawResource[4], strikeThrough = rawResource[5], faded = rawResource[6];
                var icon = icons[0];
                var iconDark = icons[1] || icon;
                var decorations = {
                    icon: icon && uri_1.default.parse(icon),
                    iconDark: iconDark && uri_1.default.parse(iconDark),
                    tooltip: tooltip,
                    strikeThrough: strikeThrough,
                    faded: faded
                };
                return new MainThreadSCMResource(_this.handle, groupHandle, handle, uri_1.default.parse(sourceUri), command, group, decorations);
            });
            this._onDidChange.fire();
        };
        MainThreadSCMProvider.prototype.$unregisterGroup = function (handle) {
            var group = this._groupsByHandle[handle];
            if (!group) {
                return;
            }
            delete this._groupsByHandle[handle];
            this._groups.splice(this._groups.indexOf(group), 1);
        };
        MainThreadSCMProvider.prototype.getOriginalResource = function (uri) {
            if (!this.features.hasQuickDiffProvider) {
                return winjs_base_1.TPromise.as(null);
            }
            return this.proxy.$provideOriginalResource(this.handle, uri);
        };
        MainThreadSCMProvider.prototype.toJSON = function () {
            return {
                $mid: 5,
                handle: this.handle
            };
        };
        MainThreadSCMProvider.prototype.dispose = function () {
        };
        MainThreadSCMProvider.ID_HANDLE = 0;
        MainThreadSCMProvider = __decorate([
            __param(4, scm_1.ISCMService),
            __param(5, commands_1.ICommandService)
        ], MainThreadSCMProvider);
        return MainThreadSCMProvider;
    }());
    var MainThreadSCM = (function () {
        function MainThreadSCM(extHostContext, instantiationService, scmService, commandService) {
            this.instantiationService = instantiationService;
            this.scmService = scmService;
            this.commandService = commandService;
            this._repositories = Object.create(null);
            this._inputDisposables = Object.create(null);
            this._disposables = [];
            this._proxy = extHostContext.get(extHost_protocol_1.ExtHostContext.ExtHostSCM);
        }
        MainThreadSCM.prototype.dispose = function () {
            var _this = this;
            Object.keys(this._repositories)
                .forEach(function (id) { return _this._repositories[id].dispose(); });
            this._repositories = Object.create(null);
            Object.keys(this._inputDisposables)
                .forEach(function (id) { return _this._inputDisposables[id].dispose(); });
            this._inputDisposables = Object.create(null);
            this._disposables = lifecycle_1.dispose(this._disposables);
        };
        MainThreadSCM.prototype.$registerSourceControl = function (handle, id, label) {
            var _this = this;
            var provider = new MainThreadSCMProvider(this._proxy, handle, id, label, this.scmService, this.commandService);
            var repository = this.scmService.registerSCMProvider(provider);
            this._repositories[handle] = repository;
            var inputDisposable = repository.input.onDidChange(function (value) { return _this._proxy.$onInputBoxValueChange(handle, value); });
            this._inputDisposables[handle] = inputDisposable;
        };
        MainThreadSCM.prototype.$updateSourceControl = function (handle, features) {
            var repository = this._repositories[handle];
            if (!repository) {
                return;
            }
            var provider = repository.provider;
            provider.$updateSourceControl(features);
        };
        MainThreadSCM.prototype.$unregisterSourceControl = function (handle) {
            var repository = this._repositories[handle];
            if (!repository) {
                return;
            }
            this._inputDisposables[handle].dispose();
            delete this._inputDisposables[handle];
            repository.dispose();
            delete this._repositories[handle];
        };
        MainThreadSCM.prototype.$registerGroup = function (sourceControlHandle, groupHandle, id, label) {
            var repository = this._repositories[sourceControlHandle];
            if (!repository) {
                return;
            }
            var provider = repository.provider;
            provider.$registerGroup(groupHandle, id, label);
        };
        MainThreadSCM.prototype.$updateGroup = function (sourceControlHandle, groupHandle, features) {
            var repository = this._repositories[sourceControlHandle];
            if (!repository) {
                return;
            }
            var provider = repository.provider;
            provider.$updateGroup(groupHandle, features);
        };
        MainThreadSCM.prototype.$updateGroupLabel = function (sourceControlHandle, groupHandle, label) {
            var repository = this._repositories[sourceControlHandle];
            if (!repository) {
                return;
            }
            var provider = repository.provider;
            provider.$updateGroupLabel(groupHandle, label);
        };
        MainThreadSCM.prototype.$updateGroupResourceStates = function (sourceControlHandle, groupHandle, resources) {
            var repository = this._repositories[sourceControlHandle];
            if (!repository) {
                return;
            }
            var provider = repository.provider;
            provider.$updateGroupResourceStates(groupHandle, resources);
        };
        MainThreadSCM.prototype.$unregisterGroup = function (sourceControlHandle, handle) {
            var repository = this._repositories[sourceControlHandle];
            if (!repository) {
                return;
            }
            var provider = repository.provider;
            provider.$unregisterGroup(handle);
        };
        MainThreadSCM.prototype.$setInputBoxValue = function (sourceControlHandle, value) {
            var repository = this._repositories[sourceControlHandle];
            if (!repository) {
                return;
            }
            repository.input.value = value;
        };
        MainThreadSCM = __decorate([
            extHostCustomers_1.extHostNamedCustomer(extHost_protocol_1.MainContext.MainThreadSCM),
            __param(1, instantiation_1.IInstantiationService),
            __param(2, scm_1.ISCMService),
            __param(3, commands_1.ICommandService)
        ], MainThreadSCM);
        return MainThreadSCM;
    }());
    exports.MainThreadSCM = MainThreadSCM;
});
//# sourceMappingURL=mainThreadSCM.js.map