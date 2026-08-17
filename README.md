# SIPRO-KALTENG 2026
### Sistem Informasi Manajemen Proyek, RAB Dinamis, Kalkulator Volume BOQ & Dashboard Kurva S
**Wilayah Acuan:** Muara Teweh (Kab. Barito Utara) & Kota Palangka Raya  
**Periode Anggaran:** Semester II (2) Tahun 2026  
**Standar Analisa:** Pedoman Analisa Harga Satuan Pekerjaan (AHSP) Permen PUPR & Standar Satuan Harga (SSH) Regional Kalteng

---

## 🌟 Fitur Utama Aplikasi

### 1. 📍 Database Regional Switcher 2026
- Pilihan acuan wilayah aktif secara instan:
  - **Muara Teweh (Kab. Barito Utara)**: Termasuk faktor indeks logistik transportasi Sungai Barito & pedalaman Kalteng.
  - **Kota Palangka Raya**: Standar Satuan Harga ibukota Provinsi Kalimantan Tengah.
- Mengubah wilayah acuan akan langsung **menghitung ulang seluruh tabel RAB, harga satuan AHSP, dan Kurva S secara real-time**.

### 2. 📐 Kalkulator Volume Pekerjaan (BOQ / Quantity Take-Off Engine)
Dilengkapi dengan formula matematis & geometris parametrik dengan audit trail langkah perhitungan dan tombol **"Terapkan ke RAB"**:
- **Galian Tanah Pondasi Lajur Trapesium**: $V = \frac{a+b}{2} \times t \times P$
- **Galian Pondasi Tapak (Footplat)**: $V = P \times L \times t \times n$
- **Pondasi Batu Belah & Aanstamping**: $V = \frac{a+b}{2} \times t \times P$
- **Cerucuk Kayu Galam / Ulin Khas Kalteng**: $N = (\frac{P}{\text{jarak}} + 1) \times \text{baris}$
- **Trio Struktur Beton Bertulang (Kolom, Balok, Plat Lantai)**:
  - Volume Beton ($m^3$)
  - Berat Pembesian Tulangan Pokok & Sengkang ($kg$) dengan rumus $\frac{d^2}{162}$
  - Luas Kontak Bekisting ($m^2$)
- **Pasangan Dinding Bata/Hebel**: Luas Netto dikurangi bukaan kusen pintu & jendela
- **Plesteran & Acian**: Kalkulasi otomatis 2 sisi dinding
- **Rangka & Penutup Atap Miring**: Koreksi sudut kemiringan $\frac{1}{\cos\alpha}$ dan overstek
- **Plafon Gypsum & List Profil**
- **Lantai Keramik / Granit & Plint Dinding**

### 3. 📋 Penyusun RAB Dinamis & Rekapitulasi
- Struktur hierarkis WBS (*Work Breakdown Structure*) per kelompok divisi pekerjaan.
- Penambahan item dari katalog AHSP PUPR atau item manual (Custom).
- Edit volume langsung (*inline edit*) dengan update otomatis subtotal biaya dan **Bobot (%)**.
- Rekapitulasi biaya fisik, Jasa Kontraktor / Overhead (dapat diatur), Pajak PPN (11% / 12%), Grand Total, dan **Format Terbilang Rupiah Otomatis**.

### 4. 📅 Time Schedule & Bobot Mingguan
- Penentuan rentang waktu pelaksanaan (*Start Week* s/d *End Week*) per item pekerjaan.
- Pilihan mode distribusi bobot: **Linier** atau **Kurva S / Normal Distribution (Bell Shape)**.
- Matriks jadwal mingguan terperinci dengan visualisasi highlight bar.

### 5. 📈 Dashboard Kurva S & Monitoring Realisasi (Opname Fisik)
- Grafik Kurva S interaktif resolusi tinggi (*HiDPI Retina Canvas*).
- Garis **Rencana Kumulatif** (Biru) vs **Realisasi Kumulatif** (Hijau/Merah).
- Hover Tooltip interaktif per minggu pelaksanaan.
- Input data opname mingguan lengkap dengan catatan kendala teknis dan pencatat cuaca (hari cerah vs hujan).
- **Early Warning System (SCM Alert)**: Otomatis mendeteksi status **Kontrak Kritis** bila deviasi $< -5.00\%$ sesuai pedoman Permen PUPR (*Show Cause Meeting Trigger*).

### 6. 💰 Arus Kas & Termijn
- Rencana tahapan penarikan termijn (*Monthly Certificate* / MC): Uang Muka (DP 20%), MC 1-3, dan Retensi Masa Pemeliharaan (5%).
- Rekapitulasi nominal pencairan dan status pembayaran.

### 7. 💾 Portabilitas & Cetak Laporan
- **Auto-Save LocalStorage**: Data tersimpan aman di browser Anda.
- **Unduh/Buka File JSON Proyek**: Cadangkan dan bagikan berkas proyek dengan mudah.
- **Ekspor CSV / Excel**: Ekspor tabel RAB ke format spreadsheet.
- **Mode Cetak / PDF**: Tampilan cetak profesional siap tanda tangan.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini bersifat **Zero-Dependency & Offline-First**:
1. Buka file `index.html` langsung di browser modern Anda (Google Chrome, Microsoft Edge, Mozilla Firefox, Opera, atau Safari).
2. Atau jalankan melalui live server lokal favorit Anda.

---
*Dikembangkan dengan standar ketekniksipilan dan regulasi jasa konstruksi Kalimantan Tengah 2026.*
