import { CommonEditorConfiguration, IEnvConfiguration } from 'vs/editor/common/config/commonEditorConfig';
import { IDimension } from 'vs/editor/common/editorCommon';
import { FontInfo, BareFontInfo } from 'vs/editor/common/config/fontInfo';
import { FastDomNode } from 'vs/base/browser/fastDomNode';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { IEditorOptions } from 'vs/editor/common/config/editorOptions';
export declare function readFontInfo(bareFontInfo: BareFontInfo): FontInfo;
export declare function restoreFontInfo(storageService: IStorageService): void;
export declare function saveFontInfo(storageService: IStorageService): void;
export interface ISerializedFontInfo {
    readonly zoomLevel: number;
    readonly fontFamily: string;
    readonly fontWeight: string;
    readonly fontSize: number;
    readonly lineHeight: number;
    readonly letterSpacing: number;
    readonly isMonospace: boolean;
    readonly typicalHalfwidthCharacterWidth: number;
    readonly typicalFullwidthCharacterWidth: number;
    readonly spaceWidth: number;
    readonly maxDigitWidth: number;
}
export declare class Configuration extends CommonEditorConfiguration {
    static applyFontInfoSlow(domNode: HTMLElement, fontInfo: BareFontInfo): void;
    static applyFontInfo(domNode: FastDomNode<HTMLElement>, fontInfo: BareFontInfo): void;
    private readonly _elementSizeObserver;
    constructor(options: IEditorOptions, referenceDomElement?: HTMLElement);
    private _onReferenceDomElementSizeChanged();
    private _onCSSBasedConfigurationChanged();
    observeReferenceElement(dimension?: IDimension): void;
    dispose(): void;
    private _getExtraEditorClassName();
    protected _getEnvConfiguration(): IEnvConfiguration;
    protected readConfiguration(bareFontInfo: BareFontInfo): FontInfo;
}
