const reply=(data,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
const SYSTEM="Anda NARA, asisten layanan pelanggan XSys•Advisory. Gunakan bahasa Indonesia profesional, ringkas, ramah. Layanan: training, consulting, mentoring, audit, certification assistance dan regulatory assistance. Tanyakan kategori layanan, topik/scope, organisasi, lokasi, format, tanggal, jumlah peserta dan kontak secara bertahap. Jadwal yang sama dapat berjalan paralel jika trainer/PIC berbeda dan tersedia. Jangan mengklaim jadwal, harga, sertifikat, izin atau akreditasi telah dikonfirmasi; semuanya perlu verifikasi tim. Jangan mengaku sebagai manusia. Untuk penawaran dan konfirmasi arahkan ke xsys.advisory@gmail.com atau WhatsApp +6281999197400. Jangan meminta password, OTP, atau data kartu.";
export default async function(req){
 if(req.method!=="POST")return reply({error:"Method not allowed"},405);
 const origin=req.headers.get("origin");if(origin&&new URL(origin).host!==new URL(req.url).host)return reply({error:"Origin not allowed"},403);
 let body;try{body=await req.json()}catch{return reply({error:"JSON tidak valid"},400)}
 const msg=String(body.message||"").trim();if(!msg||msg.length>1500)return reply({error:"Pesan wajib diisi (maksimal 1500 karakter)."},400);
 const history=Array.isArray(body.history)?body.history.slice(-8).filter(x=>x&&["user","assistant"].includes(x.role)&&typeof x.content==="string").map(x=>({role:x.role,content:x.content.slice(0,1500)})):[];
 const key=Netlify.env.get("OPENAI_API_KEY")||process.env.OPENAI_API_KEY;
 if(!key)return reply({error:"Layanan AI belum diaktifkan. Silakan hubungi tim XSys•Advisory melalui WhatsApp atau email."},503);
 try{
 const res=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:Netlify.env.get("NARA_OPENAI_MODEL")||"gpt-4o-mini",temperature:0.35,max_tokens:450,messages:[{role:"system",content:SYSTEM},...history,{role:"user",content:msg}]})});
 if(!res.ok){console.error("NARA provider status",res.status);return reply({error:"Layanan AI sedang tidak tersedia. Silakan hubungi tim XSys•Advisory."},502)}
 const json=await res.json();return reply({answer:String(json.choices?.[0]?.message?.content||"Mohon ulangi pertanyaan Anda.").slice(0,3000)})
 }catch(e){console.error("NARA network failure",String(e));return reply({error:"Koneksi layanan AI terganggu. Silakan coba lagi."},502)}
}
export const config={rateLimit:{action:"rate_limit",aggregateBy:"ip",windowSize:60,windowLimit:12}};
