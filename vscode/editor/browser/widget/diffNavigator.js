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
define(["require", "exports", "vs/base/common/assert", "vs/base/common/eventEmitter", "vs/base/common/objects", "vs/editor/common/core/range", "vs/base/common/lifecycle"], function (require, exports, assert, eventEmitter_1, objects, range_1, lifecycle_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var defaultOptions = {
        followsCaret: true,
        ignoreCharChanges: true,
        alwaysRevealFirst: true
    };
    /**
     * Create a new diff navigator for the provided diff editor.
     */
    var DiffNavigator = (function (_super) {
        __extends(DiffNavigator, _super);
        function DiffNavigator(editor, options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, [
                DiffNavigator.Events.UPDATED
            ]) || this;
            _this.editor = editor;
            _this.options = objects.mixin(options, defaultOptions, false);
            _this.disposed = false;
            _this.toUnbind = [];
            _this.nextIdx = -1;
            _this.ranges = [];
            _this.ignoreSelectionChange = false;
            _this.revealFirst = _this.options.alwaysRevealFirst;
            // hook up to diff editor for diff, disposal, and caret move
            _this.toUnbind.push(_this.editor.onDidDispose(function () { return _this.dispose(); }));
            _this.toUnbind.push(_this.editor.onDidUpdateDiff(function () { return _this.onDiffUpdated(); }));
            if (_this.options.followsCaret) {
                _this.toUnbind.push(_this.editor.getModifiedEditor().onDidChangeCursorPosition(function (e) {
                    if (_this.ignoreSelectionChange) {
                        return;
                    }
                    _this.nextIdx = -1;
                }));
            }
            if (_this.options.alwaysRevealFirst) {
                _this.toUnbind.push(_this.editor.getModifiedEditor().onDidChangeModel(function (e) {
                    _this.revealFirst = true;
                }));
            }
            // init things
            _this.init();
            return _this;
        }
        DiffNavigator.prototype.init = function () {
            var changes = this.editor.getLineChanges();
            if (!changes) {
                return;
            }
        };
        DiffNavigator.prototype.onDiffUpdated = function () {
            this.init();
            this.compute(this.editor.getLineChanges());
            if (this.revealFirst) {
                // Only reveal first on first non-null changes
                if (this.editor.getLineChanges() !== null) {
                    this.revealFirst = false;
                    this.nextIdx = -1;
                    this.next();
                }
            }
        };
        DiffNavigator.prototype.compute = function (lineChanges) {
            var _this = this;
            // new ranges
            this.ranges = [];
            if (lineChanges) {
                // create ranges from changes
                lineChanges.forEach(function (lineChange) {
                    if (!_this.options.ignoreCharChanges && lineChange.charChanges) {
                        lineChange.charChanges.forEach(function (charChange) {
                            _this.ranges.push({
                                rhs: true,
                                range: new range_1.Range(charChange.modifiedStartLineNumber, charChange.modifiedStartColumn, charChange.modifiedEndLineNumber, charChange.modifiedEndColumn)
                            });
                        });
                    }
                    else {
                        _this.ranges.push({
                            rhs: true,
                            range: new range_1.Range(lineChange.modifiedStartLineNumber, 1, lineChange.modifiedStartLineNumber, 1)
                        });
                    }
                });
            }
            // sort
            this.ranges.sort(function (left, right) {
                if (left.range.getStartPosition().isBeforeOrEqual(right.range.getStartPosition())) {
                    return -1;
                }
                else if (right.range.getStartPosition().isBeforeOrEqual(left.range.getStartPosition())) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            this.emit(DiffNavigator.Events.UPDATED, {});
        };
        DiffNavigator.prototype.initIdx = function (fwd) {
            var found = false;
            var position = this.editor.getPosition();
            for (var i = 0, len = this.ranges.length; i < len && !found; i++) {
                var range = this.ranges[i].range;
                if (position.isBeforeOrEqual(range.getStartPosition())) {
                    this.nextIdx = i + (fwd ? 0 : -1);
                    found = true;
                }
            }
            if (!found) {
                // after the last change
                this.nextIdx = fwd ? 0 : this.ranges.length - 1;
            }
            if (this.nextIdx < 0) {
                this.nextIdx = this.ranges.length - 1;
            }
        };
        DiffNavigator.prototype.move = function (fwd) {
            assert.ok(!this.disposed, 'Illegal State - diff navigator has been disposed');
            if (!this.canNavigate()) {
                return;
            }
            if (this.nextIdx === -1) {
                this.initIdx(fwd);
            }
            else if (fwd) {
                this.nextIdx += 1;
                if (this.nextIdx >= this.ranges.length) {
                    this.nextIdx = 0;
                }
            }
            else {
                this.nextIdx -= 1;
                if (this.nextIdx < 0) {
                    this.nextIdx = this.ranges.length - 1;
                }
            }
            var info = this.ranges[this.nextIdx];
            this.ignoreSelectionChange = true;
            try {
                var pos = info.range.getStartPosition();
                this.editor.setPosition(pos);
                this.editor.revealPositionInCenter(pos);
            }
            finally {
                this.ignoreSelectionChange = false;
            }
        };
        DiffNavigator.prototype.canNavigate = function () {
            return this.ranges && this.ranges.length > 0;
        };
        DiffNavigator.prototype.next = function () {
            this.move(true);
        };
        DiffNavigator.prototype.previous = function () {
            this.move(false);
        };
        DiffNavigator.prototype.dispose = function () {
            this.toUnbind = lifecycle_1.dispose(this.toUnbind);
            this.ranges = null;
            this.disposed = true;
            _super.prototype.dispose.call(this);
        };
        DiffNavigator.Events = {
            UPDATED: 'navigation.updated'
        };
        return DiffNavigator;
    }(eventEmitter_1.EventEmitter));
    exports.DiffNavigator = DiffNavigator;
});
//# sourceMappingURL=diffNavigator.js.map