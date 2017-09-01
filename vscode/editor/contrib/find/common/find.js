define(["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function getSelectionSearchString(editor) {
        var selection = editor.getSelection();
        // if selection spans multiple lines, default search string to empty
        if (selection.startLineNumber === selection.endLineNumber) {
            if (selection.isEmpty()) {
                var wordAtPosition = editor.getModel().getWordAtPosition(selection.getStartPosition());
                if (wordAtPosition) {
                    return wordAtPosition.word;
                }
            }
            else {
                return editor.getModel().getValueInRange(selection);
            }
        }
        return null;
    }
    exports.getSelectionSearchString = getSelectionSearchString;
});
//# sourceMappingURL=find.js.map