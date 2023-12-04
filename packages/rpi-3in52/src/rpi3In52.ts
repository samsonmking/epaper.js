import { ColorMode, DisplayDevice, Monochrome, Orientation } from '@epaperjs/core';
import { ImageOptions } from '@epaperjs/core/src/image/imageOptions';
import bindings from 'bindings';
import { Driver } from './driver';

export class Rpi3In52 implements DisplayDevice {
    public readonly height: number;
    public readonly width: number;
    private readonly driver: Driver;

    constructor(public readonly orientation = Orientation.Horizontal, public readonly colorMode = ColorMode.Black) {
        if (colorMode !== ColorMode.Black) {
            throw new Error('Only black color mode is supported');
        }

        this.driver = bindings('waveshare3in52');
        this.height = this.orientation === Orientation.Horizontal ? 240 : 360;
        this.width = this.orientation === Orientation.Horizontal ? 360 : 240;
    }

    public connect(): void {
        this.driver.dev_init();
        this.wake();
    }

    public disconnect(): void {
        this.sleep();
        this.driver.dev_exit();
    }

    public wake(): void {
        this.driver.init();
    }

    public clear(): void {
        this.driver.clear();
    }

    public sleep(): void {
        this.driver.sleep();
    }

    public async displayPng(img: Buffer, options?: ImageOptions): Promise<void> {
        await this.displayPngBW(img, options);
    }

    private async displayPngBW(img: Buffer, options?: ImageOptions) {
        const converter = new Monochrome(img);
        const blackBuffer = await converter.toBlack({
            ...options,
            rotate90Degrees: this.orientation === Orientation.Horizontal,
        });
        this.driver.display(blackBuffer);
    }
}
