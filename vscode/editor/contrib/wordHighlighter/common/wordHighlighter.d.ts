import { TPromise } from 'vs/base/common/winjs.base';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { DocumentHighlight } from 'vs/editor/common/modes';
import { Position } from 'vs/editor/common/core/position';
export declare const editorWordHighlight: string;
export declare const editorWordHighlightStrong: string;
export declare function getOccurrencesAtPosition(model: editorCommon.IReadOnlyModel, position: Position): TPromise<DocumentHighlight[]>;
