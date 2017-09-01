import 'vs/css!./progressbar';
import { Builder } from 'vs/base/browser/builder';
import { Color } from 'vs/base/common/color';
export interface IProgressBarOptions extends IProgressBarStyles {
}
export interface IProgressBarStyles {
    progressBarBackground?: Color;
}
/**
 * A progress bar with support for infinite or discrete progress.
 */
export declare class ProgressBar {
    private options;
    private toUnbind;
    private workedVal;
    private element;
    private animationRunning;
    private bit;
    private totalWork;
    private animationStopToken;
    private progressBarBackground;
    constructor(builder: Builder, options?: IProgressBarOptions);
    private create(parent);
    private off();
    /**
     * Indicates to the progress bar that all work is done.
     */
    done(): ProgressBar;
    /**
     * Stops the progressbar from showing any progress instantly without fading out.
     */
    stop(): ProgressBar;
    private doDone(delayed);
    /**
     * Use this mode to indicate progress that has no total number of work units.
     */
    infinite(): ProgressBar;
    /**
     * Tells the progress bar the total number of work. Use in combination with workedVal() to let
     * the progress bar show the actual progress based on the work that is done.
     */
    total(value: number): ProgressBar;
    /**
     * Finds out if this progress bar is configured with total work
     */
    hasTotal(): boolean;
    /**
     * Tells the progress bar that an amount of work has been completed.
     */
    worked(value: number): ProgressBar;
    /**
     * Returns the builder this progress bar is building in.
     */
    getContainer(): Builder;
    style(styles: IProgressBarStyles): void;
    protected applyStyles(): void;
    dispose(): void;
}
