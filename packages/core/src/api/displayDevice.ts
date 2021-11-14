export enum ColorMode {
    Gray1 = 'GRAY_1',
    Gray4 = 'GRAY_4',
}

export enum Orientation {
    Horizontal = 'H',
    Vertical = 'V',
}

export interface DisplayDevice {
    orientation: Orientation;
    readonly height: number;
    readonly width: number;
    colorMode: ColorMode;
    init(): void;
    clear(): void;
    sleep(): void;
    displayPng(img: Buffer): Promise<void>;
}
