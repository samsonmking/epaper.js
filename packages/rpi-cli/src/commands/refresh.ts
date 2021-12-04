import { SinglePage, ColorMode, DisplayDevice, getBrowserPage, Orientation } from '@epaperjs/core';
import { getDevice } from '../deviceFactory';

export class RefreshCommand {
    private displayDevice?: DisplayDevice;
    private browserPage?: SinglePage;

    constructor() {
        process.on('SIGINT', () => this.onExit());
        process.on('SIGTERM', () => this.onExit());
    }

    public async refresh(
        deviceType: string,
        url: string,
        seconds: number = 600,
        orientation?: Orientation,
        colorMode?: ColorMode
    ) {
        this.displayDevice = await getDevice(deviceType, orientation, colorMode);
        if (!this.displayDevice) {
            throw new Error(`device type ${deviceType} not recognized`);
        }
        this.displayDevice.init();

        this.browserPage = await getBrowserPage(this.displayDevice.width, this.displayDevice.height);

        while (true) {
            this.displayDevice.wake();
            const imgOfUrl = await this.browserPage.display(url);
            await this.displayDevice.displayPng(imgOfUrl);
            this.displayDevice.sleep();
            await this.sleep(seconds);
        }
    }

    private onExit() {
        this.displayDevice?.sleep();
        this.browserPage?.close();
    }

    private sleep(seconds: number) {
        return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    }
}
