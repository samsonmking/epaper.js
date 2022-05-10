#include "napi.h"
extern "C"
{
#include "DEV_Config.h"
#include "EPD_IT8951.h"
}

IT8951_Dev_Info Dev_Info;
UWORD Panel_Width;
UWORD Panel_Height;
UDOUBLE Init_Target_Memory_Addr;
bool Four_Byte_Align = false;

Napi::Number DEV_Init(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    uint8_t result = DEV_Module_Init();
    return Napi::Number::New(env, result);
}

Napi::Value Init(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    UWORD VCOM = 2000;
    Dev_Info = EPD_IT8951_Init(VCOM);
    char *LUT_Version = (char *)Dev_Info.LUT_Version;
    if (strcmp(LUT_Version, "M641") == 0)
    {
        // 6inch e-Paper HAT(800,600), 6inch HD e-Paper HAT(1448,1072), 6inch HD touch e-Paper HAT(1448,1072)
        A2_Mode = 4;
        Four_Byte_Align = true;
    }
    else if (strcmp(LUT_Version, "M841_TFAB512") == 0)
    {
        // Another firmware version for 6inch HD e-Paper HAT(1448,1072), 6inch HD touch e-Paper HAT(1448,1072)
        A2_Mode = 6;
        Four_Byte_Align = true;
    }
    else if (strcmp(LUT_Version, "M841") == 0)
    {
        // 9.7inch e-Paper HAT(1200,825)
        A2_Mode = 6;
    }
    else if (strcmp(LUT_Version, "M841_TFA2812") == 0)
    {
        // 7.8inch e-Paper HAT(1872,1404)
        A2_Mode = 6;
    }
    else if (strcmp(LUT_Version, "M841_TFA5210") == 0)
    {
        // 10.3inch e-Paper HAT(1872,1404)
        A2_Mode = 6;
    }
    else
    {
        // default set to 6 as A2 Mode
        A2_Mode = 6;
    }
    Panel_Width = Dev_Info.Panel_W;
    Panel_Height = Dev_Info.Panel_H;
    return env.Undefined();
}

Napi::Value Init_4Gray(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    return env.Undefined();
}

Napi::Value Display(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    Napi::Buffer<uint8_t> jsBuffer = info[0].As<Napi::Buffer<uint8_t>>();
    EPD_IT8951_1bp_Refresh(reinterpret_cast<uint8_t *>(jsBuffer.Data()), 0, 0, Panel_Width, Panel_Height, false, Init_Target_Memory_Addr, false);
    return env.Undefined();
}

Napi::Value Display_4GrayDisplay(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    Napi::Buffer<uint8_t> jsBuffer = info[0].As<Napi::Buffer<uint8_t>>();
    EPD_IT8951_2bp_Refresh(reinterpret_cast<uint8_t *>(jsBuffer.Data()), 0, 0, Panel_Width, Panel_Height, false, Init_Target_Memory_Addr, false);
    return env.Undefined();
}

Napi::Value Clear(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    EPD_IT8951_Init_Refresh(Dev_Info, Init_Target_Memory_Addr, A2_Mode);
    return env.Undefined();
}

Napi::Value Sleep(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    EPD_IT8951_Sleep();
    return env.Undefined();
}

Napi::Value DEV_Exit(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    DEV_Module_Exit();
    return env.Undefined();
}

Napi::Object SetupNapi(Napi::Env env, Napi::Object exports)
{
    exports.Set(Napi::String::New(env, "dev_init"),
                Napi::Function::New(env, DEV_Init));
    exports.Set(Napi::String::New(env, "init"),
                Napi::Function::New(env, Init));
    exports.Set(Napi::String::New(env, "init_4Gray"),
                Napi::Function::New(env, Init));
    exports.Set(Napi::String::New(env, "display"),
                Napi::Function::New(env, Display));
    exports.Set(Napi::String::New(env, "display_4GrayDisplay"),
                Napi::Function::New(env, Display_4GrayDisplay));
    exports.Set(Napi::String::New(env, "clear"),
                Napi::Function::New(env, Clear));
    exports.Set(Napi::String::New(env, "sleep"),
                Napi::Function::New(env, Sleep));
    exports.Set(Napi::String::New(env, "dev_exit"),
                Napi::Function::New(env, DEV_Exit));

    return exports;
}

NODE_API_MODULE(epaper, SetupNapi)
