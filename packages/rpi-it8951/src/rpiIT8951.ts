import { ColorMode, DisplayDevice, GrayLR, Monochrome, Orientation } from '@epaperjs/core';
import { ImageOptions } from '@epaperjs/core/src/image/imageOptions';
import bindings from 'bindings';
import { Driver } from './driver';

export class RpiIT8951 implements DisplayDevice {
    public readonly height: number;
    public readonly width: number;
    private readonly driver: Driver;

    constructor(
        public readonly orientation: Orientation = Orientation.Horizontal,
        public readonly colorMode: ColorMode = ColorMode.Black
    ) {
        const supportedColorModes = [ColorMode.Black, ColorMode.Gray4];
        if (!supportedColorModes.includes(colorMode)) {
            throw new Error(`Only color modes: [${supportedColorModes}] are supported`);
        }
        this.driver = bindings('waveshareIT8951.node');
        this.height = this.orientation === Orientation.Horizontal ? 825 : 1200;
        this.width = this.orientation === Orientation.Horizontal ? 1200 : 825;
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
        console.log("wake");
        if (this.colorMode === ColorMode.Gray4) {
            this.driver.init_4Gray();
        } else {
            this.driver.init();
        }
    }

    public clear() {
        console.log("clear");
        this.driver.clear();
    }

    public sleep() {
        console.log("sleep");
        this.driver.sleep();
    }

    public async displayPng(img: Buffer, options?: ImageOptions) {
        console.log("displayPng");
        if (this.colorMode === ColorMode.Gray4) {
            console.log("+displayPng gray");
            await this.displayPngGray4(img, options);
        } else {
            console.log("+displayPng bw");
            await this.displayPngBW(img, options);
        }
    }

    public async displayPngBW(img: Buffer, options?: ImageOptions) {
        console.log("displayPng bw");
        const converter = new Monochrome(img);
        const blackBuffer = await converter.toBlack({
            ...options,
            rotate90Degrees: this.orientation === Orientation.Vertical,
        });
        this.driver.display(blackBuffer);
    }

    public async displayPngGray4(img: Buffer, options?: ImageOptions) {
        console.log("displayPng gray 4");
        const converter = new GrayLR(img);
        const grayBuffer = await converter.to4Gray({
            ...options,
            rotate90Degrees: this.orientation === Orientation.Vertical,
        });
        this.driver.display_4GrayDisplay(grayBuffer);
    }
}
