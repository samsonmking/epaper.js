#include "napi.h"
extern "C" {
#include "DEV_Config.h"
#include "EPD_4in2.h"
}
#include "iostream"
#include <chrono>
#include <thread>

class PromiseVoid : public Napi::AsyncWorker {
public:
  PromiseVoid(Napi::Env &env)
      : Napi::AsyncWorker(env), deferred(Napi::Promise::Deferred::New(env)) {}

  void OnOK() override { deferred.Resolve(Env().Undefined()); }

  void OnError(Napi::Error const &error) override {
    std::cout << "rejecting" << std::endl;
    deferred.Reject(error.Value());
  }

  Napi::Promise GetPromise() { return deferred.Promise(); }

private:
  Napi::Promise::Deferred deferred;
};

class PromiseNumber : public Napi::AsyncWorker {
public:
  PromiseNumber(Napi::Env &env)
      : Napi::AsyncWorker(env), result(Napi::Number::New(env, 0)),
        deferred(Napi::Promise::Deferred::New(env)) {}

  void OnOK() override { deferred.Resolve(result); }

  void OnError(Napi::Error const &error) override {
    deferred.Reject(error.Value());
  }

  Napi::Promise GetPromise() { return deferred.Promise(); }

protected:
  Napi::Number result;

private:
  Napi::Promise::Deferred deferred;
};

class AsyncDevInit : public PromiseNumber {
public:
  AsyncDevInit(Napi::Env &env) : PromiseNumber(env) {}
  void Execute() override {
    uint8_t initResult = DEV_Module_Init();
    result = Napi::Number::New(Env(), initResult);
  }
};

class AsyncEpdInit : public PromiseVoid {
public:
  AsyncEpdInit(Napi::Env &env) : PromiseVoid(env) {}
  void Execute() override { EPD_4IN2_Init(); }
};

class AsyncEpdInit4Gray : public PromiseVoid {
public:
  AsyncEpdInit4Gray(Napi::Env &env) : PromiseVoid(env) {}
  void Execute() override { EPD_4IN2_Init_4Gray(); }
};

class AsyncDisplay : public PromiseVoid {
public:
  AsyncDisplay(Napi::Env &env, uint8_t *buffer)
      : PromiseVoid(env), buffer(buffer) {}
  void Execute() override { EPD_4IN2_Display(buffer); }

private:
  uint8_t *buffer;
};

class AsyncDisplay4Gray : public PromiseVoid {
public:
  AsyncDisplay4Gray(Napi::Env &env, uint8_t *buffer)
      : PromiseVoid(env), buffer(buffer) {}
  void Execute() override {
    std::this_thread::sleep_for(std::chrono::seconds(60));
    EPD_4IN2_4GrayDisplay(buffer);
  }

private:
  uint8_t *buffer;
};

class AsyncClear : public PromiseVoid {
public:
  AsyncClear(Napi::Env &env) : PromiseVoid(env) {}
  void Execute() override { EPD_4IN2_Clear(); }
};

class AsyncSleep : public PromiseVoid {
public:
  AsyncSleep(Napi::Env &env) : PromiseVoid(env) {}
  void Execute() override {
    std::cout << "sleeping" << std::endl;
    EPD_4IN2_Sleep();
  }
};

class AsyncDevExit : public PromiseVoid {
public:
  AsyncDevExit(Napi::Env &env) : PromiseVoid(env) {}
  void Execute() override {
    std::cout << "exiting" << std::endl;
    DEV_Module_Exit();
  }
};

Napi::Promise DEV_Init(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  AsyncDevInit *devInit = new AsyncDevInit(env);
  devInit->Queue();
  return devInit->GetPromise();
}

Napi::Promise Init(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  AsyncEpdInit *epdInit = new AsyncEpdInit(env);
  epdInit->Queue();
  return epdInit->GetPromise();
};

Napi::Promise Init_4Gray(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  AsyncEpdInit4Gray *epdInit4Gray = new AsyncEpdInit4Gray(env);
  epdInit4Gray->Queue();
  return epdInit4Gray->GetPromise();
};

Napi::Promise Display(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  Napi::Buffer<uint8_t> jsBuffer = info[0].As<Napi::Buffer<uint8_t>>();
  AsyncDisplay *asyncDisplay =
      new AsyncDisplay(env, reinterpret_cast<uint8_t *>(jsBuffer.Data()));
  asyncDisplay->Queue();
  return asyncDisplay->GetPromise();
};

Napi::Promise Display_4GrayDisplay(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  Napi::Buffer<uint8_t> jsBuffer = info[0].As<Napi::Buffer<uint8_t>>();
  AsyncDisplay4Gray *asyncDisplay =
      new AsyncDisplay4Gray(env, reinterpret_cast<uint8_t *>(jsBuffer.Data()));
  asyncDisplay->Queue();
  return asyncDisplay->GetPromise();
};

Napi::Promise Clear(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  AsyncClear *asyncClear = new AsyncClear(env);
  asyncClear->Queue();
  return asyncClear->GetPromise();
};

Napi::Promise Sleep(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  AsyncSleep *asyncSleep = new AsyncSleep(env);
  asyncSleep->Queue();
  return asyncSleep->GetPromise();
};

// Napi::Value SyncSleep(const Napi::CallbackInfo &info) {
//   Napi::Env env = info.Env();
//   EPD_4IN2_Sleep();
//   return env.Undefined();
// };

Napi::Promise DEV_Exit(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  AsyncDevExit *asyncDevExit = new AsyncDevExit(env);
  asyncDevExit->Queue();
  return asyncDevExit->GetPromise();
};

Napi::Object SetupNapi(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "dev_init"),
              Napi::Function::New(env, DEV_Init));
  exports.Set(Napi::String::New(env, "init"), Napi::Function::New(env, Init));
  exports.Set(Napi::String::New(env, "init_4Gray"),
              Napi::Function::New(env, Init));
  exports.Set(Napi::String::New(env, "display"),
              Napi::Function::New(env, Display));
  exports.Set(Napi::String::New(env, "display_4GrayDisplay"),
              Napi::Function::New(env, Display_4GrayDisplay));
  exports.Set(Napi::String::New(env, "clear"), Napi::Function::New(env, Clear));
  exports.Set(Napi::String::New(env, "sleep"), Napi::Function::New(env, Sleep));
  exports.Set(Napi::String::New(env, "dev_exit"),
              Napi::Function::New(env, DEV_Exit));

  return exports;
}

NODE_API_MODULE(epaper, SetupNapi)
