{
    "targets": [
        {
            "target_name": "waveshare12in48b",
            "cflags!": [
                "-fno-exceptions",
                "-Wextra"
            ],
            "cflags_cc!": [ "-fno-exceptions" ],
            "sources": [
                "./src/c/EPD_12in48b_node.cc",
                "./src/c/DEV_Config.c",
                "./src/c/EPD_12in48b.c",
                "./src/c/RPI_sysfs_gpio.c"
            ],
            "defines": [
                "RPI",
                "USE_BCM2835_LIB"
            ],
            "include_dirs": [
                "<!@(node -p \"require('node-addon-api').include\")"
            ],
            "libraries": [
                "-lbcm2835",
                "-lm"
            ]
        }
    ]
}
