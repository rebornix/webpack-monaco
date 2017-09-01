/**
 * Executes the given function (fn) over the given array of items (list) in parallel and returns the resulting errors and results as
 * array to the callback (callback). The resulting errors and results are evaluated by calling the provided callback function.
 */
export declare function parallel<T, E>(list: T[], fn: (item: T, callback: (err: Error, result: E) => void) => void, callback: (err: Error[], result: E[]) => void): void;
/**
 * Executes the given function (fn) over the given array of items (param) in sequential order and returns the first occurred error or the result as
 * array to the callback (callback). The resulting errors and results are evaluated by calling the provided callback function. The first param can
 * either be a function that returns an array of results to loop in async fashion or be an array of items already.
 */
export declare function loop<T, E>(param: (callback: (error: Error, result: T[]) => void) => void, fn: (item: T, callback: (error: Error, result: E) => void, index: number, total: number) => void, callback: (error: Error, result: E[]) => void): void;
export declare function loop<T, E>(param: T[], fn: (item: T, callback: (error: Error, result: E) => void, index: number, total: number) => void, callback: (error: Error, result: E[]) => void): void;
/**
 * Takes a variable list of functions to execute in sequence. The first function must be the error handler and the
 * following functions can do arbitrary work. "this" must be used as callback value for async functions to continue
 * through the sequence:
 * 	sequence(
 * 		function errorHandler(error) {
 * 			clb(error, null);
 * 		},
 *
 * 		function doSomethingAsync() {
 * 			fs.doAsync(path, this);
 * 		},
 *
 * 		function done(result) {
 * 			clb(null, result);
 * 		}
 * 	);
 */
export declare function sequence(errorHandler: (error: Error) => void, ...sequences: Function[]): void;
export declare function sequence(sequences: Function[]): void;
