import { ColorMode, Orientation } from '@epaperjs/core';
import yargs, { Options, PositionalOptions } from 'yargs';
import { DisplayArgs, DisplayCommand, RefreshArgs, RefreshCommand } from './commands';
import { ClearCommand } from './commands/clear';
import { Command } from './commands/command';
import { ConsoleLogger, Logger } from './logger';

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

const intervalArgs: Options = {
    alias: 'i',
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

const screenshotDelayArgs: Options = {
    number: true,
    describe: 'optional delay after loading url before taking screenshot (milliseconds)',
};

const ditherArgs: Options = {
    boolean: true,
    describe: 'A dithering algorithm will be applied to approximate mid-tones',
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
                    .option('screenshotDelay', screenshotDelayArgs)
                    .option('dither', ditherArgs)
                    .positional('deviceType', deviceTypeArgs)
                    .positional('url', urlArgs);
            },
            async (args) => {
                const logger = new ConsoleLogger(args.debug);
                const displayCommand = new DisplayCommand(logger);
                executeCommand(displayCommand, args, logger);
            }
        )
        .command<RefreshArgs>(
            'refresh [options] <deviceType> <url>',
            'display the URL every n seconds',
            (yargs) => {
                yargs
                    .option('interval', intervalArgs)
                    .option('orientation', orientationArgs)
                    .option('colorMode', colorArgs)
                    .option('debug', debugArgs)
                    .option('screenshotDelay', screenshotDelayArgs)
                    .option('dither', ditherArgs)
                    .positional('deviceType', deviceTypeArgs)
                    .positional('url', urlArgs);
            },
            async (args) => {
                const logger = new ConsoleLogger(args.debug);
                const refreshCommand = new RefreshCommand(logger);
                executeCommand(refreshCommand, args, logger);
            }
        )
        .command<BaseArgs>(
            'clear [options] <deviceType>',
            'clear the display',
            (yargs) => {
                yargs.option('debug', debugArgs).positional('deviceType', deviceTypeArgs);
            },
            async (args) => {
                const logger = new ConsoleLogger(args.debug);
                const clearCommand = new ClearCommand(logger);
                executeCommand(clearCommand, args, logger);
            }
        )
        .demandCommand(1, 'No command specified - you must specify a command')
        .strict()
        .help().argv;
}

async function executeCommand<T extends BaseArgs>(command: Command<T>, args: T, logger: Logger) {
    process.on('SIGINT', () => command.dispose());
    process.on('SIGTERM', () => command.dispose());
    try {
        await command.execute(args);
        await command.dispose();
    } catch (e) {
        const definedError = e instanceof Error ? e : 'Unknown error occurred';
        logger.error(definedError);
        await command.dispose();
        process.exit(1);
    }
}
