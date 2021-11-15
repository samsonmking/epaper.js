import yargs from 'yargs/yargs';
import { DisplayCommand } from './commands';

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
                        choices: ['h', 'v'],
                        describe: 'desired orientation:\n(h)orizontal, (v)ertical',
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
                await displayCommand.display(args.deviceType, args.url, args.orientation);
            }
        )
        .demandCommand(1, 'No command specified - you must specify a command')
        .help().argv;
}

interface DisplayArgs {
    deviceType: string;
    url: string;
    orientation?: string;
    colorMode?: string;
}
