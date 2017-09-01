import { ViewEventHandler } from 'vs/editor/common/viewModel/viewEventHandler';
import { IOverviewRuler } from 'vs/editor/browser/editorBrowser';
import { ViewContext } from 'vs/editor/common/view/viewContext';
import * as viewEvents from 'vs/editor/common/view/viewEvents';
import { OverviewRulerPosition } from 'vs/editor/common/config/editorOptions';
import { OverviewRulerZone } from 'vs/editor/common/view/overviewZoneManager';
export declare class OverviewRuler extends ViewEventHandler implements IOverviewRuler {
    private _context;
    private _overviewRuler;
    constructor(context: ViewContext, cssClassName: string, minimumHeight: number, maximumHeight: number);
    dispose(): void;
    onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean;
    onFlushed(e: viewEvents.ViewFlushedEvent): boolean;
    onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean;
    onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean;
    getDomNode(): HTMLElement;
    setLayout(position: OverviewRulerPosition): void;
    setZones(zones: OverviewRulerZone[]): void;
}
