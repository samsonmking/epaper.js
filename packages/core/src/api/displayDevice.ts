export enum ColorMode {
    Black = 'black',
    Gray4 = 'gray',
}

export enum Orientation {
    Horizontal = 'h',
    Vertical = 'v',
}

export interface DisplayDevice {
    orientation: Orientation;
    readonly height: number;
    readonly width: number;
    colorMode: ColorMode;
    init(): void;
    wake(): void;
    clear(): void;
    sleep(): void;
    displayPng(img: Buffer): Promise<void>;
}
