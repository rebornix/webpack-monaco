import { IStringDictionary } from 'vs/base/common/collections';
export declare enum ValidationState {
    OK = 0,
    Info = 1,
    Warning = 2,
    Error = 3,
    Fatal = 4,
}
export declare class ValidationStatus {
    private _state;
    constructor();
    state: ValidationState;
    isOK(): boolean;
    isFatal(): boolean;
}
export interface IProblemReporter {
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    fatal(message: string): void;
    status: ValidationStatus;
}
export declare class NullProblemReporter implements IProblemReporter {
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    fatal(message: string): void;
    status: ValidationStatus;
}
export declare abstract class Parser {
    private _problemReporter;
    constructor(problemReporter: IProblemReporter);
    reset(): void;
    readonly problemReporter: IProblemReporter;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    fatal(message: string): void;
    protected is(value: any, func: (value: any) => boolean, wrongTypeState?: ValidationState, wrongTypeMessage?: string, undefinedState?: ValidationState, undefinedMessage?: string): boolean;
    protected static merge<T>(destination: T, source: T, overwrite: boolean): void;
}
export interface ISystemVariables {
    resolve(value: string): string;
    resolve(value: string[]): string[];
    resolve(value: IStringDictionary<string>): IStringDictionary<string>;
    resolve(value: IStringDictionary<string[]>): IStringDictionary<string[]>;
    resolve(value: IStringDictionary<IStringDictionary<string>>): IStringDictionary<IStringDictionary<string>>;
    resolveAny<T>(value: T): T;
    [key: string]: any;
}
export declare abstract class AbstractSystemVariables implements ISystemVariables {
    resolve(value: string): string;
    resolve(value: string[]): string[];
    resolve(value: IStringDictionary<string>): IStringDictionary<string>;
    resolve(value: IStringDictionary<string[]>): IStringDictionary<string[]>;
    resolve(value: IStringDictionary<IStringDictionary<string>>): IStringDictionary<IStringDictionary<string>>;
    resolveAny<T>(value: T): T;
    protected resolveString(value: string): string;
    private __resolveLiteral(values);
    private __resolveAnyLiteral<T>(values);
    private __resolveArray(value);
    private __resolveAnyArray<T>(value);
}
