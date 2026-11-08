import {getStore,getDeployStore} from "@netlify/blobs";
const respond=(data,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store"}});
const clean=(v,max)=>typeof v==="string"?v.trim().slice(0,max):"";
export default async function handler(req,context){
 if(req.method!=="POST")return respond({error:"Method not allowed"},405);
 const origin=req.headers.get("origin");if(origin){try{if(new URL(origin).host!==new URL(req.url).host)return respond({error:"Forbidden"},403)}catch{return respond({error:"Invalid origin"},403)}}
 if(Number(req.headers.get("content-length")||0)>6000)return respond({error:"Too large"},413);
 const raw=await req.text();if(raw.length>6000)return respond({error:"Too large"},413);
 let b;try{b=JSON.parse(raw)}catch{return respond({error:"Invalid JSON"},400)}
 if(b?.website)return respond({ok:true,message:"Permintaan diterima."},201);
 if(b?.consent!==true)return respond({error:"Persetujuan pengiriman data diperlukan"},400);
 const name=clean(b.name,100),contact=clean(b.contact,160),company=clean(b.company,120),service=clean(b.service,70),details=clean(b.details,1000);
 if(!name||!contact||!details)return respond({error:"Nama, kontak dan kebutuhan wajib diisi"},400);
 if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)||/^\+?[0-9()\-\s]{8,25}$/.test(contact)))return respond({error:"Format kontak tidak valid"},400);
 const record={id:crypto.randomUUID(),created_at:new Date().toISOString(),source:"nara_web",stage:"New",name,contact,company,service,details,consent_at:new Date().toISOString()};
 const deploymentContext=context?.deploy?.context||Netlify.env.get("CONTEXT")||process.env.CONTEXT||"";
 const isProduction=deploymentContext==="production";
 const store=isProduction?getStore({name:"nara-leads-production",consistency:"strong"}):getDeployStore("nara-leads-preview");
 try{await store.setJSON("lead/"+record.id,record,{onlyIfNew:true});return respond({ok:true,reference:record.id,message:"Permintaan Anda sudah diterima oleh sistem XSys. Tim kami akan menindaklanjuti melalui kontak yang diberikan."},201)}
 catch(e){console.error("NARA lead storage error",e?.name);return respond({error:"Penyimpanan belum tersedia. Silakan hubungi XSys melalui WhatsApp atau email."},503)}
}
export const config={rateLimit:{action:"rate_limit",aggregateBy:"ip",windowSize:60,windowLimit:5}};
