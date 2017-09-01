define(["require", "exports", "vs/base/common/event", "vs/base/common/lifecycle", "vs/editor/common/core/range", "vs/editor/common/modes", "./quickFix"], function (require, exports, event_1, lifecycle_1, range_1, modes_1, quickFix_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var QuickFixOracle = (function () {
        function QuickFixOracle(_editor, _markerService, _signalChange, delay) {
            if (delay === void 0) { delay = 250; }
            var _this = this;
            this._editor = _editor;
            this._markerService = _markerService;
            this._signalChange = _signalChange;
            this._disposables = [];
            this._disposables.push(event_1.debounceEvent(this._markerService.onMarkerChanged, function (last, cur) { return last ? last.concat(cur) : cur; }, delay / 2)(function (e) { return _this._onMarkerChanges(e); }), event_1.debounceEvent(this._editor.onDidChangeCursorPosition, function (last) { return last; }, delay)(function (e) { return _this._onCursorChange(); }));
        }
        QuickFixOracle.prototype.dispose = function () {
            this._disposables = lifecycle_1.dispose(this._disposables);
        };
        QuickFixOracle.prototype.trigger = function (type) {
            // get selection from marker or current word
            // unless the selection is non-empty and manually
            // requesting code actions
            var selection = this._editor.getSelection();
            var range = this._getActiveMarkerOrWordRange();
            if (type === 'manual' && !selection.isEmpty()) {
                range = selection;
            }
            // empty selection somewhere in nowhere
            if (!range) {
                range = selection;
            }
            this._signalChange({
                type: type,
                range: range,
                position: this._editor.getPosition(),
                fixes: range && quickFix_1.getCodeActions(this._editor.getModel(), this._editor.getModel().validateRange(range))
            });
        };
        QuickFixOracle.prototype._onMarkerChanges = function (resources) {
            var uri = this._editor.getModel().uri;
            for (var _i = 0, resources_1 = resources; _i < resources_1.length; _i++) {
                var resource = resources_1[_i];
                if (resource.toString() === uri.toString()) {
                    this._currentRange = undefined;
                    this._onCursorChange();
                    return;
                }
            }
        };
        QuickFixOracle.prototype._onCursorChange = function () {
            var range = this._getActiveMarkerOrWordRange();
            if (!range_1.Range.equalsRange(this._currentRange, range)) {
                this._currentRange = range;
                this._signalChange({
                    type: 'auto',
                    range: range,
                    position: this._editor.getPosition(),
                    fixes: range && quickFix_1.getCodeActions(this._editor.getModel(), this._editor.getModel().validateRange(range))
                });
            }
        };
        QuickFixOracle.prototype._getActiveMarkerOrWordRange = function () {
            var selection = this._editor.getSelection();
            var model = this._editor.getModel();
            // (1) return marker that contains a (empty/non-empty) selection
            for (var _i = 0, _a = this._markerService.read({ resource: model.uri }); _i < _a.length; _i++) {
                var marker = _a[_i];
                var range = range_1.Range.lift(marker);
                if (range.containsRange(selection)) {
                    return range;
                }
            }
            // (2) return range of current word
            if (selection.isEmpty()) {
                var pos = selection.getStartPosition();
                var info = model.getWordAtPosition(pos);
                if (info) {
                    return new range_1.Range(pos.lineNumber, info.startColumn, pos.lineNumber, info.endColumn);
                }
            }
            return undefined;
        };
        return QuickFixOracle;
    }());
    exports.QuickFixOracle = QuickFixOracle;
    var QuickFixModel = (function () {
        function QuickFixModel(editor, markerService) {
            var _this = this;
            this._onDidChangeFixes = new event_1.Emitter();
            this._disposables = [];
            this._editor = editor;
            this._markerService = markerService;
            this._disposables.push(this._editor.onDidChangeModel(function () { return _this._update(); }));
            this._disposables.push(this._editor.onDidChangeModelLanguage(function () { return _this._update(); }));
            this._disposables.push(modes_1.CodeActionProviderRegistry.onDidChange(this._update, this));
            this._update();
        }
        QuickFixModel.prototype.dispose = function () {
            this._disposables = lifecycle_1.dispose(this._disposables);
            lifecycle_1.dispose(this._quickFixOracle);
        };
        Object.defineProperty(QuickFixModel.prototype, "onDidChangeFixes", {
            get: function () {
                return this._onDidChangeFixes.event;
            },
            enumerable: true,
            configurable: true
        });
        QuickFixModel.prototype._update = function () {
            var _this = this;
            if (this._quickFixOracle) {
                this._quickFixOracle.dispose();
                this._quickFixOracle = undefined;
                this._onDidChangeFixes.fire(undefined);
            }
            if (this._editor.getModel()
                && modes_1.CodeActionProviderRegistry.has(this._editor.getModel())
                && !this._editor.getConfiguration().readOnly) {
                this._quickFixOracle = new QuickFixOracle(this._editor, this._markerService, function (p) { return _this._onDidChangeFixes.fire(p); });
                this._quickFixOracle.trigger('auto');
            }
        };
        QuickFixModel.prototype.trigger = function (type) {
            if (this._quickFixOracle) {
                this._quickFixOracle.trigger(type);
            }
        };
        return QuickFixModel;
    }());
    exports.QuickFixModel = QuickFixModel;
});
//# sourceMappingURL=quickFixModel.js.map