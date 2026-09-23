# CTA Button Naming Rules

## CTA Name Must Match the Clicked Button Text

Setiap tracking, analytics event, atau identifier yang berkaitan dengan CTA **harus menggunakan nama yang sesuai dengan teks tombol yang benar-benar diklik oleh user**.

### Rule

Jika teks tombol yang terlihat oleh user adalah:

`Konsultasi Gratis`

maka nama CTA yang dikirim ke analytics harus merepresentasikan tombol tersebut, misalnya:

```js
cta_name: "Konsultasi Gratis"
```

atau:

```js
button_name: "Konsultasi Gratis"
```

Jangan menggunakan nama generik atau nama yang tidak sesuai dengan tombol.

### Benar

Button:

```html
<button>Konsultasi Gratis</button>
```

Tracking:

```js
trackCTA({
  cta_name: "Konsultasi Gratis"
});
```

Button:

```html
<button>Gabung Sekarang</button>
```

Tracking:

```js
trackCTA({
  cta_name: "Gabung Sekarang"
});
```

### Salah

Button:

```html
<button>Konsultasi Gratis</button>
```

Tracking:

```js
cta_name: "Hero CTA"
```

atau:

```js
cta_name: "Button 1"
```

atau:

```js
cta_name: "WhatsApp Button"
```

jika teks tombol yang sebenarnya adalah `Konsultasi Gratis`.

## Dynamic CTA

Sebisa mungkin, jangan menulis nama CTA secara manual apabila nama tersebut bisa diambil langsung dari teks button.

Contoh:

```js
const ctaName = button.textContent.trim();
```

Kemudian gunakan nilai tersebut untuk tracking:

```js
trackCTA({
  cta_name: ctaName
});
```

Dengan begitu, jika copy tombol berubah dari:

`Konsultasi Gratis`

menjadi:

`Konsultasi Sekarang`

nama CTA pada tracking juga otomatis menjadi:

`Konsultasi Sekarang`

## Core Principle

> **What the user clicks is what we track.**

Nama CTA di analytics harus mencerminkan **label/button text yang dilihat dan diklik oleh user**, bukan nama internal section, posisi tombol, atau nama komponen developer.

Jika perlu mengetahui posisi tombol, simpan sebagai property terpisah.

Contoh:

```js
{
  event: "cta_click",
  cta_name: "Konsultasi Gratis",
  cta_location: "hero"
}
```

Bukan:

```js
{
  event: "cta_click",
  cta_name: "hero_cta"
}
```
