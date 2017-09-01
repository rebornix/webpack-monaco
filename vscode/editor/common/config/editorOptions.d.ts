import * as platform from 'vs/base/common/platform';
import { ScrollbarVisibility } from 'vs/base/common/scrollable';
import { FontInfo } from 'vs/editor/common/config/fontInfo';
/**
 * Configuration options for editor scrollbars
 */
export interface IEditorScrollbarOptions {
    /**
     * The size of arrows (if displayed).
     * Defaults to 11.
     */
    arrowSize?: number;
    /**
     * Render vertical scrollbar.
     * Accepted values: 'auto', 'visible', 'hidden'.
     * Defaults to 'auto'.
     */
    vertical?: string;
    /**
     * Render horizontal scrollbar.
     * Accepted values: 'auto', 'visible', 'hidden'.
     * Defaults to 'auto'.
     */
    horizontal?: string;
    /**
     * Cast horizontal and vertical shadows when the content is scrolled.
     * Defaults to true.
     */
    useShadows?: boolean;
    /**
     * Render arrows at the top and bottom of the vertical scrollbar.
     * Defaults to false.
     */
    verticalHasArrows?: boolean;
    /**
     * Render arrows at the left and right of the horizontal scrollbar.
     * Defaults to false.
     */
    horizontalHasArrows?: boolean;
    /**
     * Listen to mouse wheel events and react to them by scrolling.
     * Defaults to true.
     */
    handleMouseWheel?: boolean;
    /**
     * Height in pixels for the horizontal scrollbar.
     * Defaults to 10 (px).
     */
    horizontalScrollbarSize?: number;
    /**
     * Width in pixels for the vertical scrollbar.
     * Defaults to 10 (px).
     */
    verticalScrollbarSize?: number;
    /**
     * Width in pixels for the vertical slider.
     * Defaults to `verticalScrollbarSize`.
     */
    verticalSliderSize?: number;
    /**
     * Height in pixels for the horizontal slider.
     * Defaults to `horizontalScrollbarSize`.
     */
    horizontalSliderSize?: number;
}
/**
 * Configuration options for editor find widget
 */
export interface IEditorFindOptions {
    /**
     * Controls if we seed search string in the Find Widget with editor selection.
     */
    seedSearchStringFromSelection?: boolean;
    /**
     * Controls if Find in Selection flag is turned on when multiple lines of text are selected in the editor.
     */
    autoFindInSelection: boolean;
}
/**
 * Configuration options for editor minimap
 */
export interface IEditorMinimapOptions {
    /**
     * Enable the rendering of the minimap.
     * Defaults to false.
     */
    enabled?: boolean;
    /**
     * Control the rendering of the minimap slider.
     * Defaults to 'mouseover'.
     */
    showSlider?: 'always' | 'mouseover';
    /**
     * Render the actual text on a line (as opposed to color blocks).
     * Defaults to true.
     */
    renderCharacters?: boolean;
    /**
     * Limit the width of the minimap to render at most a certain number of columns.
     * Defaults to 120.
     */
    maxColumn?: number;
}
/**
 * Configuration options for the editor.
 */
