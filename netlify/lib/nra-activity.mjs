/** Official XSys activity naming. No calendar/CRM writes occur here. */
const LEGAL_PREFIX=/^(?:(?:PT|CV|UD|PD|TBK)\.?\s+)+/i;
const CODE=/^[A-Z]{2}$/;
function normalizedPart(value,label){
 if(typeof value!=="string")throw new TypeError(label+" wajib berupa teks");
 const s=value.trim().replace(/\s+/g," ").replace(/[_|\r\n]/g," ");
 if(!s)throw new Error(label+" wajib diisi");
 return s;
}
export function normalizeCompanyName(value){
 const original=normalizedPart(value,"Nama perusahaan");
 const s=original.replace(LEGAL_PREFIX,"").replace(/^(?:PT|CV|UD|PD|TBK)\.?$/i,"").trim();
 if(!s)throw new Error("Nama perusahaan tidak boleh hanya bentuk badan usaha");
 return s;
}
export function formatNraActivity({trainerCode,activity,company,date}){
 const code=normalizedPart(trainerCode,"Kode trainer").toUpperCase();
 if(!CODE.test(code))throw new Error("Kode trainer harus tepat dua huruf A-Z");
 const name=normalizedPart(activity,"Nama kegiatan");
 const client=normalizeCompanyName(company);
 // Strict YYYY-MM-DD; use date-only input to avoid timezone conversion.
 if(typeof date!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(date))throw new Error("Tanggal harus YYYY-MM-DD");
 const [y,m,d]=date.split("-").map(Number);
 const utc=new Date(Date.UTC(y,m-1,d));
 if(utc.getUTCFullYear()!==y||utc.getUTCMonth()!==m-1||utc.getUTCDate()!==d)throw new Error("Tanggal tidak valid");
 const dd=String(d).padStart(2,"0"),mm=String(m).padStart(2,"0"),yy=String(y).slice(-2);
 return `NRA-${code}_${name}_${client}_${dd}${mm}${yy}`;
}
