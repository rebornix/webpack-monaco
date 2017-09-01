export declare const IClipboardService: {
    (...args: any[]): void;
    type: IClipboardService;
};
export interface IClipboardService {
    _serviceBrand: any;
    /**
     * Writes text to the system clipboard.
     */
    writeText(text: string): void;
}
