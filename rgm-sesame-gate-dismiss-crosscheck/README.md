# RGM Sesame Gate – Dismiss Cross-Check

A Tampermonkey userscript that adds a confirmation step before dismissing an **“Equipment detected at the gate”** event in the configured YMS Sesame Gate Console page.

The goal is to reduce accidental dismissals when a vehicle may still be present at the gate. The script asks the operator to acknowledge a visual check before allowing the dismissal action to continue.

> **Important:** This is a client-side user aid. It does not independently detect vehicles, verify camera feeds, validate backend state, or guarantee that every dismissal path is intercepted. Follow all applicable operational procedures.

## Features

- Intercepts matching `Dismiss` button clicks within the equipment-detection panel.
- Displays a confirmation dialog with an operational warning.
- Requires the operator to check a visual-verification checkbox before confirming.
- Provides **Cancel** and **Confirm Dismiss** actions.
- Watches dynamically rendered page content using `MutationObserver`.
- Uses plain JavaScript and CSS; no external dependencies.

## Repository contents

```text
rgm-sesame-gate-dismiss-crosscheck/
├── .github/
│   └── ISSUE_TEMPLATE/
│       └── bug_report.md
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── SECURITY.md
└── rgm-sesame-gate-dismiss-crosscheck.user.js
```

## Requirements

- A supported browser such as Chrome or Microsoft Edge.
- A userscript manager such as [Tampermonkey](https://www.tampermonkey.net/).
- Authorized access to the target YMS console.
- Permission from the relevant organization to install and use custom browser scripts.

## Installation

1. Install Tampermonkey from its official website.
2. Open the Tampermonkey dashboard and choose **Create a new script**.
3. Open `rgm-sesame-gate-dismiss-crosscheck.user.js` from this repository.
4. Copy its contents into the userscript editor, replacing the starter template.
5. Save the script and ensure it is enabled.
6. Open the configured YMS Sesame Gate Console page.
7. In an approved test environment, verify the dialog appears for the intended panel and that Cancel leaves the event untouched.

The userscript is configured for this URL pattern:

```text
https://trans-logistics.amazon.com/yms/sesameGateConsole*
```

## How it works

1. Scans page buttons for the exact label `Dismiss`.
2. Checks whether the button is contained in a nearby element whose text includes `Equipment detected at the gate`.
3. Adds a capturing click handler to each matching button.
4. Intercepts the initial click and displays a confirmation modal.
5. Keeps **Confirm Dismiss** disabled until the checkbox is selected.
6. If the operator confirms, the modal closes and the script triggers the button click again, allowing that next click through.
7. A `MutationObserver` repeats the scan when the page DOM changes.

## Configuration

The main detection constants are near the top of the script:

| Constant | Purpose |
|---|---|
| `PANEL_MARKER_TEXT` | Text used to recognize the equipment panel. |
| `DISMISS_BUTTON_TEXT` | Exact button label to intercept. |
| `GUARD_FLAG` | Dataset key used to avoid attaching the guard twice to the same button. |

If the web application changes its wording or structure, these checks may need to be updated and retested.

## Manual test checklist

- [ ] The script is enabled on the configured URL.
- [ ] Clicking a matching `Dismiss` button opens the confirmation dialog.
- [ ] The confirmation button is disabled when the dialog first opens.
- [ ] Selecting the checkbox enables **Confirm Dismiss**.
- [ ] Selecting **Cancel** closes the dialog without intentionally triggering dismissal.
- [ ] Clicking outside the dialog closes it without confirming.
- [ ] A matching button added after page load is detected.
- [ ] A `Dismiss` button outside the target panel is not guarded.
- [ ] The script is tested after any YMS page update.

Use only an approved test environment and follow site procedures. Do not test by dismissing a real event where the vehicle status is uncertain.

## Known limitations

- Detection relies on exact button text and a text marker in nearby DOM content.
- The panel detection logic is heuristic and may match an unexpected ancestor if the page structure changes.
- The script does not inspect cameras, sensors, vehicle records, or backend APIs.
- Other controls, keyboard actions, alternate UI flows, or application changes may bypass this client-side guard.
- The script does not replace server-side validation or official operational safeguards.

## Troubleshooting

### The dialog does not appear
- Confirm that Tampermonkey and this script are enabled.
- Check that the current page matches the URL pattern in the userscript metadata.
- Verify that the button text and panel marker match the configured constants.
- Inspect the browser console for JavaScript errors.

### The dialog appears for the wrong button
- Review `isInEquipmentPanel()` and the page's current DOM structure.
- Adjust the detection logic only after testing against the actual page structure.

### It stops working after a page update
The console may have changed its markup, text, or click handling. Review the detection logic and retest in an approved environment before relying on the script.

## Security and privacy

The script does not intentionally send data to an external service and does not require additional userscript grants. It runs on the configured page and interacts with that page's DOM. Review the source code before installing it and follow your organization's rules for internal tools and code sharing.

Do not include confidential operational details, credentials, personal information, internal screenshots, or restricted source code in public issues.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for suggestions and testing expectations. Please confirm that you are authorized to share proposed changes before submitting them.

## License

See [LICENSE](LICENSE). Confirm that you have permission to publish and license this code before making the repository public.

## Disclaimer

This is an independently maintained userscript and is not an official Amazon product unless formally approved and maintained by Amazon. Use only where authorized and in accordance with applicable company policies.