export interface IEditorOptions {
    /**
     * This editor is used inside a diff editor.
     * @internal
     */
    inDiffEditor?: boolean;
    /**
     * The aria label for the editor's textarea (when it is focused).
     */
    ariaLabel?: string;
    /**
     * Render vertical lines at the specified columns.
     * Defaults to empty array.
     */
    rulers?: number[];
    /**
     * A string containing the word separators used when doing word navigation.
     * Defaults to `~!@#$%^&*()-=+[{]}\\|;:\'",.<>/?
     */
    wordSeparators?: string;
    /**
     * Enable Linux primary clipboard.
     * Defaults to true.
     */
    selectionClipboard?: boolean;
    /**
     * Control the rendering of line numbers.
     * If it is a function, it will be invoked when rendering a line number and the return value will be rendered.
     * Otherwise, if it is a truey, line numbers will be rendered normally (equivalent of using an identity function).
     * Otherwise, line numbers will not be rendered.
     * Defaults to true.
     */
    lineNumbers?: 'on' | 'off' | 'relative' | ((lineNumber: number) => string);
    /**
     * Should the corresponding line be selected when clicking on the line number?
     * Defaults to true.
     */
    selectOnLineNumbers?: boolean;
    /**
     * Control the width of line numbers, by reserving horizontal space for rendering at least an amount of digits.
     * Defaults to 5.
     */
    lineNumbersMinChars?: number;
    /**
     * Enable the rendering of the glyph margin.
     * Defaults to true in vscode and to false in monaco-editor.
     */
    glyphMargin?: boolean;
    /**
     * The width reserved for line decorations (in px).
     * Line decorations are placed between line numbers and the editor content.
     * You can pass in a string in the format floating point followed by "ch". e.g. 1.3ch.
     * Defaults to 10.
     */
    lineDecorationsWidth?: number | string;
    /**
     * When revealing the cursor, a virtual padding (px) is added to the cursor, turning it into a rectangle.
     * This virtual padding ensures that the cursor gets revealed before hitting the edge of the viewport.
     * Defaults to 30 (px).
     */
    revealHorizontalRightPadding?: number;
    /**
     * Render the editor selection with rounded borders.
     * Defaults to true.
     */
    roundedSelection?: boolean;
    /**
     * Class name to be added to the editor.
     */
    extraEditorClassName?: string;
    /**
     * Should the editor be read only.
     * Defaults to false.
     */
    readOnly?: boolean;
    /**
     * Control the behavior and rendering of the scrollbars.
     */
    scrollbar?: IEditorScrollbarOptions;
    /**
     * Control the behavior and rendering of the minimap.
     */
    minimap?: IEditorMinimapOptions;
    /**
     * Control the behavior of the find widget.
     */
    find?: IEditorFindOptions;
    /**
     * Display overflow widgets as `fixed`.
     * Defaults to `false`.
     */
    fixedOverflowWidgets?: boolean;
    /**
     * The number of vertical lanes the overview ruler should render.
     * Defaults to 2.
     */
    overviewRulerLanes?: number;
    /**
     * Controls if a border should be drawn around the overview ruler.
     * Defaults to `true`.
     */
    overviewRulerBorder?: boolean;
    /**
     * Control the cursor animation style, possible values are 'blink', 'smooth', 'phase', 'expand' and 'solid'.
     * Defaults to 'blink'.
     */
    cursorBlinking?: string;
    /**
     * Zoom the font in the editor when using the mouse wheel in combination with holding Ctrl.
     * Defaults to false.
     */
    mouseWheelZoom?: boolean;
    /**
     * Control the mouse pointer style, either 'text' or 'default' or 'copy'
     * Defaults to 'text'
     * @internal
     */
    mouseStyle?: 'text' | 'default' | 'copy';
    /**
     * Control the cursor style, either 'block' or 'line'.
     * Defaults to 'line'.
     */
    cursorStyle?: string;
    /**
     * Enable font ligatures.
     * Defaults to false.
     */
    fontLigatures?: boolean;
    /**
     * Disable the use of `will-change` for the editor margin and lines layers.
     * The usage of `will-change` acts as a hint for browsers to create an extra layer.
     * Defaults to false.
     */
    disableLayerHinting?: boolean;
    /**
     * Disable the optimizations for monospace fonts.
     * Defaults to false.
     */
    disableMonospaceOptimizations?: boolean;
    /**
     * Should the cursor be hidden in the overview ruler.
     * Defaults to false.
     */
    hideCursorInOverviewRuler?: boolean;
    /**
     * Enable that scrolling can go one screen size after the last line.
     * Defaults to true.
     */
    scrollBeyondLastLine?: boolean;
    /**
     * Enable that the editor animates scrolling to a position.
     * Defaults to false.
     */
    smoothScrolling?: boolean;
    /**
     * Enable that the editor will install an interval to check if its container dom node size has changed.
     * Enabling this might have a severe performance impact.
     * Defaults to false.
     */
    automaticLayout?: boolean;
    /**
     * Control the wrapping of the editor.
     * When `wordWrap` = "off", the lines will never wrap.
     * When `wordWrap` = "on", the lines will wrap at the viewport width.
     * When `wordWrap` = "wordWrapColumn", the lines will wrap at `wordWrapColumn`.
     * When `wordWrap` = "bounded", the lines will wrap at min(viewport width, wordWrapColumn).
     * Defaults to "off".
     */
    wordWrap?: 'off' | 'on' | 'wordWrapColumn' | 'bounded';
    /**
     * Control the wrapping of the editor.
     * When `wordWrap` = "off", the lines will never wrap.
     * When `wordWrap` = "on", the lines will wrap at the viewport width.
     * When `wordWrap` = "wordWrapColumn", the lines will wrap at `wordWrapColumn`.
     * When `wordWrap` = "bounded", the lines will wrap at min(viewport width, wordWrapColumn).
     * Defaults to 80.
     */
    wordWrapColumn?: number;
    /**
     * Force word wrapping when the text appears to be of a minified/generated file.
     * Defaults to true.
     */
    wordWrapMinified?: boolean;
    /**
     * Control indentation of wrapped lines. Can be: 'none', 'same' or 'indent'.
     * Defaults to 'same' in vscode and to 'none' in monaco-editor.
     */
    wrappingIndent?: string;
    /**
     * Configure word wrapping characters. A break will be introduced before these characters.
     * Defaults to '{([+'.
     */
    wordWrapBreakBeforeCharacters?: string;
    /**
     * Configure word wrapping characters. A break will be introduced after these characters.
     * Defaults to ' \t})]?|&,;'.
     */
    wordWrapBreakAfterCharacters?: string;
    /**
     * Configure word wrapping characters. A break will be introduced after these characters only if no `wordWrapBreakBeforeCharacters` or `wordWrapBreakAfterCharacters` were found.
     * Defaults to '.'.
     */
    wordWrapBreakObtrusiveCharacters?: string;
    /**
     * Performance guard: Stop rendering a line after x characters.
     * Defaults to 10000.
     * Use -1 to never stop rendering
     */
    stopRenderingLineAfter?: number;
    /**
     * Enable hover.
     * Defaults to true.
     */
    hover?: boolean;
    /**
     * Enable detecting links and making them clickable.
     * Defaults to true.
     */
    links?: boolean;
    /**
     * Enable inline color decorators and color picker rendering.
     */
    colorDecorators?: boolean;
    /**
     * Enable custom contextmenu.
     * Defaults to true.
     */
    contextmenu?: boolean;
    /**
     * A multiplier to be used on the `deltaX` and `deltaY` of mouse wheel scroll events.
     * Defaults to 1.
     */
    mouseWheelScrollSensitivity?: number;
    /**
     * The modifier to be used to add multiple cursors with the mouse.
     * Defaults to 'alt'
     */
    multiCursorModifier?: 'ctrlCmd' | 'alt';
    /**
     * Configure the editor's accessibility support.
     * Defaults to 'auto'. It is best to leave this to 'auto'.
     */
    accessibilitySupport?: 'auto' | 'off' | 'on';
    /**
     * Enable quick suggestions (shadow suggestions)
     * Defaults to true.
     */
    quickSuggestions?: boolean | {
        other: boolean;
        comments: boolean;
        strings: boolean;
    };
    /**
     * Quick suggestions show delay (in ms)
     * Defaults to 500 (ms)
     */
    quickSuggestionsDelay?: number;
    /**
     * Enables parameter hints
     */
    parameterHints?: boolean;
    /**
     * Render icons in suggestions box.
     * Defaults to true.
     */
    iconsInSuggestions?: boolean;
    /**
     * Enable auto closing brackets.
     * Defaults to true.
     */
    autoClosingBrackets?: boolean;
    /**
     * Enable auto indentation adjustment.
     * Defaults to false.
     */
    autoIndent?: boolean;
    /**
     * Enable format on type.
     * Defaults to false.
     */
    formatOnType?: boolean;
    /**
     * Enable format on paste.
     * Defaults to false.
     */
    formatOnPaste?: boolean;
    /**
     * Controls if the editor should allow to move selections via drag and drop.
     * Defaults to false.
     */
    dragAndDrop?: boolean;
    /**
     * Enable the suggestion box to pop-up on trigger characters.
     * Defaults to true.
     */
    suggestOnTriggerCharacters?: boolean;
    /**
     * Accept suggestions on ENTER.
     * Defaults to 'on'.
     */
    acceptSuggestionOnEnter?: 'on' | 'smart' | 'off';
    /**
     * Accept suggestions on provider defined characters.
     * Defaults to true.
     */
    acceptSuggestionOnCommitCharacter?: boolean;
    /**
     * Enable snippet suggestions. Default to 'true'.
     */
    snippetSuggestions?: 'top' | 'bottom' | 'inline' | 'none';
    /**
     * Copying without a selection copies the current line.
     */
    emptySelectionClipboard?: boolean;
    /**
     * Enable word based suggestions. Defaults to 'true'
     */
    wordBasedSuggestions?: boolean;
    /**
     * The font size for the suggest widget.
     * Defaults to the editor font size.
     */
    suggestFontSize?: number;
    /**
     * The line height for the suggest widget.
     * Defaults to the editor line height.
     */
    suggestLineHeight?: number;
    /**
     * Enable selection highlight.
     * Defaults to true.
     */
    selectionHighlight?: boolean;
    /**
     * Enable semantic occurrences highlight.
     * Defaults to true.
     */
    occurrencesHighlight?: boolean;
    /**
     * Show code lens
     * Defaults to true.
     */
    codeLens?: boolean;
    /**
     * @deprecated - use codeLens instead
     * @internal
     */
    referenceInfos?: boolean;
    /**
     * Enable code folding
     * Defaults to true in vscode and to false in monaco-editor.
     */
    folding?: boolean;
    /**
     * Controls whether the fold actions in the gutter stay always visible or hide unless the mouse is over the gutter.
     * Defaults to 'mouseover'.
     */
    showFoldingControls?: 'always' | 'mouseover';
    /**
     * Enable highlighting of matching brackets.
     * Defaults to true.
     */
    matchBrackets?: boolean;
    /**
     * Enable rendering of whitespace.
     * Defaults to none.
     */
    renderWhitespace?: 'none' | 'boundary' | 'all';
    /**
     * Enable rendering of control characters.
     * Defaults to false.
     */
    renderControlCharacters?: boolean;
    /**
     * Enable rendering of indent guides.
     * Defaults to false.
     */
    renderIndentGuides?: boolean;
    /**
     * Enable rendering of current line highlight.
     * Defaults to all.
     */
    renderLineHighlight?: 'none' | 'gutter' | 'line' | 'all';
    /**
     * Inserting and deleting whitespace follows tab stops.
     */
    useTabStops?: boolean;
    /**
     * The font family
     */
    fontFamily?: string;
    /**
     * The font weight
     */
    fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | 'initial' | 'inherit' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    /**
     * The font size
     */
    fontSize?: number;
    /**
     * The line height
     */
    lineHeight?: number;
    /**
     * The letter spacing
     */
    letterSpacing?: number;
}
/**
 * Configuration options for the diff editor.
 */
