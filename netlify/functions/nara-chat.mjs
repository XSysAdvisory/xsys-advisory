const json=(data,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
const SYSTEM=`Anda NARA, AI Business Development & Training Sales Specialist resmi XSys•Advisory. Bahasa utama Indonesia; adaptasi bahasa pelanggan. Layanan: public/in-house/private training, consulting, mentoring, audit, regulatory compliance, sertifikasi dan perizinan. Triase: kategori layanan, topik dan scope, kompetensi trainer/konsultan, kalender orang, metode (offline/Zoom/hybrid), lokasi dan sumber daya. Kegiatan di tanggal sama BOLEH paralel bila PIC/trainer berbeda, kompeten dan tersedia; public training topik sama bisa digabung. Jangan menjanjikan harga, tanggal, trainer, sertifikat, kelulusan, perizinan, atau hasil audit tanpa verifikasi manusia. Jangan mengarang data perusahaan, regulasi, jadwal, maupun biaya. Kumpulkan secara bertahap hanya data yang diperlukan: nama perusahaan, kebutuhan, peserta, perkiraan tanggal, kota, format dan kontak opsional. Untuk penawaran resmi arahkan ke xsys.advisory@gmail.com atau WhatsApp 081999197400. Jangan meminta rahasia, data pembayaran, password, atau API key. Beri jawaban ringkas, akurat dan tawarkan langkah berikutnya.`;
export default async function handler(req){
 if(req.method!=="POST")return json({error:"Metode tidak didukung",code:"METHOD"},405);
 const origin=req.headers.get("origin");
 if(origin){try{if(new URL(origin).host!==new URL(req.url).host)return json({error:"Origin tidak diizinkan",code:"ORIGIN"},403)}catch{return json({error:"Origin tidak valid",code:"ORIGIN"},403)}}
 if(Number(req.headers.get("content-length")||0)>16000)return json({error:"Pesan terlalu besar",code:"SIZE"},413);
 let body;try{body=await req.json()}catch{return json({error:"Format pesan tidak valid",code:"JSON"},400)}
 const messages=Array.isArray(body?.messages)?body.messages:[];
 if(!messages.length||messages.length>12||messages.some(m=>!["user","assistant"].includes(m?.role)||typeof m?.content!=="string"||!m.content.trim()||m.content.length>1600))return json({error:"Isi pesan tidak valid",code:"INPUT"},400);
 const key=Netlify.env.get("OPENAI_API_KEY");
 if(!key)return json({error:"Layanan AI belum dikonfigurasi. Hubungi tim XSys.",code:"CONFIG"},503);
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),18000);
 try{
 const response=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Authorization":"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4o-mini",temperature:0.3,max_tokens:450,messages:[{role:"system",content:SYSTEM},...messages]}),signal:controller.signal});
 if(!response.ok){
  let providerCode="";try{providerCode=(await response.json())?.error?.code||""}catch{}
  console.error("NARA provider error",response.status,providerCode);
  if(response.status===429&&["insufficient_quota","billing_hard_limit_reached"].includes(providerCode))return json({error:"Layanan AI sedang menunggu aktivasi kredit API. Silakan hubungi tim XSys.",code:"BILLING"},503);
  if(response.status===401||response.status===403)return json({error:"Autentikasi layanan AI perlu diperiksa oleh administrator.",code:"AUTH"},503);
  if(response.status===429)return json({error:"NARA sedang ramai. Silakan coba beberapa saat lagi.",code:"RATE_LIMIT"},429);
  return json({error:"NARA sedang tidak tersedia. Silakan hubungi tim XSys.",code:"UPSTREAM"},502);
 }
 const result=await response.json();const reply=result?.choices?.[0]?.message?.content;
 return typeof reply==="string"&&reply.trim()?json({reply}):json({error:"Respons AI kosong",code:"EMPTY"},502);
 }catch(e){console.error("NARA connection error",e?.name);return json({error:"Koneksi AI terganggu. Silakan coba lagi.",code:"TIMEOUT"},504)}
 finally{clearTimeout(timeout)}
}
export const config={rateLimit:{action:"rate_limit",aggregateBy:"ip",windowSize:60,windowLimit:12}};
