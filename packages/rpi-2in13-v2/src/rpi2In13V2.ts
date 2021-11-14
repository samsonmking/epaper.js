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
    private readonly driver: Driver;
    public orientation = Orientation.Horizontal;
    public colorMode = ColorMode.Gray4;

    constructor() {
        this.driver = bindings('waveshare2in13v2.node');
    }

    public get height() {
        return this.orientation === Orientation.Horizontal ? 122 : 250;
    }

    public get width() {
        return this.orientation === Orientation.Horizontal ? 250 : 122;
    }

    public init() {
        this.driver.dev_init();
        this.driver.init();
    }

    public clear() {
        this.driver.clear();
    }

    public sleep() {
        this.driver.sleep();
    }

    public async displayPng(img: Buffer) {
        const converter =
            this.orientation === Orientation.Horizontal ? convertPNGto1BitBW2in13V2Rotated : convertPNGto1BitBW2in13V2;
        const blackBuffer = await converter(img);
        this.driver.display(blackBuffer);
    }
}
