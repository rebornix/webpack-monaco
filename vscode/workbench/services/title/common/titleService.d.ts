export declare const ITitleService: {
    (...args: any[]): void;
    type: ITitleService;
};
export interface ITitleService {
    _serviceBrand: any;
    /**
     * Set the window title with the given value.
     */
    setTitle(title: string): void;
    /**
     * Set the represented file name to the title if any.
     */
    setRepresentedFilename(path: string): void;
}
