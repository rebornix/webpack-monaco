import { ParsedArgs } from '../common/environment';
/**
 * Use this to parse raw code process.argv such as: `Electron . --verbose --wait`
 */
export declare function parseMainProcessArgv(processArgv: string[]): ParsedArgs;
/**
 * Use this to parse raw code CLI process.argv such as: `Electron cli.js . --verbose --wait`
 */
export declare function parseCLIProcessArgv(processArgv: string[]): ParsedArgs;
/**
 * Use this to parse code arguments such as `--verbose --wait`
 */
export declare function parseArgs(args: string[]): ParsedArgs;
export declare const optionsHelp: {
    [name: string]: string;
};
export declare function formatOptions(options: {
    [name: string]: string;
}, columns: number): string;
export declare function buildHelpMessage(fullName: string, name: string, version: string): string;
