/** XSys NRA staging-only Google Apps Script. Install as a bound script on the NATIVE STAGING sheet.
 * Configure CALENDAR_ID explicitly; do not use the user's default calendar implicitly.
 * Trigger runs every 5 minutes after authorization. Writes only rows with Status=Confirmed
 * AND Konfirmasi Trainer=Confirmed AND Status Sinkronisasi=PENDING_REVIEW.
 * Never deletes events; never processes legacy/non-NRA events. */
const NRA={TRAINING:'TRAINING',TRAINER:'TRAINER',HEADER:4,CALENDAR_ID:'xsys.advisory@gmail.com',PREFIX:'NRA-',TZ:'Asia/Jakarta'};
function nraSetup(){
 const ss=SpreadsheetApp.getActiveSpreadsheet();
 if(ss.getId()!=='1GYndjkQc9aBDp5meO__FVZ7Pt1Kw0BOpyd_vj-4gUBk')throw Error('Only approved staging spreadsheet');
 const cal=CalendarApp.getCalendarById(NRA.CALENDAR_ID);if(!cal)throw Error('Calendar unavailable: authorize Calendar access');
 ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()==='nraSync').forEach(t=>ScriptApp.deleteTrigger(t));
 ScriptApp.newTrigger('nraSync').timeBased().everyMinutes(5).create();
 return 'Staging trigger installed';
}
function nraSync(){
 const lock=LockService.getScriptLock();if(!lock.tryLock(1000))return;
 try{
 const ss=SpreadsheetApp.getActiveSpreadsheet();if(ss.getId()!=='1GYndjkQc9aBDp5meO__FVZ7Pt1Kw0BOpyd_vj-4gUBk')throw Error('Unexpected spreadsheet');
 const sh=ss.getSheetByName(NRA.TRAINING),trainer=ss.getSheetByName(NRA.TRAINER);
 if(!sh||!trainer)throw Error('Required tabs missing');
 const headers=sh.getRange(4,1,1,23).getDisplayValues()[0];
 const idx=name=>{const i=headers.indexOf(name);if(i<0)throw Error('Missing column '+name);return i};
 const cols={client:idx('Klien'),title:idx('Judul Program'),start:idx('Tanggal Mulai'),end:idx('Tanggal Selesai'),hours:idx('Jam'),trainer:idx('Lead Trainer'),status:idx('Status'),confirm:idx('Konfirmasi Trainer'),code:idx('Kode Trainer NRA'),nra:idx('ID Kegiatan NRA'),sync:idx('Status Sinkronisasi'),event:idx('ID Event Kalender')};
 const directory=trainer.getRange(5,1,Math.max(1,trainer.getLastRow()-4),14).getDisplayValues();
 const verified=directory.filter(r=>r[12]&&r[13]==='TERVERIFIKASI'&&/^[A-Z]{2}$/.test(r[12])).map(r=>({name:r[1],code:r[12]}));
 if(new Set(verified.map(x=>x.code)).size!==verified.length)throw Error('Duplicate verified trainer codes');
 const cal=CalendarApp.getCalendarById(NRA.CALENDAR_ID);if(!cal)throw Error('Calendar unavailable');
 const n=Math.max(0,sh.getLastRow()-4);if(!n)return;
 const values=sh.getRange(5,1,n,23).getValues(),display=sh.getRange(5,1,n,23).getDisplayValues();
 for(let i=0;i<n;i++){
  const r=values[i],d=display[i],row=i+5;
  if(d[cols.sync]!=='PENDING_REVIEW')continue;
  try{
   if(d[cols.status]!=='Confirmed'||d[cols.confirm]!=='Confirmed')throw Error('Commercial and trainer confirmation required');
   const match=verified.find(t=>t.code===d[cols.code]&&t.name===d[cols.trainer]);if(!match)throw Error('Trainer code/name not verified');
   if(d[cols.event])throw Error('Existing event ID: manual reconciliation required');
   const start=r[cols.start],end=r[cols.end];if(!(start instanceof Date)||!(end instanceof Date))throw Error('Dates must be date cells');
   if(!d[cols.hours])throw Error('Hours required (HH:mm-HH:mm)');
   const m=d[cols.hours].match(/^(\\d{2}):(\\d{2})\\s*[-–]\\s*(\\d{2}):(\\d{2})$/);
   if(!m)throw Error('Hours format HH:mm-HH:mm required');
   const a=new Date(start),b=new Date(end);a.setHours(+m[1],+m[2],0,0);b.setHours(+m[3],+m[4],0,0);
   if(a>=b)throw Error('Invalid time range');
   const dd=Utilities.formatDate(a,NRA.TZ,'ddMMyy');const company=d[cols.client].replace(/^(?:(?:PT|CV|UD|PD|TBK)\\.?\\s+)+/i,'').trim();
   if(!company||!d[cols.title])throw Error('Missing company or activity');
   const name='NRA-'+match.code+'_'+d[cols.title].trim().replace(/_/g,' ')+'_'+company.replace(/_/g,' ')+'_'+dd;
   if(d[cols.nra]&&d[cols.nra]!==name)throw Error('NRA identifier mismatch');
   const overlapping=cal.getEvents(a,b);if(overlapping.some(e=>e.getTitle()===name))throw Error('Matching calendar event exists: reconcile manually');
   // Safety: do not auto-book until a human confirms no travel/resource conflicts.
   throw Error('Requires manual resource/travel clearance before calendar creation');
  }catch(err){sh.getRange(row,22).setValue('ERROR');sh.getRange(row,23).setNote(String(err.message||err));}
 }
 }finally{lock.releaseLock();}
}
