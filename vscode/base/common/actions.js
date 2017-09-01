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
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/eventEmitter", "vs/base/common/events", "vs/base/common/event"], function (require, exports, winjs_base_1, eventEmitter_1, Events, event_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Checks if the provided object is compatible
     * with the IAction interface.
     * @param thing an object
     */
    function isAction(thing) {
        if (!thing) {
            return false;
        }
        else if (thing instanceof Action) {
            return true;
        }
        else if (typeof thing.id !== 'string') {
            return false;
        }
        else if (typeof thing.label !== 'string') {
            return false;
        }
        else if (typeof thing.class !== 'string') {
            return false;
        }
        else if (typeof thing.enabled !== 'boolean') {
            return false;
        }
        else if (typeof thing.checked !== 'boolean') {
            return false;
        }
        else if (typeof thing.run !== 'function') {
            return false;
        }
        else {
            return true;
        }
    }
    exports.isAction = isAction;
    var Action = (function () {
        function Action(id, label, cssClass, enabled, actionCallback) {
            if (label === void 0) { label = ''; }
            if (cssClass === void 0) { cssClass = ''; }
            if (enabled === void 0) { enabled = true; }
            this._onDidChange = new event_1.Emitter();
            this._id = id;
            this._label = label;
            this._cssClass = cssClass;
            this._enabled = enabled;
            this._actionCallback = actionCallback;
        }
        Action.prototype.dispose = function () {
            this._onDidChange.dispose();
        };
        Object.defineProperty(Action.prototype, "onDidChange", {
            get: function () {
                return this._onDidChange.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Action.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Action.prototype, "label", {
            get: function () {
                return this._label;
            },
            set: function (value) {
                this._setLabel(value);
            },
            enumerable: true,
            configurable: true
        });
        Action.prototype._setLabel = function (value) {
            if (this._label !== value) {
                this._label = value;
                this._onDidChange.fire({ label: value });
            }
        };
        Object.defineProperty(Action.prototype, "tooltip", {
            get: function () {
                return this._tooltip;
            },
            set: function (value) {
                this._setTooltip(value);
            },
            enumerable: true,
            configurable: true
        });
        Action.prototype._setTooltip = function (value) {
            if (this._tooltip !== value) {
                this._tooltip = value;
                this._onDidChange.fire({ tooltip: value });
            }
        };
        Object.defineProperty(Action.prototype, "class", {
            get: function () {
                return this._cssClass;
            },
            set: function (value) {
                this._setClass(value);
            },
            enumerable: true,
            configurable: true
        });
        Action.prototype._setClass = function (value) {
            if (this._cssClass !== value) {
                this._cssClass = value;
                this._onDidChange.fire({ class: value });
            }
        };
        Object.defineProperty(Action.prototype, "enabled", {
            get: function () {
                return this._enabled;
            },
            set: function (value) {
                this._setEnabled(value);
            },
            enumerable: true,
            configurable: true
        });
        Action.prototype._setEnabled = function (value) {
            if (this._enabled !== value) {
                this._enabled = value;
                this._onDidChange.fire({ enabled: value });
            }
        };
        Object.defineProperty(Action.prototype, "checked", {
            get: function () {
                return this._checked;
            },
            set: function (value) {
                this._setChecked(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Action.prototype, "radio", {
            get: function () {
                return this._radio;
            },
            set: function (value) {
                this._setRadio(value);
            },
            enumerable: true,
            configurable: true
        });
        Action.prototype._setChecked = function (value) {
            if (this._checked !== value) {
                this._checked = value;
                this._onDidChange.fire({ checked: value });
            }
        };
        Action.prototype._setRadio = function (value) {
            if (this._radio !== value) {
                this._radio = value;
                this._onDidChange.fire({ radio: value });
            }
        };
        Object.defineProperty(Action.prototype, "order", {
            get: function () {
                return this._order;
            },
            set: function (value) {
                this._order = value;
            },
            enumerable: true,
            configurable: true
        });
        Action.prototype.run = function (event, data) {
            if (this._actionCallback !== void 0) {
                return this._actionCallback(event);
            }
            return winjs_base_1.TPromise.as(true);
        };
        return Action;
    }());
    exports.Action = Action;
    var ActionRunner = (function (_super) {
        __extends(ActionRunner, _super);
        function ActionRunner() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ActionRunner.prototype.run = function (action, context) {
            var _this = this;
            if (!action.enabled) {
                return winjs_base_1.TPromise.as(null);
            }
            this.emit(Events.EventType.BEFORE_RUN, { action: action });
            return this.runAction(action, context).then(function (result) {
                _this.emit(Events.EventType.RUN, { action: action, result: result });
            }, function (error) {
                _this.emit(Events.EventType.RUN, { action: action, error: error });
            });
        };
        ActionRunner.prototype.runAction = function (action, context) {
            return winjs_base_1.TPromise.as(context ? action.run(context) : action.run());
        };
        return ActionRunner;
    }(eventEmitter_1.EventEmitter));
    exports.ActionRunner = ActionRunner;
});
//# sourceMappingURL=actions.js.map