# Panduan Optimasi Sistem Tracking untuk High Traffic

Dokumen ini berisi langkah-langkah teknis untuk mengatasi masalah latensi tinggi (TTFB lambat) dan *request flood* pada sistem analytics internal. Dengan menerapkan pola **Batching**, **Debouncing**, dan **Asynchronous Processing**, web dapat menangani ribuan akses bersamaan tanpa mengorbankan performa *home page*.

---

## 1. Optimasi Frontend (Browser)

Masalah utama saat ini adalah frontend terlalu sering mengirim request tunggal (seperti `scroll_time`, `click`, dll). Kita perlu mengumpulkan event-event tersebut dan mengirimkannya sekaligus.

### A. Menerapkan Debounce pada Event Scroll
Jangan biarkan event scroll memicu fungsi setiap milidetik. Gunakan teknik *debounce* atau *throttle*.

```javascript
// Utilitas Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Catat scroll maksimal setiap 1 detik saja
window.addEventListener('scroll', debounce(() => {
    trackEvent('scroll_time', { depth: window.scrollY });
}, 1000));
```

### B. Batching Event & `navigator.sendBeacon`
Kumpulkan event dalam sebuah *array* sementara. Kirimkan secara periodik atau saat pengguna akan menutup/meninggalkan halaman menggunakan `navigator.sendBeacon`.

```javascript
// Sistem Tracking Sederhana dengan Batching
const AnalyticsTracker = {
    queue: [],
    batchSize: 10, // Kirim jika sudah ada 10 event terkumpul
    endpoint: '/api/track-batch',

    track(eventName, data = {}) {
        this.queue.push({
            event: eventName,
            data: data,
            timestamp: new Date().toISOString()
        });

        // Kirim jika antrean sudah mencapai batas
        if (this.queue.length >= this.batchSize) {
            this.flush();
        }
    },

    flush() {
        if (this.queue.length === 0) return;

        // Siapkan payload
        const payload = JSON.stringify({ events: this.queue });
        
        // Gunakan sendBeacon yang berjalan di background
        const success = navigator.sendBeacon(this.endpoint, payload);
        
        if (success) {
            this.queue = []; // Kosongkan antrean jika berhasil
        }
    }
};

// Fungsi helper untuk dipanggil di mana saja
function trackEvent(name, data) {
    AnalyticsTracker.track(name, data);
}

// Pastikan sisa event terkirim saat pengguna menutup halaman
window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        AnalyticsTracker.flush();
    }
});
```

---

## 2. Optimasi Backend (Server)

Di sisi server, endpoint `/api/track-batch` **TIDAK BOLEH** langsung menulis data ke database (MySQL/PostgreSQL) saat memproses *request*. Server harus merespon secepat mungkin agar koneksi segera dibebaskan.

### Konsep Asynchronous Processing (Message Queue)

1. **Terima Request:** Controller menerima payload JSON dari frontend.
2. **Validasi Cepat:** Lakukan pengecekan format data sederhana (opsional).
3. **Kirim ke Queue:** Dorong payload tersebut ke dalam antrean *Message Queue* seperti **Redis**, **RabbitMQ**, atau driver Queue bawaan framework.
4. **Kembalikan Respon 202:** Langsung berikan respon `202 Accepted` ke browser (biasanya proses ini memakan waktu kurang dari 50ms).
5. **Background Worker:** Sebuah *background job* atau *worker* akan mengambil data dari Queue satu per satu dan mengeksekusi query `INSERT` ke database tanpa mengganggu traffic utama web.

### Contoh Logika Backend (Pseudocode / Laravel Style)

```php
// Controller Endpoint: /api/track-batch
public function storeBatch(Request $request)
{
    $events = $request->input('events');
    
    if (!empty($events)) {
        // Jangan lakukan DB::table('track')->insert($events); di sini!
        
        // Lemparkan tugas ke background worker (Queue)
        ProcessTrackingDataJob::dispatch($events); 
    }

    // Langsung kembalikan respon sukses agar TTFB frontend sangat cepat
    return response()->json(['status' => 'queued'], 202);
}
```

```php
// Job/Worker (Berjalan di background)
class ProcessTrackingDataJob implements ShouldQueue
{
    protected $events;

    public function __construct($events)
    {
        $this->events = $events;
    }

    public function handle()
    {
        // Di sinilah query database berat dieksekusi secara aman
        // Worker bisa memproses ratusan insert tanpa memblokir koneksi web
        DB::table('analytics_data')->insert($this->events);
    }
}
```

Dengan mengkombinasikan metode *batching* di frontend dan *queueing* di backend, sistem analytics kamu bisa mencatat data tanpa batas tanpa mengganggu performa halaman utama sama sekali.