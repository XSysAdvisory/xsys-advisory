# LABORATORY SAFETY PRACTICES — Smart E-Book

**Rubai Ahmad — Food Safety & QHSE Specialist**  
**XSys•Advisory** | xsys.advisory@gmail.com | WA 081999197400  
https://xsys-advisory.netlify.app

## Isi versi 1.0 (24 November 2026)

- 12 bab, 36 subbagian edukasi Laboratory Safety Management System (LSMS)
- Matriks kepatuhan: 24 referensi regulasi Indonesia + 16 acuan internasional; status applicability dilengkapi catatan
- 78 butir checklist internal audit (status, bukti, gap, PIC, target; ekspor CSV)
- HIRADC × RAMP: kalkulator risiko 5×5 dan register editable, ekspor CSV
- 34 item inventaris dokumen dan rekaman, 14 template DOCX dalam ZIP
- 7 simulasi kasus laboratorium dengan narasi dan pertanyaan
- Pre-test 15 soal dan post-test 15 soal, nilai dan pembahasan setelah submit
- Rencana implementasi 30 hari, progress belajar, pencarian materi, cadangan/impor JSON
- `book.html` untuk cetak dan `assets/Laboratory_Safety_Practices_Rubai_Ahmad_2026.pdf` untuk PDF.

## Menjalankan

1. Ekstrak arsip; buka `index.html` di browser modern untuk melihat e-book.
2. Sebagian browser membatasi penyimpanan/unduhan dari `file://`; untuk penggunaan penuh sebaiknya terbitkan ke hosting HTTPS.
3. Jika ingin mencoba sebagai situs lokal: `python -m http.server 8000` lalu buka http://localhost:8000.
4. Untuk Netlify, masuk ke https://app.netlify.com/drop lalu **unggah folder hasil ekstraksi ini** (folder yang berisi `index.html`). Netlify memberikan URL `https://[nama].netlify.app` gratis bila tersedia. Jangan menyatakan URL sudah aktif sebelum deployment sukses.
5. Untuk repositori GitHub, unggah semua file ke repo publik. Netlify dapat dihubungkan untuk auto-deploy bila tersedia.

## Privasi dan keterbatasan

Aplikasi tanpa backend, login, atau pelacakan; data isian disimpan di localStorage browser yang dipakai. Ekspor/backup JSON sebelum membersihkan data browser atau berganti perangkat. Jangan memasukkan nama pasien, data spesimen sensitif, atau rahasia dagang ke browser bersama. Legal register adalah titik awal kajian; verifikasi applicability dan versi peraturan dalam JDIH resmi. Standar/pedoman global tidak otomatis mengikat secara hukum di Indonesia. Skor risiko sisa workshop bukan bukti kontrol sudah berjalan.

Dokumen yang tersedia adalah contoh untuk adaptasi, bukan bentuk/form hukum wajib secara universal. Penyimpanan status kuis di perangkat tidak ekuivalen dengan sertifikasi kompetensi.

## Strukur file

- `index.html`, `styles.css`, `app.js`, `data.js`, `content.js`: aplikasi utama
- `book.html`: edisi buku lengkap siap cetak
- `assets/`: workbook sumber, studi kasus, PDF e-book, dan paket 14 form DOCX
- `sw.js`, `manifest.webmanifest`: dukungan instalasi/offline di HTTPS
- `build_*.py` dan `*.json`: utilitas pemeliharaan konten untuk editor/pengelola

## Hak cipta

© 2026 Rubai Ahmad / XSys•Advisory. Diperkenankan sebagai materi pembelajaran dengan penyebutan sumber; distribusi/modifikasi publik dan materi pelatih perlu persetujuan pemilik. Standar asli ISO, OSHA, WHO, CDC dan teks regulasi tetap hak pemilik masing-masing dan tidak direproduksi penuh di sini.
