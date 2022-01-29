export interface Driver {
    dev_init(): void;
    init(): void;
    display(buffer: Buffer): void;
    clear(): void;
    sleep(): void;
    dev_exit(): void;
}
