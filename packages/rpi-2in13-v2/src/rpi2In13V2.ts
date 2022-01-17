import { ColorMode, DisplayDevice, MonochromeRL, Orientation } from '@epaperjs/core';
import { ImageOptions } from '@epaperjs/core/src/image/imageOptions';
import bindings from 'bindings';
import { Driver } from './driver';

export class Rpi2In13V2 implements DisplayDevice {
    public readonly height: number;
    public readonly width: number;
    private readonly driver: Driver;

    constructor(
        public readonly orientation: Orientation = Orientation.Horizontal,
        public readonly colorMode = ColorMode.Black
    ) {
        if (this.colorMode !== ColorMode.Black) {
            throw new Error('Only black color mode is supported');
        }
        this.driver = bindings('waveshare2in13v2.node');
        this.height = orientation === Orientation.Horizontal ? 122 : 250;
        this.width = orientation === Orientation.Horizontal ? 250 : 122;
    }

    public connect() {
        this.driver.dev_init();
        this.wake();
    }

    public disconnect(): void {
        this.sleep();
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
        const converter = new MonochromeRL(img);
        const blackBuffer = await converter.toBlack({
            ...options,
            rotate90Degrees: this.orientation === Orientation.Horizontal,
        });
        this.driver.display(blackBuffer);
    }
}
