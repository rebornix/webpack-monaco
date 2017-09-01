import { Selection } from 'vs/editor/common/core/selection';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { LanguageIdentifier } from 'vs/editor/common/modes';
export declare function testCommand(lines: string[], languageIdentifier: LanguageIdentifier, selection: Selection, commandFactory: (selection: Selection) => editorCommon.ICommand, expectedLines: string[], expectedSelection: Selection): void;
/**
 * Extract edit operations if command `command` were to execute on model `model`
 */
export declare function getEditOperation(model: editorCommon.IModel, command: editorCommon.ICommand): editorCommon.IIdentifiedSingleEditOperation[];
/**
 * Create single edit operation
 */
export declare function createSingleEditOp(text: string, positionLineNumber: number, positionColumn: number, selectionLineNumber?: number, selectionColumn?: number): editorCommon.IIdentifiedSingleEditOperation;
/**
 * Create single edit operation
 */
export declare function createInsertDeleteSingleEditOp(text: string, positionLineNumber: number, positionColumn: number, selectionLineNumber?: number, selectionColumn?: number): editorCommon.IIdentifiedSingleEditOperation;
