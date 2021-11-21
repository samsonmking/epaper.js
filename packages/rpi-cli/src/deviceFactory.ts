import { DisplayDevice, Orientation } from '@epaperjs/core';

export class DeviceFactory {
    private readonly deviceMap;
    constructor() {
        this.deviceMap = new Map<string, (orientation: Orientation) => Promise<DisplayDevice>>([
            ['rpi-2in13-v2', async (orientation) => await this.getRpi2in13V2(orientation)],
            ['rpi-2in13-bc', async (orientation) => await this.getRpi2In13Bc(orientation)],
        ]);
    }

    public async getDevice(deviceType: string, orientation: Orientation): Promise<DisplayDevice | undefined> {
        const factory = this.deviceMap.get(deviceType);
        if (factory) {
            return await factory(orientation);
        }
        return undefined;
    }

    private async getRpi2in13V2(orientation: Orientation): Promise<DisplayDevice> {
        const { Rpi2In13V2 } = await import('@epaperjs/rpi-2in13-v2');
        return new Rpi2In13V2(orientation);
    }

    private async getRpi2In13Bc(orientation: Orientation): Promise<DisplayDevice> {
        const { Rpi2In13BC } = await import('@epaperjs/rpi-2in13-bc');
        return new Rpi2In13BC(orientation);
    }
}
