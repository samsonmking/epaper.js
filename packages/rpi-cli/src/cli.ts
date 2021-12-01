import { ColorMode, Orientation } from '@epaperjs/core';
import yargs from 'yargs/yargs';
import { DisplayCommand, RefreshCommand } from './commands';

export function cli(processArgs: string[]) {
    yargs(processArgs)
        .usage('Usage $0 <command> [options]')
        .command<DisplayArgs>(
            'display [options] <deviceType> <url>',
            'display a single rendition of the URL',
            (yargs) => {
                yargs
                    .option('orientation', {
                        alias: 'o',
                        choices: Object.values(Orientation),
                        describe: 'desired orientation:\n(h)orizontal, (v)ertical',
                    })
                    .option('colorMode', {
                        alias: 'c',
                        choices: Object.values(ColorMode),
                        describe: 'desired color mode',
                    })
                    .positional('deviceType', {
                        describe: 'The type of screen connected to your device',
                        type: 'string',
                    })
                    .positional('url', {
                        describe: 'URL to display',
                        type: 'string',
                    });
            },
            async (args) => {
                const displayCommand = new DisplayCommand();
                await displayCommand.display(args.deviceType, args.url, args.orientation, args.colorMode);
            }
        )
        .command<RefreshArgs>(
            'refresh [options] <deviceType> <url>',
            'display the URL every n seconds',
            (yargs) => {
                yargs
                    .option('time', {
                        alias: 't',
                        number: true,
                        describe: 'amount of time in seconds between refreshes',
                    })
                    .option('orientation', {
                        alias: 'o',
                        choices: Object.values(Orientation),
                        describe: 'desired orientation:\n(h)orizontal, (v)ertical',
                    })
                    .option('colorMode', {
                        alias: 'c',
                        choices: Object.values(ColorMode),
                        describe: 'desired color mode',
                    })
                    .positional('deviceType', {
                        describe: 'The type of screen connected to your device',
                        type: 'string',
                    })
                    .positional('url', {
                        describe: 'URL to display',
                        type: 'string',
                    });
            },
            async (args) => {
                const refreshCommand = new RefreshCommand();
                await refreshCommand.refresh(args.deviceType, args.url, args.time, args.orientation, args.colorMode);
            }
        )
        .demandCommand(1, 'No command specified - you must specify a command')
        .help().argv;
}

interface DisplayArgs {
    deviceType: string;
    url: string;
    orientation?: Orientation;
    colorMode?: ColorMode;
}

interface RefreshArgs extends DisplayArgs {
    time?: number;
}
