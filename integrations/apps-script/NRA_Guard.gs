/**
 * NARA staging guard for Apps Script. Paste into a separate file NRA_Guard.gs.
 * This file does not create, update or delete Google Calendar events.
 */
const NRA_GUARD = Object.freeze({
  spreadsheetId: '1GYndjkQc9aBDp5meO__FVZ7Pt1Kw0BOpyd_vj-4gUBk',
  trainerSheet: 'TRAINER',
  trainingSheet: 'TRAINING',
  statusConfirmed: 'Terkonfirmasi',
  verified: 'TERVERIFIKASI'
});

function nraGuardReview() {
  const ss = SpreadsheetApp.openById(NRA_GUARD.spreadsheetId);
  const trainers = ss.getSheetByName(NRA_GUARD.trainerSheet);
  const training = ss.getSheetByName(NRA_GUARD.trainingSheet);
  if (!trainers || !training) throw new Error('Tab TRAINER atau TRAINING tidak ditemukan');
  const t = trainers.getRange(5, 1, Math.max(1, trainers.getLastRow() - 4), 14).getDisplayValues();
  const codeMap = {};
  const errors = [];
  t.forEach((r, i) => {
    const [id, name] = r;
    const code = String(r[12] || '').trim().toUpperCase();
    const verified = String(r[13] || '').trim();
    if (!id && !name && !code) return;
    if (!id || !name) errors.push('TRAINER baris ' + (i + 5) + ': ID/nama tidak lengkap');
    if (verified === NRA_GUARD.verified) {
      if (!/^[A-Z]{2}$/.test(code)) errors.push('TRAINER baris ' + (i + 5) + ': kode terverifikasi tidak valid');
      else if (codeMap[code]) errors.push('Kode duplikat: ' + code);
      else codeMap[code] = { id, name, row: i + 5 };
    }
  });
  const rows = training.getRange(5, 1, Math.max(1, training.getLastRow() - 4), 23).getDisplayValues();
  const report = { scanned: 0, pendingReview: 0, confirmed: 0, readyForHumanReview: 0, errors, verifiedTrainerCodes: Object.keys(codeMap) };
  rows.forEach((r, i) => {
    if (!r.some(v => String(v).trim())) return;
    report.scanned++;
    const status = String(r[13] || '').trim(); // N
    const trainerCode = String(r[19] || '').trim().toUpperCase(); // T
    const syncStatus = String(r[21] || '').trim(); // V
    if (syncStatus === 'PENDING_REVIEW') report.pendingReview++;
    if (status === NRA_GUARD.statusConfirmed) {
      report.confirmed++;
      if (syncStatus === 'PENDING_REVIEW') {
        if (!codeMap[trainerCode]) report.errors.push('TRAINING baris ' + (i + 5) + ': kode trainer belum terverifikasi');
        else report.readyForHumanReview++;
      }
    }
  });
  console.log(JSON.stringify(report));
  return report;
}
