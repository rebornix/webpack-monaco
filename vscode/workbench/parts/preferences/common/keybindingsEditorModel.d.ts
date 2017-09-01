import { TPromise } from 'vs/base/common/winjs.base';
import { OperatingSystem } from 'vs/base/common/platform';
import { IMatch } from 'vs/base/common/filters';
import { ResolvedKeybinding } from 'vs/base/common/keyCodes';
import { EditorModel } from 'vs/workbench/common/editor';
import { IExtensionService } from 'vs/platform/extensions/common/extensions';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { ResolvedKeybindingItem } from 'vs/platform/keybinding/common/resolvedKeybindingItem';
export declare const KEYBINDING_ENTRY_TEMPLATE_ID = "keybinding.entry.template";
export declare const KEYBINDING_HEADER_TEMPLATE_ID = "keybinding.header.template";
export interface KeybindingMatch {
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    keyCode?: boolean;
}
export interface KeybindingMatches {
    firstPart: KeybindingMatch;
    chordPart: KeybindingMatch;
}
export interface IListEntry {
    id: string;
    templateId: string;
}
export interface IKeybindingItemEntry extends IListEntry {
    keybindingItem: IKeybindingItem;
    commandIdMatches?: IMatch[];
    commandLabelMatches?: IMatch[];
    commandDefaultLabelMatches?: IMatch[];
    sourceMatches?: IMatch[];
    whenMatches?: IMatch[];
    keybindingMatches?: KeybindingMatches;
}
export interface IKeybindingItem {
    keybinding: ResolvedKeybinding;
    keybindingItem: ResolvedKeybindingItem;
    commandLabel: string;
    commandDefaultLabel: string;
    command: string;
    source: string;
    when: string;
}
export declare class KeybindingsEditorModel extends EditorModel {
    private os;
    private keybindingsService;
    private extensionService;
    private _keybindingItems;
    private _keybindingItemsSortedByPrecedence;
    private modifierLabels;
    constructor(os: OperatingSystem, keybindingsService: IKeybindingService, extensionService: IExtensionService);
    fetch(searchValue: string, sortByPrecedence?: boolean): IKeybindingItemEntry[];
    private fetchKeybindingItems(keybindingItems, searchValue, completeMatch);
    private splitKeybindingWords(wordsSeparatedBySpaces);
    resolve(): TPromise<EditorModel>;
    private static getId(keybindingItem);
    private static compareKeybindingData(a, b);
    private static toKeybindingEntry(command, keybindingItem, workbenchActionsRegistry, editorActions);
    private static getCommandDefaultLabel(workbenchAction, menuCommand, workbenchActionsRegistry);
    private static getCommandLabel(workbenchAction, menuCommand, editorAction);
}
