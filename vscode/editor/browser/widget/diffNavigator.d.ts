import { EventEmitter } from 'vs/base/common/eventEmitter';
import { ICommonDiffEditor } from 'vs/editor/common/editorCommon';
export interface Options {
    followsCaret?: boolean;
    ignoreCharChanges?: boolean;
    alwaysRevealFirst?: boolean;
}
/**
 * Create a new diff navigator for the provided diff editor.
 */
export declare class DiffNavigator extends EventEmitter {
    static Events: {
        UPDATED: string;
    };
    private editor;
    private options;
    private disposed;
    private toUnbind;
    private nextIdx;
    private ranges;
    private ignoreSelectionChange;
    revealFirst: boolean;
    constructor(editor: ICommonDiffEditor, options?: Options);
    private init();
    private onDiffUpdated();
    private compute(lineChanges);
    private initIdx(fwd);
    private move(fwd);
    canNavigate(): boolean;
    next(): void;
    previous(): void;
    dispose(): void;
}
