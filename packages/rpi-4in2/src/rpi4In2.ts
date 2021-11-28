import { ColorMode, convertPNGto4Grey, convertPNGto4GreyRotated, DisplayDevice, Orientation } from '@epaperjs/core';
import bindings from 'bindings';
import { Driver } from './driver';

export class Rpi4In2 implements DisplayDevice {
    public readonly colorMode = ColorMode.Gray4;
    public readonly height: number;
    public readonly width: number;
    private readonly driver: Driver;
    private readonly converter: (img: Buffer) => Promise<Buffer>;

    constructor(public readonly orientation: Orientation) {
        this.driver = bindings('waveshare4in2.node');
        this.height = this.orientation === Orientation.Horizontal ? 300 : 400;
        this.width = this.orientation === Orientation.Horizontal ? 400 : 300;
        this.converter = this.getConverter();
    }

    public init() {
        this.driver.dev_init();
        this.driver.init_4Gray();
    }

    public clear() {
        this.driver.clear();
    }

    public sleep() {
        this.driver.sleep();
    }

    public async displayPng(img: Buffer) {
        const imageBuffer = await this.converter(img);
        this.driver.display_4GrayDisplay(imageBuffer);
    }

    private getConverter() {
        if (this.orientation === Orientation.Horizontal) {
            return convertPNGto4Grey;
        } else {
            return convertPNGto4GreyRotated;
        }
    }
}
