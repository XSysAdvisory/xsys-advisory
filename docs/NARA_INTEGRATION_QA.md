# NARA — Integration Contract & QA Gate (2026-11-08)

## Ground truth
- Official account: xsys.advisory@gmail.com only.
- Existing CRM: XSys_CRM_Operasional_Admin_v0.1.xlsx, Drive ID 19T9GXihaSwZHIlol1tV1qCr2RXbJFv36. This is an Excel workbook stored in Drive, NOT a native Google Sheet; it is a template with no imported live transactions. Preserve original.
- Existing calendar: xsys.advisory@gmail.com. Nov 12–13 ISO 37001 Online and Nov 14–15 ISO 14001 Online are **TRAINEED INDONESIA activities, NOT XSys•Advisory projects**. They are planning events, not confirmed trainer reservations. Exclude both from XSys sales pipeline, turnover, delivery KPIs and client portfolio. Only consider trainer/person availability when independently verified.

## Mapping lead intake -> CRM (staging only until authenticated write integration)
| Web lead | CRM LEAD & PERTANYAAN | Rule |
|---|---|---|
| reference UUID | Lead ID | Retain UUID as external ID; generate LEAD-YYYY-#### only with atomic allocation |
| created_at | Tanggal Terima | Convert UTC to Asia/Jakarta |
| company | Nama Klien | No invented company |
| name | PIC Klien | Required |
| contact | Email/WA | Consent required |
| service | Kategori Kebutuhan | Controlled mapping |
| details | Topik / Catatan | Human review for scope and dates |
| New | Status Lead | Never auto-mark Won |

Do not write to the existing workbook until native Sheets conversion/copy, schema validation, permissions, duplicate policy, and idempotent write are proven. The Netlify lead store and Drive workbook are **not yet synchronized**.

## Calendar and trainer matching
- Read calendar in Asia/Jakarta, include transparent/tentative events but mark planning distinctly from confirmed assignments.
- Never use calendar free/busy alone as proof a trainer is available. Maintain per-trainer verified availability, skills, assignments, travel buffers and online-platform resources.
- Same-date parallel programs are permitted with distinct qualified available PICs and sufficient resources; conflicts are person/resource-specific.
- Require human approval before writing confirmed calendar events or issuing commercial commitments.
- Training directory columns: Trainer ID, Nama, Spesialisasi, Email, WhatsApp, Domisili, Ketersediaan, Kontrak/NDA, Profil/Bio, Rate Referensi, Status, Catatan.

## Integration architecture (NOT yet active)
1. Visitor submits opt-in lead to Netlify backend.
2. Backend stores isolated preview/production record.
3. Secure server-side job, using dedicated Google OAuth credentials and scoped permissions, syncs to a NEW native Google Sheet after schema/idempotency checks; never expose OAuth tokens in browser.
4. Read-only calendar availability and verified trainer directory feed lead qualification; write confirmed calendar events only after human approval.
5. Notify sales only after successful durable write, with retry/dead-letter and audit log.

## QA gate
- [x] GitHub branch and preview deploy exist.
- [x] Existing CRM workbook located; headers reviewed.
- [x] Official calendar found; planning events identified.
- [ ] Verify runtime lead POST returns 201 and record persists; use fictional test record and delete after.
- [ ] Verify CRM GET returns 401 without token and authorized reads with secret token.
- [ ] Configure admin token; prior Netlify env write returned 403.
- [ ] Create native Sheet staging copy, verify schema and permissions.
- [ ] Implement and test authenticated idempotent sync.
- [ ] Implement and test trainer/resource-aware availability.
- [ ] Verify existing website pages/functions remain unchanged.
- [ ] OpenAI API funded and end-to-end chat tested.
- [ ] Owner authorizes production rollout after tests.

Do not claim production readiness until all applicable gates pass.

## Mandatory organizer separation — Traineed vs XSys
- Classify each activity by contracting organizer/client ownership, NOT by trainer identity or mere calendar presence.
- `organizer_owner`: `XSYS`, `TRAINEED`, `OTHER`, `UNVERIFIED`; `commercial_owner`: separately verified; `trainer_engagement`: external/partner/internal; `calendar_visibility`: availability_only or operational.
- Traineed activities can block a trainer's actual availability, but must NOT create XSys leads, quotations, invoices, revenue, sales KPIs or customer ownership without documented XSys commercial role.
- Existing calendar items with ambiguous organizer remain `UNVERIFIED`; do not reclassify by guesswork or edit events without review.
- Exclude `TRAINEED` from XSys sales dashboards and automated follow-ups; maintain partner engagement as separate reporting category.
- Require explicit owner/contract evidence before promoting a partner engagement to XSys commercial pipeline.

