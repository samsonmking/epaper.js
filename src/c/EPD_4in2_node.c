#include <node_api.h>
#include "EPD_4in2.h"

napi_value Init(napi_env env, napi_callback_info info);
napi_value Display(napi_env env, napi_callback_info info);

napi_value Init(napi_env env, napi_callback_info info) {
    EPD_4IN2_Init();
    return NULL;
}

napi_value NAPI_Init(napi_env env, napi_value exports) {
    napi_status status;
    napi_value fn;

    status = napi_create_function(env, NULL, 0, Init, NULL, &fn);
    if(status != napi_ok) {
        napi_throw_error(env, NULL, "Unable to populate exports");
    }
    status = napi_set_named_property(env, exports, "init", fn);
    if(status != napi_ok) {
        napi_throw_error(env, NULL, "Unable to populate exports");
    }
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, NAPI_Init)
