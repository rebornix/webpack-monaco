import _ = require('vs/base/parts/tree/browser/tree');
export declare class FakeRenderer {
    getHeight(tree: _.ITree, element: any): number;
    getTemplateId(tree: _.ITree, element: any): string;
    renderTemplate(tree: _.ITree, templateId: string, container: any): any;
    renderElement(tree: _.ITree, element: any, templateId: string, templateData: any): void;
    disposeTemplate(tree: _.ITree, templateId: string, templateData: any): void;
}
