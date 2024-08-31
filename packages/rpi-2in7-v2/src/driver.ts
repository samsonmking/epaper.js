export interface Driver {
    dev_init(): void;
    init(): void;
    init_4Gray(): void;
    display(buffer: Buffer): void;
    display_4Gray(buffer: Buffer): void;
    clear(): void;
    sleep(): void;
    dev_exit(): void;
}
