export interface Driver {
    dev_init(): Promise<void>;
    init(): Promise<void>;
    init_4Gray(): Promise<void>;
    display(buffer: Buffer): Promise<void>;
    display_4GrayDisplay(buffer: Buffer): Promise<void>;
    clear(): Promise<void>;
    sleep(): Promise<void>;
    dev_exit(): Promise<void>;
}
