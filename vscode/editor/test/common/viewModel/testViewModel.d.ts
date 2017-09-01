import { Model } from 'vs/editor/common/model/model';
import { ViewModel } from 'vs/editor/common/viewModel/viewModelImpl';
import { MockCodeEditorCreationOptions } from 'vs/editor/test/common/mocks/mockCodeEditor';
export declare function testViewModel(text: string[], options: MockCodeEditorCreationOptions, callback: (viewModel: ViewModel, model: Model) => void): void;
