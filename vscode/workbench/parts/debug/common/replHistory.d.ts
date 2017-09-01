/**
 * The repl history has the following characteristics:
 * - the history is stored in local storage up to N items
 * - every time a expression is evaluated, it is being added to the history
 * - when starting to navigate in history, the current expression is remembered to be able to go back
 * - when navigating in history and making changes to any expression, these changes are remembered until a expression is evaluated
 * - the navigation state is not remembered so that the user always ends up at the end of the history stack when evaluating a expression
 */
export declare class ReplHistory {
    private history;
    private historyPointer;
    private currentExpressionStoredMarkers;
    private historyOverwrites;
    constructor(history: string[]);
    next(): string;
    previous(): string;
    private navigate(previous);
    remember(expression: string, fromPrevious: boolean): void;
    evaluated(expression: string): void;
    save(): string[];
}
