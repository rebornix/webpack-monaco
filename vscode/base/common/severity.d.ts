declare enum Severity {
    Ignore = 0,
    Info = 1,
    Warning = 2,
    Error = 3,
}
declare namespace Severity {
    /**
     * Parses 'error', 'warning', 'warn', 'info' in call casings
     * and falls back to ignore.
     */
    function fromValue(value: string): Severity;
    function toString(value: Severity): string;
    function compare(a: Severity, b: Severity): number;
}
export default Severity;
