import 'vs/css!./media/titlebarpart';
import { Builder, Dimension } from 'vs/base/browser/builder';
import { Part } from 'vs/workbench/browser/part';
import { ITitleService } from 'vs/workbench/services/title/common/titleService';
import { IWindowService, IWindowsService } from 'vs/platform/windows/common/windows';
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IIntegrityService } from 'vs/platform/integrity/common/integrity';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IPartService } from 'vs/workbench/services/part/common/partService';
export declare class TitlebarPart extends Part implements ITitleService {
    private contextMenuService;
    private windowService;
    private configurationService;
    private windowsService;
    private editorService;
    private editorGroupService;
    private integrityService;
    private environmentService;
    private contextService;
    private partService;
    _serviceBrand: any;
    private static NLS_UNSUPPORTED;
    private static NLS_EXTENSION_HOST;
    private static TITLE_DIRTY;
    private static TITLE_SEPARATOR;
    private titleContainer;
    private title;
    private pendingTitle;
    private initialTitleFontSize;
    private representedFileName;
    private isInactive;
    private titleTemplate;
    private isPure;
    private activeEditorListeners;
    constructor(id: string, contextMenuService: IContextMenuService, windowService: IWindowService, configurationService: IConfigurationService, windowsService: IWindowsService, editorService: IWorkbenchEditorService, editorGroupService: IEditorGroupService, integrityService: IIntegrityService, environmentService: IEnvironmentService, contextService: IWorkspaceContextService, themeService: IThemeService, partService: IPartService);
    private init();
    private registerListeners();
    private onBlur();
    private onFocus();
    private onDidChangeWorkspaceRoots();
    private onDidChangeWorkspaceName();
    private onConfigurationChanged(update?);
    private onEditorsChanged();
    private getWindowTitle();
    /**
     * Possible template values:
     *
     * {activeEditorLong}: e.g. /Users/Development/myProject/myFolder/myFile.txt
     * {activeEditorMedium}: e.g. myFolder/myFile.txt
     * {activeEditorShort}: e.g. myFile.txt
     * {rootName}: e.g. myFolder1, myFolder2, myFolder3
     * {rootPath}: e.g. /Users/Development/myProject
     * {folderName}: e.g. myFolder
     * {folderPath}: e.g. /Users/Development/myFolder
     * {appName}: e.g. VS Code
     * {dirty}: indiactor
     * {separator}: conditional separator
     */
    private doGetWindowTitle();
    createContentArea(parent: Builder): Builder;
    protected updateStyles(): void;
    private onTitleDoubleclick();
    private onContextMenu(e);
    private getContextMenuActions();
    setTitle(title: string): void;
    setRepresentedFilename(path: string): void;
    layout(dimension: Dimension): Dimension[];
}
