/*****************************************************************************
* | File      	:	EPD_12in48b.c
* | Author      :   Waveshare team
* | Function    :   Electronic paper driver
* | Info	 :
*----------------
* |	This version:   V1.0
* | Date	 :   2018-11-29
* | Info	 :
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documnetation files(the "Software"), to deal
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
#include "EPD_12in48b.h"
#include "Debug.h"

static void EPD_Reset(void);
static void EPD_M1_SendCommand(UBYTE Reg);
static void EPD_M1_SendData(UBYTE Data);
static void EPD_S1_SendCommand(UBYTE Reg);
static void EPD_S1_SendData(UBYTE Data);
static void EPD_M2_SendCommand(UBYTE Reg);
static void EPD_M2_SendData(UBYTE Data);
static void EPD_S2_SendCommand(UBYTE Reg);
static void EPD_S2_SendData(UBYTE Data);
static void EPD_M1M2_SendCommand(UBYTE Reg);
static void EPD_M1M2_SendData(UBYTE Data);
static void EPD_M1S1M2S2_SendCommand(UBYTE Reg);
static void EPD_M1S1M2S2_SendData(UBYTE Data);
static void EPD_M1_ReadBusy(void);
static void EPD_M2_ReadBusy(void);
static void EPD_S1_ReadBusy(void);
static void EPD_S2_ReadBusy(void);
static void EPD_M1_ReadTemperature(void);
static void EPD_SetLut(void);

/******************************************************************************
function :	Initialize the e-Paper register
parameter:
******************************************************************************/
UBYTE EPD_12in48B_Init(void)
{
    DEV_Digital_Write(EPD_M1_CS_PIN, 1);
    DEV_Digital_Write(EPD_S1_CS_PIN, 1);
    DEV_Digital_Write(EPD_M2_CS_PIN, 1);
    DEV_Digital_Write(EPD_S2_CS_PIN, 1);

    EPD_Reset();

    //panel setting
    EPD_M1_SendCommand(0x00);
    EPD_M1_SendData(0x2f);	//KW-3f   KWR-2F	BWROTP 0f	BWOTP 1f
    EPD_S1_SendCommand(0x00);
    EPD_S1_SendData(0x2f);
    EPD_M2_SendCommand(0x00);
    EPD_M2_SendData(0x23);
    EPD_S2_SendCommand(0x00);
    EPD_S2_SendData(0x23);

    // POWER SETTING
    EPD_M1_SendCommand(0x01);
    EPD_M1_SendData(0x07);
    EPD_M1_SendData(0x17);	//VGH=20V,VGL=-20V
    EPD_M1_SendData(0x3F);	//VDH=15V
    EPD_M1_SendData(0x3F);  //VDL=-15V
    EPD_M1_SendData(0x0d);
    EPD_M2_SendCommand(0x01);
    EPD_M2_SendData(0x07);
    EPD_M2_SendData(0x17);	//VGH=20V,VGL=-20V
    EPD_M2_SendData(0x3F);	//VDH=15V
    EPD_M2_SendData(0x3F);  //VDL=-15V
    EPD_M2_SendData(0x0d);

    // booster soft start
    EPD_M1_SendCommand(0x06);
    EPD_M1_SendData(0x17);	//A
    EPD_M1_SendData(0x17);	//B
    EPD_M1_SendData(0x39);	//C
    EPD_M1_SendData(0x17);
    EPD_M2_SendCommand(0x06);
    EPD_M2_SendData(0x17);
    EPD_M2_SendData(0x17);
    EPD_M2_SendData(0x39);
    EPD_M2_SendData(0x17);

    //resolution setting
    EPD_M1_SendCommand(0x61);
    EPD_M1_SendData(0x02);
    EPD_M1_SendData(0x88);	//source 648
    EPD_M1_SendData(0x01);	//gate 492
    EPD_M1_SendData(0xEC);
    EPD_S1_SendCommand(0x61);
    EPD_S1_SendData(0x02);
    EPD_S1_SendData(0x90);	//source 656
    EPD_S1_SendData(0x01);	//gate 492
    EPD_S1_SendData(0xEC);
    EPD_M2_SendCommand(0x61);
    EPD_M2_SendData(0x02);
    EPD_M2_SendData(0x90);	//source 656
    EPD_M2_SendData(0x01);	//gate 492
    EPD_M2_SendData(0xEC);
    EPD_S2_SendCommand(0x61);
    EPD_S2_SendData(0x02);
    EPD_S2_SendData(0x88);	//source 648
    EPD_S2_SendData(0x01);	//gate 492
    EPD_S2_SendData(0xEC);

    EPD_M1S1M2S2_SendCommand(0x15);	//DUSPI
    EPD_M1S1M2S2_SendData(0x20);

    EPD_M1S1M2S2_SendCommand(0x30);	// PLL
    EPD_M1S1M2S2_SendData(0x08);

    EPD_M1S1M2S2_SendCommand(0x50);	//Vcom and data interval setting
    EPD_M1S1M2S2_SendData(0x31);
    EPD_M1S1M2S2_SendData(0x07);

    EPD_M1S1M2S2_SendCommand(0x60);//TCON
    EPD_M1S1M2S2_SendData(0x22);

    EPD_M1_SendCommand(0xE0);			//POWER SETTING
    EPD_M1_SendData(0x01);
    EPD_M2_SendCommand(0xE0);			//POWER SETTING
    EPD_M2_SendData(0x01);

    EPD_M1S1M2S2_SendCommand(0xE3);
    EPD_M1S1M2S2_SendData(0x00);

    EPD_M1_SendCommand(0x82);
    EPD_M1_SendData(0x1c);
    EPD_M2_SendCommand(0x82);
    EPD_M2_SendData(0x1c);

    EPD_SetLut();
    // EPD_M1_ReadTemperature();
    return 0;
}

