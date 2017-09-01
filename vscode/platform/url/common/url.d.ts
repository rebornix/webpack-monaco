import Event from 'vs/base/common/event';
import URI from 'vs/base/common/uri';
export declare const ID = "urlService";
export declare const IURLService: {
    (...args: any[]): void;
    type: IURLService;
};
export interface IURLService {
    _serviceBrand: any;
    open(url: string): void;
    onOpenURL: Event<URI>;
}
