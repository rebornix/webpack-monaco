import URI from 'vs/base/common/uri';
export interface ILabelProvider {
    /**
     * Given an element returns a label for it to display in the UI.
     */
    getLabel(element: any): string;
}
export interface IRootProvider {
    getRoot(resource: URI): URI;
    getWorkspace(): {
        roots: URI[];
    };
}
export interface IUserHomeProvider {
    userHome: string;
}
export declare function getPathLabel(resource: URI | string, rootProvider?: IRootProvider, userHomeProvider?: IUserHomeProvider): string;
export declare function tildify(path: string, userHome: string): string;
export declare function shorten(paths: string[]): string[];
export interface ISeparator {
    label: string;
}
/**
 * Helper to insert values for specific template variables into the string. E.g. "this $(is) a $(template)" can be
 * passed to this function together with an object that maps "is" and "template" to strings to have them replaced.
 * @param value string to which templating is applied
 * @param values the values of the templates to use
 */
export declare function template(template: string, values?: {
    [key: string]: string | ISeparator;
}): string;
export declare function mnemonicLabel(label: string, forceDisableMnemonics?: boolean): string;
export declare function unmnemonicLabel(label: string): string;
