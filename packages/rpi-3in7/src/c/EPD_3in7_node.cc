#include "napi.h"
extern "C" {
    #include "DEV_Config.h"
    #include "EPD_3in7.h"
}

Napi::Number DEV_Init(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    uint8_t result = DEV_Module_Init();
    return Napi::Number::New(env, result);
}

Napi::Value Init(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    /*
    if previously used in 4gray mode a residual image remains after init/clear/display in 1 Gray mode. 
    This will init as 4gray and clear it before init as 1gray mode ensuring a clear screen when entering 1 gray mode.
    */
    EPD_3IN7_4Gray_Init();
    EPD_3IN7_4Gray_Clear();
    EPD_3IN7_1Gray_Init();
    return env.Undefined();
}

Napi::Value Init_4Gray(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    EPD_3IN7_4Gray_Init();
    return env.Undefined();
}

Napi::Value Display(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Napi::Buffer<uint8_t> jsBuffer = info[0].As<Napi::Buffer<uint8_t>>();
    EPD_3IN7_1Gray_Display(reinterpret_cast<uint8_t *>(jsBuffer.Data()));
    return env.Undefined();
}

Napi::Value Display_4Gray(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Napi::Buffer<uint8_t> jsBuffer = info[0].As<Napi::Buffer<uint8_t>>();
    EPD_3IN7_4Gray_Display(reinterpret_cast<uint8_t *>(jsBuffer.Data()));
    return env.Undefined();
}

Napi::Value Clear(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    EPD_3IN7_1Gray_Clear();
    return env.Undefined();
}

Napi::Value Clear_4Gray(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    EPD_3IN7_4Gray_Clear();
    return env.Undefined();
}

Napi::Value Sleep(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    EPD_3IN7_Sleep();
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
    exports.Set(Napi::String::New(env, "init_4Gray"),
                Napi::Function::New(env, Init_4Gray));
    exports.Set(Napi::String::New(env, "display"),
                Napi::Function::New(env, Display));
    exports.Set(Napi::String::New(env, "display_4Gray"),
                Napi::Function::New(env, Display_4Gray));
    exports.Set(Napi::String::New(env, "clear_4Gray"),
                Napi::Function::New(env, Clear_4Gray));
    exports.Set(Napi::String::New(env, "clear"),
                Napi::Function::New(env, Clear));
    exports.Set(Napi::String::New(env, "sleep"),
                Napi::Function::New(env, Sleep));
    exports.Set(Napi::String::New(env, "dev_exit"),
                Napi::Function::New(env, DEV_Exit));

    return exports;
}

NODE_API_MODULE(epaper, SetupNapi)
