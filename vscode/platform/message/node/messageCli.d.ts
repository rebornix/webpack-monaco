import { TPromise } from 'vs/base/common/winjs.base';
import { IChoiceService, Severity } from 'vs/platform/message/common/message';
export declare class ChoiceCliService implements IChoiceService {
    _serviceBrand: any;
    choose(severity: Severity, message: string, options: string[], cancelId: number): TPromise<number>;
    private toQuestion(message, options);
    private toOption(answer, options);
}
