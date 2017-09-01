import URI from 'vs/base/common/uri';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import Event from 'vs/base/common/event';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { ParsedExpression, IExpression } from 'vs/base/common/glob';
import { RawContextKey, IContextKeyService, IContextKey } from 'vs/platform/contextkey/common/contextkey';
import { IModeService } from 'vs/editor/common/services/modeService';
export declare class ResourceContextKey implements IContextKey<URI> {
    private _modeService;
    static Scheme: RawContextKey<string>;
    static Filename: RawContextKey<string>;
    static LangId: RawContextKey<string>;
    static Resource: RawContextKey<URI>;
    private _resourceKey;
    private _schemeKey;
    private _filenameKey;
    private _langIdKey;
    constructor(contextKeyService: IContextKeyService, _modeService: IModeService);
    set(value: URI): void;
    reset(): void;
    get(): URI;
}
export declare class ResourceGlobMatcher {
    private globFn;
    private parseFn;
    private contextService;
    private configurationService;
    private static readonly NO_ROOT;
    private _onExpressionChange;
    private toUnbind;
    private mapRootToParsedExpression;
    private mapRootToExpressionConfig;
    constructor(globFn: (root?: URI) => IExpression, parseFn: (expression: IExpression) => ParsedExpression, contextService: IWorkspaceContextService, configurationService: IConfigurationService);
    readonly onExpressionChange: Event<void>;
    private registerListeners();
    private onConfigurationChanged();
    private onDidChangeWorkspaceRoots();
    private updateExcludes(fromEvent);
    matches(resource: URI): boolean;
    dispose(): void;
}
