import { ICommonCodeEditor, IEditorContribution } from 'vs/editor/common/editorCommon';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { Position } from 'vs/editor/common/core/position';
import { IColorRange } from 'vs/editor/common/modes';
import { ICodeEditorService } from 'vs/editor/common/services/codeEditorService';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
export declare class ColorDetector implements IEditorContribution {
    private _editor;
    private _codeEditorService;
    private _configurationService;
    private static ID;
    static RECOMPUTE_TIME: number;
    private _globalToDispose;
    private _localToDispose;
    private _computePromise;
    private _timeoutPromise;
    private _decorationsIds;
    private _colorRanges;
    private _colorDecoratorIds;
    private _decorationsTypes;
    private _isEnabled;
    constructor(_editor: ICodeEditor, _codeEditorService: ICodeEditorService, _configurationService: IConfigurationService);
    isEnabled(): boolean;
    getId(): string;
    static get(editor: ICommonCodeEditor): ColorDetector;
    dispose(): void;
    private onModelChanged();
    private beginCompute();
    private stop();
    private updateDecorations(colorInfos);
    private updateColorDecorators(colorInfos);
    private removeAllDecorations();
    getColorRange(position: Position): IColorRange | null;
}
