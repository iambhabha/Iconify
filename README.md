# 👋 Welcome to Iconify

The Ultimate Browser Extension for **quality** SVG icons.

> [!Note]
> This is a **community-maintained continuation** of the original [Kyutefox/Iconify](https://github.com/Kyutefox/Iconify) project, which has not received updates for around a year. Full credit for the original extension goes to the original authors — see [Credits](#-credits). This fork keeps it working with the latest changes on the supported sites.

## 👍 Table of Contents

- 🚀 [Getting Started](#-getting-started)
- 🌏 [Supported Sites](#-supported-sites)
- 🛠️ [Installation](#️-installation)
    - [Chrome](#chrome-browser)
    - [Firefox](#firefox-browser)
    - [Microsoft Edge](#microsoft-edge)
    - [How to Use?](#how-to-use)
- ❗❗ [Troubleshoot](#-troubleshoot)
- 🔒 [Is it Safe?](#-is-it-safe)
- 📃 [Changelog](#-changelog)
- 🙌 [Credits](#-credits)

## 🚀 Getting Started

Iconify is a browser extension that lets you access and download high-quality SVG icons from **Flaticon, Icons8, FontAwesome and IconScout** — using your own logged-in account on each site.

This extension is supported on the following browsers:

| Chrome | Firefox | Microsoft Edge | Safari |
| :----: | :-----: | :------------: | :----: |
|   ✅   |   ✅    |       ✅       |   ❌   |

Whether you are a designer, developer, or just someone who appreciates good design, Iconify helps you grab icons in SVG (and Lottie / PNG where supported) quickly and cleanly.

## 🌏 Supported Sites

- [x] [Font Awesome](https://fontawesome.com/)
- [x] [Flaticon](https://flaticon.com)
- [x] [Icons8](https://icons8.com)
- [x] [IconScout](https://iconscout.com/)

Want more sites? Create an [Issue](https://github.com/Kyutefox/Iconify/issues) and let us know!

## 🛠️ Installation

> [!Caution]
> Before installing, uninstall any older "Flaticon Premium" version of this extension and clear your cache to prevent conflicts or unresponsiveness.

### Prerequisite

> [!Warning]
> You must be logged in to the respective icon site to download icons from that site.

### Chrome Browser

> [!Important]
> Install manually from the [GitHub Release Page](https://github.com/Kyutefox/Iconify/releases).

```
1. Extract the downloaded ZIP file to your local PC.
2. Go to chrome://extensions/ in the address bar.
3. Turn on Developer mode from the top-right corner.
4. Click "Load unpacked" on the top-left of the same window.
5. Locate the extracted folder and open it.
6. Enjoy!
```

### Firefox Browser

```
1. Open Firefox and go to the Firefox Add-ons store.
2. Install the add-on.
3. Go to Manage Extensions.
4. Click Iconify, then Permissions.
5. Turn on all the switches.
6. Enjoy!
```

### Microsoft Edge

```
1. Open Edge and go to the Edge Add-ons store.
2. Install the add-on.
3. Enjoy!
```

### How to use?

> [!Tip]
> Using Iconify is straightforward.

```
1. Go to a supported site (Flaticon, Icons8, FontAwesome or IconScout).
2. Log in with your account (create one if you don't have it).
3. Open the icon you want to download.
4. The extra download buttons added by Iconify will appear.
5. Click the SVG / Download button that is available.
6. Enjoy!
```

## ❗❗ Troubleshoot

> [!Important]
> If you face any error while using Iconify, try `CTRL + R` to hard reload once the page has loaded.

> [!Note]
> **v1.0.9 fixes the IconScout download issue** (Lottie / SVG / 3D) caused by IconScout's site update, and stops download buttons from getting stuck on the loading spinner. Make sure you are logged in to the icon site before downloading.

**Still not downloading? Debug it in seconds:**

1. Open the icon site and press `F12` to open the browser Console.
2. Run `Iconify.debug(true)` to turn on detailed logs.
3. Click Download once — the Console shows a `SUCCESS` line, or a `FAILED` line with the exact reason.
4. Run `Iconify.diagnose()` to print the current page details when reporting an issue.

## 🔒 Is it Safe?

Iconify does not track your browsing data or personal information. It works entirely on the page using **your own logged-in session** on the icon site: when you click a download button, it uses your account to request the icon from that site's server and saves the result as a downloadable SVG / Lottie / PNG file. It does nothing else in the background.

## 📃 Changelog

See the [CHANGELOG.md](./CHANGELOG.md) file for the full version history.

## 🙌 Credits

- Original project: **[Kyutefox/Iconify](https://github.com/Kyutefox/Iconify)** — all credit for the original extension goes to its authors.
- This repository is a maintained continuation that keeps the extension working with the latest site changes.

> Did this project help you? Leave a ⭐️ to show your support!
