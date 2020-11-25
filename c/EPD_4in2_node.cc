#include "napi.h"
extern "C" {
    #include "DEV_Config.h"
    #include "EPD_4in2.h"
}

Napi::Number DEV_Init(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    uint8_t result = DEV_Module_Init();
    return Napi::Number::New(env, result);
}

Napi::Value Init(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    EPD_4IN2_Init();
    return env.Undefined();
}

Napi::Value Init_4Gray(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    EPD_4IN2_Init_4Gray();
    return env.Undefined();
}

Napi::Value Display(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Napi::Buffer<uint8_t> jsBuffer = info[0].As<Napi::Buffer<uint8_t>>();
    EPD_4IN2_Display(reinterpret_cast<uint8_t *>(jsBuffer.Data()));
    return env.Undefined();
}

Napi::Value Display_4GrayDisplay(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    Napi::Buffer<uint8_t> jsBuffer = info[0].As<Napi::Buffer<uint8_t>>();
    EPD_4IN2_4GrayDisplay(reinterpret_cast<uint8_t *>(jsBuffer.Data()));
    return env.Undefined();
}

Napi::Value Clear(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    EPD_4IN2_Clear();
    return env.Undefined();
}

Napi::Value Sleep(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    EPD_4IN2_Sleep();
    return env.Undefined();
}

Napi::Object SetupNapi(Napi::Env env, Napi::Object exports) {
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

    return exports;
}

NODE_API_MODULE(epaper, SetupNapi)
