# Contributing

Thank you for considering a contribution.

## Before contributing

- Confirm that you are authorized to share and modify this code.
- Do not include credentials, internal identifiers, personal data, confidential screenshots, or restricted operational details.
- Keep changes focused and explain the operational problem they address.

## Suggested workflow

1. Create a branch for your change.
2. Make a focused update.
3. Test in an approved non-production or otherwise authorized environment.
4. Confirm that the guard only affects the intended panel.
5. Update the README if behavior, setup, or limitations change.
6. Submit a pull request with a clear summary and test notes.

## Testing checklist

- Confirm the dialog appears for the intended `Dismiss` button.
- Confirm Cancel does not intentionally proceed with dismissal.
- Confirm the checkbox is required to enable confirmation.
- Confirm unrelated buttons are unaffected.
- Confirm dynamically rendered matching buttons are handled.
- Retest after changes to page structure or button labels.

Do not test against a live operational event unless you are authorized and following site procedures.
