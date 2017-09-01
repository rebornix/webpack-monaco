import { IInstantiationService, IConstructorSignature0 } from 'vs/platform/instantiation/common/instantiation';
/**
 * A workbench contribution that will be loaded when the workbench starts and disposed when the workbench shuts down.
 */
export interface IWorkbenchContribution {
    /**
     * The unique identifier of this workbench contribution.
     */
    getId(): string;
}
export declare namespace Extensions {
    const Workbench = "workbench.contributions.kind";
}
export declare type IWorkbenchContributionSignature = IConstructorSignature0<IWorkbenchContribution>;
export interface IWorkbenchContributionsRegistry {
    /**
     * Registers a workbench contribution to the platform that will be loaded when the workbench starts and disposed when
     * the workbench shuts down.
     */
    registerWorkbenchContribution(contribution: IWorkbenchContributionSignature): void;
    /**
     * Returns all workbench contributions that are known to the platform.
     */
    getWorkbenchContributions(): IWorkbenchContribution[];
    setInstantiationService(service: IInstantiationService): void;
}
