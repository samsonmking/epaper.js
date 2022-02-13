import { ImageOptions } from '../image/imageOptions';

export enum ColorMode {
    Black = 'black',
    Gray4 = '4gray',
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
    connect(): Promise<void>;
    wake(): Promise<void>;
    clear(): Promise<void>;
    sleep(): Promise<void>;
    displayPng(img: Buffer, options?: ImageOptions): Promise<void>;
    disconnect(): Promise<void>;
}
