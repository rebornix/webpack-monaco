import { IConfiguration } from 'vs/editor/common/editorCommon';
import { IViewModel, IViewLayout } from 'vs/editor/common/viewModel/viewModel';
import { ViewEventHandler } from 'vs/editor/common/viewModel/viewEventHandler';
import { ViewEventDispatcher } from 'vs/editor/common/view/viewEventDispatcher';
import { ITheme } from 'vs/platform/theme/common/themeService';
export declare class ViewContext {
    readonly configuration: IConfiguration;
    readonly model: IViewModel;
    readonly viewLayout: IViewLayout;
    readonly privateViewEventBus: ViewEventDispatcher;
    theme: ITheme;
    constructor(configuration: IConfiguration, theme: ITheme, model: IViewModel, privateViewEventBus: ViewEventDispatcher);
    addEventHandler(eventHandler: ViewEventHandler): void;
    removeEventHandler(eventHandler: ViewEventHandler): void;
}
