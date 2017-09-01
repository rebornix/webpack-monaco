import Event from 'vs/base/common/event';
import { IURLService } from 'vs/platform/url/common/url';
import URI from 'vs/base/common/uri';
export declare class URLService implements IURLService {
    _serviceBrand: any;
    private openUrlEmitter;
    onOpenURL: Event<URI>;
    constructor(initial?: string | string[]);
    open(url: string): void;
}
