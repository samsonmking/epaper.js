# @epaperjs/rpi-12in48-b

Node bindings for [Waveshare 12.48" B display](<https://www.waveshare.com/12.48inch-e-paper.htm>)

## Supported Color Modes

`Black / White`
`Black / White / Red`


## Installation


### Install BCM2835

There is an infinite loop issue with the C driver supplied by Waveshare.  The only way I was able to get this
to work was to take advantage of their inclusion (and dependency upon) the [BCM2835](http://www.airspayce.com/mikem/bcm2835/).

```
cd ~                  
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.58.tar.gz
tar xvfz bcm2835-1.58.tar.gz
cd bcm2835-1.58
./configure
make
sudo make install
```

```
npm i -g @epaperjs/rpi-12in48-b
```

## License

MIT
