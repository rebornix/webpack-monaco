import { TPromise } from 'vs/base/common/winjs.base';
import { ServicesAccessor, IConstructorSignature1 } from 'vs/platform/instantiation/common/instantiation';
import { ICommandHandlerDescription } from 'vs/platform/commands/common/commands';
import { ICommandAndKeybindingRule, IKeybindings } from 'vs/platform/keybinding/common/keybindingsRegistry';
import { Position } from 'vs/editor/common/core/position';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { IMenuItem } from 'vs/platform/actions/common/actions';
import { ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';
export declare type ServicesAccessor = ServicesAccessor;
export declare type ICommonEditorContributionCtor = IConstructorSignature1<editorCommon.ICommonCodeEditor, editorCommon.IEditorContribution>;
export interface ICommandKeybindingsOptions extends IKeybindings {
    kbExpr?: ContextKeyExpr;
    weight?: number;
}
export interface ICommandOptions {
    id: string;
    precondition: ContextKeyExpr;
    kbOpts?: ICommandKeybindingsOptions;
    description?: ICommandHandlerDescription;
}
export declare abstract class Command {
    readonly id: string;
    readonly precondition: ContextKeyExpr;
    private readonly _kbOpts;
    private readonly _description;
    constructor(opts: ICommandOptions);
    toCommandAndKeybindingRule(defaultWeight: number): ICommandAndKeybindingRule;
    abstract runCommand(accessor: ServicesAccessor, args: any): void | TPromise<void>;
}
export interface IContributionCommandOptions<T> extends ICommandOptions {
    handler: (controller: T) => void;
}
export interface EditorControllerCommand<T extends editorCommon.IEditorContribution> {
    new (opts: IContributionCommandOptions<T>): EditorCommand;
}
export declare abstract class EditorCommand extends Command {
    /**
     * Create a command class that is bound to a certain editor contribution.
     */
    static bindToContribution<T extends editorCommon.IEditorContribution>(controllerGetter: (editor: editorCommon.ICommonCodeEditor) => T): EditorControllerCommand<T>;
    runCommand(accessor: ServicesAccessor, args: any): void | TPromise<void>;
    abstract runEditorCommand(accessor: ServicesAccessor, editor: editorCommon.ICommonCodeEditor, args: any): void | TPromise<void>;
}
export interface IEditorCommandMenuOptions {
    group?: string;
    order?: number;
}
export interface IActionOptions extends ICommandOptions {
    label: string;
    alias: string;
    menuOpts?: IEditorCommandMenuOptions;
}
export declare abstract class EditorAction extends EditorCommand {
    label: string;
    alias: string;
    private menuOpts;
    constructor(opts: IActionOptions);
    toMenuItem(): IMenuItem;
    runEditorCommand(accessor: ServicesAccessor, editor: editorCommon.ICommonCodeEditor, args: any): void | TPromise<void>;
    protected reportTelemetry(accessor: ServicesAccessor, editor: editorCommon.ICommonCodeEditor): void;
    abstract run(accessor: ServicesAccessor, editor: editorCommon.ICommonCodeEditor, args: any): void | TPromise<void>;
}
export declare function editorAction(ctor: {
    new (): EditorAction;
}): void;
export declare function editorCommand(ctor: {
    new (): EditorCommand;
}): void;
export declare function registerEditorCommand<T extends EditorCommand>(editorCommand: T): T;
export declare function commonEditorContribution(ctor: ICommonEditorContributionCtor): void;
export declare module CommonEditorRegistry {
    function registerEditorAction(editorAction: EditorAction): void;
    function getEditorActions(): EditorAction[];
    function getEditorCommand(commandId: string): EditorCommand;
    function getEditorContributions(): ICommonEditorContributionCtor[];
    function commandWeight(importance?: number): number;
    function registerEditorCommand(editorCommand: EditorCommand): void;
    function registerLanguageCommand(id: string, handler: (accessor: ServicesAccessor, args: {
        [n: string]: any;
    }) => any): void;
    function registerDefaultLanguageCommand(id: string, handler: (model: editorCommon.IModel, position: Position, args: {
        [n: string]: any;
    }) => any): void;
}
