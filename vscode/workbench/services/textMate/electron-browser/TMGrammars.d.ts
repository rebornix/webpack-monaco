import { IExtensionPoint } from 'vs/platform/extensions/common/extensionsRegistry';
export interface IEmbeddedLanguagesMap {
    [scopeName: string]: string;
}
export interface ITMSyntaxExtensionPoint {
    language: string;
    scopeName: string;
    path: string;
    embeddedLanguages: IEmbeddedLanguagesMap;
    injectTo: string[];
}
export declare const grammarsExtPoint: IExtensionPoint<ITMSyntaxExtensionPoint[]>;
