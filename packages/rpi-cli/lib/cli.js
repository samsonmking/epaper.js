'use strict';

const factory = require('yargs/yargs');
const rpiCli = require('./rpi-cli');

module.exports = cli;

function cli(cwd) {
  const parser = factory(null, cwd);

  parser.alias('h', 'help');
  parser.alias('v', 'version');

  parser.usage(
    "$0",
    "Render a webpage onto an ePaper display on a RaspberryPi",
    yargs => {
      yargs.command('display <deviceType> <url>', 'render url onto display', (yargs) => {
      }, argv => rpiCli(argv.deviceType, argv.url))
    },
    argv => parser.showHelp()
  );


  return parser;
}
