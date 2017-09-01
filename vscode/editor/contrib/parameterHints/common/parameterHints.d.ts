import { TPromise } from 'vs/base/common/winjs.base';
import { IReadOnlyModel } from 'vs/editor/common/editorCommon';
import { SignatureHelp } from 'vs/editor/common/modes';
import { Position } from 'vs/editor/common/core/position';
import { RawContextKey } from 'vs/platform/contextkey/common/contextkey';
export declare const Context: {
    Visible: RawContextKey<boolean>;
    MultipleSignatures: RawContextKey<boolean>;
};
export declare function provideSignatureHelp(model: IReadOnlyModel, position: Position): TPromise<SignatureHelp>;
