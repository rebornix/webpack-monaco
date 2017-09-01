import { TPromise } from 'vs/base/common/winjs.base';
import { IDisposable } from 'vs/base/common/lifecycle';
import URI from 'vs/base/common/uri';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { ILifecycleService } from 'vs/platform/lifecycle/common/lifecycle';
import { ITelemetryService, ITelemetryInfo, ITelemetryData } from 'vs/platform/telemetry/common/telemetry';
export declare const NullTelemetryService: {
    _serviceBrand: any;
    publicLog(eventName: string, data?: ITelemetryData): TPromise<void, any>;
    isOptedIn: boolean;
    getTelemetryInfo(): TPromise<ITelemetryInfo, any>;
};
export interface ITelemetryAppender {
    log(eventName: string, data: any): void;
}
export declare function combinedAppender(...appenders: ITelemetryAppender[]): ITelemetryAppender;
export declare const NullAppender: ITelemetryAppender;
export declare function anonymize(input: string): string;
export interface URIDescriptor {
    mimeType?: string;
    ext?: string;
    path?: string;
}
export declare function telemetryURIDescriptor(uri: URI): URIDescriptor;
export declare function configurationTelemetry(telemetryService: ITelemetryService, configurationService: IConfigurationService): IDisposable;
export declare function lifecycleTelemetry(telemetryService: ITelemetryService, lifecycleService: ILifecycleService): IDisposable;
export declare function keybindingsTelemetry(telemetryService: ITelemetryService, keybindingService: IKeybindingService): IDisposable;
