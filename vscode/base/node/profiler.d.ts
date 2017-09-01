import { TPromise } from 'vs/base/common/winjs.base';
export declare function startProfiling(name: string): TPromise<boolean>;
export declare function stopProfiling(dir: string, prefix: string): TPromise<string>;
export declare function removePiiPaths(profile: Profile): void;
export interface Profile {
    title: string;
    export(callback: (err, data) => void): any;
    delete(): any;
    head: ProfileSample;
}
export interface ProfileSample {
    url: string;
    children: ProfileSample[];
}
