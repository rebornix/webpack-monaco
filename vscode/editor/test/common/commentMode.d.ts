import { CommentRule } from 'vs/editor/common/modes/languageConfiguration';
import { MockMode } from 'vs/editor/test/common/mocks/mockMode';
export declare class CommentMode extends MockMode {
    private static _id;
    constructor(commentsConfig: CommentRule);
}
