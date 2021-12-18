{
    "targets": [
        {
            "target_name": "waveshare4in2",
            "cflags!": [ "-fno-exceptions" ],
            "cflags_cc!": [ "-fno-exceptions" ],
            "sources": [ 
                "./src/c/EPD_4in2_node.cc",
                "./src/c/DEV_Config.c",
                "./src/c/EPD_4in2.c",
                "./src/c/dev_hardware_SPI.c",
                "./src/c/RPI_sysfs_gpio.c"
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
                "-lm"
            ]
        }
    ]
}
