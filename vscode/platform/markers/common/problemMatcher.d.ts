import Severity from 'vs/base/common/severity';
import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { IJSONSchema } from 'vs/base/common/jsonSchema';
import { ValidationStatus, IProblemReporter, Parser } from 'vs/base/common/parsers';
import { IMarkerData } from 'vs/platform/markers/common/markers';
import { ExtensionMessageCollector } from 'vs/platform/extensions/common/extensionsRegistry';
export declare enum FileLocationKind {
    Auto = 0,
    Relative = 1,
    Absolute = 2,
}
export declare module FileLocationKind {
    function fromString(value: string): FileLocationKind;
}
export interface ProblemPattern {
    regexp: RegExp;
    file?: number;
    message?: number;
    location?: number;
    line?: number;
    character?: number;
    endLine?: number;
    endCharacter?: number;
    code?: number;
    severity?: number;
    loop?: boolean;
}
export interface NamedProblemPattern extends ProblemPattern {
    name: string;
}
export declare type MultiLineProblemPattern = ProblemPattern[];
export interface WatchingPattern {
    regexp: RegExp;
    file?: number;
}
export interface WatchingMatcher {
    activeOnStart: boolean;
    beginsPattern: WatchingPattern;
    endsPattern: WatchingPattern;
}
export declare enum ApplyToKind {
    allDocuments = 0,
    openDocuments = 1,
    closedDocuments = 2,
}
export declare module ApplyToKind {
    function fromString(value: string): ApplyToKind;
}
export interface ProblemMatcher {
    owner: string;
    applyTo: ApplyToKind;
    fileLocation: FileLocationKind;
    filePrefix?: string;
    pattern: ProblemPattern | ProblemPattern[];
    severity?: Severity;
    watching?: WatchingMatcher;
}
export interface NamedProblemMatcher extends ProblemMatcher {
    name: string;
    label: string;
    deprecated?: boolean;
}
export interface NamedMultiLineProblemPattern {
    name: string;
    label: string;
    patterns: MultiLineProblemPattern;
}
export declare function isNamedProblemMatcher(value: ProblemMatcher): value is NamedProblemMatcher;
export interface ProblemMatch {
    resource: URI;
    marker: IMarkerData;
    description: ProblemMatcher;
}
export interface HandleResult {
    match: ProblemMatch;
    continue: boolean;
}
export declare function getResource(filename: string, matcher: ProblemMatcher): URI;
export interface ILineMatcher {
    matchLength: number;
    next(line: string): ProblemMatch;
    handle(lines: string[], start?: number): HandleResult;
}
export declare function createLineMatcher(matcher: ProblemMatcher): ILineMatcher;
export declare namespace Config {
    /**
    * Defines possible problem severity values
    */
    namespace ProblemSeverity {
        const Error: string;
        const Warning: string;
        const Info: string;
    }
    interface ProblemPattern {
        /**
        * The regular expression to find a problem in the console output of an
        * executed task.
        */
        regexp?: string;
        /**
        * The match group index of the filename.
        * If omitted 1 is used.
        */
        file?: number;
        /**
        * The match group index of the problem's location. Valid location
        * patterns are: (line), (line,column) and (startLine,startColumn,endLine,endColumn).
        * If omitted the line and column properties are used.
        */
        location?: number;
        /**
        * The match group index of the problem's line in the source file.
        *
        * Defaults to 2.
        */
        line?: number;
        /**
        * The match group index of the problem's column in the source file.
        *
        * Defaults to 3.
        */
        column?: number;
        /**
        * The match group index of the problem's end line in the source file.
        *
        * Defaults to undefined. No end line is captured.
        */
        endLine?: number;
        /**
        * The match group index of the problem's end column in the source file.
        *
        * Defaults to undefined. No end column is captured.
        */
        endColumn?: number;
        /**
        * The match group index of the problem's severity.
        *
        * Defaults to undefined. In this case the problem matcher's severity
        * is used.
        */
        severity?: number;
        /**
        * The match group index of the problem's code.
        *
        * Defaults to undefined. No code is captured.
        */
        code?: number;
        /**
        * The match group index of the message. If omitted it defaults
        * to 4 if location is specified. Otherwise it defaults to 5.
        */
        message?: number;
        /**
        * Specifies if the last pattern in a multi line problem matcher should
        * loop as long as it does match a line consequently. Only valid on the
        * last problem pattern in a multi line problem matcher.
        */
        loop?: boolean;
    }
    interface NamedProblemPattern extends ProblemPattern {
        /**
         * The name of the problem pattern.
         */
        name: string;
        /**
         * A human readable label
         */
        label?: string;
    }
    namespace NamedProblemPattern {
        function is(value: ProblemPattern): value is NamedProblemPattern;
    }
    type MultiLineProblemPattern = ProblemPattern[];
    namespace MultiLineProblemPattern {
        function is(value: any): value is MultiLineProblemPattern;
    }
    interface NamedMultiLineProblemPattern {
        /**
         * The name of the problem pattern.
         */
        name: string;
        /**
         * A human readable label
         */
        label?: string;
        /**
         * The actual patterns
         */
        patterns: MultiLineProblemPattern;
    }
    namespace NamedMultiLineProblemPattern {
        function is(value: any): value is NamedMultiLineProblemPattern;
    }
    type NamedProblemPatterns = (Config.NamedProblemPattern | Config.NamedMultiLineProblemPattern)[];
    /**
    * A watching pattern
    */
    interface WatchingPattern {
        /**
        * The actual regular expression
        */
        regexp?: string;
        /**
        * The match group index of the filename. If provided the expression
        * is matched for that file only.
        */
        file?: number;
    }
    /**
    * A description to track the start and end of a watching task.
    */
    interface BackgroundMonitor {
        /**
        * If set to true the watcher is in active mode when the task
        * starts. This is equals of issuing a line that matches the
        * beginPattern.
        */
        activeOnStart?: boolean;
        /**
        * If matched in the output the start of a watching task is signaled.
        */
        beginsPattern?: string | WatchingPattern;
        /**
        * If matched in the output the end of a watching task is signaled.
        */
        endsPattern?: string | WatchingPattern;
    }
    /**
    * A description of a problem matcher that detects problems
    * in build output.
    */
    interface ProblemMatcher {
        /**
        * The name of a base problem matcher to use. If specified the
        * base problem matcher will be used as a template and properties
        * specified here will replace properties of the base problem
        * matcher
        */
        base?: string;
        /**
        * The owner of the produced VSCode problem. This is typically
        * the identifier of a VSCode language service if the problems are
        * to be merged with the one produced by the language service
        * or a generated internal id. Defaults to the generated internal id.
        */
        owner?: string;
        /**
        * Specifies to which kind of documents the problems found by this
        * matcher are applied. Valid values are:
        *
        *   "allDocuments": problems found in all documents are applied.
        *   "openDocuments": problems found in documents that are open
        *   are applied.
        *   "closedDocuments": problems found in closed documents are
        *   applied.
        */
        applyTo?: string;
        /**
        * The severity of the VSCode problem produced by this problem matcher.
        *
        * Valid values are:
        *   "error": to produce errors.
        *   "warning": to produce warnings.
        *   "info": to produce infos.
        *
        * The value is used if a pattern doesn't specify a severity match group.
        * Defaults to "error" if omitted.
        */
        severity?: string;
        /**
        * Defines how filename reported in a problem pattern
        * should be read. Valid values are:
        *  - "absolute": the filename is always treated absolute.
        *  - "relative": the filename is always treated relative to
        *    the current working directory. This is the default.
        *  - ["relative", "path value"]: the filename is always
        *    treated relative to the given path value.
        */
        fileLocation?: string | string[];
        /**
        * The name of a predefined problem pattern, the inline definintion
        * of a problem pattern or an array of problem patterns to match
        * problems spread over multiple lines.
        */
        pattern?: string | ProblemPattern | ProblemPattern[];
        /**
        * A regular expression signaling that a watched tasks begins executing
        * triggered through file watching.
        */
        watchedTaskBeginsRegExp?: string;
        /**
        * A regular expression signaling that a watched tasks ends executing.
        */
        watchedTaskEndsRegExp?: string;
        /**
         * @deprecated Use background instead.
         */
        watching?: BackgroundMonitor;
        background?: BackgroundMonitor;
    }
    type ProblemMatcherType = string | ProblemMatcher | (string | ProblemMatcher)[];
    interface NamedProblemMatcher extends ProblemMatcher {
        /**
        * An optional name. This name can be used to refer to the
        * problem matcher from within a task.
        */
        name?: string;
        /**
         * A human readable label.
         */
        label?: string;
    }
    function isNamedProblemMatcher(value: ProblemMatcher): value is NamedProblemMatcher;
}
export declare class ExtensionRegistryReporter implements IProblemReporter {
    private _collector;
    private _validationStatus;
    constructor(_collector: ExtensionMessageCollector, _validationStatus?: ValidationStatus);
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    fatal(message: string): void;
    readonly status: ValidationStatus;
}
export declare namespace Schemas {
    const ProblemPattern: IJSONSchema;
    const NamedProblemPattern: IJSONSchema;
    const MultLileProblemPattern: IJSONSchema;
    const NamedMultiLineProblemPattern: IJSONSchema;
}
export interface IProblemPatternRegistry {
    onReady(): TPromise<void>;
    exists(key: string): boolean;
    get(key: string): ProblemPattern | MultiLineProblemPattern;
}
export declare const ProblemPatternRegistry: IProblemPatternRegistry;
export declare class ProblemMatcherParser extends Parser {
    constructor(logger: IProblemReporter);
    parse(json: Config.ProblemMatcher): ProblemMatcher;
    private checkProblemMatcherValid(externalProblemMatcher, problemMatcher);
    private createProblemMatcher(description);
    private createProblemPattern(value);
    private addWatchingMatcher(external, internal);
    private createWatchingPattern(external);
    private createRegularExpression(value);
}
export declare namespace Schemas {
    const WatchingPattern: IJSONSchema;
    const PatternType: IJSONSchema;
    const ProblemMatcher: IJSONSchema;
    const LegacyProblemMatcher: IJSONSchema;
    const NamedProblemMatcher: IJSONSchema;
}
export interface IProblemMatcherRegistry {
    onReady(): TPromise<void>;
    exists(name: string): boolean;
    get(name: string): NamedProblemMatcher;
    values(): NamedProblemMatcher[];
    keys(): string[];
}
export declare const ProblemMatcherRegistry: IProblemMatcherRegistry;
