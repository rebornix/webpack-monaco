export interface IStringBuilder {
    build(): string;
    reset(): void;
    write1(charCode: number): void;
    appendASCII(charCode: number): void;
    appendASCIIString(str: string): void;
}
export declare let createStringBuilder: (capacity: number) => IStringBuilder;
