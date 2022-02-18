import { ColorMode, DisplayDevice, Monochrome, Orientation } from '@epaperjs/core';
import { ImageOptions } from '@epaperjs/core/src/image/imageOptions';
import bindings from 'bindings';
import { Driver } from './driver';

export class Rpi7In5V2 implements DisplayDevice {
    public readonly height: number;
    public readonly width: number;
    private readonly driver: Driver;
    private sleeping = true;
    constructor(public readonly orientation = Orientation.Horizontal, public readonly colorMode = ColorMode.Black) {
        if (colorMode !== ColorMode.Black) {
            throw new Error('Only black color mode is supported');
        }
        this.driver = bindings('waveshare7in5v2');
        this.width = this.orientation === Orientation.Horizontal ? 800 : 480;
        this.height = this.orientation === Orientation.Horizontal ? 480 : 800;
    }

    public async connect() {
        this.driver.dev_init();
        this.wake();
    }

    public async disconnect() {
        this.sleep();
        this.driver.dev_exit();
    }

    public async wake() {
        this.driver.init();
        this.sleeping = false;
    }

    public async clear() {
        this.driver.clear();
    }

    public async sleep() {
        if (!this.sleeping) {
            this.driver.sleep();
            this.sleeping = true;
        }
    }

    public async displayPng(img: Buffer, options?: ImageOptions): Promise<void> {
        const converter = new Monochrome(img);
        const blackBuffer = await converter.toBlack({
            ...options,
            rotate90Degrees: this.orientation === Orientation.Vertical,
        });
        this.driver.display(blackBuffer);
    }
}
