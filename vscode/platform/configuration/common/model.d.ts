import { ConfigurationModel } from 'vs/platform/configuration/common/configuration';
export declare function getDefaultValues(): any;
export declare function toValuesTree(properties: {
    [qualifiedKey: string]: any;
}, conflictReporter: (message: string) => void): any;
export declare function getConfigurationKeys(): string[];
export declare class DefaultConfigurationModel<T> extends ConfigurationModel<T> {
    constructor();
    readonly keys: string[];
}
export declare class CustomConfigurationModel<T> extends ConfigurationModel<T> {
    private name;
    protected _parseErrors: any[];
    constructor(content?: string, name?: string);
    readonly errors: any[];
    update(content: string): void;
    protected processRaw(raw: T): void;
}
export declare function overrideIdentifierFromKey(key: string): string;
export declare function keyFromOverrideIdentifier(overrideIdentifier: string): string;
