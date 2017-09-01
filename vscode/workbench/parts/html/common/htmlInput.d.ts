import URI from 'vs/base/common/uri';
import { ResourceEditorInput } from 'vs/workbench/common/editor/resourceEditorInput';
import { ITextModelService } from 'vs/editor/common/services/resolverService';
export interface HtmlInputOptions {
    allowScripts?: boolean;
    allowSvgs?: boolean;
    svgWhiteList?: string[];
}
export declare function areHtmlInputOptionsEqual(left: HtmlInputOptions, right: HtmlInputOptions): boolean;
export declare class HtmlInput extends ResourceEditorInput {
    readonly options: HtmlInputOptions;
    constructor(name: string, description: string, resource: URI, options: HtmlInputOptions, textModelResolverService: ITextModelService);
}
