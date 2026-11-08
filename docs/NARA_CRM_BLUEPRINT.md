# NARA — CRM Sales Blueprint (Draft v0.1)

Status: rancangan, **belum** ada penyimpanan CRM otomatis atau sinkronisasi Google Sheets/Gmail/Calendar. Jangan menyatakan lead sudah tercatat hanya karena pengunjung membuka WhatsApp/email.

## Data prospek minimum
- lead_id (UUID), created_at (UTC), source (webchat/WhatsApp/email/manual), company_name, contact_name, contact_channel, contact_value (opsional, atas persetujuan), service_category (training/consulting/mentoring/certification_assistance), topic_scope, participant_count, preferred_dates, location, delivery_mode, owner, next_action, next_action_at, stage, consent_at, last_updated.
- Jangan menyimpan API key, kata sandi, data pembayaran, atau transkrip lengkap tanpa dasar dan pemberitahuan yang sesuai.

## Pipeline
New → Qualified → Trainer/Consultant Check → Proposal → Negotiation → Won / Lost / On Hold.

## Triase dan verifikasi wajib
1. Klasifikasikan layanan, judul/topik, dan ruang lingkup.
2. Cocokkan kompetensi trainer/konsultan/PIC.
3. Periksa kalender orang terkait dan durasi.
4. Periksa format public/in-house/private, metode online/offline/hybrid, lokasi, perjalanan, dan sumber daya.
5. Kegiatan pada tanggal sama **boleh paralel** jika PIC/trainer berbeda dan tersedia. Public training topik sama dapat menggabungkan peserta dari beberapa perusahaan.
6. Jangan konfirmasi tanggal, biaya, sertifikasi, atau trainer sebelum verifikasi dan persetujuan tim XSys.

## Kontrol dan keamanan
- Akses CRM dibatasi berdasarkan peran; catat perubahan status dan pemilik lead.
- Terapkan pemberitahuan privasi dan persetujuan kontak sebelum pengumpulan data pribadi.
- Hindari duplikasi dengan kombinasi kanal kontak + perusahaan + topik (review manual bila ambigu).
- Lead handoff saat ini berupa tautan WhatsApp/email yang dibuka oleh pengunjung; pengiriman dan pencatatan tidak otomatis.
- Untuk CRM terintegrasi Google Sheets/Calendar, perlu implementasi penyimpanan, otorisasi, aturan retensi, deduplikasi, notifikasi dan pengujian sebelum dinyatakan aktif.

## Acceptance test sebelum go-live
- Widget tampil desktop/mobile; keyboard dan screen reader dapat mengakses tombol.
- Tidak ada kerusakan halaman lama, navigasi, aset, fungsi testimoni, dan halaman admin.
- Respons OpenAI berhasil setelah billing aktif; error billing muncul dengan pesan ramah.
- Tombol WhatsApp/email menyertakan ringkasan hanya ketika diklik; tidak ada data yang dikirim otomatis.
- Rate limit, input validation, dan pengendalian biaya berfungsi.
- Periksa halaman selain homepage secara terpisah: widget belum otomatis dipasang di semua halaman.
