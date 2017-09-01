import { ILink } from 'vs/editor/common/modes';
export interface ILinkComputerTarget {
    getLineCount(): number;
    getLineContent(lineNumber: number): string;
}
/**
 * Returns an array of all links contains in the provided
 * document. *Note* that this operation is computational
 * expensive and should not run in the UI thread.
 */
export declare function computeLinks(model: ILinkComputerTarget): ILink[];
