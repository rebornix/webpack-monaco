import { TPromise } from 'vs/base/common/winjs.base';
import { Action } from 'vs/base/common/actions';
import { IExtensionsWorkbenchService } from 'vs/workbench/parts/extensions/common/extensions';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IMessageService } from 'vs/platform/message/common/message';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IWindowsService } from 'vs/platform/windows/common/windows';
import { IFileService } from 'vs/platform/files/common/files';
export declare class OpenExtensionsFolderAction extends Action {
    private windowsService;
    private fileService;
    private environmentService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, windowsService: IWindowsService, fileService: IFileService, environmentService: IEnvironmentService);
    run(): TPromise<void>;
    protected isEnabled(): boolean;
}
export declare class InstallVSIXAction extends Action {
    private extensionsWorkbenchService;
    private messageService;
    private instantiationService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, extensionsWorkbenchService: IExtensionsWorkbenchService, messageService: IMessageService, instantiationService: IInstantiationService);
    run(): TPromise<any>;
}