export interface IDiffEditorOptions extends IEditorOptions {
    /**
     * Allow the user to resize the diff editor split view.
     * Defaults to true.
     */
    enableSplitViewResizing?: boolean;
    /**
     * Render the differences in two side-by-side editors.
     * Defaults to true.
     */
    renderSideBySide?: boolean;
    /**
     * Compute the diff by ignoring leading/trailing whitespace
     * Defaults to true.
     */
    ignoreTrimWhitespace?: boolean;
    /**
     * Render +/- indicators for added/deleted changes.
     * Defaults to true.
     */
    renderIndicators?: boolean;
    /**
     * Original model should be editable?
     * Defaults to false.
     */
    originalEditable?: boolean;
}
export declare enum RenderMinimap {
    None = 0,
    Small = 1,
    Large = 2,
    SmallBlocks = 3,
    LargeBlocks = 4,
}
/**
 * Describes how to indent wrapped lines.
 */
export declare enum WrappingIndent {
    /**
     * No indentation => wrapped lines begin at column 1.
     */
    None = 0,
    /**
     * Same => wrapped lines get the same indentation as the parent.
     */
    Same = 1,
    /**
     * Indent => wrapped lines get +1 indentation as the parent.
     */
    Indent = 2,
}
/**
 * The kind of animation in which the editor's cursor should be rendered.
 */
