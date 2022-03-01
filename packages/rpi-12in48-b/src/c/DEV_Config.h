/*****************************************************************************
* | File      	:   DEV_Config.h
* | Author      :   Waveshare team
* | Function    :   Hardware underlying interface
* | Info        :
*                Used to shield the underlying layers of each master
*                and enhance portability,software spi.
*----------------
* |	This version:   V1.0
* | Date        :   2018-11-29
* | Info        :

#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documnetation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to  whom the Software is
# furished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS OR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
#
******************************************************************************/
#ifndef _DEV_CONFIG_H_
#define _DEV_CONFIG_H_

#ifdef USE_BCM2835_LIB
    #include <bcm2835.h>
#elif USE_WIRINGPI_LIB
    #include <wiringPi.h>
#elif USE_DEV_LIB
    #include "RPI_sysfs_gpio.h"
#endif

#include <stdint.h>
#include <stdio.h>
#include <unistd.h>
#include <errno.h>
#include <string.h>
/**
 * data
**/
#define UBYTE   uint8_t
#define UWORD   uint16_t
#define UDOUBLE uint32_t

/**
 * GPIO config
**/
#define EPD_SCK_PIN  11
#define EPD_MOSI_PIN  10

#define EPD_M1_CS_PIN  8
#define EPD_S1_CS_PIN  7
#define EPD_M2_CS_PIN  17
#define EPD_S2_CS_PIN  18

#define EPD_M1S1_DC_PIN  13
#define EPD_M2S2_DC_PIN  22

#define EPD_M1S1_RST_PIN 6
#define EPD_M2S2_RST_PIN 23

#define EPD_M1_BUSY_PIN  5
#define EPD_S1_BUSY_PIN  19
#define EPD_M2_BUSY_PIN  27
#define EPD_S2_BUSY_PIN  24


/**
 * SPI communication mode
**/
typedef enum {
    Mode0,   /* Clock Polarity is 0 and Clock Phase is 0 */
    Mode1,   /* Clock Polarity is 0 and Clock Phase is 1 */
    Mode2,   /* Clock Polarity is 1 and Clock Phase is 0 */
    Mode3,   /* Clock Polarity is 1 and Clock Phase is 1 */
} SPIMode;

/**
 * Define SPI type
**/
typedef enum {
    Master,
    Slave,
} SPIType;

/**
 * Define SPI attribute
**/
typedef struct SPIStruct {
    UWORD SCLK_PIN;
    UWORD MOSI_PIN;
    UWORD MISO_PIN;
    UWORD CS_PIN;
    SPIMode Mode;
    SPIType Type;
    UWORD Clock;
} SOFTWARE_SPI;

/*------------------------------------------------------------------------------------------------------*/
void DEV_Digital_Write(UWORD Pin, UBYTE Value);
UBYTE DEV_Digital_Read(UWORD Pin);

void DEV_Delay_us(UWORD xus);
void DEV_Delay_ms(UDOUBLE xms);

void DEV_SPI_WriteByte(UBYTE value);
UBYTE DEV_SPI_ReadByte(UBYTE Reg);

UBYTE DEV_ModuleInit(void);
void DEV_ModuleExit(void);


#endif