/******************************************************************************
function :	Clear screen
parameter:
******************************************************************************/
void EPD_12in48B_Clear(void)
{
    UWORD y, x;

    // M1 part 648*492
    EPD_M1_SendCommand(0x10);
    for(y =  492; y < 984; y++) {
        for(x = 0; x < 81; x++) {
            EPD_M1_SendData(0xff);
        }
    }
    EPD_M1_SendCommand(0x13);
    for(y = 492; y < 984; y++) {
        for(x = 0; x < 81; x++) {
            EPD_M1_SendData(0x00);
        }
    }

    // S1 part 656*492
    EPD_S1_SendCommand(0x10);
    for(y = 492; y < 984; y++) {
        for(x = 81; x < 163; x++) {
            EPD_S1_SendData(0xff);
        }
    }
    EPD_S1_SendCommand(0x13);
    for(y = 492; y < 984; y++) {
        for(x = 81; x < 163; x++) {
            EPD_S1_SendData(0x00);
        }
    }

    // M2 part 656*492
    EPD_M2_SendCommand(0x10);
    for(y = 0; y < 492; y++) {
        for(x = 81; x < 163; x++) {
            EPD_M2_SendData(0xff);
        }
    }
    EPD_M2_SendCommand(0x13);
    for(y = 0; y < 492; y++) {
        for(x = 81; x < 163; x++) {
            EPD_M2_SendData(0x00);
        }
    }

    // S2 part 648*492
    EPD_S2_SendCommand(0x10);
    for(y = 0; y < 492; y++) {
        for(x = 0; x < 81; x++) {
            EPD_S2_SendData(0xff);
        }
    }
    EPD_S2_SendCommand(0x13);
    for(y = 0; y < 492; y++) {
        for(x = 0; x < 81; x++) {
            EPD_S2_SendData(0x00);
        }
    }

    // Turn On Display
    EPD_12in48B_TurnOnDisplay();
}

