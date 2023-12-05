{
    "targets": [
        {
            "target_name": "waveshare3in52",
            "cflags!": [
                "-fno-exceptions",
                "-Wextra"
            ],
            "cflags_cc!": [ "-fno-exceptions" ],
            "sources": [ 
                "./src/c/EPD_3in52_node.cc",
                "./src/c/DEV_Config.c",
                "./src/c/EPD_3in52.c",
                "./src/c/dev_hardware_SPI.c",
                "./src/c/RPI_gpiod.c",
                "./src/c/RPI_sysfs_gpio.c"
            ],
            "defines": [
                "RPI",
                "USE_DEV_LIB"
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
