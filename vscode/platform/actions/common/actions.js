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
define(["require", "exports", "vs/base/common/actions", "vs/platform/instantiation/common/descriptors", "vs/platform/instantiation/common/instantiation", "vs/platform/commands/common/commands"], function (require, exports, actions_1, descriptors_1, instantiation_1, commands_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MenuId = (function () {
        function MenuId(_id) {
            this._id = _id;
        }
        Object.defineProperty(MenuId.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        MenuId.EditorTitle = new MenuId('1');
        MenuId.EditorTitleContext = new MenuId('2');
        MenuId.EditorContext = new MenuId('3');
        MenuId.ExplorerContext = new MenuId('4');
        MenuId.ProblemsPanelContext = new MenuId('5');
        MenuId.DebugVariablesContext = new MenuId('6');
        MenuId.DebugWatchContext = new MenuId('7');
        MenuId.DebugCallStackContext = new MenuId('8');
        MenuId.DebugBreakpointsContext = new MenuId('9');
        MenuId.DebugConsoleContext = new MenuId('10');
        MenuId.SCMTitle = new MenuId('11');
        MenuId.SCMResourceGroupContext = new MenuId('12');
        MenuId.SCMResourceContext = new MenuId('13');
        MenuId.CommandPalette = new MenuId('14');
        MenuId.ViewTitle = new MenuId('15');
        MenuId.ViewItemContext = new MenuId('16');
        return MenuId;
    }());
    exports.MenuId = MenuId;
    exports.IMenuService = instantiation_1.createDecorator('menuService');
    exports.MenuRegistry = new (function () {
        function class_1() {
            this._commands = Object.create(null);
            this._menuItems = Object.create(null);
        }
        class_1.prototype.addCommand = function (command) {
            var old = this._commands[command.id];
            this._commands[command.id] = command;
            return old !== void 0;
        };
        class_1.prototype.getCommand = function (id) {
            return this._commands[id];
        };
        class_1.prototype.appendMenuItem = function (_a, item) {
            var id = _a.id;
            var array = this._menuItems[id];
            if (!array) {
                this._menuItems[id] = array = [item];
            }
            else {
                array.push(item);
            }
            return {
                dispose: function () {
                    var idx = array.indexOf(item);
                    if (idx >= 0) {
                        array.splice(idx, 1);
                    }
                }
            };
        };
        class_1.prototype.getMenuItems = function (_a) {
            var id = _a.id;
            var result = this._menuItems[id] || [];
            if (id === MenuId.CommandPalette.id) {
                // CommandPalette is special because it shows
                // all commands by default
                this._appendImplicitItems(result);
            }
            return result;
        };
        class_1.prototype._appendImplicitItems = function (result) {
            var set = new Set();
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var _a = result_1[_i], command = _a.command, alt = _a.alt;
                set.add(command.id);
                if (alt) {
                    set.add(alt.id);
                }
            }
            for (var id in this._commands) {
                if (!set.has(id)) {
                    result.push({ command: this._commands[id] });
                }
            }
        };
        return class_1;
    }());
    var ExecuteCommandAction = (function (_super) {
        __extends(ExecuteCommandAction, _super);
        function ExecuteCommandAction(id, label, _commandService) {
            var _this = _super.call(this, id, label) || this;
            _this._commandService = _commandService;
            return _this;
        }
        ExecuteCommandAction.prototype.run = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return (_a = this._commandService).executeCommand.apply(_a, [this.id].concat(args));
            var _a;
        };
        ExecuteCommandAction = __decorate([
            __param(2, commands_1.ICommandService)
        ], ExecuteCommandAction);
        return ExecuteCommandAction;
    }(actions_1.Action));
    exports.ExecuteCommandAction = ExecuteCommandAction;
    var MenuItemAction = (function (_super) {
        __extends(MenuItemAction, _super);
        function MenuItemAction(item, alt, options, commandService) {
            var _this = this;
            typeof item.title === 'string' ? _this = _super.call(this, item.id, item.title, commandService) || this : _this = _super.call(this, item.id, item.title.value, commandService) || this;
            _this._cssClass = item.iconClass;
            _this._enabled = true;
            _this._options = options || {};
            _this.item = item;
            _this.alt = alt ? new MenuItemAction(alt, undefined, _this._options, commandService) : undefined;
            return _this;
        }
        MenuItemAction.prototype.run = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var runArgs = [];
            if (this._options.arg) {
                runArgs = runArgs.concat([this._options.arg]);
            }
            if (this._options.shouldForwardArgs) {
                runArgs = runArgs.concat(args);
            }
            return _super.prototype.run.apply(this, runArgs);
        };
        MenuItemAction = __decorate([
            __param(3, commands_1.ICommandService)
        ], MenuItemAction);
        return MenuItemAction;
    }(ExecuteCommandAction));
    exports.MenuItemAction = MenuItemAction;
    var SyncActionDescriptor = (function () {
        function SyncActionDescriptor(ctor, id, label, keybindings, keybindingContext, keybindingWeight) {
            this._id = id;
            this._label = label;
            this._keybindings = keybindings;
            this._keybindingContext = keybindingContext;
            this._keybindingWeight = keybindingWeight;
            this._descriptor = descriptors_1.createSyncDescriptor(ctor, this._id, this._label);
        }
        Object.defineProperty(SyncActionDescriptor.prototype, "syncDescriptor", {
            get: function () {
                return this._descriptor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SyncActionDescriptor.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SyncActionDescriptor.prototype, "label", {
            get: function () {
                return this._label;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SyncActionDescriptor.prototype, "keybindings", {
            get: function () {
                return this._keybindings;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SyncActionDescriptor.prototype, "keybindingContext", {
            get: function () {
                return this._keybindingContext;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SyncActionDescriptor.prototype, "keybindingWeight", {
            get: function () {
                return this._keybindingWeight;
            },
            enumerable: true,
            configurable: true
        });
        return SyncActionDescriptor;
    }());
    exports.SyncActionDescriptor = SyncActionDescriptor;
});
//# sourceMappingURL=actions.js.map