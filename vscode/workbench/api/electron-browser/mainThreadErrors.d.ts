import { SerializedError } from 'vs/base/common/errors';
import { MainThreadErrorsShape } from '../node/extHost.protocol';
export declare class MainThreadErrors implements MainThreadErrorsShape {
    dispose(): void;
    $onUnexpectedError(err: any | SerializedError, extensionId: string | undefined): void;
}
