# NARA Apps Script — Staging deployment and acceptance gate

## Scope
- Approved spreadsheet: `1GYndjkQc9aBDp5meO__FVZ7Pt1Kw0BOpyd_vj-4gUBk`
- Approved calendar: `xsys.advisory@gmail.com`
- Existing handler: `nraSync`, one time trigger every five minutes.
- Rev 2 is REVIEW_ONLY. No calendar event creation, update, or deletion.
- Keep production website, production CRM, and legacy partner events untouched.

## Installation procedure (requires Google Apps Script editor)
1. Open the bound Apps Script project from the approved staging spreadsheet.
2. Save a backup copy of the current `Kode.gs` before any replacement.
3. Replace only the contents of `Kode.gs` with the reviewed `NARA_Kode_gs_Rev2.gs` artifact; do not paste both versions because duplicate `const NRA` and `nraSync` declarations will fail.
4. Save and run `nraSync` once. Inspect **Executions** and the console report.
5. Verify `mode=REVIEW_ONLY`, `calendarWrites=0`, and (while TRAINING is empty) `checked=0`.
6. Inspect **Triggers**; keep exactly one `nraSync` trigger. Do not create another if one exists.
7. Verify no rows were modified in TRAINING and no events created in the XSys calendar.

## Known schema
- TRAINING column N: `Terkonfirmasi` (not `Confirmed`).
- TRAINING column O: explicit trainer confirmation, currently checked against `Confirmed`; verify actual cell validation before live use.
- TRAINING column T: trainer NRA code.
- TRAINING column U: NRA activity identifier.
- TRAINING column V: sync status `PENDING_REVIEW` and other controlled values.
- TRAINING column W: calendar event ID.
- TRAINER column M: unique two-letter code; column N: `TERVERIFIKASI`.
- Only RA is currently verified. Do not infer or activate other codes.

## Approval gate for eventual event creation
Before any write-capable version, require human confirmation of organizer XSys, trainer competence and availability, date/time/timezone, travel buffers, resource/platform conflicts, company and program, multi-day slot model, and idempotency against existing event IDs. Parallel programs are permitted if trainer/PIC and resources differ. Do not count Traineed engagements as XSys commercial work.

## Current result
The Apps Script project has NOT been edited through the connector; deployment and Google execution remain unverified. This file is a runbook, not evidence of deployment.
