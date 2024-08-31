import { ColorMode, DisplayDevice, GrayLR, Monochrome, Orientation } from '@epaperjs/core';
import { ImageOptions } from '@epaperjs/core/src/image/imageOptions';
import bindings from 'bindings';
import { Driver } from './driver';

export class Rpi2In7V2 implements DisplayDevice {
    public readonly height: number;
    public readonly width: number;
    private readonly driver: Driver;
    constructor(public readonly orientation = Orientation.Horizontal, public readonly colorMode = ColorMode.Black) {
        const supportedColorModes = [ColorMode.Black, ColorMode.Gray4];
        if (!supportedColorModes.includes(colorMode)) {
            throw new Error(`Only color modes: [${supportedColorModes}] are supported`);
        }
        this.driver = bindings('waveshare2in7v2.node');
        this.width = this.orientation === Orientation.Horizontal ? 264 : 176;
        this.height = this.orientation === Orientation.Horizontal ? 176 : 264;
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
        if (this.colorMode === ColorMode.Gray4) {
            this.driver.init_4Gray();
        } else {
            this.driver.init();
        }
    }

    public clear(): void {
        this.driver.clear();
    }

    public sleep(): void {
        this.driver.sleep();
    }

    public async displayPng(img: Buffer, options?: ImageOptions): Promise<void> {
        if (this.colorMode === ColorMode.Gray4) {
            await this.displayPngGray4(img, options);
        } else {
            await this.displayPngBW(img, options);
        }
    }

    private async displayPngBW(img: Buffer, options?: ImageOptions) {
        const converter = new Monochrome(img);
        const blackBuffer = await converter.toBlack({
            ...options,
            rotate90Degrees: this.orientation === Orientation.Horizontal,
        });
        this.driver.display(blackBuffer);
    }

    private async displayPngGray4(img: Buffer, options?: ImageOptions) {
        const converter = new GrayLR(img);
        const grayBuffer = await converter.to4Gray({
            ...options,
            rotate90Degrees: this.orientation === Orientation.Horizontal,
        });
        this.driver.display_4Gray(grayBuffer);
    }
}
