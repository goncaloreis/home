# Evidence: company page, tablet headline and breakpoint fixes

Evidence only. This branch is not a site and is not for merge.

- Page commit measured: `1d644ab138ac357a0cb4de03b43ee3fe03b4d679` on `company-page-clean` (home PR #5).
- Built locally with the offer price unset, so no price appears in any file or screenshot here.
- Taken 26 Nov 2026 on a Mac mini with headless Chromium (Playwright).

## Late-font sweep (`sweep.csv`, `sweep.json`, `sweep-summary.json`)
Widths: every 16 px from 320 to 1920, plus 360, 375, 390, 393, 402, 412, 430, 744, 820, 834, 1024, 1280, 1366 and 1440, plus a dense tablet band every 4 px from 800 to 1000. 149 widths for each of two fallback sets, 298 rows.

Per row: late-font CLS (web fonts held 2.5 s), longest rendered line in characters with the web fonts loaded and with them blocked, and whether the page scrolls sideways in either case.

Fallback sets:
- `georgia-arial`: real Georgia and Arial installed on the test Mac, which is what Apple and Windows devices fall back to.
- `android`: no Georgia or Arial. The page's own font stacks are used with the generic serif and sans keywords pointed at Noto Serif and Roboto files. This emulates an Android phone; it is not a real Android device.

Results for this commit:
- Late-font CLS: at most 0.0024 in `georgia-arial` (320 px) and 0.0015 in `android` (800 to 852 px). No width reaches 0.01.
- Tablet band 768 to 1023 px (55 widths per set): at most 0.0015. The previous head `c5b5164` measured 0.0387 at 834 px and 0.0383 at 900 px in `georgia-arial`, and 0.0605 at 834 px in `android` (`before-sample-c5b5164.csv`, five widths).
- Phones 320 to 430 px: at most 0.0024 (`georgia-arial`) and 0 (`android`).
- Longest line with the web fonts: 71 characters. With fonts blocked: 71 (`georgia-arial`) and 75 (`android`, 560 to 704 px), the standard's limit.
- No sideways scroll at any width, fonts loaded or blocked.

## Other checks (`checks/`)
- `scanner.txt`: suite design scanner at suite `1b5f7cd`, 0 violations, 623 token parity checks.
- `privacy.txt`: privacy scan, 0 hits. `gitleaks.txt`: no leaks. `html-validate.txt`: HTML validation.
- `axe-links-lines.json`: axe (WCAG 2.0 to 2.2 A and AA, best practice) at 390 x 844 and 1440 x 900 in light and dark, 0 violations; every link resolves; late-font CLS and longest line at the stock widths.

## Screenshots (`screenshots/`)
Phone 390 x 844, tablet 834 x 1112 and laptop 1440 x 900, each in light, dark and grayscale, first screen and full page.