export declare enum TextEditorCursorBlinkingStyle {
    /**
     * Hidden
     */
    Hidden = 0,
    /**
     * Blinking
     */
    Blink = 1,
    /**
     * Blinking with smooth fading
     */
    Smooth = 2,
    /**
     * Blinking with prolonged filled state and smooth fading
     */
    Phase = 3,
    /**
     * Expand collapse animation on the y axis
     */
    Expand = 4,
    /**
     * No-Blinking
     */
    Solid = 5,
}
/**
 * @internal
 */
export declare function blinkingStyleToString(blinkingStyle: TextEditorCursorBlinkingStyle): string;
/**
 * The style in which the editor's cursor should be rendered.
 */
export declare enum TextEditorCursorStyle {
    /**
     * As a vertical line (sitting between two characters).
     */
    Line = 1,
    /**
     * As a block (sitting on top of a character).
     */
    Block = 2,
    /**
     * As a horizontal line (sitting under a character).
     */
    Underline = 3,
    /**
     * As a thin vertical line (sitting between two characters).
     */
    LineThin = 4,
    /**
     * As an outlined block (sitting on top of a character).
     */
    BlockOutline = 5,
    /**
     * As a thin horizontal line (sitting under a character).
     */
    UnderlineThin = 6,
}
/**
 * @internal
 */
