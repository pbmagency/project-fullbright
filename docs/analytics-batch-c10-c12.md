# Analytics batch untuk `/c10-lp` dan `/c12-price`

Kedua halaman mengumpulkan maksimal 10 event per request dan mengirim antrean
setiap 5 detik. Saat CTA keluar atau tab disembunyikan, browser memakai
`sendBeacon`. Endpoint `POST /analytics/track-batch` memvalidasi sumber halaman,
membatasi ukuran payload hingga 64 KiB, lalu mengembalikan `202` setelah job
masuk queue. Penulisan `user_analytics` dan Meta CAPI berjalan di worker.
Halaman lain tetap memakai `POST /analytics/track`.

Di server, pastikan migrasi tabel `jobs` sudah dijalankan dan
`QUEUE_CONNECTION=database` (atau driver queue asinkron lain) aktif. Jalankan
worker sebagai proses yang dikelola supervisor agar terus hidup dan dimulai
ulang sesudah deploy, misalnya:

```sh
php artisan queue:work --queue=default --sleep=1 --tries=3 --timeout=60
```

Sesudah deploy, jalankan `php artisan queue:restart` agar worker memuat kode
job terbaru. Pantau `php artisan queue:failed` untuk job yang gagal. Driver
`sync` akan menjalankan job di request dan tidak memberikan manfaat latensi.
