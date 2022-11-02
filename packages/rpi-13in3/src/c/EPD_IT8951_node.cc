#include "napi.h"
extern "C" {
    #include "DEV_Config.h"
    #include "EPD_IT8951.h"
}

Napi::Number DEV_Init(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    uint8_t result = DEV_Module_Init();
    return Napi::Number::New(env, result);
}

Napi::Value Init(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    // TODO the 2300 should be a config variable
    IT8951_Dev_Info Dev_Info = EPD_IT8951_Init(2300);
    UDOUBLE Init_Target_Memory_Addr = Dev_Info.Memory_Addr_L | (Dev_Info.Memory_Addr_H << 16);

    return Napi::Number::New(env, Init_Target_Memory_Addr);
}

Napi::Value Display(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    Napi::Buffer<uint8_t> jsBuffer = info[0].As<Napi::Buffer<uint8_t>>();
    UDOUBLE Init_Target_Memory_Addr = info[0].ToNumber().DoubleValue();

    EPD_IT8951_8bp_Refresh(
        reinterpret_cast<uint8_t *>(jsBuffer.Data()),
        0,
        0,
        1200,
        1600,
        false,
        Init_Target_Memory_Addr
    );

    return env.Undefined();
}

Napi::Value Clear(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    //EPD_IT8951_Clear_Refresh(Dev_Info, Init_Target_Memory_Addr, INIT_Mode);
    return env.Undefined();
}

Napi::Value Sleep(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    EPD_IT8951_Sleep();
    return env.Undefined();
}

Napi::Value DEV_Exit(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    DEV_Module_Exit();
    return env.Undefined();
}

Napi::Object SetupNapi(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "dev_init"),
                Napi::Function::New(env, DEV_Init));
    exports.Set(Napi::String::New(env, "init"),
                Napi::Function::New(env, Init));
    exports.Set(Napi::String::New(env, "display"),
                Napi::Function::New(env, Display));
    exports.Set(Napi::String::New(env, "clear"),
                Napi::Function::New(env, Clear));
    exports.Set(Napi::String::New(env, "sleep"),
                Napi::Function::New(env, Sleep));
    exports.Set(Napi::String::New(env, "dev_exit"),
                Napi::Function::New(env, DEV_Exit));

    return exports;
}

NODE_API_MODULE(epaper, SetupNapi)
