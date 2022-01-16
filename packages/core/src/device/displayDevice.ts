export enum ColorMode {
    Black = 'black',
    Gray4 = 'gray',
    Red = 'red',
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
    connect(): void;
    wake(): void;
    clear(): void;
    sleep(): void;
    displayPng(img: Buffer): Promise<void>;
    disconnect(): void;
}
