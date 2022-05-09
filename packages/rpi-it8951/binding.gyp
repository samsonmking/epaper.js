{
    "targets": [
        {
            "target_name": "waveshareIT8951",
            "cflags!": [
                "-fno-exceptions",
                "-Wextra"
            ],
            "cflags_cc!": [ "-fno-exceptions" ],
            "sources": [ 
                "./src/c/EPD_IT8951_node.cc",
                "./src/c/DEV_Config.c",
                "./src/c/EPD_IT8951.c" 
            ],
            "defines": [
                "RPI",
                "USE_DEV_LIB",
                "NAPI_DISABLE_CPP_EXCEPTIONS"
            ],
            "include_dirs": [
                "<!@(node -p \"require('node-addon-api').include\")"
            ],
            "libraries": [
                "-lm",
                "-lrt",
                "-lpthread",
                "-lbcm2835"
            ]
        }
    ]
}