/******************************************************************************
function :	Sends the image buffer in RAM to e-Paper and displays
parameter:
******************************************************************************/
void EPD_12in48B_Display(const UBYTE *BlackImage, const UBYTE *RedImage)
{
    int x,y;
    //S1 part 648*492
    EPD_S2_SendCommand(0x10);
    for(y = 0; y < 492; y++)
        for(x = 0; x < 81; x++) {
            EPD_S2_SendData(*(BlackImage + (y*163 + x)));
        }
    EPD_S2_SendCommand(0x13);
    for(y = 0; y < 492; y++)
        for(x = 0; x < 81; x++) {
            EPD_S2_SendData(~*(RedImage + (y*163 + x)));
        }

    //M2 part 656*492
    EPD_M2_SendCommand(0x10);
    for(y = 0; y < 492; y++)
        for(x = 81; x < 163; x++) {
            EPD_M2_SendData(*(BlackImage+ (y*163) +x));
        }
    EPD_M2_SendCommand(0x13);
    for(y = 0; y < 492; y++)
        for(x = 81; x < 163; x++) {
            EPD_M2_SendData(~*(RedImage + (y*163 + x)));
        }

    //S1 part 656*492
    EPD_S1_SendCommand(0x10);
    for(y = 492; y < 984; y++)
        for(x = 81; x < 163; x++) {
            EPD_S1_SendData(*(BlackImage+ (y*163) +x));
        }
    EPD_S1_SendCommand(0x13);
    for(y = 492; y < 984; y++)
        for(x = 81; x < 163; x++) {
            EPD_S1_SendData(~*(RedImage + (y*163 + x)));
        }
        
    //M1 part 648*492
    EPD_M1_SendCommand(0x10);
    for(y = 492; y < 984; y++)
        for(x = 0; x < 81; x++) {
            EPD_M1_SendData(*(BlackImage+ (y*163) +x));
        }
    EPD_M1_SendCommand(0x13);
    for(y = 492; y < 984; y++)
        for(x = 0; x < 81; x++) {
            EPD_M1_SendData(~*(RedImage + (y*163 + x)));
        }

    EPD_12in48B_TurnOnDisplay();
}

/******************************************************************************
function :	Turn On Display
parameter:
******************************************************************************/
void EPD_12in48B_TurnOnDisplay(void)
{
    EPD_M1M2_SendCommand(0x04); //power on
    DEV_Delay_ms(300);
    EPD_M1S1M2S2_SendCommand(0x12); //Display Refresh

    // printf("M1 S1 M2 S2 \r\n");
    EPD_M1_ReadBusy();
    EPD_S1_ReadBusy();
    EPD_M2_ReadBusy();
    EPD_S2_ReadBusy();
}

/******************************************************************************
function :	Enter sleep mode
parameter:
******************************************************************************/
void EPD_12in48B_Sleep(void)
{
    EPD_M1S1M2S2_SendCommand(0X02);  	//power off
    DEV_Delay_ms(300);

    EPD_M1S1M2S2_SendCommand(0X07);  	//deep sleep
    EPD_M1S1M2S2_SendData(0xA5);
    DEV_Delay_ms(300);
   
}

/******************************************************************************
function :	Software reset
parameter:
******************************************************************************/
static void EPD_Reset(void)
{
	DEV_Digital_Write(EPD_M1S1_RST_PIN, 1);
    DEV_Digital_Write(EPD_M2S2_RST_PIN, 1);
    DEV_Delay_ms(200);
    DEV_Digital_Write(EPD_M1S1_RST_PIN, 0);
    DEV_Digital_Write(EPD_M2S2_RST_PIN, 0);
    DEV_Delay_ms(10);
    DEV_Digital_Write(EPD_M1S1_RST_PIN, 1);
    DEV_Digital_Write(EPD_M2S2_RST_PIN, 1);
    DEV_Delay_ms(200);
}

/******************************************************************************
function :	send command and data(M1\M2\S1\S2\M1S1\M1S1M2S2)
parameter:
    Reg : Command register
or:
    Data : Write data
******************************************************************************/
static void EPD_M1_SendCommand(UBYTE Reg)
{
    DEV_Digital_Write(EPD_M1S1_DC_PIN, 0);
    DEV_Digital_Write(EPD_M1_CS_PIN, 0);
    DEV_SPI_WriteByte(Reg);
    DEV_Digital_Write(EPD_M1_CS_PIN, 1);
}
static void EPD_M1_SendData(UBYTE Data)
{
    DEV_Digital_Write(EPD_M1S1_DC_PIN, 1);
    DEV_Digital_Write(EPD_M1_CS_PIN, 0);
    DEV_SPI_WriteByte(Data);
    DEV_Digital_Write(EPD_M1_CS_PIN, 1);
}

static void EPD_S1_SendCommand(UBYTE Reg)
{
    DEV_Digital_Write(EPD_M1S1_DC_PIN, 0);
    DEV_Digital_Write(EPD_S1_CS_PIN, 0);
    DEV_SPI_WriteByte(Reg);
    DEV_Digital_Write(EPD_S1_CS_PIN, 1);
}
static void EPD_S1_SendData(UBYTE Data)
{
    DEV_Digital_Write(EPD_M1S1_DC_PIN, 1);
    DEV_Digital_Write(EPD_S1_CS_PIN, 0);
    DEV_SPI_WriteByte(Data);
    DEV_Digital_Write(EPD_S1_CS_PIN, 1);
}

