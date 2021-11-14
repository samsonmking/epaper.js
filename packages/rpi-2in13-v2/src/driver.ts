export interface Driver {
    dev_init(): void;
    init(): void;
    display(buffer: Uint8Array): void;
    clear(): void;
    sleep(): void;
}
