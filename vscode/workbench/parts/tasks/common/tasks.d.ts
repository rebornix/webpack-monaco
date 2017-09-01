import { IJSONSchemaMap } from 'vs/base/common/jsonSchema';
import { IExtensionDescription } from 'vs/platform/extensions/common/extensions';
import { ProblemMatcher } from 'vs/platform/markers/common/problemMatcher';
export interface ShellConfiguration {
    /**
     * The shell executable.
     */
    executable: string;
    /**
     * The arguments to be passed to the shell executable.
     */
    args?: string[];
}
export declare namespace ShellConfiguration {
    function is(value: any): value is ShellConfiguration;
}
export interface CommandOptions {
    /**
     * The shell to use if the task is a shell command.
     */
    shell?: ShellConfiguration;
    /**
     * The current working directory of the executed program or shell.
     * If omitted VSCode's current workspace root is used.
     */
    cwd?: string;
    /**
     * The environment of the executed program or shell. If omitted
     * the parent process' environment is used.
     */
    env?: {
        [key: string]: string;
    };
}
export declare enum RevealKind {
    /**
     * Always brings the terminal to front if the task is executed.
     */
    Always = 1,
    /**
     * Only brings the terminal to front if a problem is detected executing the task
     * (e.g. the task couldn't be started because).
     */
    Silent = 2,
    /**
     * The terminal never comes to front when the task is executed.
     */
    Never = 3,
}
export declare namespace RevealKind {
    function fromString(value: string): RevealKind;
}
export declare enum PanelKind {
    /**
     * Shares a panel with other tasks. This is the default.
     */
    Shared = 1,
    /**
     * Uses a dedicated panel for this tasks. The panel is not
     * shared with other tasks.
     */
    Dedicated = 2,
    /**
     * Creates a new panel whenever this task is executed.
     */
    New = 3,
}
export declare namespace PanelKind {
    function fromString(value: string): PanelKind;
}
export interface PresentationOptions {
    /**
     * Controls whether the task output is reveal in the user interface.
     * Defaults to `RevealKind.Always`.
     */
    reveal: RevealKind;
    /**
     * Controls whether the command associated with the task is echoed
     * in the user interface.
     */
    echo: boolean;
    /**
     * Controls whether the panel showing the task output is taking focus.
     */
    focus: boolean;
    /**
     * Controls if the task panel is used for this task only (dedicated),
     * shared between tasks (shared) or if a new panel is created on
     * every task execution (new). Defaults to `TaskInstanceKind.Shared`
     */
    panel: PanelKind;
}
export declare enum RuntimeType {
    Shell = 1,
    Process = 2,
}
export declare namespace RuntimeType {
    function fromString(value: string): RuntimeType;
}
export interface CommandConfiguration {
    /**
     * The task type
     */
    runtime: RuntimeType;
    /**
     * The command to execute
     */
    name: string;
    /**
     * Additional command options.
     */
    options?: CommandOptions;
    /**
     * Command arguments.
     */
    args?: string[];
    /**
     * The task selector if needed.
     */
    taskSelector?: string;
    /**
     * Whether to suppress the task name when merging global args
     *
     */
    suppressTaskName?: boolean;
    /**
     * Describes how the task is presented in the UI.
     */
    presentation: PresentationOptions;
}
export declare namespace TaskGroup {
    const Clean: 'clean';
    const Build: 'build';
    const Rebuild: 'rebuild';
    const Test: 'test';
    function is(value: string): value is string;
}
export declare type TaskGroup = 'clean' | 'build' | 'rebuild' | 'test';
export declare namespace TaskSourceKind {
    const Workspace: 'workspace';
    const Extension: 'extension';
    const Composite: 'composite';
}
export interface TaskSourceConfigElement {
    file: string;
    index: number;
    element: any;
}
export interface WorkspaceTaskSource {
    kind: 'workspace';
    label: string;
    config: TaskSourceConfigElement;
    customizes?: TaskIdentifier;
}
export interface ExtensionTaskSource {
    kind: 'extension';
    label: string;
    extension: string;
}
export interface CompositeTaskSource {
    kind: 'composite';
    label: string;
}
export declare type TaskSource = WorkspaceTaskSource | ExtensionTaskSource | CompositeTaskSource;
export interface TaskIdentifier {
    _key: string;
    type: string;
}
export interface ConfigurationProperties {
    /**
     * The task's name
     */
    name?: string;
    /**
     * The task's name
     */
    identifier?: string;
    /**
     * the task's group;
     */
    group?: string;
    /**
     * Whether this task is a primary task in the task group.
     */
    isDefaultGroupEntry?: boolean;
    /**
     * The presentation options
     */
    presentation?: PresentationOptions;
    /**
     * Whether the task is a background task or not.
     */
    isBackground?: boolean;
    /**
     * Whether the task should prompt on close for confirmation if running.
     */
    promptOnClose?: boolean;
    /**
     * The other tasks this task depends on.
     */
    dependsOn?: string[];
    /**
     * The problem watchers to use for this task
     */
    problemMatchers?: (string | ProblemMatcher)[];
}
export interface CommonTask {
    /**
     * The task's internal id
     */
    _id: string;
    /**
     * The cached label.
     */
    _label: string;
    type: string;
}
export interface CustomTask extends CommonTask, ConfigurationProperties {
    type: 'custom';
    /**
     * Indicated the source of the task (e.g tasks.json or extension)
     */
    _source: WorkspaceTaskSource;
    name: string;
    identifier: string;
    /**
     * The command configuration
     */
    command: CommandConfiguration;
}
export declare namespace CustomTask {
    function is(value: any): value is CustomTask;
}
export interface ConfiguringTask extends CommonTask, ConfigurationProperties {
    /**
     * Indicated the source of the task (e.g tasks.json or extension)
     */
    _source: WorkspaceTaskSource;
    configures: TaskIdentifier;
}
export declare namespace ConfiguringTask {
    function is(value: any): value is ConfiguringTask;
}
export interface ContributedTask extends CommonTask, ConfigurationProperties {
    /**
     * Indicated the source of the task (e.g tasks.json or extension)
     */
    _source: ExtensionTaskSource;
    defines: TaskIdentifier;
    hasDefinedMatchers: boolean;
    /**
     * The command configuration
     */
    command: CommandConfiguration;
}
export declare namespace ContributedTask {
    function is(value: any): value is ContributedTask;
}
export interface CompositeTask extends CommonTask, ConfigurationProperties {
    /**
     * Indicated the source of the task (e.g tasks.json or extension)
     */
    _source: CompositeTaskSource;
    type: 'composite';
    identifier: string;
}
export declare namespace CompositeTask {
    function is(value: any): value is CompositeTask;
}
export declare type Task = CustomTask | ContributedTask | CompositeTask;
export declare namespace Task {
    function getKey(task: Task): string;
    function getTelemetryKind(task: Task): string;
}
export declare enum ExecutionEngine {
    Process = 1,
    Terminal = 2,
}
export declare namespace ExecutionEngine {
    const _default: ExecutionEngine;
}
export declare enum JsonSchemaVersion {
    V0_1_0 = 1,
    V2_0_0 = 2,
}
export interface TaskSet {
    tasks: Task[];
    extension?: IExtensionDescription;
}
export interface TaskDefinition {
    taskType: string;
    required: string[];
    properties: IJSONSchemaMap;
}
