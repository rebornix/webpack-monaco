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
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/common/objects", "vs/base/common/lifecycle", "vs/editor/common/core/range", "vs/editor/common/editorCommon", "vs/workbench/parts/debug/common/debug", "vs/editor/common/services/modelService", "vs/base/common/htmlContent"], function (require, exports, nls, winjs_base_1, objects, lifecycle, range_1, editorCommon_1, debug_1, modelService_1, htmlContent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var stickiness = editorCommon_1.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges;
    var DebugEditorModelManager = (function () {
        function DebugEditorModelManager(modelService, debugService) {
            this.modelService = modelService;
            this.debugService = debugService;
            this.modelDataMap = new Map();
            this.toDispose = [];
            this.registerListeners();
        }
        DebugEditorModelManager.prototype.getId = function () {
            return DebugEditorModelManager.ID;
        };
        DebugEditorModelManager.prototype.dispose = function () {
            this.modelDataMap.forEach(function (modelData) {
                lifecycle.dispose(modelData.toDispose);
                modelData.model.deltaDecorations(modelData.breakpointDecorationIds, []);
                modelData.model.deltaDecorations(modelData.currentStackDecorations, []);
            });
            this.toDispose = lifecycle.dispose(this.toDispose);
            this.modelDataMap.clear();
        };
        DebugEditorModelManager.prototype.registerListeners = function () {
            var _this = this;
            this.toDispose.push(this.modelService.onModelAdded(this.onModelAdded, this));
            this.modelService.getModels().forEach(function (model) { return _this.onModelAdded(model); });
            this.toDispose.push(this.modelService.onModelRemoved(this.onModelRemoved, this));
            this.toDispose.push(this.debugService.getModel().onDidChangeBreakpoints(function () { return _this.onBreakpointsChange(); }));
            this.toDispose.push(this.debugService.getViewModel().onDidFocusStackFrame(function () { return _this.onFocusStackFrame(); }));
            this.toDispose.push(this.debugService.onDidChangeState(function (state) {
                if (state === debug_1.State.Inactive) {
                    _this.modelDataMap.forEach(function (modelData) {
                        modelData.dirty = false;
                        modelData.topStackFrameRange = undefined;
                    });
                }
            }));
        };
        DebugEditorModelManager.prototype.onModelAdded = function (model) {
            var _this = this;
            var modelUrlStr = model.uri.toString();
            var breakpoints = this.debugService.getModel().getBreakpoints().filter(function (bp) { return bp.uri.toString() === modelUrlStr; });
            var currentStackDecorations = model.deltaDecorations([], this.createCallStackDecorations(modelUrlStr));
            var breakPointDecorations = model.deltaDecorations([], this.createBreakpointDecorations(breakpoints));
            var toDispose = [model.onDidChangeDecorations(function (e) { return _this.onModelDecorationsChanged(modelUrlStr, e); })];
            var breakpointDecorationsAsMap = new Map();
            breakPointDecorations.forEach(function (bpd) { return breakpointDecorationsAsMap.set(bpd, true); });
            this.modelDataMap.set(modelUrlStr, {
                model: model,
                toDispose: toDispose,
                breakpointDecorationIds: breakPointDecorations,
                breakpointLines: breakpoints.map(function (bp) { return bp.lineNumber; }),
                breakpointDecorationsAsMap: breakpointDecorationsAsMap,
                currentStackDecorations: currentStackDecorations,
                dirty: false,
                topStackFrameRange: undefined
            });
        };
        DebugEditorModelManager.prototype.onModelRemoved = function (model) {
            var modelUriStr = model.uri.toString();
            if (this.modelDataMap.has(modelUriStr)) {
                lifecycle.dispose(this.modelDataMap.get(modelUriStr).toDispose);
                this.modelDataMap.delete(modelUriStr);
            }
        };
        // call stack management. Represent data coming from the debug service.
        DebugEditorModelManager.prototype.onFocusStackFrame = function () {
            var _this = this;
            this.modelDataMap.forEach(function (modelData, uri) {
                modelData.currentStackDecorations = modelData.model.deltaDecorations(modelData.currentStackDecorations, _this.createCallStackDecorations(uri));
            });
        };
        DebugEditorModelManager.prototype.createCallStackDecorations = function (modelUriStr) {
            var result = [];
            var stackFrame = this.debugService.getViewModel().focusedStackFrame;
            if (!stackFrame || stackFrame.source.uri.toString() !== modelUriStr) {
                return result;
            }
            // only show decorations for the currently focused thread.
            var columnUntilEOLRange = new range_1.Range(stackFrame.range.startLineNumber, stackFrame.range.startColumn, stackFrame.range.startLineNumber, 1073741824 /* MAX_SAFE_SMALL_INTEGER */);
            var range = new range_1.Range(stackFrame.range.startLineNumber, stackFrame.range.startColumn, stackFrame.range.startLineNumber, stackFrame.range.startColumn + 1);
            // compute how to decorate the editor. Different decorations are used if this is a top stack frame, focused stack frame,
            // an exception or a stack frame that did not change the line number (we only decorate the columns, not the whole line).
            var callStack = stackFrame.thread.getCallStack();
            if (callStack && callStack.length && stackFrame === callStack[0]) {
                result.push({
                    options: DebugEditorModelManager.TOP_STACK_FRAME_MARGIN,
                    range: range
                });
                if (stackFrame.thread.stoppedDetails && stackFrame.thread.stoppedDetails.reason === 'exception') {
                    result.push({
                        options: DebugEditorModelManager.TOP_STACK_FRAME_EXCEPTION_DECORATION,
                        range: columnUntilEOLRange
                    });
                }
                else {
                    result.push({
                        options: DebugEditorModelManager.TOP_STACK_FRAME_DECORATION,
                        range: columnUntilEOLRange
                    });
                    if (stackFrame.range.endLineNumber && stackFrame.range.endColumn) {
                        result.push({
                            options: { className: 'debug-top-stack-frame-range' },
                            range: stackFrame.range
                        });
                    }
                    if (this.modelDataMap.has(modelUriStr)) {
                        var modelData = this.modelDataMap.get(modelUriStr);
                        if (modelData.topStackFrameRange && modelData.topStackFrameRange.startLineNumber === stackFrame.range.startLineNumber && modelData.topStackFrameRange.startColumn !== stackFrame.range.startColumn) {
                            result.push({
                                options: DebugEditorModelManager.TOP_STACK_FRAME_INLINE_DECORATION,
                                range: columnUntilEOLRange
                            });
                        }
                        modelData.topStackFrameRange = columnUntilEOLRange;
                    }
                }
            }
            else {
                result.push({
                    options: DebugEditorModelManager.FOCUSED_STACK_FRAME_MARGIN,
                    range: range
                });
                if (stackFrame.range.endLineNumber && stackFrame.range.endColumn) {
                    result.push({
                        options: { className: 'debug-focused-stack-frame-range' },
                        range: stackFrame.range
                    });
                }
                result.push({
                    options: DebugEditorModelManager.FOCUSED_STACK_FRAME_DECORATION,
                    range: columnUntilEOLRange
                });
            }
            return result;
        };
        // breakpoints management. Represent data coming from the debug service and also send data back.
        DebugEditorModelManager.prototype.onModelDecorationsChanged = function (modelUrlStr, e) {
            var _this = this;
            var modelData = this.modelDataMap.get(modelUrlStr);
            if (modelData.breakpointDecorationsAsMap.size === 0) {
                // I have no decorations
                return;
            }
            if (!e.changedDecorations.some(function (decorationId) { return modelData.breakpointDecorationsAsMap.has(decorationId); })) {
                // nothing to do, my decorations did not change.
                return;
            }
            var data = [];
            var lineToBreakpointDataMap = new Map();
            this.debugService.getModel().getBreakpoints().filter(function (bp) { return bp.uri.toString() === modelUrlStr; }).forEach(function (bp) {
                lineToBreakpointDataMap.set(bp.lineNumber, bp);
            });
            var modelUri = modelData.model.uri;
            for (var i = 0, len = modelData.breakpointDecorationIds.length; i < len; i++) {
                var decorationRange = modelData.model.getDecorationRange(modelData.breakpointDecorationIds[i]);
                var lineNumber = modelData.breakpointLines[i];
                // check if the line got deleted.
                if (decorationRange.endColumn - decorationRange.startColumn > 0) {
                    var breakpoint = lineToBreakpointDataMap.get(lineNumber);
                    // since we know it is collapsed, it cannot grow to multiple lines
                    data.push({
                        lineNumber: decorationRange.startLineNumber,
                        enabled: breakpoint.enabled,
                        condition: breakpoint.condition,
                        hitCondition: breakpoint.hitCondition,
                        column: breakpoint.column ? decorationRange.startColumn : undefined
                    });
                }
            }
            modelData.dirty = this.debugService.state !== debug_1.State.Inactive;
            var toRemove = this.debugService.getModel().getBreakpoints()
                .filter(function (bp) { return bp.uri.toString() === modelUri.toString(); });
            winjs_base_1.TPromise.join(toRemove.map(function (bp) { return _this.debugService.removeBreakpoints(bp.getId()); })).then(function () {
                _this.debugService.addBreakpoints(modelUri, data);
            });
        };
        DebugEditorModelManager.prototype.onBreakpointsChange = function () {
            var _this = this;
            var breakpointsMap = new Map();
            this.debugService.getModel().getBreakpoints().forEach(function (bp) {
                var uriStr = bp.uri.toString();
                if (breakpointsMap.has(uriStr)) {
                    breakpointsMap.get(uriStr).push(bp);
                }
                else {
                    breakpointsMap.set(uriStr, [bp]);
                }
            });
            breakpointsMap.forEach(function (bps, uri) {
                if (_this.modelDataMap.has(uri)) {
                    _this.updateBreakpoints(_this.modelDataMap.get(uri), breakpointsMap.get(uri));
                }
            });
            this.modelDataMap.forEach(function (modelData, uri) {
                if (!breakpointsMap.has(uri)) {
                    _this.updateBreakpoints(modelData, []);
                }
            });
        };
        DebugEditorModelManager.prototype.updateBreakpoints = function (modelData, newBreakpoints) {
            modelData.breakpointDecorationIds = modelData.model.deltaDecorations(modelData.breakpointDecorationIds, this.createBreakpointDecorations(newBreakpoints));
            modelData.breakpointDecorationsAsMap.clear();
            modelData.breakpointDecorationIds.forEach(function (id) { return modelData.breakpointDecorationsAsMap.set(id, true); });
            modelData.breakpointLines = newBreakpoints.map(function (bp) { return bp.lineNumber; });
        };
        DebugEditorModelManager.prototype.createBreakpointDecorations = function (breakpoints) {
            var _this = this;
            return breakpoints.map(function (breakpoint) {
                var range = breakpoint.column ? new range_1.Range(breakpoint.lineNumber, breakpoint.column, breakpoint.lineNumber, breakpoint.column + 1)
                    : new range_1.Range(breakpoint.lineNumber, 1, breakpoint.lineNumber, 1073741824 /* MAX_SAFE_SMALL_INTEGER */); // Decoration has to have a width #20688
                return {
                    options: _this.getBreakpointDecorationOptions(breakpoint),
                    range: range
                };
            });
        };
        DebugEditorModelManager.prototype.getBreakpointDecorationOptions = function (breakpoint) {
            var activated = this.debugService.getModel().areBreakpointsActivated();
            var state = this.debugService.state;
            var debugActive = state === debug_1.State.Running || state === debug_1.State.Stopped || state === debug_1.State.Initializing;
            var modelData = this.modelDataMap.get(breakpoint.uri.toString());
            var result = (!breakpoint.enabled || !activated) ? DebugEditorModelManager.BREAKPOINT_DISABLED_DECORATION :
                debugActive && modelData && modelData.dirty && !breakpoint.verified ? DebugEditorModelManager.BREAKPOINT_DIRTY_DECORATION :
                    debugActive && !breakpoint.verified ? DebugEditorModelManager.BREAKPOINT_UNVERIFIED_DECORATION :
                        !breakpoint.condition && !breakpoint.hitCondition ? DebugEditorModelManager.BREAKPOINT_DECORATION : null;
            if (result) {
                result = objects.clone(result);
                if (breakpoint.message) {
                    result.glyphMarginHoverMessage = new htmlContent_1.MarkdownString().appendText(breakpoint.message);
                }
                if (breakpoint.column) {
                    result.beforeContentClassName = "debug-breakpoint-column " + result.glyphMarginClassName + "-column";
                }
                return result;
            }
            var process = this.debugService.getViewModel().focusedProcess;
            if (process && !process.session.capabilities.supportsConditionalBreakpoints) {
                return DebugEditorModelManager.BREAKPOINT_UNSUPPORTED_DECORATION;
            }
            var modeId = modelData ? modelData.model.getLanguageIdentifier().language : '';
            var condition;
            if (breakpoint.condition && breakpoint.hitCondition) {
                condition = "Expression: " + breakpoint.condition + "\nHitCount: " + breakpoint.hitCondition;
            }
            else {
                condition = breakpoint.condition ? breakpoint.condition : breakpoint.hitCondition;
            }
            var glyphMarginHoverMessage = new htmlContent_1.MarkdownString().appendCodeblock(modeId, condition);
            var glyphMarginClassName = 'debug-breakpoint-conditional-glyph';
            var beforeContentClassName = breakpoint.column ? "debug-breakpoint-column " + glyphMarginClassName + "-column" : undefined;
            return {
                glyphMarginClassName: glyphMarginClassName,
                glyphMarginHoverMessage: glyphMarginHoverMessage,
                stickiness: stickiness,
                beforeContentClassName: beforeContentClassName
            };
        };
        DebugEditorModelManager.ID = 'breakpointManager';
        // editor decorations
        DebugEditorModelManager.BREAKPOINT_DECORATION = {
            glyphMarginClassName: 'debug-breakpoint-glyph',
            stickiness: stickiness
        };
        DebugEditorModelManager.BREAKPOINT_DISABLED_DECORATION = {
            glyphMarginClassName: 'debug-breakpoint-disabled-glyph',
            glyphMarginHoverMessage: new htmlContent_1.MarkdownString().appendText(nls.localize('breakpointDisabledHover', "Disabled Breakpoint")),
            stickiness: stickiness
        };
        DebugEditorModelManager.BREAKPOINT_UNVERIFIED_DECORATION = {
            glyphMarginClassName: 'debug-breakpoint-unverified-glyph',
            glyphMarginHoverMessage: new htmlContent_1.MarkdownString().appendText(nls.localize('breakpointUnverifieddHover', "Unverified Breakpoint")),
            stickiness: stickiness
        };
        DebugEditorModelManager.BREAKPOINT_DIRTY_DECORATION = {
            glyphMarginClassName: 'debug-breakpoint-unverified-glyph',
            glyphMarginHoverMessage: new htmlContent_1.MarkdownString().appendText(nls.localize('breakpointDirtydHover', "Unverified breakpoint. File is modified, please restart debug session.")),
            stickiness: stickiness
        };
        DebugEditorModelManager.BREAKPOINT_UNSUPPORTED_DECORATION = {
            glyphMarginClassName: 'debug-breakpoint-unsupported-glyph',
            glyphMarginHoverMessage: new htmlContent_1.MarkdownString().appendText(nls.localize('breakpointUnsupported', "Conditional breakpoints not supported by this debug type")),
            stickiness: stickiness
        };
        // we need a separate decoration for glyph margin, since we do not want it on each line of a multi line statement.
        DebugEditorModelManager.TOP_STACK_FRAME_MARGIN = {
            glyphMarginClassName: 'debug-top-stack-frame-glyph',
            stickiness: stickiness
        };
        DebugEditorModelManager.FOCUSED_STACK_FRAME_MARGIN = {
            glyphMarginClassName: 'debug-focused-stack-frame-glyph',
            stickiness: stickiness
        };
        DebugEditorModelManager.TOP_STACK_FRAME_DECORATION = {
            isWholeLine: true,
            inlineClassName: 'debug-remove-token-colors',
            className: 'debug-top-stack-frame-line',
            stickiness: stickiness
        };
        DebugEditorModelManager.TOP_STACK_FRAME_EXCEPTION_DECORATION = {
            isWholeLine: true,
            inlineClassName: 'debug-remove-token-colors',
            className: 'debug-top-stack-frame-exception-line',
            stickiness: stickiness
        };
        DebugEditorModelManager.TOP_STACK_FRAME_INLINE_DECORATION = {
            beforeContentClassName: 'debug-top-stack-frame-column'
        };
        DebugEditorModelManager.FOCUSED_STACK_FRAME_DECORATION = {
            isWholeLine: true,
            inlineClassName: 'debug-remove-token-colors',
            className: 'debug-focused-stack-frame-line',
            stickiness: stickiness
        };
        DebugEditorModelManager = __decorate([
            __param(0, modelService_1.IModelService),
            __param(1, debug_1.IDebugService)
        ], DebugEditorModelManager);
        return DebugEditorModelManager;
    }());
    exports.DebugEditorModelManager = DebugEditorModelManager;
});
//# sourceMappingURL=debugEditorModelManager.js.map