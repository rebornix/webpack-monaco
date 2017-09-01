import Event from 'vs/base/common/event';
import { TPromise } from 'vs/base/common/winjs.base';
import { IMarkerService } from 'vs/platform/markers/common/markers';
import { Range } from 'vs/editor/common/core/range';
import { ICommonCodeEditor } from 'vs/editor/common/editorCommon';
import { Command } from 'vs/editor/common/modes';
import { Position } from 'vs/editor/common/core/position';
export declare class QuickFixOracle {
    private _editor;
    private _markerService;
    private _signalChange;
    private _disposables;
    private _currentRange;
    constructor(_editor: ICommonCodeEditor, _markerService: IMarkerService, _signalChange: (e: QuickFixComputeEvent) => any, delay?: number);
    dispose(): void;
    trigger(type: 'manual' | 'auto'): void;
    private _onMarkerChanges(resources);
    private _onCursorChange();
    private _getActiveMarkerOrWordRange();
}
export interface QuickFixComputeEvent {
    type: 'auto' | 'manual';
    range: Range;
    position: Position;
    fixes: TPromise<Command[]>;
}
export declare class QuickFixModel {
    private _editor;
    private _markerService;
    private _quickFixOracle;
    private _onDidChangeFixes;
    private _disposables;
    constructor(editor: ICommonCodeEditor, markerService: IMarkerService);
    dispose(): void;
    readonly onDidChangeFixes: Event<QuickFixComputeEvent>;
    private _update();
    trigger(type: 'auto' | 'manual'): void;
}
