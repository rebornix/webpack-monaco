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
define(["require", "exports", "vs/platform/instantiation/common/instantiation"], function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ContextKeyExprType;
    (function (ContextKeyExprType) {
        ContextKeyExprType[ContextKeyExprType["Defined"] = 1] = "Defined";
        ContextKeyExprType[ContextKeyExprType["Not"] = 2] = "Not";
        ContextKeyExprType[ContextKeyExprType["Equals"] = 3] = "Equals";
        ContextKeyExprType[ContextKeyExprType["NotEquals"] = 4] = "NotEquals";
        ContextKeyExprType[ContextKeyExprType["And"] = 5] = "And";
    })(ContextKeyExprType = exports.ContextKeyExprType || (exports.ContextKeyExprType = {}));
    var ContextKeyExpr = (function () {
        function ContextKeyExpr() {
        }
        ContextKeyExpr.has = function (key) {
            return new ContextKeyDefinedExpr(key);
        };
        ContextKeyExpr.equals = function (key, value) {
            return new ContextKeyEqualsExpr(key, value);
        };
        ContextKeyExpr.notEquals = function (key, value) {
            return new ContextKeyNotEqualsExpr(key, value);
        };
        ContextKeyExpr.not = function (key) {
            return new ContextKeyNotExpr(key);
        };
        ContextKeyExpr.and = function () {
            var expr = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                expr[_i] = arguments[_i];
            }
            return new ContextKeyAndExpr(expr);
        };
        ContextKeyExpr.deserialize = function (serialized) {
            var _this = this;
            if (!serialized) {
                return null;
            }
            var pieces = serialized.split('&&');
            var result = new ContextKeyAndExpr(pieces.map(function (p) { return _this._deserializeOne(p); }));
            return result.normalize();
        };
        ContextKeyExpr._deserializeOne = function (serializedOne) {
            serializedOne = serializedOne.trim();
            if (serializedOne.indexOf('!=') >= 0) {
                var pieces = serializedOne.split('!=');
                return new ContextKeyNotEqualsExpr(pieces[0].trim(), this._deserializeValue(pieces[1]));
            }
            if (serializedOne.indexOf('==') >= 0) {
                var pieces = serializedOne.split('==');
                return new ContextKeyEqualsExpr(pieces[0].trim(), this._deserializeValue(pieces[1]));
            }
            if (/^\!\s*/.test(serializedOne)) {
                return new ContextKeyNotExpr(serializedOne.substr(1).trim());
            }
            return new ContextKeyDefinedExpr(serializedOne);
        };
        ContextKeyExpr._deserializeValue = function (serializedValue) {
            serializedValue = serializedValue.trim();
            if (serializedValue === 'true') {
                return true;
            }
            if (serializedValue === 'false') {
                return false;
            }
            var m = /^'([^']*)'$/.exec(serializedValue);
            if (m) {
                return m[1].trim();
            }
            return serializedValue;
        };
        return ContextKeyExpr;
    }());
    exports.ContextKeyExpr = ContextKeyExpr;
    function cmp(a, b) {
        var aType = a.getType();
        var bType = b.getType();
        if (aType !== bType) {
            return aType - bType;
        }
        switch (aType) {
            case ContextKeyExprType.Defined:
                return a.cmp(b);
            case ContextKeyExprType.Not:
                return a.cmp(b);
            case ContextKeyExprType.Equals:
                return a.cmp(b);
            case ContextKeyExprType.NotEquals:
                return a.cmp(b);
            default:
                throw new Error('Unknown ContextKeyExpr!');
        }
    }
    var ContextKeyDefinedExpr = (function () {
        function ContextKeyDefinedExpr(key) {
            this.key = key;
        }
        ContextKeyDefinedExpr.prototype.getType = function () {
            return ContextKeyExprType.Defined;
        };
        ContextKeyDefinedExpr.prototype.cmp = function (other) {
            if (this.key < other.key) {
                return -1;
            }
            if (this.key > other.key) {
                return 1;
            }
            return 0;
        };
        ContextKeyDefinedExpr.prototype.equals = function (other) {
            if (other instanceof ContextKeyDefinedExpr) {
                return (this.key === other.key);
            }
            return false;
        };
        ContextKeyDefinedExpr.prototype.evaluate = function (context) {
            return (!!context.getValue(this.key));
        };
        ContextKeyDefinedExpr.prototype.normalize = function () {
            return this;
        };
        ContextKeyDefinedExpr.prototype.serialize = function () {
            return this.key;
        };
        ContextKeyDefinedExpr.prototype.keys = function () {
            return [this.key];
        };
        return ContextKeyDefinedExpr;
    }());
    exports.ContextKeyDefinedExpr = ContextKeyDefinedExpr;
    var ContextKeyEqualsExpr = (function () {
        function ContextKeyEqualsExpr(key, value) {
            this.key = key;
            this.value = value;
        }
        ContextKeyEqualsExpr.prototype.getType = function () {
            return ContextKeyExprType.Equals;
        };
        ContextKeyEqualsExpr.prototype.cmp = function (other) {
            if (this.key < other.key) {
                return -1;
            }
            if (this.key > other.key) {
                return 1;
            }
            if (this.value < other.value) {
                return -1;
            }
            if (this.value > other.value) {
                return 1;
            }
            return 0;
        };
        ContextKeyEqualsExpr.prototype.equals = function (other) {
            if (other instanceof ContextKeyEqualsExpr) {
                return (this.key === other.key && this.value === other.value);
            }
            return false;
        };
        ContextKeyEqualsExpr.prototype.evaluate = function (context) {
            /* tslint:disable:triple-equals */
            // Intentional ==
            return (context.getValue(this.key) == this.value);
            /* tslint:enable:triple-equals */
        };
        ContextKeyEqualsExpr.prototype.normalize = function () {
            if (typeof this.value === 'boolean') {
                if (this.value) {
                    return new ContextKeyDefinedExpr(this.key);
                }
                return new ContextKeyNotExpr(this.key);
            }
            return this;
        };
        ContextKeyEqualsExpr.prototype.serialize = function () {
            if (typeof this.value === 'boolean') {
                return this.normalize().serialize();
            }
            return this.key + ' == \'' + this.value + '\'';
        };
        ContextKeyEqualsExpr.prototype.keys = function () {
            return [this.key];
        };
        return ContextKeyEqualsExpr;
    }());
    exports.ContextKeyEqualsExpr = ContextKeyEqualsExpr;
    var ContextKeyNotEqualsExpr = (function () {
        function ContextKeyNotEqualsExpr(key, value) {
            this.key = key;
            this.value = value;
        }
        ContextKeyNotEqualsExpr.prototype.getType = function () {
            return ContextKeyExprType.NotEquals;
        };
        ContextKeyNotEqualsExpr.prototype.cmp = function (other) {
            if (this.key < other.key) {
                return -1;
            }
            if (this.key > other.key) {
                return 1;
            }
            if (this.value < other.value) {
                return -1;
            }
            if (this.value > other.value) {
                return 1;
            }
            return 0;
        };
        ContextKeyNotEqualsExpr.prototype.equals = function (other) {
            if (other instanceof ContextKeyNotEqualsExpr) {
                return (this.key === other.key && this.value === other.value);
            }
            return false;
        };
        ContextKeyNotEqualsExpr.prototype.evaluate = function (context) {
            /* tslint:disable:triple-equals */
            // Intentional !=
            return (context.getValue(this.key) != this.value);
            /* tslint:enable:triple-equals */
        };
        ContextKeyNotEqualsExpr.prototype.normalize = function () {
            if (typeof this.value === 'boolean') {
                if (this.value) {
                    return new ContextKeyNotExpr(this.key);
                }
                return new ContextKeyDefinedExpr(this.key);
            }
            return this;
        };
        ContextKeyNotEqualsExpr.prototype.serialize = function () {
            if (typeof this.value === 'boolean') {
                return this.normalize().serialize();
            }
            return this.key + ' != \'' + this.value + '\'';
        };
        ContextKeyNotEqualsExpr.prototype.keys = function () {
            return [this.key];
        };
        return ContextKeyNotEqualsExpr;
    }());
    exports.ContextKeyNotEqualsExpr = ContextKeyNotEqualsExpr;
    var ContextKeyNotExpr = (function () {
        function ContextKeyNotExpr(key) {
            this.key = key;
        }
        ContextKeyNotExpr.prototype.getType = function () {
            return ContextKeyExprType.Not;
        };
        ContextKeyNotExpr.prototype.cmp = function (other) {
            if (this.key < other.key) {
                return -1;
            }
            if (this.key > other.key) {
                return 1;
            }
            return 0;
        };
        ContextKeyNotExpr.prototype.equals = function (other) {
            if (other instanceof ContextKeyNotExpr) {
                return (this.key === other.key);
            }
            return false;
        };
        ContextKeyNotExpr.prototype.evaluate = function (context) {
            return (!context.getValue(this.key));
        };
        ContextKeyNotExpr.prototype.normalize = function () {
            return this;
        };
        ContextKeyNotExpr.prototype.serialize = function () {
            return '!' + this.key;
        };
        ContextKeyNotExpr.prototype.keys = function () {
            return [this.key];
        };
        return ContextKeyNotExpr;
    }());
    exports.ContextKeyNotExpr = ContextKeyNotExpr;
    var ContextKeyAndExpr = (function () {
        function ContextKeyAndExpr(expr) {
            this.expr = ContextKeyAndExpr._normalizeArr(expr);
        }
        ContextKeyAndExpr.prototype.getType = function () {
            return ContextKeyExprType.And;
        };
        ContextKeyAndExpr.prototype.equals = function (other) {
            if (other instanceof ContextKeyAndExpr) {
                if (this.expr.length !== other.expr.length) {
                    return false;
                }
                for (var i = 0, len = this.expr.length; i < len; i++) {
                    if (!this.expr[i].equals(other.expr[i])) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        };
        ContextKeyAndExpr.prototype.evaluate = function (context) {
            for (var i = 0, len = this.expr.length; i < len; i++) {
                if (!this.expr[i].evaluate(context)) {
                    return false;
                }
            }
            return true;
        };
        ContextKeyAndExpr._normalizeArr = function (arr) {
            var expr = [];
            if (arr) {
                for (var i = 0, len = arr.length; i < len; i++) {
                    var e = arr[i];
                    if (!e) {
                        continue;
                    }
                    e = e.normalize();
                    if (!e) {
                        continue;
                    }
                    if (e instanceof ContextKeyAndExpr) {
                        expr = expr.concat(e.expr);
                        continue;
                    }
                    expr.push(e);
                }
                expr.sort(cmp);
            }
            return expr;
        };
        ContextKeyAndExpr.prototype.normalize = function () {
            if (this.expr.length === 0) {
                return null;
            }
            if (this.expr.length === 1) {
                return this.expr[0];
            }
            return this;
        };
        ContextKeyAndExpr.prototype.serialize = function () {
            if (this.expr.length === 0) {
                return '';
            }
            if (this.expr.length === 1) {
                return this.normalize().serialize();
            }
            return this.expr.map(function (e) { return e.serialize(); }).join(' && ');
        };
        ContextKeyAndExpr.prototype.keys = function () {
            var result = [];
            for (var _i = 0, _a = this.expr; _i < _a.length; _i++) {
                var expr = _a[_i];
                result.push.apply(result, expr.keys());
            }
            return result;
        };
        return ContextKeyAndExpr;
    }());
    exports.ContextKeyAndExpr = ContextKeyAndExpr;
    var RawContextKey = (function (_super) {
        __extends(RawContextKey, _super);
        function RawContextKey(key, defaultValue) {
            var _this = _super.call(this, key) || this;
            _this._defaultValue = defaultValue;
            return _this;
        }
        RawContextKey.prototype.bindTo = function (target) {
            return target.createKey(this.key, this._defaultValue);
        };
        RawContextKey.prototype.getValue = function (target) {
            return target.getContextKeyValue(this.key);
        };
        RawContextKey.prototype.toNegated = function () {
            return ContextKeyExpr.not(this.key);
        };
        RawContextKey.prototype.isEqualTo = function (value) {
            return ContextKeyExpr.equals(this.key, value);
        };
        return RawContextKey;
    }(ContextKeyDefinedExpr));
    exports.RawContextKey = RawContextKey;
    exports.IContextKeyService = instantiation_1.createDecorator('contextKeyService');
    exports.SET_CONTEXT_COMMAND_ID = 'setContext';
});
//# sourceMappingURL=contextkey.js.map