export declare function cursorStyleToString(cursorStyle: TextEditorCursorStyle): string;
export interface InternalEditorScrollbarOptions {
    readonly arrowSize: number;
    readonly vertical: ScrollbarVisibility;
    readonly horizontal: ScrollbarVisibility;
    readonly useShadows: boolean;
    readonly verticalHasArrows: boolean;
    readonly horizontalHasArrows: boolean;
    readonly handleMouseWheel: boolean;
    readonly horizontalScrollbarSize: number;
    readonly horizontalSliderSize: number;
    readonly verticalScrollbarSize: number;
    readonly verticalSliderSize: number;
    readonly mouseWheelScrollSensitivity: number;
}
export interface InternalEditorMinimapOptions {
    readonly enabled: boolean;
    readonly showSlider: 'always' | 'mouseover';
    readonly renderCharacters: boolean;
    readonly maxColumn: number;
}
export interface InternalEditorFindOptions {
    readonly seedSearchStringFromSelection: boolean;
    readonly autoFindInSelection: boolean;
}
export interface EditorWrappingInfo {
    readonly inDiffEditor: boolean;
    readonly isDominatedByLongLines: boolean;
    readonly isWordWrapMinified: boolean;
    readonly isViewportWrapping: boolean;
    readonly wrappingColumn: number;
    readonly wrappingIndent: WrappingIndent;
    readonly wordWrapBreakBeforeCharacters: string;
    readonly wordWrapBreakAfterCharacters: string;
    readonly wordWrapBreakObtrusiveCharacters: string;
}
export interface InternalEditorViewOptions {
    readonly extraEditorClassName: string;
    readonly disableMonospaceOptimizations: boolean;
    readonly rulers: number[];
    readonly ariaLabel: string;
    readonly renderLineNumbers: boolean;
    readonly renderCustomLineNumbers: (lineNumber: number) => string;
    readonly renderRelativeLineNumbers: boolean;
    readonly selectOnLineNumbers: boolean;
    readonly glyphMargin: boolean;
    readonly revealHorizontalRightPadding: number;
    readonly roundedSelection: boolean;
    readonly overviewRulerLanes: number;
    readonly overviewRulerBorder: boolean;
    readonly cursorBlinking: TextEditorCursorBlinkingStyle;
    readonly mouseWheelZoom: boolean;
    readonly cursorStyle: TextEditorCursorStyle;
    readonly hideCursorInOverviewRuler: boolean;
    readonly scrollBeyondLastLine: boolean;
    readonly smoothScrolling: boolean;
    readonly stopRenderingLineAfter: number;
    readonly renderWhitespace: 'none' | 'boundary' | 'all';
    readonly renderControlCharacters: boolean;
    readonly fontLigatures: boolean;
    readonly renderIndentGuides: boolean;
    readonly renderLineHighlight: 'none' | 'gutter' | 'line' | 'all';
    readonly scrollbar: InternalEditorScrollbarOptions;
    readonly minimap: InternalEditorMinimapOptions;
    readonly fixedOverflowWidgets: boolean;
}
export interface EditorContribOptions {
    readonly selectionClipboard: boolean;
    readonly hover: boolean;
    readonly links: boolean;
    readonly contextmenu: boolean;
    readonly quickSuggestions: boolean | {
        other: boolean;
        comments: boolean;
        strings: boolean;
    };
    readonly quickSuggestionsDelay: number;
    readonly parameterHints: boolean;
    readonly iconsInSuggestions: boolean;
    readonly formatOnType: boolean;
    readonly formatOnPaste: boolean;
    readonly suggestOnTriggerCharacters: boolean;
    readonly acceptSuggestionOnEnter: 'on' | 'smart' | 'off';
    readonly acceptSuggestionOnCommitCharacter: boolean;
    readonly snippetSuggestions: 'top' | 'bottom' | 'inline' | 'none';
    readonly wordBasedSuggestions: boolean;
    readonly suggestFontSize: number;
    readonly suggestLineHeight: number;
    readonly selectionHighlight: boolean;
    readonly occurrencesHighlight: boolean;
    readonly codeLens: boolean;
    readonly folding: boolean;
    readonly showFoldingControls: 'always' | 'mouseover';
    readonly matchBrackets: boolean;
    readonly find: InternalEditorFindOptions;
    readonly colorDecorators: boolean;
}
/**
 * Validated configuration options for the editor.
 * This is a 1 to 1 validated/parsed version of IEditorOptions merged on top of the defaults.
 * @internal
 */
