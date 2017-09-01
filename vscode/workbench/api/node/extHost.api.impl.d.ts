import { IExtensionDescription } from 'vs/platform/extensions/common/extensions';
import { ExtHostExtensionService } from 'vs/workbench/api/node/extHostExtensionService';
import { TPromise } from 'vs/base/common/winjs.base';
import * as vscode from 'vscode';
import { IInitData } from './extHost.protocol';
import { ExtHostThreadService } from 'vs/workbench/services/thread/node/extHostThreadService';
export interface IExtensionApiFactory {
    (extension: IExtensionDescription): typeof vscode;
}
/**
 * This method instantiates and returns the extension API surface
 */
export declare function createApiFactory(initData: IInitData, threadService: ExtHostThreadService, extensionService: ExtHostExtensionService): IExtensionApiFactory;
export declare function initializeExtensionApi(extensionService: ExtHostExtensionService, apiFactory: IExtensionApiFactory): TPromise<void>;
