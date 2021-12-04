import { SinglePage, ColorMode, DisplayDevice, getBrowserPage, Orientation } from '@epaperjs/core';
import { getDevice } from '../deviceFactory';
import { DisplayArgs } from './display';

export interface RefreshArgs extends DisplayArgs {
    time?: number;
}

export class RefreshCommand {
    private displayDevice?: DisplayDevice;
    private browserPage?: SinglePage;

    constructor() {
        process.on('SIGINT', () => this.onExit());
        process.on('SIGTERM', () => this.onExit());
    }

    public async refresh(refreshArgs: RefreshArgs) {
        try {
            const { deviceType, orientation, colorMode, url, time } = refreshArgs;

            this.displayDevice = await getDevice(deviceType, orientation, colorMode);
            if (!this.displayDevice) {
                throw new Error(`device type ${deviceType} not recognized`);
            }
            this.displayDevice.init();

            this.browserPage = await getBrowserPage(this.displayDevice.width, this.displayDevice.height);

            while (true) {
                const imgOfUrl = await this.browserPage.display(url);
                this.displayDevice.wake();
                await this.displayDevice.displayPng(imgOfUrl);
                this.displayDevice.sleep();
                await this.sleep(time);
            }
        } catch (e) {
            throw e;
        } finally {
            console.log('finally');
            this.onExit();
        }
    }

    private onExit() {
        this.displayDevice?.sleep();
        this.browserPage?.close();
    }

    private sleep(seconds: number = 15) {
        return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    }
}
