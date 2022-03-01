import { ColorMode, DisplayDevice, Monochrome, Orientation } from '@epaperjs/core';
import { ImageOptions } from '@epaperjs/core/src/image/imageOptions';
import bindings from 'bindings';
import { Driver } from './driver';

// The display driver treats the display as taller than wide,
// which is unusual given how Waveshare treats its other displays.
const HEIGHT = 1304;
const WIDTH = 984;

export class Rpi12In48B implements DisplayDevice {
    public readonly height: number;
    public readonly width: number;
    private readonly driver: Driver;

    constructor(public readonly orientation = Orientation.Horizontal, public readonly colorMode = ColorMode.Red) {
        const supportedColorModes = [ColorMode.Black, ColorMode.Red];
        if (!supportedColorModes.includes(colorMode)) {
            throw new Error(`Only color modes: [${supportedColorModes}] are supported`);
        }
        this.driver = bindings('waveshare12in48b.node');
        
        this.height = orientation === Orientation.Horizontal ? HEIGHT : WIDTH;
        this.width = orientation === Orientation.Horizontal ? WIDTH : HEIGHT;
    }

    public connect() {
        this.driver.dev_init();
        this.wake();
    }

    public disconnect() {
        this.driver.sleep();
        this.driver.dev_exit();
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

    public async displayPng(img: Buffer, options?: ImageOptions) {
        const converter = new Monochrome(img);
        const blackBuffer = await converter.toBlack({
            ...options,
            rotate90Degrees: this.orientation === Orientation.Horizontal,
        });
        const redBuffer = await converter.toRed({ ...options, rotate90Degrees: this.orientation === Orientation.Horizontal });
        this.driver.display(blackBuffer, redBuffer);
    }
}
