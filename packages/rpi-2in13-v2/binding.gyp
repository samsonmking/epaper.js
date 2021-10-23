{
    "targets": [
        {
            "target_name": "waveshare2in13v2",
            "cflags!": [ "-fno-exceptions" ],
            "cflags_cc!": [ "-fno-exceptions" ],
            "sources": [
                "./lib/c/EPD_2in13_V2_node.cc",
                "./lib/c/DEV_Config.c",
                "./lib/c/EPD_2in13_V2.c"
            ],
            "defines": [
                "RPI",
                "USE_WIRINGPI_LIB",
                "NAPI_DISABLE_CPP_EXCEPTIONS"
            ],
            "include_dirs": [
                "<!@(node -p \"require('node-addon-api').include\")"
            ],
            "libraries": [
                "-lwiringPi",
                "-lm"
            ]
        }
    ]
}
