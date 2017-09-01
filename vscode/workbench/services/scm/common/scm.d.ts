import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import Event from 'vs/base/common/event';
import { IDisposable } from 'vs/base/common/lifecycle';
import { Command } from 'vs/editor/common/modes';
export interface IBaselineResourceProvider {
    getBaselineResource(resource: URI): TPromise<URI>;
}
export declare const ISCMService: {
    (...args: any[]): void;
    type: ISCMService;
};
export interface ISCMResourceDecorations {
    icon?: URI;
    iconDark?: URI;
    tooltip?: string;
    strikeThrough?: boolean;
    faded?: boolean;
}
export interface ISCMResource {
    readonly resourceGroup: ISCMResourceGroup;
    readonly sourceUri: URI;
    readonly command?: Command;
    readonly decorations: ISCMResourceDecorations;
}
export interface ISCMResourceGroup {
    readonly provider: ISCMProvider;
    readonly label: string;
    readonly id: string;
    readonly resources: ISCMResource[];
}
export interface ISCMProvider extends IDisposable {
    readonly label: string;
    readonly id: string;
    readonly contextValue: string;
    readonly resources: ISCMResourceGroup[];
    readonly onDidChange: Event<void>;
    readonly count?: number;
    readonly commitTemplate?: string;
    readonly onDidChangeCommitTemplate?: Event<string>;
    readonly acceptInputCommand?: Command;
    readonly statusBarCommands?: Command[];
    getOriginalResource(uri: URI): TPromise<URI>;
}
export interface ISCMInput {
    value: string;
    readonly onDidChange: Event<string>;
}
export interface ISCMRepository extends IDisposable {
    readonly onDidFocus: Event<void>;
    readonly provider: ISCMProvider;
    readonly input: ISCMInput;
    focus(): void;
}
export interface ISCMService {
    readonly _serviceBrand: any;
    readonly onDidAddRepository: Event<ISCMRepository>;
    readonly onDidRemoveRepository: Event<ISCMRepository>;
    readonly onDidChangeRepository: Event<ISCMRepository>;
    readonly repositories: ISCMRepository[];
    registerSCMProvider(provider: ISCMProvider): ISCMRepository;
}
