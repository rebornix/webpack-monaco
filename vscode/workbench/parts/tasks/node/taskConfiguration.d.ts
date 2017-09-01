import { IStringDictionary } from 'vs/base/common/collections';
import { ValidationStatus, IProblemReporter as IProblemReporterBase } from 'vs/base/common/parsers';
import { Config as ProblemMatcherConfig } from 'vs/platform/markers/common/problemMatcher';
import * as Tasks from '../common/tasks';
/**
 * Defines the problem handling strategy
 */
export declare class ProblemHandling {
    /**
     * Cleans all problems for the owner defined in the
     * error pattern.
     */
    static clean: string;
}
export interface ShellConfiguration {
    executable: string;
    args?: string[];
}
export interface CommandOptions {
    /**
     * The current working directory of the executed program or shell.
     * If omitted VSCode's current workspace root is used.
     */
    cwd?: string;
    /**
     * The additional environment of the executed program or shell. If omitted
     * the parent process' environment is used.
     */
    env?: IStringDictionary<string>;
    /**
     * The shell configuration;
     */
    shell?: ShellConfiguration;
}
export interface PresentationOptions {
    /**
     * Controls whether the terminal executing a task is brought to front or not.
     * Defaults to `RevealKind.Always`.
     */
    reveal?: string;
    /**
     * Controls whether the executed command is printed to the output window or terminal as well.
     */
    echo?: boolean;
    /**
     * Controls whether the terminal is focus when this task is executed
     */
    focus?: boolean;
    /**
     * Controls whether the task runs in a new terminal
     */
    panel?: string;
}
export interface TaskIdentifier {
    type?: string;
}
export interface LegacyTaskProperties {
    /**
     * @deprecated Use `isBackground` instead.
     * Whether the executed command is kept alive and is watching the file system.
     */
    isWatching?: boolean;
    /**
     * @deprecated Use `group` instead.
     * Whether this task maps to the default build command.
     */
    isBuildCommand?: boolean;
    /**
     * @deprecated Use `group` instead.
     * Whether this task maps to the default test command.
     */
    isTestCommand?: boolean;
}
export interface LegacyCommandProperties {
    /**
     * Whether this is a shell or process
     */
    type?: string;
    /**
     * @deprecated Use presentation options
     * Controls whether the output view of the running tasks is brought to front or not.
     * See BaseTaskRunnerConfiguration#showOutput for details.
     */
    showOutput?: string;
    /**
     * @deprecated Use presentation options
     * Controls whether the executed command is printed to the output windows as well.
     */
    echoCommand?: boolean;
    /**
     * @deprecated Use presentation instead
     */
    terminal?: PresentationOptions;
    /**
     * @deprecated Use inline commands.
     * See BaseTaskRunnerConfiguration#suppressTaskName for details.
     */
    suppressTaskName?: boolean;
    /**
     * Some commands require that the task argument is highlighted with a special
     * prefix (e.g. /t: for msbuild). This property can be used to control such
     * a prefix.
     */
    taskSelector?: string;
    /**
     * @deprecated use the task type instead.
     * Specifies whether the command is a shell command and therefore must
     * be executed in a shell interpreter (e.g. cmd.exe, bash, ...).
     *
     * Defaults to false if omitted.
     */
    isShellCommand?: boolean | ShellConfiguration;
}
export interface BaseCommandProperties {
    /**
     * Whether the task is a shell task or a process task.
     */
    runtime?: string;
    /**
     * The command to be executed. Can be an external program or a shell
     * command.
     */
    command?: string;
    /**
     * The command options used when the command is executed. Can be omitted.
     */
    options?: CommandOptions;
    /**
     * The arguments passed to the command or additional arguments passed to the
     * command when using a global command.
     */
    args?: string[];
}
export interface CommandProperties extends BaseCommandProperties {
    /**
     * Windows specific command properties
     */
    windows?: BaseCommandProperties;
    /**
     * OSX specific command properties
     */
    osx?: BaseCommandProperties;
    /**
     * linux specific command properties
     */
    linux?: BaseCommandProperties;
}
export interface GroupKind {
    kind?: string;
    isDefault?: boolean;
}
export interface ConfigurationProperties {
    /**
     * The task's name
     */
    taskName?: string;
    /**
     * The UI label used for the task.
     */
    label?: string;
    /**
     * An optional indentifier which can be used to reference a task
     * in a dependsOn or other attributes.
     */
    identifier?: string;
    /**
     * Whether the executed command is kept alive and runs in the background.
     */
    isBackground?: boolean;
    /**
     * Whether the task should prompt on close for confirmation if running.
     */
    promptOnClose?: boolean;
    /**
     * Defines the group the task belongs too.
     */
    group?: string | GroupKind;
    /**
     * The other tasks the task depend on
     */
    dependsOn?: string | string[];
    /**
     * Controls the behavior of the used terminal
     */
    presentation?: PresentationOptions;
    /**
     * The problem matcher(s) to use to capture problems in the tasks
     * output.
     */
    problemMatcher?: ProblemMatcherConfig.ProblemMatcherType;
}
export interface CustomTask extends CommandProperties, ConfigurationProperties {
    /**
     * Custom tasks have the type 'custom'
     */
    type?: string;
}
export interface ConfiguringTask extends ConfigurationProperties {
    /**
     * The contributed type of the task
     */
    type?: string;
}
/**
 * The base task runner configuration
 */
