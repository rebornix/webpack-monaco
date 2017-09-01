import { RawContextKey } from 'vs/platform/contextkey/common/contextkey';
export declare const VIEWLET_ID = "workbench.view.search";
export declare const FindInFilesActionId = "workbench.action.findInFiles";
export declare const FocusActiveEditorActionId = "search.action.focusActiveEditor";
export declare const FocusSearchFromResults = "search.action.focusSearchFromResults";
export declare const OpenMatchToSide = "search.action.openResultToSide";
export declare const CancelActionId = "search.action.cancel";
export declare const RemoveActionId = "search.action.remove";
export declare const ReplaceActionId = "search.action.replace";
export declare const ReplaceAllInFileActionId = "search.action.replaceAllInFile";
export declare const ToggleCaseSensitiveActionId = "toggleSearchCaseSensitive";
export declare const ToggleWholeWordActionId = "toggleSearchWholeWord";
export declare const ToggleRegexActionId = "toggleSearchRegex";
export declare const CloseReplaceWidgetActionId = "closeReplaceInFilesWidget";
export declare const SearchViewletVisibleKey: RawContextKey<boolean>;
export declare const InputBoxFocusedKey: RawContextKey<boolean>;
export declare const SearchInputBoxFocusedKey: RawContextKey<boolean>;
export declare const ReplaceInputBoxFocusedKey: RawContextKey<boolean>;
export declare const PatternIncludesFocusedKey: RawContextKey<boolean>;
export declare const PatternExcludesFocusedKey: RawContextKey<boolean>;
export declare const ReplaceActiveKey: RawContextKey<boolean>;
export declare const FirstMatchFocusKey: RawContextKey<boolean>;
export declare const FileMatchOrMatchFocusKey: RawContextKey<boolean>;
export declare const FileFocusKey: RawContextKey<boolean>;
export declare const MatchFocusKey: RawContextKey<boolean>;