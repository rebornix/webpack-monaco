define(["require", "exports", "vs/editor/common/model/model"], function (require, exports, model_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function withEditorModel(text, callback) {
        var model = model_1.Model.createFromString(text.join('\n'));
        callback(model);
        model.dispose();
    }
    exports.withEditorModel = withEditorModel;
});
//# sourceMappingURL=editorTestUtils.js.map