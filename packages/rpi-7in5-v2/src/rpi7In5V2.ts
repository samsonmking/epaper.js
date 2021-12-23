import { ColorMode, DisplayDevice, MonochromeHScan, Orientation } from '@epaperjs/core';
import bindings from 'bindings';
import { Driver } from './driver';

export class Rpi7In5V2 implements DisplayDevice {
    public readonly height: number;
    public readonly width: number;
    private readonly driver: Driver;
    constructor(public readonly orientation = Orientation.Horizontal, public readonly colorMode = ColorMode.Black) {
        if (colorMode !== ColorMode.Black) {
            throw new Error('Only black color mode is supported');
        }
        this.driver = bindings('waveshare7in5v2');
        this.width = this.orientation === Orientation.Horizontal ? 800 : 480;
        this.height = this.orientation === Orientation.Horizontal ? 480 : 800;
    }

    public init(): void {
        this.driver.dev_init();
        this.wake();
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

    public async displayPng(img: Buffer): Promise<void> {
        const converter = new MonochromeHScan(img);
        const blackBuffer = await converter.toBlack({ rotate90Degrees: this.orientation === Orientation.Vertical });
        this.driver.display(blackBuffer);
    }
}
