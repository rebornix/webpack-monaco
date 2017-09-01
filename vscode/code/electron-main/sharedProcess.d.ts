import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { TPromise } from 'vs/base/common/winjs.base';
import { IProcessEnvironment } from 'vs/base/common/platform';
import { ISharedProcess } from 'vs/platform/windows/electron-main/windows';
export declare class SharedProcess implements ISharedProcess {
    private environmentService;
    private userEnv;
    private spawnPromiseSource;
    private window;
    private disposables;
    private readonly _whenReady;
    constructor(environmentService: IEnvironmentService, userEnv: IProcessEnvironment);
    spawn(): void;
    whenReady(): TPromise<void>;
    toggle(): void;
    show(): void;
    hide(): void;
    dispose(): void;
}
