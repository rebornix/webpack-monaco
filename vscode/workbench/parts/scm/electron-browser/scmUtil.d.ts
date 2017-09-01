import { ISCMResourceGroup, ISCMResource } from 'vs/workbench/services/scm/common/scm';
export declare function isSCMResource(element: ISCMResourceGroup | ISCMResource): element is ISCMResource;
export declare function getSCMResourceContextKey(resource: ISCMResourceGroup | ISCMResource): string;
