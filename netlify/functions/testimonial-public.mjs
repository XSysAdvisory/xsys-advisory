import {getStore} from '@netlify/blobs';
const json=(v,status=200)=>new Response(JSON.stringify(v),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const clip=(v,n=250)=>String(v??'').slice(0,n);
export default async req=>{
 if(req.method!=='GET')return json({error:'Metode tidak didukung'},405);
 const token=process.env.NETLIFY_ACCESS_TOKEN,form=process.env.XSYS_FEEDBACK_FORM_ID;
 if(!token||!form)return json({items:[],configured:false});
 const store=getStore({name:'xsys-testimonial-decisions',consistency:'strong'});
 const r=await fetch('https://api.netlify.com/api/v1/forms/'+encodeURIComponent(form)+'/submissions?per_page=100',{headers:{Authorization:'Bearer '+token}});
 if(!r.ok)return json({items:[],error:'Data tidak tersedia'},502);
 const rows=await r.json(),items=[];
 for(const s of rows){const d=s.data||{},decision=await store.get('decision/'+s.id,{type:'json'});if(decision?.status!=='approved'||!(d.izin_publikasi==='ya'||d.izin_publikasi===true))continue;items.push({name:clip(d.nama_peserta,80),program:clip(d.program_kegiatan,120),organization:clip(d.instansi,120),comment:clip(d.kesan_pesan,1600),photo:clip(d.foto_kegiatan,2000)})}
 return json({items});
};
