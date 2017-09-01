import { ServiceIdentifier } from 'vs/platform/instantiation/common/instantiation';
import { IEditorInput, ITextEditorOptions, IResourceInput } from 'vs/platform/editor/common/editor';
import URI from 'vs/base/common/uri';
export declare const IHistoryService: {
    (...args: any[]): void;
    type: IHistoryService;
};
export interface IHistoryService {
    _serviceBrand: ServiceIdentifier<any>;
    /**
     * Re-opens the last closed editor if any.
     */
    reopenLastClosedEditor(): void;
    /**
     * Add an entry to the navigation stack of the history.
     */
    add(input: IEditorInput, options?: ITextEditorOptions): void;
    /**
     * Navigate forwards in history.
     *
     * @param acrossEditors instructs the history to skip navigation entries that
     * are only within the same document.
     */
    forward(acrossEditors?: boolean): void;
    /**
     * Navigate backwards in history.
     *
     * @param acrossEditors instructs the history to skip navigation entries that
     * are only within the same document.
     */
    back(acrossEditors?: boolean): void;
    /**
     * Removes an entry from history.
     */
    remove(input: IEditorInput | IResourceInput): void;
    /**
     * Clears all history.
     */
    clear(): void;
    /**
     * Get the entire history of opened editors.
     */
    getHistory(): (IEditorInput | IResourceInput)[];
    /**
     * Looking at the editor history, returns the workspace root of the last file that was
     * inside the workspace and part of the editor history.
     */
    getLastActiveWorkspaceRoot(): URI;
}