export interface IValidatedEditorOptions {
    readonly inDiffEditor: boolean;
    readonly wordSeparators: string;
    readonly lineNumbersMinChars: number;
    readonly lineDecorationsWidth: number | string;
    readonly readOnly: boolean;
    readonly mouseStyle: 'text' | 'default' | 'copy';
    readonly disableLayerHinting: boolean;
    readonly automaticLayout: boolean;
    readonly wordWrap: 'off' | 'on' | 'wordWrapColumn' | 'bounded';
    readonly wordWrapColumn: number;
    readonly wordWrapMinified: boolean;
    readonly wrappingIndent: WrappingIndent;
    readonly wordWrapBreakBeforeCharacters: string;
    readonly wordWrapBreakAfterCharacters: string;
    readonly wordWrapBreakObtrusiveCharacters: string;
    readonly autoClosingBrackets: boolean;
    readonly autoIndent: boolean;
    readonly dragAndDrop: boolean;
    readonly emptySelectionClipboard: boolean;
    readonly useTabStops: boolean;
    readonly multiCursorModifier: 'altKey' | 'ctrlKey' | 'metaKey';
    readonly accessibilitySupport: 'auto' | 'off' | 'on';
    readonly viewInfo: InternalEditorViewOptions;
    readonly contribInfo: EditorContribOptions;
}
/**
 * Internal configuration options (transformed or computed) for the editor.
 */
