import { IJSONSchema } from 'vs/base/common/jsonSchema';
import { IDisposable } from 'vs/base/common/lifecycle';
export declare const Extensions: {
    JSONContribution: string;
};
export interface ISchemaContributions {
    schemas?: {
        [id: string]: IJSONSchema;
    };
}
export interface IJSONContributionRegistry {
    /**
     * Register a schema to the registry.
     */
    registerSchema(uri: string, unresolvedSchemaContent: IJSONSchema): void;
    /**
     * Get all schemas
     */
    getSchemaContributions(): ISchemaContributions;
    /**
     * Adds a change listener
     */
    addRegistryChangedListener(callback: (e: IJSONContributionRegistryEvent) => void): IDisposable;
}
export interface IJSONContributionRegistryEvent {
}
