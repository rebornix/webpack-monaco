import { IEditorContributionCtor } from 'vs/editor/browser/editorBrowser';
export declare function editorContribution(ctor: IEditorContributionCtor): void;
export declare namespace EditorBrowserRegistry {
    function getEditorContributions(): IEditorContributionCtor[];
}
