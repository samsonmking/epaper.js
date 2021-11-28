export interface Driver {
    dev_init(): void;
    init(): void;
    init_4Gray(): void;
    display(buffer: Buffer): void;
    display_4GrayDisplay(buffer: Buffer): void;
    clear(): void;
    sleep(): void;
}
