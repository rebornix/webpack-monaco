define(["require", "exports", "vs/base/common/winjs.base"], function (require, exports, winjs_base_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var InternalEditorAction = (function () {
        function InternalEditorAction(id, label, alias, precondition, run, contextKeyService) {
            this.id = id;
            this.label = label;
            this.alias = alias;
            this._precondition = precondition;
            this._run = run;
            this._contextKeyService = contextKeyService;
        }
        InternalEditorAction.prototype.isSupported = function () {
            return this._contextKeyService.contextMatchesRules(this._precondition);
        };
        InternalEditorAction.prototype.run = function () {
            if (!this.isSupported()) {
                return winjs_base_1.TPromise.as(void 0);
            }
            var r = this._run();
            return r ? r : winjs_base_1.TPromise.as(void 0);
        };
        return InternalEditorAction;
    }());
    exports.InternalEditorAction = InternalEditorAction;
});
//# sourceMappingURL=editorAction.js.map