#include "napi.h"
extern "C" {
    #include "DEV_Config.h"
    #include "EPD_2in7.h"
}

Napi::Number DEV_Init(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    uint8_t result = DEV_Module_Init();
    return Napi::Number::New(env, result);
}

Napi::Value Init(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    EPD_2IN7_Init();
    return env.Undefined();
}

Napi::Value Display(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Napi::Buffer<uint8_t> jsBuffer = info[0].As<Napi::Buffer<uint8_t>>();
    EPD_2IN7_Display(reinterpret_cast<uint8_t *>(jsBuffer.Data()));
    return env.Undefined();
}

Napi::Value Clear(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    EPD_2IN7_Clear();
    return env.Undefined();
}

Napi::Value Sleep(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    EPD_2IN7_Sleep();
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

    return exports;
}

NODE_API_MODULE(epaper, SetupNapi)