static void EPD_M2_SendCommand(UBYTE Reg)
{
    DEV_Digital_Write(EPD_M2S2_DC_PIN, 0);
    DEV_Digital_Write(EPD_M2_CS_PIN, 0);
    DEV_SPI_WriteByte(Reg);
    DEV_Digital_Write(EPD_M2_CS_PIN, 1);
}
static void EPD_M2_SendData(UBYTE Data)
{
    DEV_Digital_Write(EPD_M2S2_DC_PIN, 1);
    DEV_Digital_Write(EPD_M2_CS_PIN, 0);
    DEV_SPI_WriteByte(Data);
    DEV_Digital_Write(EPD_M2_CS_PIN, 1);
}

static void EPD_S2_SendCommand(UBYTE Reg)
{
    DEV_Digital_Write(EPD_M2S2_DC_PIN, 0);
    DEV_Digital_Write(EPD_S2_CS_PIN, 0);
    DEV_SPI_WriteByte(Reg);
    DEV_Digital_Write(EPD_S2_CS_PIN, 1);
}
static void EPD_S2_SendData(UBYTE Data)
{
    DEV_Digital_Write(EPD_M2S2_DC_PIN, 1);
    DEV_Digital_Write(EPD_S2_CS_PIN, 0);
    DEV_SPI_WriteByte(Data);
    DEV_Digital_Write(EPD_S2_CS_PIN, 1);
}

static void EPD_M1M2_SendCommand(UBYTE Reg)
{
    DEV_Digital_Write(EPD_M1S1_DC_PIN, 0);
    DEV_Digital_Write(EPD_M2S2_DC_PIN, 0);
    DEV_Digital_Write(EPD_M1_CS_PIN, 0);
    DEV_Digital_Write(EPD_M2_CS_PIN, 0);
    DEV_SPI_WriteByte(Reg);
    DEV_Digital_Write(EPD_M1_CS_PIN, 1);
    DEV_Digital_Write(EPD_M2_CS_PIN, 1);
}
static void EPD_M1M2_SendData(UBYTE Data)
{
    DEV_Digital_Write(EPD_M1S1_DC_PIN, 1);
    DEV_Digital_Write(EPD_M2S2_DC_PIN, 1);
    DEV_Digital_Write(EPD_M1_CS_PIN, 0);
    DEV_Digital_Write(EPD_M2_CS_PIN, 0);
    DEV_SPI_WriteByte(Data);
    DEV_Digital_Write(EPD_M1_CS_PIN, 1);
    DEV_Digital_Write(EPD_M2_CS_PIN, 1);
}

static void EPD_M1S1M2S2_SendCommand(UBYTE Reg)
{
    DEV_Digital_Write(EPD_M1S1_DC_PIN, 0);	// command write
    DEV_Digital_Write(EPD_M2S2_DC_PIN, 0);  // command write

    DEV_Digital_Write(EPD_M1_CS_PIN, 0);
    DEV_Digital_Write(EPD_S1_CS_PIN, 0);
    DEV_Digital_Write(EPD_M2_CS_PIN, 0);
    DEV_Digital_Write(EPD_S2_CS_PIN, 0);
    DEV_SPI_WriteByte(Reg);
    DEV_Digital_Write(EPD_M1_CS_PIN, 1);
    DEV_Digital_Write(EPD_S1_CS_PIN, 1);
    DEV_Digital_Write(EPD_M2_CS_PIN, 1);
    DEV_Digital_Write(EPD_S2_CS_PIN, 1);
}
static void EPD_M1S1M2S2_SendData(UBYTE Data)
{
    DEV_Digital_Write(EPD_M1S1_DC_PIN, 1);	// command write
    DEV_Digital_Write(EPD_M2S2_DC_PIN, 1);  // command write

    DEV_Digital_Write(EPD_M1_CS_PIN, 0);
    DEV_Digital_Write(EPD_S1_CS_PIN, 0);
    DEV_Digital_Write(EPD_M2_CS_PIN, 0);
    DEV_Digital_Write(EPD_S2_CS_PIN, 0);
    DEV_SPI_WriteByte(Data);
    DEV_Digital_Write(EPD_M1_CS_PIN, 1);
    DEV_Digital_Write(EPD_S1_CS_PIN, 1);
    DEV_Digital_Write(EPD_M2_CS_PIN, 1);
    DEV_Digital_Write(EPD_S2_CS_PIN, 1);
}

