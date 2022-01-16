import { ColorMode, DisplayDevice, MonochromeLR, Orientation } from '@epaperjs/core';
import bindings from 'bindings';
import { Driver } from './driver';

export class Rpi2In13BC implements DisplayDevice {
    public readonly height: number;
    public readonly width: number;
    private readonly driver: Driver;

    constructor(public readonly orientation = Orientation.Horizontal, public readonly colorMode = ColorMode.Red) {
        const supportedColorModes = [ColorMode.Black, ColorMode.Red];
        if (!supportedColorModes.includes(colorMode)) {
            throw new Error(`Only color modes: [${supportedColorModes}] are supported`);
        }
        this.driver = bindings('waveshare2in13bc.node');
        this.height = orientation === Orientation.Horizontal ? 104 : 212;
        this.width = orientation === Orientation.Horizontal ? 212 : 104;
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

    public async displayPng(img: Buffer) {
        const converter = new MonochromeLR(img);
        const blackBuffer = await converter.toBlack({ rotate90Degrees: this.orientation === Orientation.Horizontal });
        const redBuffer =
            this.colorMode === ColorMode.Red
                ? await converter.toRed({ rotate90Degrees: this.orientation === Orientation.Horizontal })
                : Buffer.alloc(blackBuffer.length, 0xff);
        this.driver.display(blackBuffer, redBuffer);
    }
}
