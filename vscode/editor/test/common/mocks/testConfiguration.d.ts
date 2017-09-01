import { CommonEditorConfiguration, IEnvConfiguration } from 'vs/editor/common/config/commonEditorConfig';
import { IEditorOptions } from 'vs/editor/common/config/editorOptions';
import { FontInfo, BareFontInfo } from 'vs/editor/common/config/fontInfo';
export declare class TestConfiguration extends CommonEditorConfiguration {
    constructor(opts: IEditorOptions);
    protected _getEnvConfiguration(): IEnvConfiguration;
    protected readConfiguration(styling: BareFontInfo): FontInfo;
}
