import Event from 'vs/base/common/event';
import { IJSONSchema } from 'vs/base/common/jsonSchema';
export declare const Extensions: {
    Configuration: string;
};
export interface IConfigurationRegistry {
    /**
     * Register a configuration to the registry.
     */
    registerConfiguration(configuration: IConfigurationNode): void;
    /**
     * Register multiple configurations to the registry.
     */
    registerConfigurations(configurations: IConfigurationNode[], validate?: boolean): void;
    registerDefaultConfigurations(defaultConfigurations: IDefaultConfigurationExtension[]): void;
    /**
     * Event that fires whenver a configuratio has been
     * registered.
     */
    onDidRegisterConfiguration: Event<IConfigurationRegistry>;
    /**
     * Returns all configuration nodes contributed to this registry.
     */
    getConfigurations(): IConfigurationNode[];
    /**
     * Returns all configurations settings of all configuration nodes contributed to this registry.
     */
    getConfigurationProperties(): {
        [qualifiedKey: string]: IConfigurationPropertySchema;
    };
    /**
     * Register the identifiers for editor configurations
     */
    registerOverrideIdentifiers(identifiers: string[]): void;
}
export declare enum ConfigurationScope {
    WINDOW = 1,
    RESOURCE = 2,
}
export interface IConfigurationPropertySchema extends IJSONSchema {
    overridable?: boolean;
    isExecutable?: boolean;
    scope?: ConfigurationScope;
}
export interface IConfigurationNode {
    id?: string;
    order?: number;
    type?: string | string[];
    title?: string;
    description?: string;
    properties?: {
        [path: string]: IConfigurationPropertySchema;
    };
    allOf?: IConfigurationNode[];
    overridable?: boolean;
    scope?: ConfigurationScope;
}
export interface IDefaultConfigurationExtension {
    id: string;
    name: string;
    defaults: {
        [key: string]: {};
    };
}
export declare const schemaId = "vscode://schemas/settings";
export declare const editorConfigurationSchemaId = "vscode://schemas/settings/editor";
export declare const resourceConfigurationSchemaId = "vscode://schemas/settings/resource";
export declare const OVERRIDE_PROPERTY_PATTERN: RegExp;
export declare function validateProperty(property: string): string;
