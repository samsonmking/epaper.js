import {
    ColorMode,
    DisplayDevice,
    Orientation,
    convertPNGto1BitBW2in13V2,
    convertPNGto1BitBW2in13V2Rotated,
} from '@epaperjs/core';
import bindings from 'bindings';
import { Driver } from './driver';

export class Rpi2In13V2 implements DisplayDevice {
    public readonly colorMode = ColorMode.Black;
    public readonly height: number;
    public readonly width: number;
    private readonly driver: Driver;
    private readonly converter: (img: Buffer) => Promise<Buffer>;

    constructor(public readonly orientation: Orientation = Orientation.Horizontal) {
        this.driver = bindings('waveshare2in13v2.node');
        this.height = orientation === Orientation.Horizontal ? 122 : 250;
        this.width = orientation === Orientation.Horizontal ? 250 : 122;
        this.converter =
            orientation === Orientation.Horizontal ? convertPNGto1BitBW2in13V2Rotated : convertPNGto1BitBW2in13V2;
    }

    public init() {
        this.driver.dev_init();
        this.wake();
    }

    public wake() {
        this.driver.init();
    }

    public clear() {
        this.driver.clear();
    }

    public sleep() {
        this.driver.sleep();
    }

    public async displayPng(img: Buffer) {
        const blackBuffer = await this.converter(img);
        this.driver.display(blackBuffer);
    }
}