## Organizer separation — owner correction
- Traineed Indonesia: ISO 37001 Online 12–13 Nov 2026; ISO 14001 Online 14–15 Nov 2026.
- The presence of an event on XSys Calendar does not imply XSys owns or organizes it.
- Add `organizer_legal_entity`, `commercial_owner`, `trainer_assignment`, and `resource_conflict` as distinct fields. Never infer commercial ownership from calendar account.

## Owner-verified XSys operational baseline — 2026-11-08
- Owner explicitly confirms **zero XSys•Advisory activities** planned, confirmed, underway, or completed to date.
- Do not count Traineed Indonesia training or other external organizer engagements as XSys projects, delivery, revenue, or portfolio.
- XSys project schedule, confirmed projects, and completed-delivery metrics begin at zero until supported by owner-verified evidence.
- This does not imply zero sales prospects, marketing activities, or future potential opportunities; track those separately without fabricating deals.
- Existing Traineed planning entries on the XSys account calendar are misattributed for business reporting; do not automatically delete or edit calendar events without instruction.

## NXA cut-off policy — effective 2026-11-08 (owner instruction)
- `NXA` means `Nara XSys Advisory`.
- From 2026-11-08 onward, prefix **all new official XSys activities** with `NXA` (e.g. `NXA | RA | Training ISO 22000 | PT ABC | 20 Nov 2026`). Apply to calendar events, activity registers, task names and internal operational records where applicable.
- Official XSys calendar `xsys.advisory@gmail.com` is reserved exclusively for XSys activities. Do not add Traineed, LUWANA or other organizers' engagements to it.
- Pre-cut-off events from Traineed on XSys calendar are legacy contamination, not XSys activity. Do not count in CRM, KPIs or portfolio. Do not delete/move legacy events without explicit confirmation of handling.
- NXA prefix does not establish a confirmed commercial engagement: preserve separate status and owner approval checks.

## Two-character trainer code (owner update)
- Required title format: `NXA | [TT] | [Activity] | [Client] | [Date]`, where `[TT]` is a **two-letter trainer identifier**.
- Confirmed identifier: `RA` = Rubai Ahmad.
- Multiple trainers: join their verified identifiers with a hyphen, e.g. `RA-XX`; never infer codes from similar initials without directory validation.
- Do not assign or promise a trainer until competence, availability and resources are checked. Unknown trainer: keep draft status rather than invent a code.

## Latest owner-approved activity identifier format — supersedes NXA display format (2026-11-08)
- Canonical format: `NRA-[TT]_[Activity]_[Company]_[DDMMYY]`.
- Owner's exact example: `NRA-RA_Training ISO 22000_ABC_201126`.
- `NRA` is the latest explicit activity prefix; it **supersedes** previous `NXA` naming instructions for new activity labels. Do not silently revert to NXA.
- `[TT]`: verified unique two-letter trainer code; `RA` = Rubai Ahmad.
- `[Company]`: concise company name without legal-form prefixes such as PT or CV; retain enough information to avoid ambiguity.
- `[DDMMYY]`: local activity date in Asia/Jakarta; for multi-day programs, define an unambiguous date-range convention before implementation.
- Use hyphen between prefix and trainer; underscores between remaining components; no vertical bars.
- This is a naming policy, not authorization to create fictional calendar bookings or change existing records.

## CRM staging isolation checkpoint — 2026-11-08
- Source operational CRM: `19T9GXihaSwZHIlol1tV1qCr2RXbJFv36`, Excel MIME type, untouched.
- Created independent **private** staging copy `13PNMacGSnOX2YJ0KWinWUA5xd7MBq0lX`, named `NRA_CRM_STAGING_20261108_DO_NOT_USE_FOR_OPERATIONS.xlsx`, under XSys My Drive root. Verified distinct ID, same file size 28063 bytes, owner-only permissions.
- Staging copy remains Excel, **not** native Google Sheets; no automated sync has been configured. No fabricated leads, bookings or trainer assignments added.
- Next gated steps: native conversion of staging workbook, read headers/formulas/validations, verify trainer codes, dry-run field mapping and calendar read-only conflict checks. Do not overwrite source or publish production.
