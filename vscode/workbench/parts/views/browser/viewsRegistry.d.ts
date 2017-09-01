import Event from 'vs/base/common/event';
import { IViewConstructorSignature } from 'vs/workbench/parts/views/browser/views';
import { ITreeViewDataProvider } from 'vs/workbench/parts/views/common/views';
import { ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';
export declare class ViewLocation {
    private _id;
    static readonly Explorer: ViewLocation;
    static readonly Debug: ViewLocation;
    static readonly Extensions: ViewLocation;
    static readonly SCM: ViewLocation;
    constructor(_id: string);
    readonly id: string;
    static getContributedViewLocation(value: string): ViewLocation;
}
export interface IViewDescriptor {
    readonly id: string;
    readonly name: string;
    readonly location: ViewLocation;
    readonly ctor: IViewConstructorSignature;
    readonly when?: ContextKeyExpr;
    readonly order?: number;
    readonly size?: number;
    readonly canToggleVisibility?: boolean;
}
export interface IViewsRegistry {
    readonly onViewsRegistered: Event<IViewDescriptor[]>;
    readonly onViewsDeregistered: Event<IViewDescriptor[]>;
    readonly onTreeViewDataProviderRegistered: Event<string>;
    registerViews(views: IViewDescriptor[]): void;
    deregisterViews(ids: string[], location: ViewLocation): void;
    registerTreeViewDataProvider(id: string, factory: ITreeViewDataProvider): void;
    deregisterTreeViewDataProviders(): void;
    getViews(loc: ViewLocation): IViewDescriptor[];
    getTreeViewDataProvider(id: string): ITreeViewDataProvider;
}
export declare const ViewsRegistry: IViewsRegistry;
