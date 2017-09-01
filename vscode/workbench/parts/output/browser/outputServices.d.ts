import Event from 'vs/base/common/event';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { IOutputChannelIdentifier, IOutputEvent, IOutputChannel, IOutputService, IOutputDelta } from 'vs/workbench/parts/output/common/output';
import { IPanelService } from 'vs/workbench/services/panel/common/panelService';
import { IModelService } from 'vs/editor/common/services/modelService';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { ITextModelService } from 'vs/editor/common/services/resolverService';
export declare class BufferedContent {
    private data;
    private dataIds;
    private idPool;
    private length;
    append(content: string): void;
    clear(): void;
    private trim();
    getDelta(previousDelta?: IOutputDelta): IOutputDelta;
}
export declare class OutputService implements IOutputService {
    private storageService;
    private instantiationService;
    private panelService;
    _serviceBrand: any;
    private receivedOutput;
    private channels;
    private activeChannelId;
    private _onOutput;
    private _onOutputChannel;
    private _onActiveOutputChannel;
    private _outputLinkDetector;
    private _outputContentProvider;
    private _outputPanel;
    constructor(storageService: IStorageService, instantiationService: IInstantiationService, panelService: IPanelService, contextService: IWorkspaceContextService, modelService: IModelService, textModelResolverService: ITextModelService);
    readonly onOutput: Event<IOutputEvent>;
    readonly onOutputChannel: Event<string>;
    readonly onActiveOutputChannel: Event<string>;
    getChannel(id: string): IOutputChannel;
    getChannels(): IOutputChannelIdentifier[];
    private append(channelId, output);
    getActiveChannel(): IOutputChannel;
    private getOutput(channelId, previousDelta);
    private clearOutput(channelId);
    private removeOutput(channelId);
    private showOutput(channelId, preserveFocus?);
}
