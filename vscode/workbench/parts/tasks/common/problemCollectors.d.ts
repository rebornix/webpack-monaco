import URI from 'vs/base/common/uri';
import { EventEmitter } from 'vs/base/common/eventEmitter';
import { IDisposable } from 'vs/base/common/lifecycle';
import { IModelService } from 'vs/editor/common/services/modelService';
import { ProblemMatcher, ProblemMatch } from 'vs/platform/markers/common/problemMatcher';
import { IMarkerService, IMarkerData } from 'vs/platform/markers/common/markers';
export declare namespace ProblemCollectorEvents {
    let WatchingBeginDetected: string;
    let WatchingEndDetected: string;
}
export interface IProblemMatcher {
    processLine(line: string): void;
}
export declare class AbstractProblemCollector extends EventEmitter implements IDisposable {
    protected markerService: IMarkerService;
    private modelService;
    private matchers;
    private activeMatcher;
    private _numberOfMatches;
    private buffer;
    private bufferLength;
    private openModels;
    private modelListeners;
    private applyToByOwner;
    private resourcesToClean;
    private markers;
    private deliveredMarkers;
    constructor(problemMatchers: ProblemMatcher[], markerService: IMarkerService, modelService: IModelService);
    dispose(): void;
    readonly numberOfMatches: number;
    protected tryFindMarker(line: string): ProblemMatch;
    protected isOpen(resource: URI): boolean;
    protected shouldApplyMatch(result: ProblemMatch): boolean;
    private mergeApplyTo(current, value);
    private tryMatchers();
    private clearBuffer();
    protected recordResourcesToClean(owner: string): void;
    protected recordResourceToClean(owner: string, resource: URI): void;
    protected removeResourceToClean(owner: string, resource: string): void;
    private getResourceSetToClean(owner);
    protected cleanAllMarkers(): void;
    protected cleanMarkers(owner: string): void;
    private _cleanMarkers(owner, toClean);
    protected recordMarker(marker: IMarkerData, owner: string, resourceAsString: string): void;
    protected reportMarkers(): void;
    protected deliverMarkersPerOwnerAndResource(owner: string, resource: string): void;
    private deliverMarkersPerOwnerAndResourceResolved(owner, resource, markers, reported);
    private getDeliveredMarkersPerOwner(owner);
}
export declare enum ProblemHandlingStrategy {
    Clean = 0,
}
export declare class StartStopProblemCollector extends AbstractProblemCollector implements IProblemMatcher {
    private owners;
    private strategy;
    private currentOwner;
    private currentResource;
    constructor(problemMatchers: ProblemMatcher[], markerService: IMarkerService, modelService: IModelService, strategy?: ProblemHandlingStrategy);
    processLine(line: string): void;
    done(): void;
}
export declare class WatchingProblemCollector extends AbstractProblemCollector implements IProblemMatcher {
    private problemMatchers;
    private watchingBeginsPatterns;
    private watchingEndsPatterns;
    private currentOwner;
    private currentResource;
    constructor(problemMatchers: ProblemMatcher[], markerService: IMarkerService, modelService: IModelService);
    aboutToStart(): void;
    processLine(line: string): void;
    forceDelivery(): void;
    private tryBegin(line);
    private tryFinish(line);
    done(): void;
    private resetCurrentResource();
    private reportMarkersForCurrentResource();
}
