import { Keybinding } from 'vs/base/common/keyCodes';
import { ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';
import { ICommandHandler, ICommandHandlerDescription } from 'vs/platform/commands/common/commands';
export interface IKeybindingItem {
    keybinding: Keybinding;
    command: string;
    commandArgs?: any;
    when: ContextKeyExpr;
    weight1: number;
    weight2: number;
}
export interface IKeybindings {
    primary: number;
    secondary?: number[];
    win?: {
        primary: number;
        secondary?: number[];
    };
    linux?: {
        primary: number;
        secondary?: number[];
    };
    mac?: {
        primary: number;
        secondary?: number[];
    };
}
export interface IKeybindingRule extends IKeybindings {
    id: string;
    weight: number;
    when: ContextKeyExpr;
}
export interface IKeybindingRule2 {
    primary: Keybinding;
    win?: {
        primary: Keybinding;
    };
    linux?: {
        primary: Keybinding;
    };
    mac?: {
        primary: Keybinding;
    };
    id: string;
    weight: number;
    when: ContextKeyExpr;
}
export interface ICommandAndKeybindingRule extends IKeybindingRule {
    handler: ICommandHandler;
    description?: ICommandHandlerDescription;
}
export interface IKeybindingsRegistry {
    registerKeybindingRule(rule: IKeybindingRule): void;
    registerKeybindingRule2(rule: IKeybindingRule2): void;
    registerCommandAndKeybindingRule(desc: ICommandAndKeybindingRule): void;
    getDefaultKeybindings(): IKeybindingItem[];
    WEIGHT: {
        editorCore(importance?: number): number;
        editorContrib(importance?: number): number;
        workbenchContrib(importance?: number): number;
        builtinExtension(importance?: number): number;
        externalExtension(importance?: number): number;
    };
}
export declare const KeybindingsRegistry: IKeybindingsRegistry;
export declare const Extensions: {
    EditorModes: string;
};
