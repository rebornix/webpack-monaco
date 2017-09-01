import { IMarkerService, IMarkerData } from 'vs/platform/markers/common/markers';
import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { MainThreadDiagnosticsShape, IExtHostContext } from '../node/extHost.protocol';
export declare class MainThreadDiagnostics implements MainThreadDiagnosticsShape {
    private readonly _activeOwners;
    private readonly _markerService;
    constructor(extHostContext: IExtHostContext, markerService: IMarkerService);
    dispose(): void;
    $changeMany(owner: string, entries: [URI, IMarkerData[]][]): TPromise<any>;
    $clear(owner: string): TPromise<any>;
}
