const json=(data,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store"}});
const SYSTEM=`Anda NARA, asisten virtual resmi XSys•Advisory. Jawab ramah, profesional, ringkas dalam bahasa pengguna (default Bahasa Indonesia). Layanan: training public/in-house/private, consulting, mentoring, audit dan pendampingan sertifikasi/perizinan. Tanyakan topik, perusahaan, jumlah peserta, tanggal, lokasi/metode, dan kontak secara bertahap, hanya bila relevan. Jadwal paralel boleh bila trainer/PIC berbeda dan tersedia; jangan pernah memastikan jadwal, biaya, sertifikat, izin, atau hasil audit tanpa verifikasi. Jangan mengarang harga, jadwal, atau ketersediaan trainer. Arahkan penawaran dan konfirmasi kepada tim XSys melalui email xsys.advisory@gmail.com atau WhatsApp 081999197400. Jangan meminta data sensitif, API key, kata sandi, atau pembayaran melalui chat.`;
export default async function handler(req){
 if(req.method!=="POST") return json({error:"Method not allowed"},405);
 const origin=req.headers.get("origin");
 if(origin && new URL(origin).host!==new URL(req.url).host) return json({error:"Origin not allowed"},403);
 const size=Number(req.headers.get("content-length")||0);
 if(size>16000) return json({error:"Payload terlalu besar"},413);
 let body;try{body=await req.json()}catch{return json({error:"JSON tidak valid"},400)}
 const messages=Array.isArray(body?.messages)?body.messages:[];
 if(!messages.length||messages.length>16||messages.some(m=>!["user","assistant"].includes(m?.role)||typeof m?.content!=="string"||m.content.length>1600))return json({error:"Pesan tidak valid"},400);
 const key=Netlify.env.get("OPENAI_API_KEY");
 if(!key)return json({error:"Layanan AI belum dikonfigurasi"},503);
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),18000);
 try{
  const upstream=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4o-mini",temperature:0.3,max_tokens:450,messages:[{role:"system",content:SYSTEM},...messages]}),signal:controller.signal});
  if(!upstream.ok){console.error("NARA provider status",upstream.status);return json({error:"NARA sedang tidak tersedia. Silakan hubungi tim XSys."},502)}
  const result=await upstream.json();const reply=result?.choices?.[0]?.message?.content;
  return typeof reply==="string"?json({reply}):json({error:"Respons AI tidak tersedia"},502);
 }catch(e){console.error("NARA request failed",e?.name);return json({error:"Koneksi NARA terganggu. Coba kembali."},504)}
 finally{clearTimeout(timeout)}
}
export const config={rateLimit:{action:"rate_limit",aggregateBy:"ip",windowSize:60,windowLimit:12}};
