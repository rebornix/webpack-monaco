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
define(["require", "exports", "vs/base/common/uri", "vs/editor/common/model/editableTextModel", "vs/editor/common/model/textModel", "vs/editor/common/model/textSource", "vs/editor/common/model/textModelEvents"], function (require, exports, uri_1, editableTextModel_1, textModel_1, textSource_1, textModelEvents) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // The hierarchy is:
    // Model -> EditableTextModel -> TextModelWithDecorations -> TextModelWithTrackedRanges -> TextModelWithMarkers -> TextModelWithTokens -> TextModel
    var MODEL_ID = 0;
    var Model = (function (_super) {
        __extends(Model, _super);
        function Model(rawTextSource, creationOptions, languageIdentifier, associatedResource) {
            if (associatedResource === void 0) { associatedResource = null; }
            var _this = _super.call(this, rawTextSource, creationOptions, languageIdentifier) || this;
            // Generate a new unique model id
            MODEL_ID++;
            _this.id = '$model' + MODEL_ID;
            if (typeof associatedResource === 'undefined' || associatedResource === null) {
                _this._associatedResource = uri_1.default.parse('inmemory://model/' + MODEL_ID);
            }
            else {
                _this._associatedResource = associatedResource;
            }
            _this._attachedEditorCount = 0;
            return _this;
        }
        Model.prototype.onDidChangeDecorations = function (listener) {
            return this._eventEmitter.addListener(textModelEvents.TextModelEventType.ModelDecorationsChanged, listener);
        };
        Model.prototype.onDidChangeOptions = function (listener) {
            return this._eventEmitter.addListener(textModelEvents.TextModelEventType.ModelOptionsChanged, listener);
        };
        Model.prototype.onWillDispose = function (listener) {
            return this._eventEmitter.addListener(textModelEvents.TextModelEventType.ModelDispose, listener);
        };
        Model.prototype.onDidChangeLanguage = function (listener) {
            return this._eventEmitter.addListener(textModelEvents.TextModelEventType.ModelLanguageChanged, listener);
        };
        Model.createFromString = function (text, options, languageIdentifier, uri) {
            if (options === void 0) { options = textModel_1.TextModel.DEFAULT_CREATION_OPTIONS; }
            if (languageIdentifier === void 0) { languageIdentifier = null; }
            if (uri === void 0) { uri = null; }
            return new Model(textSource_1.RawTextSource.fromString(text), options, languageIdentifier, uri);
        };
        Model.prototype.destroy = function () {
            this.dispose();
        };
        Model.prototype.dispose = function () {
            this._isDisposing = true;
            this._eventEmitter.emit(textModelEvents.TextModelEventType.ModelDispose);
            _super.prototype.dispose.call(this);
            this._isDisposing = false;
        };
        Model.prototype.onBeforeAttached = function () {
            this._attachedEditorCount++;
            // Warm up tokens for the editor
            this._warmUpTokens();
        };
        Model.prototype.onBeforeDetached = function () {
            this._attachedEditorCount--;
        };
        Model.prototype._shouldAutoTokenize = function () {
            return this.isAttachedToEditor();
        };
        Model.prototype.isAttachedToEditor = function () {
            return this._attachedEditorCount > 0;
        };
        Object.defineProperty(Model.prototype, "uri", {
            get: function () {
                return this._associatedResource;
            },
            enumerable: true,
            configurable: true
        });
        return Model;
    }(editableTextModel_1.EditableTextModel));
    exports.Model = Model;
});
//# sourceMappingURL=model.js.map