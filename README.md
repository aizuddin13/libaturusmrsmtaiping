# Sesi Libat Urus — MRSM Taiping

Dashboard live polling & word cloud sendiri (tanpa Mentimeter/AhaSlides), untuk sesi libat urus guru-guru Sains.

## Struktur
- `index.html` — menu utama (pilih Peserta / Fasilitator)
- `sertai.html` — halaman peserta (dibuka di telefon masing-masing)
- `papar.html` — halaman fasilitator/paparan projektor (kawal soalan + lihat keputusan live)
- `app.js` — soalan sesi & logik Firebase
- `firebase-config.js` — **kena diisi dengan config Firebase anda (langkah di bawah)**

## Langkah 1 — Buat projek Firebase (percuma)
1. Pergi ke https://console.firebase.google.com
2. "Add project" → namakan contoh `libat-urus-mrsm`
3. Matikan Google Analytics (tak perlu) → Create project

## Langkah 2 — Aktifkan Realtime Database
1. Dalam projek, menu kiri → **Build → Realtime Database**
2. "Create Database" → pilih lokasi **Singapore (asia-southeast1)**
3. Mode: pilih **Start in test mode** (benarkan baca/tulis buat sementara)
4. Selepas database dicipta, pergi tab **Rules** dan tampal:
   ```json
   {
     "rules": {
       "libatUrus": {
         ".read": true,
         ".write": true
       }
     }
   }
   ```
   Klik **Publish**. (Ini membenarkan sesiapa dengan pautan untuk baca/tulis data sesi — sesuai untuk sesi dalaman pendek. Jangan guna untuk data sensitif jangka panjang.)

## Langkah 3 — Dapatkan config & isi `firebase-config.js`
1. Klik ikon gear ⚙️ (Project settings) di menu kiri atas
2. Scroll ke **Your apps** → klik ikon `</>` (Web app)
3. Nickname: `libat-urus-web` → Register app (jangan tick Firebase Hosting)
4. Firebase akan papar objek `firebaseConfig` — salin semua nilai
5. Buka fail `firebase-config.js` dalam repo ini, gantikan setiap `GANTI_...` dengan nilai sebenar
6. Commit & push perubahan tersebut

## Langkah 4 — Aktifkan GitHub Pages
1. Repo ini → **Settings → Pages**
2. Source: **Deploy from a branch**, Branch: `main`, folder `/ (root)` → Save
3. Tunggu ~1 minit, pautan laman akan muncul di situ (contoh: `https://aizuddin13.github.io/libaturusmrsmtaiping/`)

## Guna semasa mesyuarat
1. Buka `papar.html` di projektor/laptop anda (Fasilitator)
2. Kongsikan pautan `sertai.html` kepada guru-guru (QR code atau link pendek)
3. Guru buka pautan di telefon masing-masing, dan paparan akan ikut soalan yang anda pilih di panel Fasilitator
4. Klik "Seterusnya →" untuk bergerak ke soalan seterusnya; keputusan terkini dipaparkan live
5. "Reset Sesi Ini" memadam semua respons jika nak guna semula untuk sesi lain
