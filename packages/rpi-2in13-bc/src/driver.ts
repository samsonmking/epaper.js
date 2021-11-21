export interface Driver {
    dev_init(): void;
    init(): void;
    display(blackBuffer: Buffer, colorBuffer: Buffer): void;
    clear(): void;
    sleep(): void;
}
