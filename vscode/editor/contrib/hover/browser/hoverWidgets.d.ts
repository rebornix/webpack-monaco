import { Position } from 'vs/editor/common/core/position';
import * as editorBrowser from 'vs/editor/browser/editorBrowser';
import { Widget } from 'vs/base/browser/ui/widget';
export declare class ContentHoverWidget extends Widget implements editorBrowser.IContentWidget {
    private _id;
    protected _editor: editorBrowser.ICodeEditor;
    private _isVisible;
    private _containerDomNode;
    private _domNode;
    protected _showAtPosition: Position;
    private _stoleFocus;
    private scrollbar;
    private disposables;
    allowEditorOverflow: boolean;
    protected isVisible: boolean;
    constructor(id: string, editor: editorBrowser.ICodeEditor);
    getId(): string;
    getDomNode(): HTMLElement;
    showAt(position: Position, focus: boolean): void;
    hide(): void;
    getPosition(): editorBrowser.IContentWidgetPosition;
    dispose(): void;
    private updateFont();
    protected updateContents(node: Node): void;
    private updateMaxHeight();
}
export declare class GlyphHoverWidget extends Widget implements editorBrowser.IOverlayWidget {
    private _id;
    protected _editor: editorBrowser.ICodeEditor;
    private _isVisible;
    private _domNode;
    protected _showAtLineNumber: number;
    constructor(id: string, editor: editorBrowser.ICodeEditor);
    protected isVisible: boolean;
    getId(): string;
    getDomNode(): HTMLElement;
    showAt(lineNumber: number): void;
    hide(): void;
    getPosition(): editorBrowser.IOverlayWidgetPosition;
    dispose(): void;
    private updateFont();
    protected updateContents(node: Node): void;
}