export declare class InternalEditorOptions {
    readonly _internalEditorOptionsBrand: void;
    readonly canUseLayerHinting: boolean;
    readonly pixelRatio: number;
    readonly editorClassName: string;
    readonly lineHeight: number;
    readonly readOnly: boolean;
    /**
     * @internal
     */
    readonly accessibilitySupport: platform.AccessibilitySupport;
    readonly multiCursorModifier: 'altKey' | 'ctrlKey' | 'metaKey';
    readonly wordSeparators: string;
    readonly autoClosingBrackets: boolean;
    readonly autoIndent: boolean;
    readonly useTabStops: boolean;
    readonly tabFocusMode: boolean;
    readonly dragAndDrop: boolean;
    readonly emptySelectionClipboard: boolean;
    readonly layoutInfo: EditorLayoutInfo;
    readonly fontInfo: FontInfo;
    readonly viewInfo: InternalEditorViewOptions;
    readonly wrappingInfo: EditorWrappingInfo;
    readonly contribInfo: EditorContribOptions;
    /**
     * @internal
     */
    constructor(source: {
        canUseLayerHinting: boolean;
        pixelRatio: number;
        editorClassName: string;
        lineHeight: number;
        readOnly: boolean;
        accessibilitySupport: platform.AccessibilitySupport;
        multiCursorModifier: 'altKey' | 'ctrlKey' | 'metaKey';
        wordSeparators: string;
        autoClosingBrackets: boolean;
        autoIndent: boolean;
        useTabStops: boolean;
        tabFocusMode: boolean;
        dragAndDrop: boolean;
        emptySelectionClipboard: boolean;
        layoutInfo: EditorLayoutInfo;
        fontInfo: FontInfo;
        viewInfo: InternalEditorViewOptions;
        wrappingInfo: EditorWrappingInfo;
        contribInfo: EditorContribOptions;
    });
    /**
     * @internal
     */
    equals(other: InternalEditorOptions): boolean;
    /**
     * @internal
     */
    createChangeEvent(newOpts: InternalEditorOptions): IConfigurationChangedEvent;
    /**
     * @internal
     */
    private static _equalsLayoutInfo(a, b);
    /**
     * @internal
     */
    private static _equalsOverviewRuler(a, b);
    /**
     * @internal
     */
    private static _equalsViewOptions(a, b);
    /**
     * @internal
     */
    private static _equalsScrollbarOptions(a, b);
    /**
     * @internal
     */
    private static _equalsMinimapOptions(a, b);
    private static _equalsNumberArrays(a, b);
    /**
     * @internal
     */
    private static _equalFindOptions(a, b);
    /**
     * @internal
     */
    private static _equalsWrappingInfo(a, b);
    /**
     * @internal
     */
    private static _equalsContribOptions(a, b);
    private static _equalsQuickSuggestions(a, b);
}
/**
 * A description for the overview ruler position.
 */
export interface OverviewRulerPosition {
    /**
     * Width of the overview ruler
     */
    readonly width: number;
    /**
     * Height of the overview ruler
     */
    readonly height: number;
    /**
     * Top position for the overview ruler
     */
    readonly top: number;
    /**
     * Right position for the overview ruler
     */
    readonly right: number;
}
/**
 * The internal layout details of the editor.
 */
export interface EditorLayoutInfo {
    /**
     * Full editor width.
     */
    readonly width: number;
    /**
     * Full editor height.
     */
    readonly height: number;
    /**
     * Left position for the glyph margin.
     */
    readonly glyphMarginLeft: number;
    /**
     * The width of the glyph margin.
     */
    readonly glyphMarginWidth: number;
    /**
     * The height of the glyph margin.
     */
    readonly glyphMarginHeight: number;
    /**
     * Left position for the line numbers.
     */
    readonly lineNumbersLeft: number;
    /**
     * The width of the line numbers.
     */
    readonly lineNumbersWidth: number;
    /**
     * The height of the line numbers.
     */
    readonly lineNumbersHeight: number;
    /**
     * Left position for the line decorations.
     */
    readonly decorationsLeft: number;
    /**
     * The width of the line decorations.
     */
    readonly decorationsWidth: number;
    /**
     * The height of the line decorations.
     */
    readonly decorationsHeight: number;
    /**
     * Left position for the content (actual text)
     */
    readonly contentLeft: number;
    /**
     * The width of the content (actual text)
     */
    readonly contentWidth: number;
    /**
     * The height of the content (actual height)
     */
    readonly contentHeight: number;
    /**
     * The width of the minimap
     */
    readonly minimapWidth: number;
    /**
     * Minimap render type
     */
    readonly renderMinimap: RenderMinimap;
    /**
     * The number of columns (of typical characters) fitting on a viewport line.
     */
    readonly viewportColumn: number;
    /**
     * The width of the vertical scrollbar.
     */
    readonly verticalScrollbarWidth: number;
    /**
     * The height of the horizontal scrollbar.
     */
    readonly horizontalScrollbarHeight: number;
    /**
     * The position of the overview ruler.
     */
    readonly overviewRuler: OverviewRulerPosition;
}
/**
 * An event describing that the configuration of the editor has changed.
 */
