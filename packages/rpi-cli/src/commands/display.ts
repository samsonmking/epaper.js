import { ColorMode, DisplayDevice, getBrowserPage, Orientation, SinglePage } from '@epaperjs/core';
import { getDevice } from '../deviceFactory';

export interface DisplayArgs extends BaseArgs {
    url: string;
    orientation?: Orientation;
    colorMode?: ColorMode;
}

export class DisplayCommand {
    private displayDevice?: DisplayDevice;
    private browserPage?: SinglePage;

    constructor() {
        process.on('SIGINT', () => this.onExit());
        process.on('SIGTERM', () => this.onExit());
    }
    public async display(displayArgs: DisplayArgs) {
        try {
            const { deviceType, orientation, colorMode, url } = displayArgs;

            const displayDevice = await getDevice(deviceType, orientation, colorMode);
            if (!displayDevice) {
                throw new Error(`device type ${deviceType} not recognized`);
            }
            displayDevice.init();

            const browserPage = await getBrowserPage(displayDevice.width, displayDevice.height);
            const imgOfUrl = await browserPage.display(url);
            await displayDevice.displayPng(imgOfUrl);
        } catch (e) {
            throw e;
        } finally {
            this.onExit();
        }
    }
    private onExit() {
        this.displayDevice?.sleep();
        this.browserPage?.close();
    }
}
