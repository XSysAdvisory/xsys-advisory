# Laboratory Safety Practices — Smart E-Book

**Author:** Rubai Ahmad, Food Safety & QHSE Specialist  
**Publisher:** XSys•Advisory  
**Email:** xsys.advisory@gmail.com  
**WhatsApp:** +62 819-9919-7400 / https://wa.me/6281999197400  
**Website:** https://xsys-advisory.netlify.app/

## Isi versi 1.0 (24 November 2026)

- 14 bab pembelajaran LSMS, keselamatan bahan kimia/biologi, peralatan, gas, limbah B3, audit dan emergency response.
- 22 referensi regulasi Indonesia dan standar/pedoman internasional, dengan pemisahan ketentuan mengikat dari rujukan teknis.
- 77 pertanyaan audit dalam 11 domain; status, catatan dan ekspor CSV.
- 21 contoh baris HIRADC×RAMP dari 7 kasus; kalkulator risiko 5×5, penambahan baris dan ekspor CSV.
- 22 template register/form/SOP yang dapat diunduh (CSV atau dokumen Word editable).
- 7 studi kasus, program implementasi 30 hari, glosarium, 20 pre-test dan 20 post-test dengan nilai dan pembahasan.
- Kontrol belajar per bab, pencarian, cetak buku lengkap, dan ekspor HTML isi buku.

## Cara membuka secara online (GitHub Pages)

Kode sumber berada di folder ini:

`public/laboratory-safety-practices/`

GitHub Pages menggunakan workflow:

`.github/workflows/laboratory-safety-pages.yml`

**Langkah aktivasi satu kali oleh pemilik repo:**

1. Buka https://github.com/XSysAdvisory/xsys-advisory/settings/pages
2. Pada **Build and deployment → Source**, pilih **GitHub Actions** (aktifkan GitHub Pages).
3. Buka https://github.com/XSysAdvisory/xsys-advisory/actions/workflows/laboratory-safety-pages.yml
4. Klik **Run workflow**, pilih `main`, lalu **Run workflow**.
5. Setelah deployment berhasil, situs tersedia di **https://xsysadvisory.github.io/xsys-advisory/**.

Jika GitHub Pages belum diaktifkan, link tersebut akan menampilkan 404.

## Alternatif Netlify gratis

1. Unduh repositori: https://github.com/XSysAdvisory/xsys-advisory/archive/refs/heads/main.zip
2. Ekstrak ZIP, buka folder `public/laboratory-safety-practices`.
3. Buka https://app.netlify.com/drop dan unggah **folder tersebut**.
4. Netlify membuat URL `https://nama-site.netlify.app`; gunakan URL yang diberikan saat deploy berhasil.

Alternatif lain: unggah folder e-book ke publish directory situs Netlify XSys untuk membuka path `/laboratory-safety-practices/`.

## Menjalankan offline

Unduh folder e-book (semua berkas: `index.html`, `style.css`, `data.js`, `extras.js`, `app.js`). Buka `index.html` lewat browser. Fitur ekspor CSV/DOC dan penyimpanan lokal bekerja tanpa server; referensi sumber membutuhkan internet.

## Privasi

- Data audit, jawaban kuis, progres belajar dan register risiko tersimpan pada **localStorage browser perangkat pembaca**, bukan server XSys.
- Tidak ada sinkronisasi pengguna, verifikasi identitas atau penerbitan sertifikat resmi.
- Cetak nilai merupakan **lembar hasil belajar mandiri**, bukan sertifikat kompetensi.

## Peringatan profesional

Contoh skoring 5×5 dan kontrol residual merupakan **simulasi**; risiko residual tetap proyeksi sampai kontrol terbukti efektif. Wajib verifikasi aturan yang berlaku, SDS, SOP, fasilitas dan supervisi sebelum implementasi. Template SOP masih draft dan memerlukan review, penomoran, validasi dan persetujuan organisasi.

**© 2026 Rubai Ahmad — XSys•Advisory.** Gunakan sesuai izin pemilik hak cipta.
