define(["require", "exports", "vs/platform/instantiation/common/instantiation"], function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * States the text text file editor model can be in.
     */
    var ModelState;
    (function (ModelState) {
        ModelState[ModelState["SAVED"] = 0] = "SAVED";
        ModelState[ModelState["DIRTY"] = 1] = "DIRTY";
        ModelState[ModelState["PENDING_SAVE"] = 2] = "PENDING_SAVE";
        /**
         * A model is in conflict mode when changes cannot be saved because the
         * underlying file has changed. Models in conflict mode are always dirty.
         */
        ModelState[ModelState["CONFLICT"] = 3] = "CONFLICT";
        /**
         * A model is in orphan state when the underlying file has been deleted.
         */
        ModelState[ModelState["ORPHAN"] = 4] = "ORPHAN";
        /**
         * Any error that happens during a save that is not causing the CONFLICT state.
         * Models in error mode are always diry.
         */
        ModelState[ModelState["ERROR"] = 5] = "ERROR";
    })(ModelState = exports.ModelState || (exports.ModelState = {}));
    var StateChange;
    (function (StateChange) {
        StateChange[StateChange["DIRTY"] = 0] = "DIRTY";
        StateChange[StateChange["SAVING"] = 1] = "SAVING";
        StateChange[StateChange["SAVE_ERROR"] = 2] = "SAVE_ERROR";
        StateChange[StateChange["SAVED"] = 3] = "SAVED";
        StateChange[StateChange["REVERTED"] = 4] = "REVERTED";
        StateChange[StateChange["ENCODING"] = 5] = "ENCODING";
        StateChange[StateChange["CONTENT_CHANGE"] = 6] = "CONTENT_CHANGE";
        StateChange[StateChange["ORPHANED_CHANGE"] = 7] = "ORPHANED_CHANGE";
    })(StateChange = exports.StateChange || (exports.StateChange = {}));
    var TextFileModelChangeEvent = (function () {
        function TextFileModelChangeEvent(model, kind) {
            this._resource = model.getResource();
            this._kind = kind;
        }
        Object.defineProperty(TextFileModelChangeEvent.prototype, "resource", {
            get: function () {
                return this._resource;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextFileModelChangeEvent.prototype, "kind", {
            get: function () {
                return this._kind;
            },
            enumerable: true,
            configurable: true
        });
        return TextFileModelChangeEvent;
    }());
    exports.TextFileModelChangeEvent = TextFileModelChangeEvent;
    exports.TEXT_FILE_SERVICE_ID = 'textFileService';
    var AutoSaveMode;
    (function (AutoSaveMode) {
        AutoSaveMode[AutoSaveMode["OFF"] = 0] = "OFF";
        AutoSaveMode[AutoSaveMode["AFTER_SHORT_DELAY"] = 1] = "AFTER_SHORT_DELAY";
        AutoSaveMode[AutoSaveMode["AFTER_LONG_DELAY"] = 2] = "AFTER_LONG_DELAY";
        AutoSaveMode[AutoSaveMode["ON_FOCUS_CHANGE"] = 3] = "ON_FOCUS_CHANGE";
        AutoSaveMode[AutoSaveMode["ON_WINDOW_CHANGE"] = 4] = "ON_WINDOW_CHANGE";
    })(AutoSaveMode = exports.AutoSaveMode || (exports.AutoSaveMode = {}));
    var SaveReason;
    (function (SaveReason) {
        SaveReason[SaveReason["EXPLICIT"] = 1] = "EXPLICIT";
        SaveReason[SaveReason["AUTO"] = 2] = "AUTO";
        SaveReason[SaveReason["FOCUS_CHANGE"] = 3] = "FOCUS_CHANGE";
        SaveReason[SaveReason["WINDOW_CHANGE"] = 4] = "WINDOW_CHANGE";
    })(SaveReason = exports.SaveReason || (exports.SaveReason = {}));
    exports.ITextFileService = instantiation_1.createDecorator(exports.TEXT_FILE_SERVICE_ID);
});
//# sourceMappingURL=textfiles.js.map