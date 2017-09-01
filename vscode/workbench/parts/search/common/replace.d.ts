import { TPromise } from 'vs/base/common/winjs.base';
import { Match, FileMatch, FileMatchOrMatch } from 'vs/workbench/parts/search/common/searchModel';
import { IProgressRunner } from 'vs/platform/progress/common/progress';
export declare const IReplaceService: {
    (...args: any[]): void;
    type: IReplaceService;
};
export interface IReplaceService {
    _serviceBrand: any;
    /**
     * Replaces the given match in the file that match belongs to
     */
    replace(match: Match): TPromise<any>;
    /**
     *	Replace all the matches from the given file matches in the files
     *  You can also pass the progress runner to update the progress of replacing.
     */
    replace(files: FileMatch[], progress?: IProgressRunner): TPromise<any>;
    /**
     * Opens the replace preview for given file match or match
     */
    openReplacePreview(element: FileMatchOrMatch, preserveFocus?: boolean, sideBySide?: boolean, pinned?: boolean): TPromise<any>;
    /**
     * Update the replace preview for the given file.
     * If `override` is `true`, then replace preview is constructed from source model
     */
    updateReplacePreview(file: FileMatch, override?: boolean): TPromise<void>;
}
