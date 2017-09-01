import * as childProcess from 'child_process';
import { IProgress, IUncachedSearchStats } from 'vs/platform/search/common/search';
import { IRawFileMatch, ISerializedSearchComplete, IRawSearch, ISearchEngine, IFolderSearch } from './search';
export declare class FileWalker {
    private config;
    private filePattern;
    private normalizedFilePatternLowercase;
    private includePattern;
    private maxResults;
    private maxFilesize;
    private isLimitHit;
    private resultCount;
    private isCanceled;
    private fileWalkStartTime;
    private directoriesWalked;
    private filesWalked;
    private traversal;
    private errors;
    private cmdForkStartTime;
    private cmdForkResultTime;
    private cmdResultCount;
    private folderExcludePatterns;
    private globalExcludePattern;
    private walkedPaths;
    constructor(config: IRawSearch);
    cancel(): void;
    walk(folderQueries: IFolderSearch[], extraFiles: string[], onResult: (result: IRawFileMatch) => void, done: (error: Error, isLimitHit: boolean) => void): void;
    private call(fun, that, ...args);
    private findTraversal(folderQuery, onResult, cb);
    /**
     * Public for testing.
     */
    spawnFindCmd(folderQuery: IFolderSearch): childProcess.ChildProcess;
    /**
     * Public for testing.
     */
    readStdout(cmd: childProcess.ChildProcess, encoding: string, cb: (err: Error, stdout?: string) => void): void;
    private collectStdout(cmd, encoding, cb);
    private forwardData(stream, encoding, cb);
    private collectData(stream);
    private decodeData(buffers, encoding);
    private initDirectoryTree();
    private addDirectoryEntries({pathToEntries}, base, relativeFiles, onResult);
    private matchDirectoryTree({rootEntries, pathToEntries}, rootFolder, onResult);
    private nodeJSTraversal(folderQuery, onResult, done);
    getStats(): IUncachedSearchStats;
    private checkFilePatternAbsoluteMatch(clb);
    private checkFilePatternRelativeMatch(basePath, clb);
    private doWalk(folderQuery, relativeParentPath, files, onResult, done);
    private matchFile(onResult, candidate);
    private isFilePatternMatch(path);
    private statLinkIfNeeded(path, lstat, clb);
    private realPathIfNeeded(path, lstat, clb);
}
export declare class Engine implements ISearchEngine<IRawFileMatch> {
    private folderQueries;
    private extraFiles;
    private walker;
    constructor(config: IRawSearch);
    search(onResult: (result: IRawFileMatch) => void, onProgress: (progress: IProgress) => void, done: (error: Error, complete: ISerializedSearchComplete) => void): void;
    cancel(): void;
}
