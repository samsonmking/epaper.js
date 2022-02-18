# @epaperjs/cli

Command line interface for displaying a URL on an ePaper display on a Raspberry Pi

## Usage

```
ejs <command> [options] <deviceType>
```

For example, the following command will update the Waveshare 7.5" v2 screen with the contents of `http://localhost:8080` every 10 minutes.

```
ejs refresh rpi-7in5-v2 "http://localhost:8080"
```

For available devices types, see [supported hardware](#supported-hardware). The different [commands](#commands) and suggested [workflows](#workflows) are described below.

### Commands

**Display**: display a single rendition of a URL

```
ejs display [options] <deviceType> <url>
```

| Option               | Description                                                                                            | Allowed Values        |
| -------------------- | ------------------------------------------------------------------------------------------------------ | --------------------- |
| `-o / --orientation` | Use (h)orizontal or (v)ertical orientation                                                             | `[h, v]`              |
| `-c / --colorMode`   | Desired color mode                                                                                     | `[black, 4gray, red]` |
| `--screenshotDelay`  | Wait an additional amount of time after loading the URL before displaying. Useful for client side apps | Time in milliseconds  |
| `--dither`           | Use a dithering algorithm to approximate grayscale / mid-tones on black and white displays             |                       |
| `--username`         | Username for basic authentication                                                                      | username as string    |
| `--password`         | Password for basic authentication                                                                      | password as string    |
| `--debug`            | Print additional log info and stacktraces                                                              |                       |
| `--version`          | Show version number                                                                                    |                       |
| `--help`             | Show help                                                                                              |                       |

**Refresh**: continuously update and display the URL

```
ejs refresh [options] <deviceType> <url>
```

| Option               | Description                                                                                            | Allowed Values                   |
| -------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------- |
| `-i / --interval`    | Amount of time between refreshes                                                                       | Time in seconds (default 10 min) |
| `-o / --orientation` | Use (h)orizontal or (v)ertical orientation                                                             | `[h, v]`                         |
| `-c / --colorMode`   | Desired color mode                                                                                     | `[black, 4gray, red]`            |
| `--screenshotDelay`  | Wait an additional amount of time after loading the URL before displaying. Useful for client side apps | Time in milliseconds             |
| `--dither`           | Use a dithering algorithm to approximate grayscale / mid-tones on black and white displays             |                                  |
| `--username`         | Username for basic authentication                                                                      | username as string               |
| `--password`         | Password for basic authentication                                                                      | password as string               |
| `--debug`            | Print additional log info and stacktraces                                                              |                                  |
| `--version`          | Show version number                                                                                    |                                  |
| `--help`             | Show help                                                                                              |                                  |

**Clear**: clear the display

```
ejs clear [options] <deviceType>
```

| Option      | Description                               | Allowed Values |
| ----------- | ----------------------------------------- | -------------- |
| `--debug`   | Print additional log info and stacktraces |                |
| `--version` | Show version number                       |                |
| `--help`    | Show help                                 |                |

### Workflows

**Self-Hosting**

-   Create a web app and store it on your Raspberry Pi
-   Host the web app with [http-server](https://www.npmjs.com/package/http-server)
-   Run ePaper.js with `ejs refresh <deviceType> "http://localhost:8080" (or whatever port you configure http-server to run on)`

**Cloud Hosting**

-   Create a web app and host it on a service like [GitHub Pages](https://pages.github.com/) or [Netlify](https://www.netlify.com/)
-   Run ePaper.js with `ejs refresh <deviceType> "<URL of your app>"`

**Running As a Daemon** \
There are several methods of automatically launching ePaper.js on startup and restarting in case of failures

-   Run with [pm2](https://pm2.keymetrics.io/)
-   Create a [systemd service](https://blog.r0b.io/post/running-node-js-as-a-systemd-service/)

## Installation

```
npm i -g @epaperjs/cli
```
