import 'vs/css!./lightBulbWidget';
import { IDisposable } from 'vs/base/common/lifecycle';
import Event from 'vs/base/common/event';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { QuickFixComputeEvent } from './quickFixModel';
export declare class LightBulbWidget implements IDisposable {
    private readonly _options;
    private readonly _editor;
    private readonly _onClick;
    private readonly _mouseDownSubscription;
    private _decorationIds;
    private _currentLine;
    private _model;
    private _futureFixes;
    constructor(editor: ICodeEditor);
    dispose(): void;
    readonly onClick: Event<{
        x: number;
        y: number;
    }>;
    model: QuickFixComputeEvent;
    title: string;
    show(e: QuickFixComputeEvent): void;
    hide(): void;
}
