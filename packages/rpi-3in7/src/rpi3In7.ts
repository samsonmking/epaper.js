import { ColorMode, DisplayDevice, GrayLR, MonochromeLR, Orientation } from '@epaperjs/core';
import bindings from 'bindings';
import { Driver } from './driver';

export class Rpi3In7 implements DisplayDevice {
    public readonly height: number;
    public readonly width: number;
    private readonly driver: Driver;

    constructor(public readonly orientation = Orientation.Horizontal, public readonly colorMode = ColorMode.Gray4) {
        const supportedColorModes = [ColorMode.Black, ColorMode.Gray4];
        if (!supportedColorModes.includes(colorMode)) {
            throw new Error(`Only color modes: [${supportedColorModes}] are supported`);
        }
        this.driver = bindings('waveshare3in7.node');
        this.height = this.orientation === Orientation.Horizontal ? 280 : 480;
        this.width = this.orientation === Orientation.Horizontal ? 480 : 280;
    }

    public connect(): void {
        this.driver.dev_init();
        this.wake();
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

    public async displayPng(img: Buffer): Promise<void> {
        if (this.colorMode === ColorMode.Gray4) {
            await this.displayPngGray4(img);
        } else {
            await this.displayPngBW(img);
        }
    }

    private async displayPngBW(img: Buffer) {
        const converter = new MonochromeLR(img);
        const blackBuffer = await converter.toBlack({ rotate90Degrees: this.orientation === Orientation.Horizontal });
        this.driver.display(blackBuffer);
    }

    private async displayPngGray4(img: Buffer) {
        const converter = new GrayLR(img);
        const grayBuffer = await converter.to4Gray({ rotate90Degrees: this.orientation === Orientation.Horizontal });
        this.driver.display_4Gray(grayBuffer);
    }
}
