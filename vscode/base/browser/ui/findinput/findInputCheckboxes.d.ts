import 'vs/css!./findInputCheckboxes';
import { Checkbox } from 'vs/base/browser/ui/checkbox/checkbox';
import { IKeyboardEvent } from 'vs/base/browser/keyboardEvent';
import { Color } from 'vs/base/common/color';
export interface IFindInputCheckboxOpts {
    appendTitle: string;
    isChecked: boolean;
    onChange: (viaKeyboard: boolean) => void;
    onKeyDown?: (e: IKeyboardEvent) => void;
    inputActiveOptionBorder?: Color;
}
export declare class CaseSensitiveCheckbox extends Checkbox {
    constructor(opts: IFindInputCheckboxOpts);
}
export declare class WholeWordsCheckbox extends Checkbox {
    constructor(opts: IFindInputCheckboxOpts);
}
export declare class RegexCheckbox extends Checkbox {
    constructor(opts: IFindInputCheckboxOpts);
}
