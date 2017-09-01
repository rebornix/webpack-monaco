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
define(["require", "exports", "vs/nls", "vs/base/common/arrays", "vs/base/common/winjs.base", "vs/platform/instantiation/common/instantiation", "vs/editor/common/core/range", "vs/editor/common/editorContextKeys", "vs/editor/common/editorCommonExtensions", "./tokenSelectionSupport"], function (require, exports, nls, arrays, winjs_base_1, instantiation_1, range_1, editorContextKeys_1, editorCommonExtensions_1, tokenSelectionSupport_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // --- selection state machine
    var State = (function () {
        function State(editor) {
            this.editor = editor;
            this.next = null;
            this.previous = null;
            this.selection = editor.getSelection();
        }
        return State;
    }());
    // --- shared state between grow and shrink actions
    var state = null;
    var ignoreSelection = false;
    // -- action implementation
    var SmartSelectController = (function () {
        function SmartSelectController(editor, instantiationService) {
            this.editor = editor;
            this._tokenSelectionSupport = instantiationService.createInstance(tokenSelectionSupport_1.TokenSelectionSupport);
        }
        SmartSelectController_1 = SmartSelectController;
        SmartSelectController.get = function (editor) {
            return editor.getContribution(SmartSelectController_1.ID);
        };
        SmartSelectController.prototype.dispose = function () {
        };
        SmartSelectController.prototype.getId = function () {
            return SmartSelectController_1.ID;
        };
        SmartSelectController.prototype.run = function (forward) {
            var _this = this;
            var selection = this.editor.getSelection();
            var model = this.editor.getModel();
            // forget about current state
            if (state) {
                if (state.editor !== this.editor) {
                    state = null;
                }
            }
            var promise = winjs_base_1.TPromise.as(null);
            if (!state) {
                promise = this._tokenSelectionSupport.getRangesToPosition(model.uri, selection.getStartPosition()).then(function (elements) {
                    if (arrays.isFalsyOrEmpty(elements)) {
                        return;
                    }
                    var lastState;
                    elements.filter(function (element) {
                        // filter ranges inside the selection
                        var selection = _this.editor.getSelection();
                        var range = new range_1.Range(element.range.startLineNumber, element.range.startColumn, element.range.endLineNumber, element.range.endColumn);
                        return range.containsPosition(selection.getStartPosition()) && range.containsPosition(selection.getEndPosition());
                    }).forEach(function (element) {
                        // create ranges
                        var range = element.range;
                        var state = new State(_this.editor);
                        state.selection = new range_1.Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
                        if (lastState) {
                            state.next = lastState;
                            lastState.previous = state;
                        }
                        lastState = state;
                    });
                    // insert current selection
                    var editorState = new State(_this.editor);
                    editorState.next = lastState;
                    if (lastState) {
                        lastState.previous = editorState;
                    }
                    state = editorState;
                    // listen to caret move and forget about state
                    var unhook = _this.editor.onDidChangeCursorPosition(function (e) {
                        if (ignoreSelection) {
                            return;
                        }
                        state = null;
                        unhook.dispose();
                    });
                });
            }
            return promise.then(function () {
                if (!state) {
                    return;
                }
                state = forward ? state.next : state.previous;
                if (!state) {
                    return;
                }
                ignoreSelection = true;
                try {
                    _this.editor.setSelection(state.selection);
                }
                finally {
                    ignoreSelection = false;
                }
                return;
            });
        };
        SmartSelectController.ID = 'editor.contrib.smartSelectController';
        SmartSelectController = SmartSelectController_1 = __decorate([
            editorCommonExtensions_1.commonEditorContribution,
            __param(1, instantiation_1.IInstantiationService)
        ], SmartSelectController);
        return SmartSelectController;
        var SmartSelectController_1;
    }());
    var AbstractSmartSelect = (function (_super) {
        __extends(AbstractSmartSelect, _super);
        function AbstractSmartSelect(forward, opts) {
            var _this = _super.call(this, opts) || this;
            _this._forward = forward;
            return _this;
        }
        AbstractSmartSelect.prototype.run = function (accessor, editor) {
            var controller = SmartSelectController.get(editor);
            if (controller) {
                return controller.run(this._forward);
            }
            return undefined;
        };
        return AbstractSmartSelect;
    }(editorCommonExtensions_1.EditorAction));
    var GrowSelectionAction = (function (_super) {
        __extends(GrowSelectionAction, _super);
        function GrowSelectionAction() {
            return _super.call(this, true, {
                id: 'editor.action.smartSelect.grow',
                label: nls.localize('smartSelect.grow', "Expand Select"),
                alias: 'Expand Select',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 1024 /* Shift */ | 512 /* Alt */ | 17 /* RightArrow */,
                    mac: { primary: 2048 /* CtrlCmd */ | 256 /* WinCtrl */ | 1024 /* Shift */ | 17 /* RightArrow */ }
                }
            }) || this;
        }
        GrowSelectionAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], GrowSelectionAction);
        return GrowSelectionAction;
    }(AbstractSmartSelect));
    var ShrinkSelectionAction = (function (_super) {
        __extends(ShrinkSelectionAction, _super);
        function ShrinkSelectionAction() {
            return _super.call(this, false, {
                id: 'editor.action.smartSelect.shrink',
                label: nls.localize('smartSelect.shrink', "Shrink Select"),
                alias: 'Shrink Select',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 1024 /* Shift */ | 512 /* Alt */ | 15 /* LeftArrow */,
                    mac: { primary: 2048 /* CtrlCmd */ | 256 /* WinCtrl */ | 1024 /* Shift */ | 15 /* LeftArrow */ }
                }
            }) || this;
        }
        ShrinkSelectionAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], ShrinkSelectionAction);
        return ShrinkSelectionAction;
    }(AbstractSmartSelect));
});
//# sourceMappingURL=smartSelect.js.map