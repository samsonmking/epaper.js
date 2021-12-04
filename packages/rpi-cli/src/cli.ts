import { ColorMode, Orientation } from '@epaperjs/core';
import yargs, { Options, PositionalOptions } from 'yargs';
import { DisplayArgs, DisplayCommand, RefreshArgs, RefreshCommand } from './commands';
import { ConsoleLogger } from './logger';

const orientationArgs: Options = {
    alias: 'o',
    choices: Object.values(Orientation),
    describe: 'desired orientation:\n(h)orizontal, (v)ertical',
};

const colorArgs: Options = {
    alias: 'c',
    choices: Object.values(ColorMode),
    describe: 'desired color mode',
};

const timeArgs: Options = {
    alias: 't',
    number: true,
    describe: 'amount of time in seconds between refreshes',
};

const deviceTypeArgs: PositionalOptions = {
    describe: 'The type of screen connected to your device',
    type: 'string',
};

const urlArgs: PositionalOptions = {
    describe: 'URL to display',
    type: 'string',
};

const debugArgs: Options = {
    alias: 'd',
    boolean: true,
    describe: 'log stacktraces and browser errors to console',
};

export function cli(processArgs: string[]) {
    yargs(processArgs)
        .usage('Usage $0 <command> [options]')
        .command<DisplayArgs>(
            'display [options] <deviceType> <url>',
            'display a single rendition of the URL',
            (yargs) => {
                yargs
                    .option('orientation', orientationArgs)
                    .option('colorMode', colorArgs)
                    .option('debug', debugArgs)
                    .positional('deviceType', deviceTypeArgs)
                    .positional('url', urlArgs);
            },
            async (args) => {
                try {
                    const displayCommand = new DisplayCommand();
                    await displayCommand.display(args);
                } catch (e) {
                    handleError(e, args);
                }
            }
        )
        .command<RefreshArgs>(
            'refresh [options] <deviceType> <url>',
            'display the URL every n seconds',
            (yargs) => {
                yargs
                    .option('time', timeArgs)
                    .option('orientation', orientationArgs)
                    .option('colorMode', colorArgs)
                    .option('debug', debugArgs)
                    .positional('deviceType', deviceTypeArgs)
                    .positional('url', urlArgs);
            },
            async (args) => {
                try {
                    const refreshCommand = new RefreshCommand();
                    await refreshCommand.refresh(args);
                } catch (e) {
                    handleError(e, args);
                }
            }
        )
        .demandCommand(1, 'No command specified - you must specify a command')
        .strict()
        .help().argv;
}

function handleError(error: any, args: yargs.Arguments<BaseArgs>) {
    const logger = new ConsoleLogger(args.debug);
    if (error instanceof Error) {
        logger.error(error);
    } else {
        logger.error('Unknown error occurred');
    }
    process.exit(1);
}
