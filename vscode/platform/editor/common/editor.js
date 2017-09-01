define(["require", "exports", "vs/platform/instantiation/common/instantiation"], function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IEditorService = instantiation_1.createDecorator('editorService');
    /**
     * Possible locations for opening an editor.
     */
    var Position;
    (function (Position) {
        /** Opens the editor in the first position replacing the input currently showing */
        Position[Position["ONE"] = 0] = "ONE";
        /** Opens the editor in the second position replacing the input currently showing */
        Position[Position["TWO"] = 1] = "TWO";
        /** Opens the editor in the third most position replacing the input currently showing */
        Position[Position["THREE"] = 2] = "THREE";
    })(Position = exports.Position || (exports.Position = {}));
    exports.POSITIONS = [Position.ONE, Position.TWO, Position.THREE];
    var Direction;
    (function (Direction) {
        Direction[Direction["LEFT"] = 0] = "LEFT";
        Direction[Direction["RIGHT"] = 1] = "RIGHT";
    })(Direction = exports.Direction || (exports.Direction = {}));
    var Verbosity;
    (function (Verbosity) {
        Verbosity[Verbosity["SHORT"] = 0] = "SHORT";
        Verbosity[Verbosity["MEDIUM"] = 1] = "MEDIUM";
        Verbosity[Verbosity["LONG"] = 2] = "LONG";
    })(Verbosity = exports.Verbosity || (exports.Verbosity = {}));
});
//# sourceMappingURL=editor.js.map