export interface BaseTaskRunnerConfiguration {
    /**
     * The command to be executed. Can be an external program or a shell
     * command.
     */
    command?: string;
    /**
     * @deprecated Use type instead
     *
     * Specifies whether the command is a shell command and therefore must
     * be executed in a shell interpreter (e.g. cmd.exe, bash, ...).
     *
     * Defaults to false if omitted.
     */
    isShellCommand?: boolean;
    /**
     * The task type
     */
    type?: string;
    /**
     * The command options used when the command is executed. Can be omitted.
     */
    options?: CommandOptions;
    /**
     * The arguments passed to the command. Can be omitted.
     */
    args?: string[];
    /**
     * Controls whether the output view of the running tasks is brought to front or not.
     * Valid values are:
     *   "always": bring the output window always to front when a task is executed.
     *   "silent": only bring it to front if no problem matcher is defined for the task executed.
     *   "never": never bring the output window to front.
     *
     * If omitted "always" is used.
     */
    showOutput?: string;
    /**
     * Controls whether the executed command is printed to the output windows as well.
     */
    echoCommand?: boolean;
    /**
     * The group
     */
    group?: string | GroupKind;
    /**
     * Controls the behavior of the used terminal
     */
    presentation?: PresentationOptions;
    /**
     * If set to false the task name is added as an additional argument to the
     * command when executed. If set to true the task name is suppressed. If
     * omitted false is used.
     */
    suppressTaskName?: boolean;
    /**
     * Some commands require that the task argument is highlighted with a special
     * prefix (e.g. /t: for msbuild). This property can be used to control such
     * a prefix.
     */
    taskSelector?: string;
    /**
     * The problem matcher(s) to used if a global command is exucuted (e.g. no tasks
     * are defined). A tasks.json file can either contain a global problemMatcher
     * property or a tasks property but not both.
     */
    problemMatcher?: ProblemMatcherConfig.ProblemMatcherType;
    /**
     * @deprecated Use `isBackground` instead.
     *
     * Specifies whether a global command is a watching the filesystem. A task.json
     * file can either contain a global isWatching property or a tasks property
     * but not both.
     */
    isWatching?: boolean;
    /**
     * Specifies whether a global command is a background task.
     */
    isBackground?: boolean;
    /**
     * Whether the task should prompt on close for confirmation if running.
     */
    promptOnClose?: boolean;
    /**
     * The configuration of the available tasks. A tasks.json file can either
     * contain a global problemMatcher property or a tasks property but not both.
     */
    tasks?: (CustomTask | ConfiguringTask)[];
    /**
     * Problem matcher declarations
     */
    declares?: ProblemMatcherConfig.NamedProblemMatcher[];
}
/**
 * A configuration of an external build system. BuildConfiguration.buildSystem
 * must be set to 'program'
 */
export interface ExternalTaskRunnerConfiguration extends BaseTaskRunnerConfiguration {
    _runner?: string;
    /**
     * Determines the runner to use
     */
    runner?: string;
    /**
     * The config's version number
     */
    version: string;
    /**
     * Windows specific task configuration
     */
    windows?: BaseTaskRunnerConfiguration;
    /**
     * Mac specific task configuration
     */
    osx?: BaseTaskRunnerConfiguration;
    /**
     * Linux speciif task configuration
     */
    linux?: BaseTaskRunnerConfiguration;
}
export declare namespace ExecutionEngine {
    function from(config: ExternalTaskRunnerConfiguration): Tasks.ExecutionEngine;
}
export declare namespace JsonSchemaVersion {
    function from(config: ExternalTaskRunnerConfiguration): Tasks.JsonSchemaVersion;
}
export interface ParseResult {
    validationStatus: ValidationStatus;
    custom: Tasks.CustomTask[];
    configured: Tasks.ConfiguringTask[];
    engine: Tasks.ExecutionEngine;
}
export interface IProblemReporter extends IProblemReporterBase {
    clearOutput(): void;
}
export declare function parse(configuration: ExternalTaskRunnerConfiguration, logger: IProblemReporter): ParseResult;
export declare function createCustomTask(contributedTask: Tasks.ContributedTask, configuredProps: Tasks.ConfigurationProperties & {
    _id: string;
    _source: Tasks.WorkspaceTaskSource;
}): Tasks.CustomTask;
export declare function getTaskIdentifier(value: TaskIdentifier): Tasks.TaskIdentifier;
export declare function findTaskIndex(fileConfig: ExternalTaskRunnerConfiguration, task: Tasks.Task): number;
