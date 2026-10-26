# RGM Sesame Gate – Dismiss Cross-Check

A lightweight browser userscript that adds a mandatory confirmation step before dismissing an **“Equipment detected at the gate”** event in Amazon YMS Sesame Gate Console.

The purpose of this script is to help prevent accidental transaction closures when a vehicle may still be present at the gate.

## Overview

In gate operations, accidentally dismissing an equipment detection event without completing the appropriate check-in or check-out process can result in a transaction being closed without the expected record.

This userscript introduces a confirmation dialog when a user attempts to click **Dismiss** within the targeted equipment detection panel. The user must confirm that no vehicle is present before proceeding.

## Features

- **Mandatory confirmation:** Intercepts clicks on the `Dismiss` button within the targeted equipment detection panel.
- **Visual verification:** Requires the user to acknowledge that the gate has been checked using a camera or on-site observation.
- **Confirmation checkbox:** Keeps the confirmation button disabled until the checkbox is selected.
- **Cancel option:** Allows the user to cancel the dismissal and return to the page.
- **Dynamic content support:** Uses a `MutationObserver` to detect buttons added or updated dynamically.
- **Targeted protection:** Applies the confirmation flow only to matching `Dismiss` buttons inside the specified panel.
- **Lightweight implementation:** Uses native JavaScript and CSS without external libraries.

## How It Works

1. The script scans the page for buttons labeled `Dismiss`.
2. It identifies buttons associated with the **Equipment detected at the gate** panel.
3. When a matching button is clicked, the original click is intercepted.
4. A confirmation dialog appears with a warning and a verification checkbox.
5. The user must select the checkbox confirming that no vehicle is present.
6. Selecting **Confirm Dismiss** allows the original dismissal action to proceed.
7. Selecting **Cancel** closes the dialog without proceeding with the dismissal.

## Installation

### Prerequisites

- A Chromium-based browser, such as Google Chrome or Microsoft Edge.
- A userscript manager, such as Tampermonkey.
- Authorized access to the Amazon YMS Sesame Gate Console.

### Setup

1. Install Tampermonkey from its official website: https://www.tampermonkey.net/
2. Open the Tampermonkey dashboard.
3. Create a new userscript.
4. Replace the default editor content with the JavaScript code from this repository.
5. Save the script.
6. Open the supported YMS Sesame Gate Console page and verify that the userscript is enabled.

## Supported Page

The userscript is configured to run on:

`https://trans-logistics.amazon.com/yms/sesameGateConsole*`

The script uses the following userscript settings:

| Setting | Value |
|---|---|
| Name | RGM Sesame Gate - Dismiss Cross-Check |
| Version | 1.0.0 |
| Execution timing | `document-idle` |
| Permissions | No additional userscript grants |
| Dependencies | None |

## Configuration

The following constants control the script's behavior:

| Constant | Purpose |
|---|---|
| `PANEL_MARKER_TEXT` | Identifies the equipment detection panel. |
| `DISMISS_BUTTON_TEXT` | Defines the button text to intercept. |
| `GUARD_FLAG` | Prevents the same button from being guarded multiple times. |

These values can be updated if the relevant page text or implementation changes.

## Safety Considerations

This script adds a user confirmation step; it does not independently verify whether a vehicle is present.

- Always check the camera feed or physically verify the gate before confirming dismissal.
- Do not dismiss an event if a vehicle is present or its status is uncertain.
- Follow applicable site procedures for check-in, check-out, and exception handling.
- Test the script in an approved environment before using it in live operations.
- Page updates may change the panel structure or button labels and affect detection.

**Important:** This is a client-side safeguard, not a replacement for operational controls, backend validation, or official site procedures. It does not guarantee that every dismissal path is intercepted.

## Limitations

- The script depends on the panel text and button label matching the configured values.
- It is designed for the specified YMS console page.
- It does not validate vehicle presence through camera feeds, sensors, or backend APIs.
- Changes to the web application's event handling may affect compatibility.

## Troubleshooting

**The confirmation dialog does not appear**
- Confirm that the userscript is enabled in Tampermonkey.
- Check that you are using the supported YMS page.
- Verify that the panel contains the expected text and the button is labeled `Dismiss`.

**The script stops working after a page update**
- Inspect the updated panel text and button structure.
- Review the configured constants.
- Test the userscript again after updating its selectors or detection logic as needed.

**The confirmation dialog appears more than once**
- Check for duplicate copies of the userscript.
- Confirm that the script is not installed or enabled through multiple userscript managers.

## Technology Stack

- JavaScript (ES6+)
- DOM manipulation
- MutationObserver
- CSS
- Tampermonkey Userscript API metadata

## Version History

### v1.0.0
- Added a confirmation dialog before dismissing equipment detection events.
- Added a required visual verification checkbox.
- Added Confirm Dismiss and Cancel actions.
- Added dynamic DOM monitoring to handle newly rendered buttons.

## Disclaimer

This project is intended as an operational safety aid. Use it only in authorized environments and in accordance with applicable company policies. It is not an official Amazon product unless formally approved and maintained by Amazon.

## License

Choose a license before publishing this repository. If you want others to reuse and modify the code, consider the MIT License, subject to your organization's policies and approval requirements.
