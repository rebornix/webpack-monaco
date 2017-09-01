import { TPromise } from 'vs/base/common/winjs.base';
/**
 * We need to get the environment from a user's shell.
 * This should only be done when Code itself is not launched
 * from within a shell.
 */
export declare function getShellEnvironment(): TPromise<typeof process.env>;
