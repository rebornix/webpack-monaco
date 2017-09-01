import { TPromise } from 'vs/base/common/winjs.base';
import { IOutputService } from 'vs/workbench/parts/output/common/output';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { IPanelService } from 'vs/workbench/services/panel/common/panelService';
import { MainThreadOutputServiceShape, IExtHostContext } from '../node/extHost.protocol';
export declare class MainThreadOutputService implements MainThreadOutputServiceShape {
    private readonly _outputService;
    private readonly _partService;
    private readonly _panelService;
    constructor(extHostContext: IExtHostContext, outputService: IOutputService, partService: IPartService, panelService: IPanelService);
    dispose(): void;
    $append(channelId: string, label: string, value: string): TPromise<void>;
    $clear(channelId: string, label: string): TPromise<void>;
    $reveal(channelId: string, label: string, preserveFocus: boolean): TPromise<void>;
    private _getChannel(channelId, label);
    $close(channelId: string): TPromise<void>;
    $dispose(channelId: string, label: string): TPromise<void>;
}
