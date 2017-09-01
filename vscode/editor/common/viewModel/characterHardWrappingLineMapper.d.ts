import { PrefixSumComputer } from 'vs/editor/common/viewModel/prefixSumComputer';
import { ILineMapperFactory, ILineMapping, OutputPosition } from 'vs/editor/common/viewModel/splitLinesCollection';
import { WrappingIndent } from 'vs/editor/common/config/editorOptions';
export declare class CharacterHardWrappingLineMapperFactory implements ILineMapperFactory {
    private classifier;
    constructor(breakBeforeChars: string, breakAfterChars: string, breakObtrusiveChars: string);
    private static nextVisibleColumn(currentVisibleColumn, tabSize, isTab, columnSize);
    createLineMapping(lineText: string, tabSize: number, breakingColumn: number, columnsForFullWidthChar: number, hardWrappingIndent: WrappingIndent): ILineMapping;
}
export declare class CharacterHardWrappingLineMapping implements ILineMapping {
    private _prefixSums;
    private _wrappedLinesIndent;
    constructor(prefixSums: PrefixSumComputer, wrappedLinesIndent: string);
    getOutputLineCount(): number;
    getWrappedLinesIndent(): string;
    getInputOffsetOfOutputPosition(outputLineIndex: number, outputOffset: number): number;
    getOutputPositionOfInputOffset(inputOffset: number): OutputPosition;
}
