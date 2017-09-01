import Event from 'vs/base/common/event';
import { ISCMService, ISCMProvider, ISCMRepository } from './scm';
export declare class SCMService implements ISCMService {
    _serviceBrand: any;
    private _providerIds;
    private _repositories;
    readonly repositories: ISCMRepository[];
    private _onDidAddProvider;
    readonly onDidAddRepository: Event<ISCMRepository>;
    private _onDidRemoveProvider;
    readonly onDidRemoveRepository: Event<ISCMRepository>;
    private _onDidChangeProvider;
    readonly onDidChangeRepository: Event<ISCMRepository>;
    constructor();
    registerSCMProvider(provider: ISCMProvider): ISCMRepository;
}
