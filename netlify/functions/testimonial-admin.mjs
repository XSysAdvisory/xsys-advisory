import { getStore } from '@netlify/blobs';
import { timingSafeEqual } from 'node:crypto';
const json=(v,status=200)=>new Response(JSON.stringify(v),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const limit=(v,n=200)=>String(v??'').slice(0,n);
const eq=(a,b)=>{const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)};
export default async req=>{
 const secret=process.env.XSYS_MODERATOR_TOKEN;
 if(!secret||secret.length<24)return json({error:'XSYS_MODERATOR_TOKEN belum disiapkan atau terlalu singkat'},503);
 const supplied=(req.headers.get('authorization')||'').replace(/^Bearer /i,'');
 if(!eq(secret,supplied))return json({error:'Tidak berwenang'},401);
 const token=process.env.NETLIFY_ACCESS_TOKEN,form=process.env.XSYS_FEEDBACK_FORM_ID;
 if(!token||!form)return json({error:'NETLIFY_ACCESS_TOKEN dan XSYS_FEEDBACK_FORM_ID diperlukan'},503);
 const states=getStore({name:'xsys-testimonial-decisions',consistency:'strong'});
 if(req.method==='POST'){
 let body;try{body=await req.json()}catch{return json({error:'JSON tidak valid'},400)}
 const id=limit(body.id,100),status=body.status;
 if(!/^[a-zA-Z0-9_-]{6,100}$/.test(id)||!['approved','rejected','pending'].includes(status))return json({error:'Input tidak valid'},400);
 // Read the actual submission first to prevent creating arbitrary public records.
 const verify=await fetch('https://api.netlify.com/api/v1/submissions/'+encodeURIComponent(id),{headers:{Authorization:'Bearer '+token}});
 if(!verify.ok)return json({error:'Tidak dapat memverifikasi ID kiriman'},502);
 const v=await verify.json();if(v.form_id!==form)return json({error:'Kiriman bukan dari formulir testimoni'},403);
 if(status==='approved'&&!(v.data?.izin_publikasi==='ya'||v.data?.izin_publikasi===true))return json({error:'Peserta belum menyetujui publikasi'},400);
 await states.setJSON('decision/'+id,{status,updatedAt:new Date().toISOString()});return json({ok:true,status});
 }
 if(req.method!=='GET')return json({error:'Metode tidak didukung'},405);
 const r=await fetch('https://api.netlify.com/api/v1/forms/'+encodeURIComponent(form)+'/submissions?per_page=100',{headers:{Authorization:'Bearer '+token}});
 if(!r.ok)return json({error:'Tidak bisa membaca kiriman Netlify Forms'},502);
 const rows=await r.json();const items=[];
 for(const s of rows){let d=s.data||{},decision=await states.get('decision/'+s.id,{type:'json'});items.push({id:s.id,name:limit(d.nama_peserta),program:limit(d.program_kegiatan),organization:limit(d.instansi),comment:limit(d.kesan_pesan,2000),photo:limit(d.foto_kegiatan,2000),status:decision?.status||'pending'})}
 return json({items});
};
