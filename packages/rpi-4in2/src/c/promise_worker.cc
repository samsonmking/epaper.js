#include "napi.h"

class PromiseWorker : public Napi:AsyncWorker {
public:
    PromiseWorker(Napi::Env &env, Napi::Promise::Deferred &deferred)
        : Napi::AsyncWorker(env), deferred(deferred) {}
    void Execute(std::function<void()>) {

    }

    void OnOk() {
        deferred.Resolve(Napi::Env::Undefined())
    }
    
    void OnError(Napi::Error const &error) {
        deferred.Reject(error.Value());
    }
private:
    Napi::Promise::Deferred &deferred;
}