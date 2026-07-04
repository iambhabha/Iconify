<h1 align = "center">
    📃CHANGELOG
</h1>

- Full Changelog can be found on the Website [here](https://kyutefox.com/changelog/iconify-browser-extension). 

### July 04, 2026 - 1.0.9 (Fix)
> - Fixes:

    - Fixed IconScout downloads not working after their site update ( Lottie / SVG / 3D )
    - Icon type is now detected from the product URL, so downloads keep working when IconScout changes page markup
    - User token (uuid) is now located automatically, fixing "missing uuid" download failures
    - Download buttons no longer get stuck on the loading spinner when a request fails
    - Added proper error handling on every site ( Flaticon, IconScout, Icons8, FontAwesome )

> - New:

    - Built-in diagnostics: run `Iconify.debug(true)` for detailed logs and `Iconify.diagnose()` to inspect the current page

### July 01, 2025 - 1.0.8 (Update)
> - Update:

    - Fixed Icons8 Not Downloading SVG [ both free and premium ]


### December 03, 2024 - 1.0.7 (Update)
> - Update:

    - Updated with new bypass method for IconScout
    - Fixed IconScout Not Downloading SVG [ both free and premium ]
    - Fixed 3D Icon Download in IconScout
    - Fixed IconScout Not Download Lottie [ both free and premium ]

### August 07, 2024 - 1.0.6 (Update)

> - Update:

    - Fixed 0 Byte in IconScout


### August 30, 2023 - 1.0.2 (Update)

> - New:

    - Download any icon as SVG ( Font Awesome )

> - New:

    - Generate Premium Font Awesome CDN and use icon directly

### August 09, 2023, 1.0.1 (Update & Fixes)

> - New:

    - Added Animated Lottie Download for (IconScout) in JSON.

    - Added Copy SVG button to copy code directly (FlatIcon).

> - Update:

    - Added Error Message for non-supported icons.

    - Improved performance in IconScout.

### April 13, 2023, 1.0.0 (Inconify - The Beggining)

> - New:

    - Added popup message for error.

    - Added animations to download button.

    - Added custom download button.

    - Added support for IconScout.

    - Added support for Icons8.

    - Added support for Microsoft Edge.

    - All new Iconify known as Flaticon Premium.

> - Update:

    - Updated to manifest version 3.0

    - Updated from server dependent to local.
