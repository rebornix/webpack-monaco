import * as editorCommon from 'vs/editor/common/editorCommon';
import { Position } from 'vs/editor/common/core/position';
export interface InsertSnippetResult {
    position: Position;
    prepend: string;
    append: string;
}
export declare class SmartSnippetInserter {
    private static hasOpenBrace(scanner);
    private static offsetToPosition(model, offset);
    static insertSnippet(model: editorCommon.ITextModel, _position: Position): InsertSnippetResult;
}
