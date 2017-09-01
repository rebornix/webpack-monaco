define(["require", "exports", "vs/base/common/types"], function (require, exports, Types) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValidationState;
    (function (ValidationState) {
        ValidationState[ValidationState["OK"] = 0] = "OK";
        ValidationState[ValidationState["Info"] = 1] = "Info";
        ValidationState[ValidationState["Warning"] = 2] = "Warning";
        ValidationState[ValidationState["Error"] = 3] = "Error";
        ValidationState[ValidationState["Fatal"] = 4] = "Fatal";
    })(ValidationState = exports.ValidationState || (exports.ValidationState = {}));
    var ValidationStatus = (function () {
        function ValidationStatus() {
            this._state = ValidationState.OK;
        }
        Object.defineProperty(ValidationStatus.prototype, "state", {
            get: function () {
                return this._state;
            },
            set: function (value) {
                if (value > this._state) {
                    this._state = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        ValidationStatus.prototype.isOK = function () {
            return this._state === ValidationState.OK;
        };
        ValidationStatus.prototype.isFatal = function () {
            return this._state === ValidationState.Fatal;
        };
        return ValidationStatus;
    }());
    exports.ValidationStatus = ValidationStatus;
    var NullProblemReporter = (function () {
        function NullProblemReporter() {
            this.status = new ValidationStatus();
        }
        NullProblemReporter.prototype.info = function (message) { };
        ;
        NullProblemReporter.prototype.warn = function (message) { };
        ;
        NullProblemReporter.prototype.error = function (message) { };
        ;
        NullProblemReporter.prototype.fatal = function (message) { };
        ;
        return NullProblemReporter;
    }());
    exports.NullProblemReporter = NullProblemReporter;
    var Parser = (function () {
        function Parser(problemReporter) {
            this._problemReporter = problemReporter;
        }
        Parser.prototype.reset = function () {
            this._problemReporter.status.state = ValidationState.OK;
        };
        Object.defineProperty(Parser.prototype, "problemReporter", {
            get: function () {
                return this._problemReporter;
            },
            enumerable: true,
            configurable: true
        });
        Parser.prototype.info = function (message) {
            this._problemReporter.info(message);
        };
        Parser.prototype.warn = function (message) {
            this._problemReporter.warn(message);
        };
        Parser.prototype.error = function (message) {
            this._problemReporter.error(message);
        };
        Parser.prototype.fatal = function (message) {
            this._problemReporter.fatal(message);
        };
        Parser.prototype.is = function (value, func, wrongTypeState, wrongTypeMessage, undefinedState, undefinedMessage) {
            if (Types.isUndefined(value)) {
                if (undefinedState) {
                    this._problemReporter.status.state = undefinedState;
                }
                if (undefinedMessage) {
                    this._problemReporter.info(undefinedMessage);
                }
                return false;
            }
            if (!func(value)) {
                if (wrongTypeState) {
                    this._problemReporter.status.state = wrongTypeState;
                }
                if (wrongTypeMessage) {
                    this.info(wrongTypeMessage);
                }
                return false;
            }
            return true;
        };
        Parser.merge = function (destination, source, overwrite) {
            var _this = this;
            Object.keys(source).forEach(function (key) {
                var destValue = destination[key];
                var sourceValue = source[key];
                if (Types.isUndefined(sourceValue)) {
                    return;
                }
                if (Types.isUndefined(destValue)) {
                    destination[key] = sourceValue;
                }
                else {
                    if (overwrite) {
                        if (Types.isObject(destValue) && Types.isObject(sourceValue)) {
                            _this.merge(destValue, sourceValue, overwrite);
                        }
                        else {
                            destination[key] = sourceValue;
                        }
                    }
                }
            });
        };
        return Parser;
    }());
    exports.Parser = Parser;
    var AbstractSystemVariables = (function () {
        function AbstractSystemVariables() {
        }
        AbstractSystemVariables.prototype.resolve = function (value) {
            if (Types.isString(value)) {
                return this.resolveString(value);
            }
            else if (Types.isArray(value)) {
                return this.__resolveArray(value);
            }
            else if (Types.isObject(value)) {
                return this.__resolveLiteral(value);
            }
            return value;
        };
        AbstractSystemVariables.prototype.resolveAny = function (value) {
            if (Types.isString(value)) {
                return this.resolveString(value);
            }
            else if (Types.isArray(value)) {
                return this.__resolveAnyArray(value);
            }
            else if (Types.isObject(value)) {
                return this.__resolveAnyLiteral(value);
            }
            return value;
        };
        AbstractSystemVariables.prototype.resolveString = function (value) {
            var _this = this;
            var regexp = /\$\{(.*?)\}/g;
            return value.replace(regexp, function (match, name) {
                var newValue = _this[name];
                if (Types.isString(newValue)) {
                    return newValue;
                }
                else {
                    return match && match.indexOf('env.') > 0 ? '' : match;
                }
            });
        };
        AbstractSystemVariables.prototype.__resolveLiteral = function (values) {
            var _this = this;
            var result = Object.create(null);
            Object.keys(values).forEach(function (key) {
                var value = values[key];
                result[key] = _this.resolve(value);
            });
            return result;
        };
        AbstractSystemVariables.prototype.__resolveAnyLiteral = function (values) {
            var _this = this;
            var result = Object.create(null);
            Object.keys(values).forEach(function (key) {
                var value = values[key];
                result[key] = _this.resolveAny(value);
            });
            return result;
        };
        AbstractSystemVariables.prototype.__resolveArray = function (value) {
            var _this = this;
            return value.map(function (s) { return _this.resolveString(s); });
        };
        AbstractSystemVariables.prototype.__resolveAnyArray = function (value) {
            var _this = this;
            return value.map(function (s) { return _this.resolveAny(s); });
        };
        return AbstractSystemVariables;
    }());
    exports.AbstractSystemVariables = AbstractSystemVariables;
});
//# sourceMappingURL=parsers.js.map