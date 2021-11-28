export const ColorMode = {
    Black: 'black',
    Gray4: 'gray4',
};
export type ColorMode = typeof ColorMode[keyof typeof ColorMode];

export const Orientation = {
    Horizontal: 'h',
    Vertical: 'v',
};
export type Orientation = typeof Orientation[keyof typeof Orientation];

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
