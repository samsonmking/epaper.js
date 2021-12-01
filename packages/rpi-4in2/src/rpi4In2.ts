import {
    ColorMode,
    convertPNGto1BitBW,
    convertPNGto1BitBWRotated,
    convertPNGto4Grey,
    convertPNGto4GreyRotated,
    DisplayDevice,
    Orientation,
} from '@epaperjs/core';
import bindings from 'bindings';
import { Driver } from './driver';

export class Rpi4In2 implements DisplayDevice {
    public readonly height: number;
    public readonly width: number;
    private readonly driver: Driver;

    constructor(
        public readonly orientation: Orientation = Orientation.Horizontal,
        public readonly colorMode: ColorMode = ColorMode.Gray4
    ) {
        this.driver = bindings('waveshare4in2.node');
        this.height = this.orientation === Orientation.Horizontal ? 300 : 400;
        this.width = this.orientation === Orientation.Horizontal ? 400 : 300;
    }

    public init() {
        this.driver.dev_init();
        this.wake();
    }

    public wake() {
        if (this.colorMode === ColorMode.Gray4) {
            this.driver.init_4Gray();
        } else {
            this.driver.init();
        }
    }

    public clear() {
        this.driver.clear();
    }

    public sleep() {
        this.driver.sleep();
    }

    public async displayPng(img: Buffer) {
        if (this.colorMode === ColorMode.Gray4) {
            await this.displayPngGray4(img);
        } else {
            await this.displayPngBW(img);
        }
    }

    private async displayPngBW(img: Buffer) {
        const converter = this.orientation === Orientation.Horizontal ? convertPNGto1BitBW : convertPNGto1BitBWRotated;
        const blackBuffer = await converter(img);
        this.driver.display(blackBuffer);
    }

    private async displayPngGray4(img: Buffer) {
        const converter = this.orientation === Orientation.Horizontal ? convertPNGto4Grey : convertPNGto4GreyRotated;
        const grayBuffer = await converter(img);
        this.driver.display_4GrayDisplay(grayBuffer);
    }
}
