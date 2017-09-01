import { TPromise } from 'vs/base/common/winjs.base';
import Event from 'vs/base/common/event';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IEditor } from 'vs/platform/editor/common/editor';
import { RawContextKey } from 'vs/platform/contextkey/common/contextkey';
import { ResourceEditorInput } from 'vs/workbench/common/editor/resourceEditorInput';
/**
 * Mime type used by the output editor.
 */
export declare const OUTPUT_MIME = "text/x-code-output";
/**
 * Output resource scheme.
 */
export declare const OUTPUT_SCHEME = "output";
/**
 * Id used by the output editor.
 */
export declare const OUTPUT_MODE_ID = "Log";
/**
 * Output panel id
 */
export declare const OUTPUT_PANEL_ID = "workbench.panel.output";
export declare const Extensions: {
    OutputChannels: string;
};
export declare const OUTPUT_SERVICE_ID = "outputService";
export declare const MAX_OUTPUT_LENGTH: number;
export declare const CONTEXT_IN_OUTPUT: RawContextKey<boolean>;
/**
 * The output event informs when new output got received.
 */
export interface IOutputEvent {
    channelId: string;
    isClear: boolean;
}
export declare const IOutputService: {
    (...args: any[]): void;
    type: IOutputService;
};
/**
 * The output service to manage output from the various processes running.
 */
export interface IOutputService {
    _serviceBrand: any;
    /**
     * Given the channel id returns the output channel instance.
     * Channel should be first registered via OutputChannelRegistry.
     */
    getChannel(id: string): IOutputChannel;
    /**
     * Returns an array of all known output channels as identifiers.
     */
    getChannels(): IOutputChannelIdentifier[];
    /**
     * Returns the currently active channel.
     * Only one channel can be active at a given moment.
     */
    getActiveChannel(): IOutputChannel;
    /**
     * Allows to register on Output events.
     */
    onOutput: Event<IOutputEvent>;
    /**
     * Allows to register on a output channel being added or removed
     */
    onOutputChannel: Event<string>;
    /**
     * Allows to register on active output channel change.
     */
    onActiveOutputChannel: Event<string>;
}
export interface IOutputDelta {
    readonly value: string;
    readonly id: number;
    readonly append?: boolean;
}
export interface IOutputChannel {
    /**
     * Identifier of the output channel.
     */
    id: string;
    /**
     * Label of the output channel to be displayed to the user.
     */
    label: string;
    /**
     * Returns the value indicating whether the channel has scroll locked.
     */
    scrollLock: boolean;
    /**
     * Appends output to the channel.
     */
    append(output: string): void;
    /**
     * Returns the received output content.
     * If a delta is passed, returns only the content that came after the passed delta.
     */
    getOutput(previousDelta?: IOutputDelta): IOutputDelta;
    /**
     * Opens the output for this channel.
     */
    show(preserveFocus?: boolean): TPromise<IEditor>;
    /**
     * Clears all received output for this channel.
     */
    clear(): void;
    /**
     * Disposes the output channel.
     */
    dispose(): void;
}
export interface IOutputChannelIdentifier {
    id: string;
    label: string;
}
export interface IOutputChannelRegistry {
    /**
     * Make an output channel known to the output world.
     */
    registerChannel(id: string, name: string): void;
    /**
     * Returns the list of channels known to the output world.
     */
    getChannels(): IOutputChannelIdentifier[];
    /**
     * Returns the channel with the passed id.
     */
    getChannel(id: string): IOutputChannelIdentifier;
    /**
     * Remove the output channel with the passed id.
     */
    removeChannel(id: string): void;
}
export declare class OutputEditors {
    private static instances;
    static getInstance(instantiationService: IInstantiationService, channel: IOutputChannel): ResourceEditorInput;
}
