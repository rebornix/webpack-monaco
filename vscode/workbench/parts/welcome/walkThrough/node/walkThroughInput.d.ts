import { TPromise } from 'vs/base/common/winjs.base';
import { EditorInput, EditorModel, ITextEditorModel } from 'vs/workbench/common/editor';
import URI from 'vs/base/common/uri';
import { IReference } from 'vs/base/common/lifecycle';
import { ITextModelService } from 'vs/editor/common/services/resolverService';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { ILifecycleService } from 'vs/platform/lifecycle/common/lifecycle';
export declare class WalkThroughModel extends EditorModel {
    private mainRef;
    private snippetRefs;
    constructor(mainRef: IReference<ITextEditorModel>, snippetRefs: IReference<ITextEditorModel>[]);
    readonly main: ITextEditorModel;
    readonly snippets: ITextEditorModel[];
    dispose(): void;
}
export interface WalkThroughInputOptions {
    readonly typeId: string;
    readonly name: string;
    readonly description?: string;
    readonly resource: URI;
    readonly telemetryFrom: string;
    readonly onReady?: (container: HTMLElement) => void;
}
export declare class WalkThroughInput extends EditorInput {
    private options;
    private telemetryService;
    private textModelResolverService;
    private disposables;
    private promise;
    private resolveTime;
    private maxTopScroll;
    private maxBottomScroll;
    constructor(options: WalkThroughInputOptions, telemetryService: ITelemetryService, lifecycleService: ILifecycleService, textModelResolverService: ITextModelService);
    getResource(): URI;
    getTypeId(): string;
    getName(): string;
    getDescription(): string;
    getTelemetryFrom(): string;
    getTelemetryDescriptor(): object;
    readonly onReady: (container: HTMLElement) => void;
    resolve(refresh?: boolean): TPromise<WalkThroughModel>;
    matches(otherInput: any): boolean;
    dispose(): void;
    relativeScrollPosition(topScroll: number, bottomScroll: number): void;
    private resolveTelemetry();
    private disposeTelemetry(reason?);
}
