/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
define(["require", "exports", "vs/nls", "vs/base/common/paths", "vs/base/common/winjs.base", "vs/base/common/lifecycle", "vs/base/common/event", "vs/base/common/uuid", "vs/base/common/errors", "vs/base/common/async", "vs/base/common/types", "vs/base/common/arrays", "vs/editor/common/core/range", "vs/workbench/parts/debug/common/debug", "vs/workbench/parts/debug/common/debugSource"], function (require, exports, nls, paths, winjs_base_1, lifecycle, event_1, uuid_1, errors, async_1, types_1, arrays_1, range_1, debug_1, debugSource_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MAX_REPL_LENGTH = 10000;
    var AbstractOutputElement = (function () {
        function AbstractOutputElement(id) {
            if (id === void 0) { id = AbstractOutputElement.ID_COUNTER++; }
            this.id = id;
            // noop
        }
        AbstractOutputElement.prototype.getId = function () {
            return "outputelement:" + this.id;
        };
        AbstractOutputElement.ID_COUNTER = 0;
        return AbstractOutputElement;
    }());
    exports.AbstractOutputElement = AbstractOutputElement;
    var OutputElement = (function (_super) {
        __extends(OutputElement, _super);
        function OutputElement(value, severity) {
            var _this = _super.call(this) || this;
            _this.value = value;
            _this.severity = severity;
            return _this;
        }
        OutputElement.prototype.toString = function () {
            return this.value;
        };
        return OutputElement;
    }(AbstractOutputElement));
    exports.OutputElement = OutputElement;
    var OutputNameValueElement = (function (_super) {
        __extends(OutputNameValueElement, _super);
        function OutputNameValueElement(name, valueObj, annotation) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.valueObj = valueObj;
            _this.annotation = annotation;
            return _this;
        }
        Object.defineProperty(OutputNameValueElement.prototype, "value", {
            get: function () {
                if (this.valueObj === null) {
                    return 'null';
                }
                else if (Array.isArray(this.valueObj)) {
                    return "Array[" + this.valueObj.length + "]";
                }
                else if (types_1.isObject(this.valueObj)) {
                    return 'Object';
                }
                else if (types_1.isString(this.valueObj)) {
                    return "\"" + this.valueObj + "\"";
                }
                return String(this.valueObj) || '';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OutputNameValueElement.prototype, "hasChildren", {
            get: function () {
                return (Array.isArray(this.valueObj) && this.valueObj.length > 0) || (types_1.isObject(this.valueObj) && Object.getOwnPropertyNames(this.valueObj).length > 0);
            },
            enumerable: true,
            configurable: true
        });
        OutputNameValueElement.prototype.getChildren = function () {
            var _this = this;
            var result = [];
            if (Array.isArray(this.valueObj)) {
                result = this.valueObj.slice(0, OutputNameValueElement.MAX_CHILDREN)
                    .map(function (v, index) { return new OutputNameValueElement(String(index), v); });
            }
            else if (types_1.isObject(this.valueObj)) {
                result = Object.getOwnPropertyNames(this.valueObj).slice(0, OutputNameValueElement.MAX_CHILDREN)
                    .map(function (key) { return new OutputNameValueElement(key, _this.valueObj[key]); });
            }
            return winjs_base_1.TPromise.as(result);
        };
        OutputNameValueElement.prototype.toString = function () {
            return this.name ? this.name + ": " + this.value : this.value;
        };
        OutputNameValueElement.MAX_CHILDREN = 1000; // upper bound of children per value
        return OutputNameValueElement;
    }(AbstractOutputElement));
    exports.OutputNameValueElement = OutputNameValueElement;
    var ExpressionContainer = (function () {
        function ExpressionContainer(process, _reference, id, namedVariables, indexedVariables, startOfVariables) {
            if (namedVariables === void 0) { namedVariables = 0; }
            if (indexedVariables === void 0) { indexedVariables = 0; }
            if (startOfVariables === void 0) { startOfVariables = 0; }
            this.process = process;
            this._reference = _reference;
            this.id = id;
            this.namedVariables = namedVariables;
            this.indexedVariables = indexedVariables;
            this.startOfVariables = startOfVariables;
        }
        Object.defineProperty(ExpressionContainer.prototype, "reference", {
            get: function () {
                return this._reference;
            },
            set: function (value) {
                this._reference = value;
                this.children = undefined; // invalidate children cache
            },
            enumerable: true,
            configurable: true
        });
        ExpressionContainer.prototype.getChildren = function () {
            if (!this.children) {
                this.children = this.doGetChildren();
            }
            return this.children;
        };
        ExpressionContainer.prototype.doGetChildren = function () {
            var _this = this;
            if (!this.hasChildren) {
                return winjs_base_1.TPromise.as([]);
            }
            if (!this.getChildrenInChunks) {
                return this.fetchVariables(undefined, undefined, undefined);
            }
            // Check if object has named variables, fetch them independent from indexed variables #9670
            return (!!this.namedVariables ? this.fetchVariables(undefined, undefined, 'named') : winjs_base_1.TPromise.as([])).then(function (childrenArray) {
                // Use a dynamic chunk size based on the number of elements #9774
                var chunkSize = ExpressionContainer.BASE_CHUNK_SIZE;
                while (_this.indexedVariables > chunkSize * ExpressionContainer.BASE_CHUNK_SIZE) {
                    chunkSize *= ExpressionContainer.BASE_CHUNK_SIZE;
                }
                if (_this.indexedVariables > chunkSize) {
                    // There are a lot of children, create fake intermediate values that represent chunks #9537
                    var numberOfChunks = Math.ceil(_this.indexedVariables / chunkSize);
                    for (var i = 0; i < numberOfChunks; i++) {
                        var start = _this.startOfVariables + i * chunkSize;
                        var count = Math.min(chunkSize, _this.indexedVariables - i * chunkSize);
                        childrenArray.push(new Variable(_this.process, _this, _this.reference, "[" + start + ".." + (start + count - 1) + "]", '', '', null, count, null, true, start));
                    }
                    return childrenArray;
                }
                return _this.fetchVariables(_this.startOfVariables, _this.indexedVariables, 'indexed')
                    .then(function (variables) { return childrenArray.concat(variables); });
            });
        };
        ExpressionContainer.prototype.getId = function () {
            return this.id;
        };
        Object.defineProperty(ExpressionContainer.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                this._value = value;
                this.valueChanged = ExpressionContainer.allValues.get(this.getId()) &&
                    ExpressionContainer.allValues.get(this.getId()) !== Expression.DEFAULT_VALUE && ExpressionContainer.allValues.get(this.getId()) !== value;
                ExpressionContainer.allValues.set(this.getId(), value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExpressionContainer.prototype, "hasChildren", {
            get: function () {
                // only variables with reference > 0 have children.
                return this.reference > 0;
            },
            enumerable: true,
            configurable: true
        });
        ExpressionContainer.prototype.fetchVariables = function (start, count, filter) {
            var _this = this;
            return this.process.session.variables({
                variablesReference: this.reference,
                start: start,
                count: count,
                filter: filter
            }).then(function (response) {
                return response && response.body && response.body.variables ? arrays_1.distinct(response.body.variables.filter(function (v) { return !!v && v.name; }), function (v) { return v.name; }).map(function (v) { return new Variable(_this.process, _this, v.variablesReference, v.name, v.evaluateName, v.value, v.namedVariables, v.indexedVariables, v.type); }) : [];
            }, function (e) { return [new Variable(_this.process, _this, 0, null, e.message, '', 0, 0, null, false)]; });
        };
        Object.defineProperty(ExpressionContainer.prototype, "getChildrenInChunks", {
            // The adapter explicitly sents the children count of an expression only if there are lots of children which should be chunked.
            get: function () {
                return !!this.indexedVariables;
            },
            enumerable: true,
            configurable: true
        });
        ExpressionContainer.prototype.toString = function () {
            return this.value;
        };
        ExpressionContainer.allValues = new Map();
        // Use chunks to support variable paging #9537
        ExpressionContainer.BASE_CHUNK_SIZE = 100;
        return ExpressionContainer;
    }());
    exports.ExpressionContainer = ExpressionContainer;
    var Expression = (function (_super) {
        __extends(Expression, _super);
        function Expression(name, id) {
            if (id === void 0) { id = uuid_1.generateUuid(); }
            var _this = _super.call(this, null, 0, id) || this;
            _this.name = name;
            _this.available = false;
            // name is not set if the expression is just being added
            // in that case do not set default value to prevent flashing #14499
            if (name) {
                _this.value = Expression.DEFAULT_VALUE;
            }
            return _this;
        }
        Expression.prototype.evaluate = function (process, stackFrame, context) {
            var _this = this;
            if (!process || (!stackFrame && context !== 'repl')) {
                this.value = context === 'repl' ? nls.localize('startDebugFirst', "Please start a debug session to evaluate") : Expression.DEFAULT_VALUE;
                this.available = false;
                this.reference = 0;
                return winjs_base_1.TPromise.as(null);
            }
            this.process = process;
            return process.session.evaluate({
                expression: this.name,
                frameId: stackFrame ? stackFrame.frameId : undefined,
                context: context
            }).then(function (response) {
                _this.available = !!(response && response.body);
                if (response && response.body) {
                    _this.value = response.body.result;
                    _this.reference = response.body.variablesReference;
                    _this.namedVariables = response.body.namedVariables;
                    _this.indexedVariables = response.body.indexedVariables;
                    _this.type = response.body.type;
                }
            }, function (err) {
                _this.value = err.message;
                _this.available = false;
                _this.reference = 0;
            });
        };
        Expression.prototype.toString = function () {
            return this.name + "\n" + this.value;
        };
        Expression.DEFAULT_VALUE = nls.localize('notAvailable', "not available");
        return Expression;
    }(ExpressionContainer));
    exports.Expression = Expression;
    var Variable = (function (_super) {
        __extends(Variable, _super);
        function Variable(process, parent, reference, name, evaluateName, value, namedVariables, indexedVariables, type, available, startOfVariables) {
            if (type === void 0) { type = null; }
            if (available === void 0) { available = true; }
            if (startOfVariables === void 0) { startOfVariables = 0; }
            var _this = _super.call(this, process, reference, "variable:" + parent.getId() + ":" + name + ":" + reference, namedVariables, indexedVariables, startOfVariables) || this;
            _this.parent = parent;
            _this.name = name;
            _this.evaluateName = evaluateName;
            _this.type = type;
            _this.available = available;
            _this.value = value;
            return _this;
        }
        Variable.prototype.setVariable = function (value) {
            var _this = this;
            return this.process.session.setVariable({
                name: this.name,
                value: value,
                variablesReference: this.parent.reference
            }).then(function (response) {
                if (response && response.body) {
                    _this.value = response.body.value;
                    _this.type = response.body.type || _this.type;
                    _this.reference = response.body.variablesReference;
                    _this.namedVariables = response.body.namedVariables;
                    _this.indexedVariables = response.body.indexedVariables;
                }
            }, function (err) {
                _this.errorMessage = err.message;
            });
        };
        Variable.prototype.toString = function () {
            return this.name + ": " + this.value;
        };
        return Variable;
    }(ExpressionContainer));
    exports.Variable = Variable;
    var Scope = (function (_super) {
        __extends(Scope, _super);
        function Scope(stackFrame, name, reference, expensive, namedVariables, indexedVariables, range) {
            var _this = _super.call(this, stackFrame.thread.process, reference, "scope:" + stackFrame.getId() + ":" + name + ":" + reference, namedVariables, indexedVariables) || this;
            _this.name = name;
            _this.expensive = expensive;
            _this.range = range;
            return _this;
        }
        return Scope;
    }(ExpressionContainer));
    exports.Scope = Scope;
    var StackFrame = (function () {
        function StackFrame(thread, frameId, source, name, presentationHint, range, index) {
            this.thread = thread;
            this.frameId = frameId;
            this.source = source;
            this.name = name;
            this.presentationHint = presentationHint;
            this.range = range;
            this.index = index;
            this.scopes = null;
        }
        StackFrame.prototype.getId = function () {
            return "stackframe:" + this.thread.getId() + ":" + this.frameId + ":" + this.index;
        };
        StackFrame.prototype.getScopes = function () {
            var _this = this;
            if (!this.scopes) {
                this.scopes = this.thread.process.session.scopes({ frameId: this.frameId }).then(function (response) {
                    return response && response.body && response.body.scopes ?
                        response.body.scopes.map(function (rs) { return new Scope(_this, rs.name, rs.variablesReference, rs.expensive, rs.namedVariables, rs.indexedVariables, rs.line && rs.column && rs.endLine && rs.endColumn ? new range_1.Range(rs.line, rs.column, rs.endLine, rs.endColumn) : null); }) : [];
                }, function (err) { return []; });
            }
            return this.scopes;
        };
        StackFrame.prototype.getMostSpecificScopes = function (range) {
            return this.getScopes().then(function (scopes) {
                scopes = scopes.filter(function (s) { return !s.expensive; });
                var haveRangeInfo = scopes.some(function (s) { return !!s.range; });
                if (!haveRangeInfo) {
                    return scopes;
                }
                var scopesContainingRange = scopes.filter(function (scope) { return scope.range && range_1.Range.containsRange(scope.range, range); })
                    .sort(function (first, second) { return (first.range.endLineNumber - first.range.startLineNumber) - (second.range.endLineNumber - second.range.startLineNumber); });
                return scopesContainingRange.length ? scopesContainingRange : scopes;
            });
        };
        StackFrame.prototype.restart = function () {
            return this.thread.process.session.restartFrame({ frameId: this.frameId }, this.thread.threadId);
        };
        StackFrame.prototype.toString = function () {
            return this.name + " (" + (this.source.inMemory ? this.source.name : this.source.uri.fsPath) + ":" + this.range.startLineNumber + ")";
        };
        StackFrame.prototype.openInEditor = function (editorService, preserveFocus, sideBySide) {
            return !this.source.available ? winjs_base_1.TPromise.as(null) : editorService.openEditor({
                resource: this.source.uri,
                description: this.source.origin,
                options: {
                    preserveFocus: preserveFocus,
                    selection: this.range,
                    revealIfVisible: true,
                    revealInCenterIfOutsideViewport: true,
                    pinned: !preserveFocus
                }
            }, sideBySide);
        };
        return StackFrame;
    }());
    exports.StackFrame = StackFrame;
    var Thread = (function () {
        function Thread(process, name, threadId) {
            this.process = process;
            this.name = name;
            this.threadId = threadId;
            this.stoppedDetails = null;
            this.callStack = [];
            this.staleCallStack = [];
            this.stopped = false;
        }
        Thread.prototype.getId = function () {
            return "thread:" + this.process.getId() + ":" + this.threadId;
        };
        Thread.prototype.clearCallStack = function () {
            if (this.callStack.length) {
                this.staleCallStack = this.callStack;
            }
            this.callStack = [];
        };
        Thread.prototype.getCallStack = function () {
            return this.callStack;
        };
        Thread.prototype.getStaleCallStack = function () {
            return this.staleCallStack;
        };
        /**
         * Queries the debug adapter for the callstack and returns a promise
         * which completes once the call stack has been retrieved.
         * If the thread is not stopped, it returns a promise to an empty array.
         * Only fetches the first stack frame for performance reasons. Calling this method consecutive times
         * gets the remainder of the call stack.
         */
        Thread.prototype.fetchCallStack = function (levels) {
            var _this = this;
            if (levels === void 0) { levels = 20; }
            if (!this.stopped) {
                return winjs_base_1.TPromise.as(null);
            }
            var start = this.callStack.length;
            return this.getCallStackImpl(start, levels).then(function (callStack) {
                if (start < _this.callStack.length) {
                    // Set the stack frames for exact position we requested. To make sure no concurrent requests create duplicate stack frames #30660
                    _this.callStack.splice(start, _this.callStack.length - start);
                }
                _this.callStack = _this.callStack.concat(callStack || []);
            });
        };
        Thread.prototype.getCallStackImpl = function (startFrame, levels) {
            var _this = this;
            return this.process.session.stackTrace({ threadId: this.threadId, startFrame: startFrame, levels: levels }).then(function (response) {
                if (!response || !response.body) {
                    return [];
                }
                if (_this.stoppedDetails) {
                    _this.stoppedDetails.totalFrames = response.body.totalFrames;
                }
                return response.body.stackFrames.map(function (rsf, index) {
                    var source = new debugSource_1.Source(rsf.source);
                    if (_this.process.sources.has(source.uri.toString())) {
                        source = _this.process.sources.get(source.uri.toString());
                    }
                    else {
                        _this.process.sources.set(source.uri.toString(), source);
                    }
                    return new StackFrame(_this, rsf.id, source, rsf.name, rsf.presentationHint, new range_1.Range(rsf.line, rsf.column, rsf.endLine, rsf.endColumn), startFrame + index);
                });
            }, function (err) {
                if (_this.stoppedDetails) {
                    _this.stoppedDetails.framesErrorMessage = err.message;
                }
                return [];
            });
        };
        Object.defineProperty(Thread.prototype, "exceptionInfo", {
            /**
             * Returns exception info promise if the exception was thrown, otherwise null
             */
            get: function () {
                var session = this.process.session;
                if (this.stoppedDetails && this.stoppedDetails.reason === 'exception') {
                    if (!session.capabilities.supportsExceptionInfoRequest) {
                        return winjs_base_1.TPromise.as({
                            description: this.stoppedDetails.text,
                            breakMode: null
                        });
                    }
                    return session.exceptionInfo({ threadId: this.threadId }).then(function (exception) {
                        if (!exception) {
                            return null;
                        }
                        return {
                            id: exception.body.exceptionId,
                            description: exception.body.description,
                            breakMode: exception.body.breakMode,
                            details: exception.body.details
                        };
                    });
                }
                return winjs_base_1.TPromise.as(null);
            },
            enumerable: true,
            configurable: true
        });
        Thread.prototype.next = function () {
            return this.process.session.next({ threadId: this.threadId });
        };
        Thread.prototype.stepIn = function () {
            return this.process.session.stepIn({ threadId: this.threadId });
        };
        Thread.prototype.stepOut = function () {
            return this.process.session.stepOut({ threadId: this.threadId });
        };
        Thread.prototype.stepBack = function () {
            return this.process.session.stepBack({ threadId: this.threadId });
        };
        Thread.prototype.continue = function () {
            return this.process.session.continue({ threadId: this.threadId });
        };
        Thread.prototype.pause = function () {
            return this.process.session.pause({ threadId: this.threadId });
        };
        Thread.prototype.reverseContinue = function () {
            return this.process.session.reverseContinue({ threadId: this.threadId });
        };
        return Thread;
    }());
    exports.Thread = Thread;
    var Process = (function () {
        function Process(configuration, _session) {
            var _this = this;
            this.configuration = configuration;
            this._session = _session;
            this.inactive = true;
            this.threads = new Map();
            this.sources = new Map();
            this._session.onDidInitialize(function () { return _this.inactive = false; });
        }
        Object.defineProperty(Process.prototype, "session", {
            get: function () {
                return this._session;
            },
            enumerable: true,
            configurable: true
        });
        Process.prototype.getName = function (includeRoot) {
            return includeRoot ? this.configuration.name + " (" + paths.basename(this.session.root.fsPath) + ")" : this.configuration.name;
        };
        Object.defineProperty(Process.prototype, "state", {
            get: function () {
                if (this.inactive) {
                    return debug_1.ProcessState.INACTIVE;
                }
                return this.configuration.type === 'attach' ? debug_1.ProcessState.ATTACH : debug_1.ProcessState.LAUNCH;
            },
            enumerable: true,
            configurable: true
        });
        Process.prototype.getThread = function (threadId) {
            return this.threads.get(threadId);
        };
        Process.prototype.getAllThreads = function () {
            var result = [];
            this.threads.forEach(function (t) { return result.push(t); });
            return result;
        };
        Process.prototype.getId = function () {
            return this._session.getId();
        };
        Process.prototype.rawUpdate = function (data) {
            if (data.thread && !this.threads.has(data.threadId)) {
                // A new thread came in, initialize it.
                this.threads.set(data.threadId, new Thread(this, data.thread.name, data.thread.id));
            }
            else if (data.thread && data.thread.name) {
                // Just the thread name got updated #18244
                this.threads.get(data.threadId).name = data.thread.name;
            }
            if (data.stoppedDetails) {
                // Set the availability of the threads' callstacks depending on
                // whether the thread is stopped or not
                if (data.allThreadsStopped) {
                    this.threads.forEach(function (thread) {
                        thread.stoppedDetails = thread.threadId === data.threadId ? data.stoppedDetails : { reason: undefined };
                        thread.stopped = true;
                        thread.clearCallStack();
                    });
                }
                else if (this.threads.has(data.threadId)) {
                    // One thread is stopped, only update that thread.
                    var thread = this.threads.get(data.threadId);
                    thread.stoppedDetails = data.stoppedDetails;
                    thread.clearCallStack();
                    thread.stopped = true;
                }
            }
        };
        Process.prototype.clearThreads = function (removeThreads, reference) {
            if (reference === void 0) { reference = undefined; }
            if (reference) {
                if (this.threads.has(reference)) {
                    var thread = this.threads.get(reference);
                    thread.clearCallStack();
                    thread.stoppedDetails = undefined;
                    thread.stopped = false;
                    if (removeThreads) {
                        this.threads.delete(reference);
                    }
                }
            }
            else {
                this.threads.forEach(function (thread) {
                    thread.clearCallStack();
                    thread.stoppedDetails = undefined;
                    thread.stopped = false;
                });
                if (removeThreads) {
                    this.threads.clear();
                    ExpressionContainer.allValues.clear();
                }
            }
        };
        Process.prototype.completions = function (frameId, text, position, overwriteBefore) {
            if (!this.session.capabilities.supportsCompletionsRequest) {
                return winjs_base_1.TPromise.as([]);
            }
            return this.session.completions({
                frameId: frameId,
                text: text,
                column: position.column,
                line: position.lineNumber
            }).then(function (response) {
                var result = [];
                if (response && response.body && response.body.targets) {
                    response.body.targets.forEach(function (item) {
                        if (item && item.label) {
                            result.push({
                                label: item.label,
                                insertText: item.text || item.label,
                                type: item.type,
                                filterText: item.start && item.length && text.substr(item.start, item.length).concat(item.label),
                                overwriteBefore: item.length || overwriteBefore
                            });
                        }
                    });
                }
                return result;
            }, function (err) { return []; });
        };
        return Process;
    }());
    exports.Process = Process;
    var Breakpoint = (function () {
        function Breakpoint(uri, lineNumber, column, enabled, condition, hitCondition) {
            this.uri = uri;
            this.lineNumber = lineNumber;
            this.column = column;
            this.enabled = enabled;
            this.condition = condition;
            this.hitCondition = hitCondition;
            if (enabled === undefined) {
                this.enabled = true;
            }
            this.verified = false;
            this.id = uuid_1.generateUuid();
        }
        Breakpoint.prototype.getId = function () {
            return this.id;
        };
        return Breakpoint;
    }());
    exports.Breakpoint = Breakpoint;
    var FunctionBreakpoint = (function () {
        function FunctionBreakpoint(name, enabled, hitCondition) {
            this.name = name;
            this.enabled = enabled;
            this.hitCondition = hitCondition;
            this.verified = false;
            this.id = uuid_1.generateUuid();
        }
        FunctionBreakpoint.prototype.getId = function () {
            return this.id;
        };
        return FunctionBreakpoint;
    }());
    exports.FunctionBreakpoint = FunctionBreakpoint;
    var ExceptionBreakpoint = (function () {
        function ExceptionBreakpoint(filter, label, enabled) {
            this.filter = filter;
            this.label = label;
            this.enabled = enabled;
            this.id = uuid_1.generateUuid();
        }
        ExceptionBreakpoint.prototype.getId = function () {
            return this.id;
        };
        return ExceptionBreakpoint;
    }());
    exports.ExceptionBreakpoint = ExceptionBreakpoint;
    var ThreadAndProcessIds = (function () {
        function ThreadAndProcessIds(processId, threadId) {
            this.processId = processId;
            this.threadId = threadId;
        }
        ThreadAndProcessIds.prototype.getId = function () {
            return this.processId + ":" + this.threadId;
        };
        return ThreadAndProcessIds;
    }());
    exports.ThreadAndProcessIds = ThreadAndProcessIds;
    var Model = (function () {
        function Model(breakpoints, breakpointsActivated, functionBreakpoints, exceptionBreakpoints, watchExpressions) {
            this.breakpoints = breakpoints;
            this.breakpointsActivated = breakpointsActivated;
            this.functionBreakpoints = functionBreakpoints;
            this.exceptionBreakpoints = exceptionBreakpoints;
            this.watchExpressions = watchExpressions;
            this.schedulers = new Map();
            this.processes = [];
            this.replElements = [];
            this.toDispose = [];
            this._onDidChangeBreakpoints = new event_1.Emitter();
            this._onDidChangeCallStack = new event_1.Emitter();
            this._onDidChangeWatchExpressions = new event_1.Emitter();
            this._onDidChangeREPLElements = new event_1.Emitter();
        }
        Model.prototype.getId = function () {
            return 'root';
        };
        Model.prototype.getProcesses = function () {
            return this.processes;
        };
        Model.prototype.addProcess = function (configuration, session) {
            var process = new Process(configuration, session);
            this.processes.push(process);
            return process;
        };
        Model.prototype.removeProcess = function (id) {
            this.processes = this.processes.filter(function (p) { return p.getId() !== id; });
            this._onDidChangeCallStack.fire();
        };
        Object.defineProperty(Model.prototype, "onDidChangeBreakpoints", {
            get: function () {
                return this._onDidChangeBreakpoints.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Model.prototype, "onDidChangeCallStack", {
            get: function () {
                return this._onDidChangeCallStack.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Model.prototype, "onDidChangeWatchExpressions", {
            get: function () {
                return this._onDidChangeWatchExpressions.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Model.prototype, "onDidChangeReplElements", {
            get: function () {
                return this._onDidChangeREPLElements.event;
            },
            enumerable: true,
            configurable: true
        });
        Model.prototype.rawUpdate = function (data) {
            var process = this.processes.filter(function (p) { return p.getId() === data.sessionId; }).pop();
            if (process) {
                process.rawUpdate(data);
                this._onDidChangeCallStack.fire();
            }
        };
        Model.prototype.clearThreads = function (id, removeThreads, reference) {
            if (reference === void 0) { reference = undefined; }
            var process = this.processes.filter(function (p) { return p.getId() === id; }).pop();
            this.schedulers.forEach(function (scheduler) { return scheduler.dispose(); });
            this.schedulers.clear();
            if (process) {
                process.clearThreads(removeThreads, reference);
                this._onDidChangeCallStack.fire();
            }
        };
        Model.prototype.fetchCallStack = function (thread) {
            var _this = this;
            if (thread.process.session.capabilities.supportsDelayedStackTraceLoading) {
                // For improved performance load the first stack frame and then load the rest async.
                return thread.fetchCallStack(1).then(function () {
                    if (!_this.schedulers.has(thread.getId())) {
                        _this.schedulers.set(thread.getId(), new async_1.RunOnceScheduler(function () {
                            thread.fetchCallStack(19).done(function () { return _this._onDidChangeCallStack.fire(); }, errors.onUnexpectedError);
                        }, 420));
                    }
                    _this.schedulers.get(thread.getId()).schedule();
                    _this._onDidChangeCallStack.fire();
                });
            }
            return thread.fetchCallStack();
        };
        Model.prototype.getBreakpoints = function () {
            return this.breakpoints;
        };
        Model.prototype.getFunctionBreakpoints = function () {
            return this.functionBreakpoints;
        };
        Model.prototype.getExceptionBreakpoints = function () {
            return this.exceptionBreakpoints;
        };
        Model.prototype.setExceptionBreakpoints = function (data) {
            var _this = this;
            if (data) {
                this.exceptionBreakpoints = data.map(function (d) {
                    var ebp = _this.exceptionBreakpoints.filter(function (ebp) { return ebp.filter === d.filter; }).pop();
                    return new ExceptionBreakpoint(d.filter, d.label, ebp ? ebp.enabled : d.default);
                });
            }
        };
        Model.prototype.areBreakpointsActivated = function () {
            return this.breakpointsActivated;
        };
        Model.prototype.setBreakpointsActivated = function (activated) {
            this.breakpointsActivated = activated;
            this._onDidChangeBreakpoints.fire();
        };
        Model.prototype.addBreakpoints = function (uri, rawData) {
            this.breakpoints = this.breakpoints.concat(rawData.map(function (rawBp) {
                return new Breakpoint(uri, rawBp.lineNumber, rawBp.column, rawBp.enabled, rawBp.condition, rawBp.hitCondition);
            }));
            this.breakpointsActivated = true;
            this.breakpoints = arrays_1.distinct(this.breakpoints, function (bp) { return bp.uri.toString() + ":" + bp.lineNumber + ":" + bp.column; });
            this._onDidChangeBreakpoints.fire();
        };
        Model.prototype.removeBreakpoints = function (toRemove) {
            this.breakpoints = this.breakpoints.filter(function (bp) { return !toRemove.some(function (toRemove) { return toRemove.getId() === bp.getId(); }); });
            this._onDidChangeBreakpoints.fire();
        };
        Model.prototype.updateBreakpoints = function (data) {
            this.breakpoints.forEach(function (bp) {
                var bpData = data[bp.getId()];
                if (bpData) {
                    bp.lineNumber = bpData.line ? bpData.line : bp.lineNumber;
                    bp.endLineNumber = bpData.endLine;
                    bp.column = bpData.column;
                    bp.endColumn = bpData.endColumn;
                    bp.verified = bpData.verified;
                    bp.idFromAdapter = bpData.id;
                    bp.message = bpData.message;
                }
            });
            this.breakpoints = arrays_1.distinct(this.breakpoints, function (bp) { return bp.uri.toString() + ":" + bp.lineNumber + ":" + bp.column; });
            this._onDidChangeBreakpoints.fire();
        };
        Model.prototype.setEnablement = function (element, enable) {
            element.enabled = enable;
            if (element instanceof Breakpoint && !element.enabled) {
                var breakpoint = element;
                breakpoint.verified = false;
            }
            this._onDidChangeBreakpoints.fire();
        };
        Model.prototype.enableOrDisableAllBreakpoints = function (enable) {
            this.breakpoints.forEach(function (bp) {
                bp.enabled = enable;
                if (!enable) {
                    bp.verified = false;
                }
            });
            this.exceptionBreakpoints.forEach(function (ebp) { return ebp.enabled = enable; });
            this.functionBreakpoints.forEach(function (fbp) { return fbp.enabled = enable; });
            this._onDidChangeBreakpoints.fire();
        };
        Model.prototype.addFunctionBreakpoint = function (functionName) {
            this.functionBreakpoints.push(new FunctionBreakpoint(functionName, true, null));
            this._onDidChangeBreakpoints.fire();
        };
        Model.prototype.updateFunctionBreakpoints = function (data) {
            this.functionBreakpoints.forEach(function (fbp) {
                var fbpData = data[fbp.getId()];
                if (fbpData) {
                    fbp.name = fbpData.name || fbp.name;
                    fbp.verified = fbpData.verified;
                    fbp.idFromAdapter = fbpData.id;
                    fbp.hitCondition = fbpData.hitCondition;
                }
            });
            this._onDidChangeBreakpoints.fire();
        };
        Model.prototype.removeFunctionBreakpoints = function (id) {
            this.functionBreakpoints = id ? this.functionBreakpoints.filter(function (fbp) { return fbp.getId() !== id; }) : [];
            this._onDidChangeBreakpoints.fire();
        };
        Model.prototype.getReplElements = function () {
            return this.replElements;
        };
        Model.prototype.addReplExpression = function (process, stackFrame, name) {
            var _this = this;
            var expression = new Expression(name);
            this.addReplElements([expression]);
            return expression.evaluate(process, stackFrame, 'repl')
                .then(function () { return _this._onDidChangeREPLElements.fire(); });
        };
        Model.prototype.appendToRepl = function (output, severity) {
            if (typeof output === 'string') {
                var previousOutput = this.replElements.length && this.replElements[this.replElements.length - 1];
                var toAdd = output.split('\n').map(function (line) { return new OutputElement(line, severity); });
                if (previousOutput instanceof OutputElement && severity === previousOutput.severity && toAdd.length) {
                    previousOutput.value += toAdd.shift().value;
                }
                if (previousOutput && previousOutput.value === '' && previousOutput.severity !== severity) {
                    // remove potential empty lines between different output types
                    this.replElements.pop();
                }
                this.addReplElements(toAdd);
            }
            else {
                // TODO@Isidor hack, we should introduce a new type which is an output that can fetch children like an expression
                output.severity = severity;
                this.addReplElements([output]);
            }
            this._onDidChangeREPLElements.fire();
        };
        Model.prototype.addReplElements = function (newElements) {
            (_a = this.replElements).push.apply(_a, newElements);
            if (this.replElements.length > MAX_REPL_LENGTH) {
                this.replElements.splice(0, this.replElements.length - MAX_REPL_LENGTH);
            }
            var _a;
        };
        Model.prototype.removeReplExpressions = function () {
            if (this.replElements.length > 0) {
                this.replElements = [];
                this._onDidChangeREPLElements.fire();
            }
        };
        Model.prototype.getWatchExpressions = function () {
            return this.watchExpressions;
        };
        Model.prototype.addWatchExpression = function (process, stackFrame, name) {
            var we = new Expression(name);
            this.watchExpressions.push(we);
            if (!name) {
                this._onDidChangeWatchExpressions.fire(we);
                return winjs_base_1.TPromise.as(null);
            }
            return this.evaluateWatchExpressions(process, stackFrame, we.getId());
        };
        Model.prototype.renameWatchExpression = function (process, stackFrame, id, newName) {
            var _this = this;
            var filtered = this.watchExpressions.filter(function (we) { return we.getId() === id; });
            if (filtered.length === 1) {
                filtered[0].name = newName;
                // Evaluate all watch expressions again since the new watch expression might have changed some.
                return this.evaluateWatchExpressions(process, stackFrame).then(function () {
                    _this._onDidChangeWatchExpressions.fire(filtered[0]);
                });
            }
            return winjs_base_1.TPromise.as(null);
        };
        Model.prototype.evaluateWatchExpressions = function (process, stackFrame, id) {
            var _this = this;
            if (id === void 0) { id = null; }
            if (id) {
                var filtered_1 = this.watchExpressions.filter(function (we) { return we.getId() === id; });
                if (filtered_1.length !== 1) {
                    return winjs_base_1.TPromise.as(null);
                }
                return filtered_1[0].evaluate(process, stackFrame, 'watch').then(function () {
                    _this._onDidChangeWatchExpressions.fire(filtered_1[0]);
                });
            }
            return winjs_base_1.TPromise.join(this.watchExpressions.map(function (we) { return we.evaluate(process, stackFrame, 'watch'); })).then(function () {
                _this._onDidChangeWatchExpressions.fire();
            });
        };
        Model.prototype.removeWatchExpressions = function (id) {
            if (id === void 0) { id = null; }
            this.watchExpressions = id ? this.watchExpressions.filter(function (we) { return we.getId() !== id; }) : [];
            this._onDidChangeWatchExpressions.fire();
        };
        Model.prototype.moveWatchExpression = function (id, position) {
            var we = this.watchExpressions.filter(function (we) { return we.getId() === id; }).pop();
            this.watchExpressions = this.watchExpressions.filter(function (we) { return we.getId() !== id; });
            this.watchExpressions = this.watchExpressions.slice(0, position).concat(we, this.watchExpressions.slice(position));
            this._onDidChangeWatchExpressions.fire();
        };
        Model.prototype.sourceIsNotAvailable = function (uri) {
            this.processes.forEach(function (p) {
                if (p.sources.has(uri.toString())) {
                    p.sources.get(uri.toString()).available = false;
                }
            });
            this._onDidChangeCallStack.fire();
        };
        Model.prototype.dispose = function () {
            this.toDispose = lifecycle.dispose(this.toDispose);
        };
        return Model;
    }());
    exports.Model = Model;
});
//# sourceMappingURL=debugModel.js.map