/******************************************************************************
function :	Wait until the busy_pin goes LOW(M1\M2\S1\S2)
parameter:
******************************************************************************/
static void EPD_M1_ReadBusy(void)
{
    UBYTE busy;
    do {
        EPD_M1_SendCommand(0x71);
        busy = DEV_Digital_Read(EPD_M1_BUSY_PIN);
        busy =!(busy & 0x01);
    } while(0);
    Debug("M1 Busy free\r\n");
    DEV_Delay_ms(200);
    
}
static void EPD_M2_ReadBusy(void)
{
    UBYTE busy;
    do {
        EPD_M2_SendCommand(0x71);
        busy = DEV_Digital_Read(EPD_M2_BUSY_PIN);
        busy =!(busy & 0x01);
    } while(busy);
    Debug("M2 Busy free\r\n");
    DEV_Delay_ms(200);
}
static void EPD_S1_ReadBusy(void)
{
    UBYTE busy;
    do {
        EPD_S1_SendCommand(0x71);
        busy = DEV_Digital_Read(EPD_S1_BUSY_PIN);
        busy =!(busy & 0x01);
    } while(busy);
    Debug("S1 Busy free\r\n");
    DEV_Delay_ms(200);
}
static void EPD_S2_ReadBusy(void)
{
    UBYTE busy;
    do {
        EPD_S2_SendCommand(0x71);
        busy = DEV_Digital_Read(EPD_S2_BUSY_PIN);
        busy =!(busy & 0x01);
    } while(busy);
    Debug("S2 Busy free\r\n");
    DEV_Delay_ms(200);
}

/******************************************************************************
function :	ReadTemperature
parameter:
******************************************************************************/
static void EPD_M1_ReadTemperature(void)
{
    EPD_M1_SendCommand(0x40);
    EPD_M1_ReadBusy();
    DEV_Delay_ms(300);

    DEV_Digital_Write(EPD_M1_CS_PIN, 0);
    DEV_Digital_Write(EPD_S1_CS_PIN, 1);
    DEV_Digital_Write(EPD_M2_CS_PIN, 1);
    DEV_Digital_Write(EPD_S2_CS_PIN, 1);

    DEV_Digital_Write(EPD_M1S1_DC_PIN, 1);
    DEV_Delay_us(5);

    UBYTE temp;
    temp = DEV_SPI_ReadByte(0x00);
    DEV_Digital_Write(EPD_M1_CS_PIN, 1);
    printf("Read Temperature Reg:%d\r\n", temp);

    EPD_M1S1M2S2_SendCommand(0xe0);//Cascade setting
    EPD_M1S1M2S2_SendData(0x03);
    EPD_M1S1M2S2_SendCommand(0xe5);//Force temperature
    EPD_M1S1M2S2_SendData(temp);

}

