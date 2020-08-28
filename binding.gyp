{
    "targets": [
        {
            "target_name": "waveshare4in2",
            "cflags!": [ "-fno-exceptions" ],
            "cflags_cc!": [ "-fno-exceptions" ],
            "sources": [ 
                "./c/EPD_4in2_node.cc",
                "./c/DEV_Config.c",
                "./c/EPD_4in2.c"
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
        },
        {
            "target_name": "waveshare7in5v2",
            "cflags!": [ "-fno-exceptions" ],
            "cflags_cc!": [ "-fno-exceptions" ],
            "sources": [ 
                "./c/EPD_7in5_V2_node.cc",
                "./c/DEV_Config.c",
                "./c/EPD_7in5_V2.c"
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
