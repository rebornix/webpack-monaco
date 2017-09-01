import URI from 'vs/base/common/uri';
import { IRange } from 'vs/editor/common/core/range';
import { IMarker, MarkerStatistics } from 'vs/platform/markers/common/markers';
import { IFilter, IMatch } from 'vs/base/common/filters';
export interface BulkUpdater {
    add(resource: URI, markers: IMarker[]): any;
    done(): any;
}
export declare class Resource {
    uri: URI;
    markers: Marker[];
    statistics: MarkerStatistics;
    matches: IMatch[];
    private _name;
    private _path;
    constructor(uri: URI, markers: Marker[], statistics: MarkerStatistics, matches?: IMatch[]);
    readonly path: string;
    readonly name: string;
}
export declare class Marker {
    id: string;
    marker: IMarker;
    labelMatches: IMatch[];
    sourceMatches: IMatch[];
    constructor(id: string, marker: IMarker, labelMatches?: IMatch[], sourceMatches?: IMatch[]);
    readonly resource: URI;
    readonly range: IRange;
    toString(): string;
}
export declare class FilterOptions {
    static _filter: IFilter;
    static _fuzzyFilter: IFilter;
    private _filterErrors;
    private _filterWarnings;
    private _filterInfos;
    private _filter;
    private _completeFilter;
    constructor(filter?: string);
    readonly filterErrors: boolean;
    readonly filterWarnings: boolean;
    readonly filterInfos: boolean;
    readonly filter: string;
    readonly completeFilter: string;
    hasFilters(): boolean;
    private parse(filter);
    private matches(prefix, word);
}
export declare class MarkersModel {
    private markersByResource;
    private _filteredResources;
    private _nonFilteredResources;
    private _filterOptions;
    constructor(markers?: IMarker[]);
    readonly filterOptions: FilterOptions;
    readonly filteredResources: Resource[];
    hasFilteredResources(): boolean;
    hasResources(): boolean;
    hasResource(resource: URI): boolean;
    readonly nonFilteredResources: Resource[];
    getBulkUpdater(): BulkUpdater;
    update(filterOptions: FilterOptions): any;
    update(resourceUri: URI, markers: IMarker[]): any;
    update(markers: IMarker[]): any;
    private refresh();
    private refreshResources();
    private updateResource(resourceUri, markers);
    private updateMarkers(markers);
    private toFilteredResource(uri, values);
    private toMarker(marker, index, uri);
    private filterMarker(marker);
    private getStatistics(markers);
    dispose(): void;
    getTitle(markerStatistics: MarkerStatistics): string;
    getMessage(): string;
    static getStatisticsLabel(markerStatistics: MarkerStatistics, onlyErrors?: boolean): string;
    private static getLabel(title, markersCount, singleMarkerString, multipleMarkersFunction);
    static compare(a: any, b: any): number;
    private static compareResources(a, b);
    private static compareMarkers(a, b);
}
export interface IProblemsConfiguration {
    problems: {
        autoReveal: boolean;
    };
}