static unsigned char lut_vcom1[] = {
    0x00,	0x10,	0x10,	0x01,	0x08,	0x01,
    0x00,	0x06,	0x01,	0x06,	0x01,	0x05,
    0x00,	0x08,	0x01,	0x08,	0x01,	0x06,
    0x00,	0x06,	0x01,	0x06,	0x01,	0x05,
    0x00,	0x05,	0x01,	0x1E,	0x0F,	0x06,
    0x00,	0x05,	0x01,	0x1E,	0x0F,	0x01,
    0x00,	0x04,	0x05,	0x08,	0x08,	0x01,
    0x00,	0x00,	0x00,	0x00,	0x00,	0x00,
    0x00,	0x00,	0x00,	0x00,	0x00,	0x00,
    0x00,	0x00,	0x00,	0x00,	0x00,	0x00,
};
static unsigned char lut_ww1[] = {
    0x91,	0x10,	0x10,	0x01,	0x08,	0x01,
    0x04,	0x06,	0x01,	0x06,	0x01,	0x05,
    0x84,	0x08,	0x01,	0x08,	0x01,	0x06,
    0x80,	0x06,	0x01,	0x06,	0x01,	0x05,
    0x00,	0x05,	0x01,	0x1E,	0x0F,	0x06,
    0x00,	0x05,	0x01,	0x1E,	0x0F,	0x01,
    0x08,	0x04,	0x05,	0x08,	0x08,	0x01,
    0x00,	0x00,	0x00,	0x00,	0x00,	0x00,
    0x00,	0x00,	0x00,	0x00,	0x00,	0x00,
    0x00,	0x00,	0x00,	0x00,	0x00,	0x00,
};
static unsigned char lut_bw1[] = {
    0xA8,	0x10,	0x10,	0x01,	0x08,	0x01,
    0x84,	0x06,	0x01,	0x06,	0x01,	0x05,
    0x84,	0x08,	0x01,	0x08,	0x01,	0x06,
    0x86,	0x06,	0x01,	0x06,	0x01,	0x05,
    0x8C,	0x05,	0x01,	0x1E,	0x0F,	0x06,
    0x8C,	0x05,	0x01,	0x1E,	0x0F,	0x01,
    0xF0,	0x04,	0x05,	0x08,	0x08,	0x01,
    0x00,	0x00,	0x00,	0x00,	0x00,	0x00,
    0x00,	0x00,	0x00,	0x00,	0x00,	0x00,
    0x00,	0x00,	0x00,	0x00,	0x00,	0x00,
};
static unsigned char lut_wb1[] = {
    0x91,	0x10,	0x10,	0x01,	0x08,	0x01,
    0x04,	0x06,	0x01,	0x06,	0x01,	0x05,
    0x84,	0x08,	0x01,	0x08,	0x01,	0x06,
    0x80,	0x06,	0x01,	0x06,	0x01,	0x05,
    0x00,	0x05,	0x01,	0x1E,	0x0F,	0x06,
    0x00,	0x05,	0x01,	0x1E,	0x0F,	0x01,
    0x08,	0x04,	0x05,	0x08,	0x08,	0x01,
    0x00,	0x00,	0x00,	0x00,	0x00,	0x00,
    0x00,	0x00,	0x00,	0x00,	0x00,	0x00,
    0x00,	0x00,	0x00,	0x00,	0x00,	0x00,
};
static unsigned char lut_bb1[] = {
    0x92,	0x10,	0x10,	0x01,	0x08,	0x01,
    0x80,	0x06,	0x01,	0x06,	0x01,	0x05,
    0x84,	0x08,	0x01,	0x08,	0x01,	0x06,
    0x04,	0x06,	0x01,	0x06,	0x01,	0x05,
    0x00,	0x05,	0x01,	0x1E,	0x0F,	0x06,
    0x00,	0x05,	0x01,	0x1E,	0x0F,	0x01,
    0x01,	0x04,	0x05,	0x08,	0x08,	0x01,
    0x00,	0x00,	0x00,	0x00,	0x00,	0x00,
    0x00,	0x00,	0x00,	0x00,	0x00,	0x00,
    0x00,	0x00,	0x00,	0x00,	0x00,	0x00,
};

/******************************************************************************
function :	ReadTemperature
parameter:
******************************************************************************/
static void EPD_SetLut(void)
{
    UWORD count;

    EPD_M1S1M2S2_SendCommand(0x20);							//vcom
    for(count=0; count<60; count++) {
        EPD_M1S1M2S2_SendData(lut_vcom1[count]);
    }

    EPD_M1S1M2S2_SendCommand(0x21);							//red not use
    for(count=0; count<60; count++) {
        EPD_M1S1M2S2_SendData(lut_ww1[count]);
    }

    EPD_M1S1M2S2_SendCommand(0x22);							//bw r
    for(count=0; count<60; count++) {
        EPD_M1S1M2S2_SendData(lut_bw1[count]);   // bw=r
    }

    EPD_M1S1M2S2_SendCommand(0x23);							//wb w
    for(count=0; count<60; count++) {
        EPD_M1S1M2S2_SendData(lut_wb1[count]);   // wb=w
    }

    EPD_M1S1M2S2_SendCommand(0x24);							//bb b
    for(count=0; count<60; count++) {
        EPD_M1S1M2S2_SendData(lut_bb1[count]);   // bb=b
    }

    EPD_M1S1M2S2_SendCommand(0x25);							//bb b
    for(count=0; count<60; count++) {
        EPD_M1S1M2S2_SendData(lut_ww1[count]);   // bb=b
    }
}
