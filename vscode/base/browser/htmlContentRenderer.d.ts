import { TPromise } from 'vs/base/common/winjs.base';
import { IMarkdownString } from 'vs/base/common/htmlContent';
import { IMouseEvent } from 'vs/base/browser/mouseEvent';
export interface RenderOptions {
    className?: string;
    inline?: boolean;
    actionCallback?: (content: string, event?: IMouseEvent) => void;
    codeBlockRenderer?: (modeId: string, value: string) => string | TPromise<string>;
}
export declare function renderText(text: string, options?: RenderOptions): Node;
export declare function renderFormattedText(formattedText: string, options?: RenderOptions): Node;
/**
 * Create html nodes for the given content element.
 *
 * @param content a html element description
 * @param actionCallback a callback function for any action links in the string. Argument is the zero-based index of the clicked action.
 */
export declare function renderMarkdown(markdown: IMarkdownString, options?: RenderOptions): Node;
