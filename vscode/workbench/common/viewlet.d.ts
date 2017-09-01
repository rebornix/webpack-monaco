import { IComposite } from 'vs/workbench/common/composite';
export interface IViewlet extends IComposite {
    /**
     * Returns the minimal width needed to avoid any content horizontal truncation
     */
    getOptimalWidth(): number;
}
