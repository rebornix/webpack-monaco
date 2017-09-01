/**
 * Given a start point and a max number of retries, will find a port that
 * is openable. Will return 0 in case no free port can be found.
 */
export declare function findFreePort(startPort: number, giveUpAfter: number, timeout: number, clb: (port: number) => void): void;
