# Manual Test Checklist

The automated tests (`npm test`) cover the pure logic — logger, IconScout type
detection, uuid recovery, cookie/token parsing. The actual per-site download
flows need a **logged-in browser** and are verified by hand using this list.

## Setup

1. `chrome://extensions` → **Developer mode** ON → **Load unpacked** → select the `src` folder.
2. Reload the extension (🔄) after any code change.
3. On the icon site, open the Console (`F12`) and run `Iconify.debug(true)`.
4. You must be **logged in** to each site with a valid (paid, where required) account.

For every case below, a pass means: the Console shows `SUCCESS <site> <action>`
**and** a file actually lands in your Downloads folder. A `FAILED …` line names
the reason.

## Flaticon — https://www.flaticon.com

| # | Steps | Expected |
|---|-------|----------|
| 1 | Open an icon → click the **SVG** button | `SUCCESS Flaticon SVG download`; `.svg` file downloaded |
| 2 | Open an icon → click **Copy SVG** | `SUCCESS Flaticon copy SVG`; SVG markup on clipboard |
| 3 | Log out, click **SVG** | Snackbar "Please login…"; no stuck spinner |

## IconScout — https://iconscout.com

| # | Steps | Expected |
|---|-------|----------|
| 4 | Open a normal **icon** → click **Download** | detection `iconType: "svg"`; `SUCCESS IconScout download (svg)` |
| 5 | Open a **Lottie animation** → click **Download** | detection `iconType: "lottie"`; `SUCCESS … (lottie)`; `.json` downloaded |
| 6 | Open a **3D** asset → click **Download** | detection `iconType: "3d"`; `SUCCESS … (3d-png)`; `.png` downloaded |
| 7 | Run `Iconify.diagnose()` | Report shows a non-empty `uuid` under `userIdCandidates` while logged in |

## Icons8 — https://icons8.com

| # | Steps | Expected |
|---|-------|----------|
| 8 | Open an icon → click **Iconify Download SVG** | `SUCCESS Icons8 SVG download`; `.svg` downloaded |
| 9 | Trigger a failing request (e.g. log out) | `FAILED Icons8 …`; button resets, no stuck spinner |

## FontAwesome — https://fontawesome.com

| # | Steps | Expected |
|---|-------|----------|
| 10 | Open an icon → click **Download SVG** | `SUCCESS FontAwesome SVG download`; `.svg` downloaded |
| 11 | On a FontAwesome page, click **Generate Premium Icon CDN Link** | CDN link copied; snackbar confirms |

## Regression: no stuck spinner (the original bug)

For **every** button above, if the request fails the button must return to its
normal label and show a snackbar — it must **never** stay on the loading
spinner. This is the core regression to watch on every release.
