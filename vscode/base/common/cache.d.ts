import { TPromise } from 'vs/base/common/winjs.base';
export default class Cache<T> {
    private task;
    private promise;
    constructor(task: () => TPromise<T>);
    get(): TPromise<T>;
}
