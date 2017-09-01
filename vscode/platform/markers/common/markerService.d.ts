import URI from 'vs/base/common/uri';
import Event from 'vs/base/common/event';
import { IMarkerService, IMarkerData, IResourceMarker, IMarker, MarkerStatistics } from './markers';
export declare class MarkerService implements IMarkerService {
    _serviceBrand: any;
    private _onMarkerChanged;
    private _onMarkerChangedEvent;
    private _byResource;
    private _byOwner;
    private _stats;
    constructor();
    dispose(): void;
    readonly onMarkerChanged: Event<URI[]>;
    getStatistics(): MarkerStatistics;
    remove(owner: string, resources: URI[]): void;
    changeOne(owner: string, resource: URI, markerData: IMarkerData[]): void;
    private static _toMarker(owner, resource, data);
    changeAll(owner: string, data: IResourceMarker[]): void;
    read(filter?: {
        owner?: string;
        resource?: URI;
        take?: number;
    }): IMarker[];
    private static _dedupeMap;
    private static _debouncer(last, event);
}
