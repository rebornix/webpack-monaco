import 'vs/css!./codelensWidget';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IMessageService } from 'vs/platform/message/common/message';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { ICodeLensSymbol } from 'vs/editor/common/modes';
import * as editorBrowser from 'vs/editor/browser/editorBrowser';
import { ICodeLensData } from './codelens';
export interface IDecorationIdCallback {
    (decorationId: string): void;
}
export declare class CodeLensHelper {
    private _removeDecorations;
    private _addDecorations;
    private _addDecorationsCallbacks;
    constructor();
    addDecoration(decoration: editorCommon.IModelDeltaDecoration, callback: IDecorationIdCallback): void;
    removeDecoration(decorationId: string): void;
    commit(changeAccessor: editorCommon.IModelDecorationsChangeAccessor): void;
}
export declare class CodeLens {
    private readonly _editor;
    private readonly _viewZone;
    private readonly _viewZoneId;
    private readonly _contentWidget;
    private _decorationIds;
    private _data;
    constructor(data: ICodeLensData[], editor: editorBrowser.ICodeEditor, helper: CodeLensHelper, viewZoneChangeAccessor: editorBrowser.IViewZoneChangeAccessor, commandService: ICommandService, messageService: IMessageService, updateCallabck: Function);
    dispose(helper: CodeLensHelper, viewZoneChangeAccessor: editorBrowser.IViewZoneChangeAccessor): void;
    isValid(): boolean;
    updateCodeLensSymbols(data: ICodeLensData[], helper: CodeLensHelper): void;
    computeIfNecessary(model: editorCommon.IModel): ICodeLensData[];
    updateCommands(symbols: ICodeLensSymbol[]): void;
    getLineNumber(): number;
    update(viewZoneChangeAccessor: editorBrowser.IViewZoneChangeAccessor): void;
}
