import * as viewEvents from 'vs/editor/common/view/viewEvents';
import { Disposable } from 'vs/base/common/lifecycle';
export declare class ViewEventHandler extends Disposable {
    private _shouldRender;
    constructor();
    shouldRender(): boolean;
    forceShouldRender(): void;
    protected setShouldRender(): void;
    onDidRender(): void;
    onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean;
    onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): boolean;
    onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean;
    onFlushed(e: viewEvents.ViewFlushedEvent): boolean;
    onFocusChanged(e: viewEvents.ViewFocusChangedEvent): boolean;
    onLineMappingChanged(e: viewEvents.ViewLineMappingChangedEvent): boolean;
    onLinesChanged(e: viewEvents.ViewLinesChangedEvent): boolean;
    onLinesDeleted(e: viewEvents.ViewLinesDeletedEvent): boolean;
    onLinesInserted(e: viewEvents.ViewLinesInsertedEvent): boolean;
    onRevealRangeRequest(e: viewEvents.ViewRevealRangeRequestEvent): boolean;
    onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean;
    onTokensChanged(e: viewEvents.ViewTokensChangedEvent): boolean;
    onTokensColorsChanged(e: viewEvents.ViewTokensColorsChangedEvent): boolean;
    onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean;
    onThemeChanged(e: viewEvents.ViewThemeChangedEvent): boolean;
    handleEvents(events: viewEvents.ViewEvent[]): void;
}
