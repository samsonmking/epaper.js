import { DisplayDevice } from '@epaperjs/core';
import { getDevice } from '../deviceFactory';
import { Command } from './command';

export class ClearCommand implements Command<BaseArgs> {
    private displayDevice?: DisplayDevice;

    public async execute(clearArgs: BaseArgs) {
        const { deviceType } = clearArgs;
        this.displayDevice = await getDevice(deviceType);
        if (!this.displayDevice) {
            throw new Error(`device type ${deviceType} not recognized`);
        }
        this.displayDevice.connect();
        this.displayDevice.clear();
    }

    public async dispose() {
        this.displayDevice?.sleep();
    }
}
