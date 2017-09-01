import { ViewEventHandler } from 'vs/editor/common/viewModel/viewEventHandler';
import { RenderingContext } from 'vs/editor/common/view/renderingContext';
export declare abstract class DynamicViewOverlay extends ViewEventHandler {
    abstract prepareRender(ctx: RenderingContext): void;
    abstract render(startLineNumber: number, lineNumber: number): string;
}
