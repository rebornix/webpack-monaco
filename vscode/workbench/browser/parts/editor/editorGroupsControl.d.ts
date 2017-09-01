import 'vs/css!./media/editorGroupsControl';
import Event from 'vs/base/common/event';
import { Dimension, Builder } from 'vs/base/browser/builder';
import { Sash, IVerticalSashLayoutProvider, IHorizontalSashLayoutProvider } from 'vs/base/browser/ui/sash/sash';
import { ProgressBar } from 'vs/base/browser/ui/progressbar/progressbar';
import { BaseEditor } from 'vs/workbench/browser/parts/editor/baseEditor';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { Position } from 'vs/platform/editor/common/editor';
import { IEditorGroupService, GroupArrangement, GroupOrientation } from 'vs/workbench/services/group/common/groupService';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IExtensionService } from 'vs/platform/extensions/common/extensions';
import { IWindowService, IWindowsService } from 'vs/platform/windows/common/windows';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { Themable } from 'vs/workbench/common/theme';
import { IMessageService } from 'vs/platform/message/common/message';
import { IFileService } from 'vs/platform/files/common/files';
import { IWorkspacesService } from 'vs/platform/workspaces/common/workspaces';
export declare enum Rochade {
    NONE = 0,
    TWO_TO_ONE = 1,
    THREE_TO_TWO = 2,
    TWO_AND_THREE_TO_ONE = 3,
}
export declare enum ProgressState {
    INFINITE = 0,
    DONE = 1,
    STOP = 2,
}
export interface IEditorGroupsControl {
    onGroupFocusChanged: Event<void>;
    show(editor: BaseEditor, position: Position, preserveActive: boolean, ratio?: number[]): void;
    hide(editor: BaseEditor, position: Position, layoutAndRochade: boolean): Rochade;
    setActive(editor: BaseEditor): void;
    getActiveEditor(): BaseEditor;
    getActivePosition(): Position;
    move(from: Position, to: Position): void;
    isDragging(): boolean;
    getInstantiationService(position: Position): IInstantiationService;
    getProgressBar(position: Position): ProgressBar;
    updateProgress(position: Position, state: ProgressState): void;
    layout(dimension: Dimension): void;
    layout(position: Position): void;
    arrangeGroups(arrangement: GroupArrangement): void;
    setGroupOrientation(orientation: GroupOrientation): void;
    getGroupOrientation(): GroupOrientation;
    resizeGroup(position: Position, groupSizeChange: number): void;
    getRatio(): number[];
    dispose(): void;
}
/**
 * Helper class to manage multiple side by side editors for the editor part.
 */
export declare class EditorGroupsControl extends Themable implements IEditorGroupsControl, IVerticalSashLayoutProvider, IHorizontalSashLayoutProvider {
    private editorService;
    private editorGroupService;
    private telemetryService;
    private contextKeyService;
    private extensionService;
    private instantiationService;
    private windowService;
    private windowsService;
    private fileService;
    private messageService;
    private workspacesService;
    private static TITLE_AREA_CONTROL_KEY;
    private static PROGRESS_BAR_CONTROL_KEY;
    private static INSTANTIATION_SERVICE_KEY;
    private static MIN_EDITOR_WIDTH;
    private static MIN_EDITOR_HEIGHT;
    private static EDITOR_TITLE_HEIGHT;
    private static SNAP_TO_MINIMIZED_THRESHOLD_WIDTH;
    private static SNAP_TO_MINIMIZED_THRESHOLD_HEIGHT;
    private stacks;
    private parent;
    private dimension;
    private dragging;
    private layoutVertically;
    private tabOptions;
    private silos;
    private silosSize;
    private silosInitialRatio;
    private silosMinimized;
    private sashOne;
    private startSiloOneSize;
    private sashTwo;
    private startSiloThreeSize;
    private visibleEditors;
    private lastActiveEditor;
    private lastActivePosition;
    private visibleEditorFocusTrackers;
    private _onGroupFocusChanged;
    private onStacksChangeScheduler;
    private stacksChangedBuffer;
    constructor(parent: Builder, groupOrientation: GroupOrientation, editorService: IWorkbenchEditorService, editorGroupService: IEditorGroupService, telemetryService: ITelemetryService, contextKeyService: IContextKeyService, extensionService: IExtensionService, instantiationService: IInstantiationService, windowService: IWindowService, windowsService: IWindowsService, themeService: IThemeService, fileService: IFileService, messageService: IMessageService, workspacesService: IWorkspacesService);
    private readonly totalSize;
    private readonly minSize;
    private isSiloMinimized(position);
    private enableMinimizedState();
    private updateMinimizedState();
    private readonly snapToMinimizeThresholdSize;
    private registerListeners();
    private updateTabOptions(tabOptions, refresh?);
    private onExtensionsReady();
    private onStacksChanged(e);
    private handleStacksChanged();
    readonly onGroupFocusChanged: Event<void>;
    show(editor: BaseEditor, position: Position, preserveActive: boolean, ratio?: number[]): void;
    private getVisibleEditorCount();
    private trackFocus(editor, position);
    private onFocusGained(editor);
    setActive(editor: BaseEditor): void;
    private focusNextNonMinimized();
    hide(editor: BaseEditor, position: Position, layoutAndRochade: boolean): Rochade;
    private doSetActive(editor, newActive);
    private clearPosition(position);
    private rochade(from, to);
    move(from: Position, to: Position): void;
    setGroupOrientation(orientation: GroupOrientation): void;
    getGroupOrientation(): GroupOrientation;
    arrangeGroups(arrangement?: GroupArrangement): void;
    getRatio(): number[];
    resizeGroup(position: Position, groupSizeChange: number): void;
    private boundSiloSize(siloPosition, sizeChangePx);
    private distributeRemainingSilosSize(remPosition1, remPosition2, availableSize);
    getActiveEditor(): BaseEditor;
    getActivePosition(): Position;
    private create();
    protected updateStyles(): void;
    private enableDropTarget(node);
    private createTitleControl(context, silo, container, instantiationService);
    private findPosition(element);
    private hookTitleDragListener(titleContainer);
    private updateFromDragging(position, isDragging);
    private updateFromDropping(element, isDropping);
    private posSilo(pos, leftTop, rightBottom?, borderLeftTopWidth?);
    private findMoveTarget(position, diffPos);
    private centerSash(a, b);
    private onSashOneDragStart();
    private onSashOneDrag(e);
    private onSashOneDragEnd();
    private onSashOneReset();
    private onSashTwoDragStart();
    private onSashTwoDrag(e);
    private onSashTwoDragEnd();
    private onSashTwoReset();
    getVerticalSashTop(sash: Sash): number;
    getVerticalSashLeft(sash: Sash): number;
    getVerticalSashHeight(sash: Sash): number;
    getHorizontalSashTop(sash: Sash): number;
    getHorizontalSashLeft(sash: Sash): number;
    getHorizontalSashWidth(sash: Sash): number;
    isDragging(): boolean;
    layout(dimension: Dimension): void;
    layout(position: Position): void;
    private layoutControl(dimension);
    private layoutContainers();
    private layoutEditor(position);
    getInstantiationService(position: Position): IInstantiationService;
    getProgressBar(position: Position): ProgressBar;
    private getTitleAreaControl(position);
    private getFromContainer(position, key);
    updateProgress(position: Position, state: ProgressState): void;
    dispose(): void;
}
