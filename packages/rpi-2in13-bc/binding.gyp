{
    "targets": [
        {
            "target_name": "waveshare2in13bc",
            "cflags!": [ "-fno-exceptions" ],
            "cflags_cc!": [ "-fno-exceptions" ],
            "sources": [
                "./src/c/EPD_2in13bc_node.cc",
                "./src/c/DEV_Config.c",
                "./src/c/EPD_2in13bc.c"
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