export interface IConfigurationChangedEvent {
    readonly canUseLayerHinting: boolean;
    readonly pixelRatio: boolean;
    readonly editorClassName: boolean;
    readonly lineHeight: boolean;
    readonly readOnly: boolean;
    readonly accessibilitySupport: boolean;
    readonly multiCursorModifier: boolean;
    readonly wordSeparators: boolean;
    readonly autoClosingBrackets: boolean;
    readonly autoIndent: boolean;
    readonly useTabStops: boolean;
    readonly tabFocusMode: boolean;
    readonly dragAndDrop: boolean;
    readonly emptySelectionClipboard: boolean;
    readonly layoutInfo: boolean;
    readonly fontInfo: boolean;
    readonly viewInfo: boolean;
    readonly wrappingInfo: boolean;
    readonly contribInfo: boolean;
}
/**
 * @internal
 */
export interface IEnvironmentalOptions {
    readonly outerWidth: number;
    readonly outerHeight: number;
    readonly fontInfo: FontInfo;
    readonly extraEditorClassName: string;
    readonly isDominatedByLongLines: boolean;
    readonly lineNumbersDigitCount: number;
    readonly emptySelectionClipboard: boolean;
    readonly pixelRatio: number;
    readonly tabFocusMode: boolean;
    readonly accessibilitySupport: platform.AccessibilitySupport;
}
/**
 * @internal
 */
export declare class EditorOptionsValidator {
    /**
     * Validate raw editor options.
     * i.e. since they can be defined by the user, they might be invalid.
     */
    static validate(opts: IEditorOptions, defaults: IValidatedEditorOptions): IValidatedEditorOptions;
    private static _sanitizeScrollbarOpts(opts, defaults, mouseWheelScrollSensitivity);
    private static _sanitizeMinimapOpts(opts, defaults);
    private static _santizeFindOpts(opts, defaults);
    private static _sanitizeViewInfo(opts, defaults);
    private static _sanitizeContribInfo(opts, defaults);
}
/**
 * @internal
 */
export declare class InternalEditorOptionsFactory {
    private static _tweakValidatedOptions(opts, accessibilitySupport);
    static createInternalEditorOptions(env: IEnvironmentalOptions, _opts: IValidatedEditorOptions): InternalEditorOptions;
}
/**
 * @internal
 */
export interface IEditorLayoutProviderOpts {
    outerWidth: number;
    outerHeight: number;
    showGlyphMargin: boolean;
    lineHeight: number;
    showLineNumbers: boolean;
    lineNumbersMinChars: number;
    lineNumbersDigitCount: number;
    lineDecorationsWidth: number;
    typicalHalfwidthCharacterWidth: number;
    maxDigitWidth: number;
    verticalScrollbarWidth: number;
    verticalScrollbarHasArrows: boolean;
    scrollbarArrowSize: number;
    horizontalScrollbarHeight: number;
    minimap: boolean;
    minimapRenderCharacters: boolean;
    minimapMaxColumn: number;
    pixelRatio: number;
}
/**
 * @internal
 */
export declare class EditorLayoutProvider {
    static compute(_opts: IEditorLayoutProviderOpts): EditorLayoutInfo;
}
/**
 * @internal
 */
export declare const EDITOR_FONT_DEFAULTS: {
    fontFamily: string;
    fontWeight: string;
    fontSize: number;
    lineHeight: number;
    letterSpacing: number;
};
/**
 * @internal
 */
export declare const EDITOR_MODEL_DEFAULTS: {
    tabSize: number;
    insertSpaces: boolean;
    detectIndentation: boolean;
    trimAutoWhitespace: boolean;
};
/**
 * @internal
 */
export declare const EDITOR_DEFAULTS: IValidatedEditorOptions;
