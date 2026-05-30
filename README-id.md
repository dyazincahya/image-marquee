<p align="center">
  <img src="./assets/icon.svg" alt="image marquee component icon" width="720" />
</p>

<p align="center">
  <a href="./README.md">🇬🇧 English</a> | <strong>🇮🇩 Indonesia</strong>
</p>

# Image Marquee

Komponen React ringan untuk menampilkan gambar super lebar sebagai marquee/loop horizontal yang halus, dengan fade di sisi kiri-kanan dan pause saat hover.

Cocok untuk gambar seperti daftar logo, partner, brand cloud, timeline visual, atau banner panorama.

<p align="center">
  <img src="./assets/demo.gif" alt="Demo animasi Image Marquee" width="900" />
</p>

## Fitur

- ✅ React + TypeScript
- ✅ Height-based sizing: cukup atur tinggi gambar, lebar mengikuti rasio gambar
- ✅ Pause on hover
- ✅ Kontrol kecepatan/durasi animasi
- ✅ Direction `left` atau `right`
- ✅ Edge fade yang bisa dikustom
- ✅ Support Next.js lewat entrypoint `image-marquee/next` yang memakai `next/image`
- ✅ Aksesibel: gambar duplikat otomatis `aria-hidden`
- ✅ Respect `prefers-reduced-motion`

## Instalasi

```bash
npm install image-marquee
```

atau:

```bash
yarn add image-marquee
pnpm add image-marquee
```

> Catatan: jika nama `image-marquee` sudah dipakai di npm, ganti `name` di `package.json` sebelum publish, misalnya `@dyazincahya/image-marquee` atau `react-image-marquee`.

## Penggunaan React biasa

```tsx
import { ImageMarquee } from "image-marquee";
import "image-marquee/styles.css";

export default function App() {
  return (
    <ImageMarquee
      src="/wide-img.png"
      alt="Logo list"
      height={220}
      speed={47}
      direction="left"
      removeImageBackground
    />
  );
}
```

## Penggunaan Next.js

Untuk Next.js, gunakan entrypoint khusus agar image renderer memakai `next/image`.

```tsx
import { ImageMarquee } from "image-marquee/next";
import "image-marquee/styles.css";

export default function Page() {
  return (
    <ImageMarquee
      src="/wide-img.png"
      alt="Logo list"
      height={220}
      speed={47}
      direction="left"
      imageProps={{
        width: 3000,
        height: 220,
        priority: true,
        sizes: "3000px",
      }}
    />
  );
}
```

`next/image` membutuhkan metadata `width` dan `height` untuk gambar dari `public` path atau remote URL. Karena itu, isi `imageProps.width` dan `imageProps.height` saat memakai `image-marquee/next`.

Jika ingin tetap import dari entrypoint utama dan mengatur sendiri renderer Next Image:

```tsx
import Image from "next/image";
import { ImageMarquee } from "image-marquee";
import "image-marquee/styles.css";

export default function Page() {
  return (
    <ImageMarquee
      src="/wide-img.png"
      alt="Logo list"
      height={220}
      ImageComponent={Image}
      imageProps={{ width: 3000, height: 220 }}
    />
  );
}
```

## Menghilangkan background putih pada gambar

Jika gambar berisi logo dengan background putih, aktifkan `removeImageBackground`:

```tsx
<ImageMarquee
  src="/wide-img.png"
  alt="Logo list"
  height={220}
  removeImageBackground
/>
```

Saat `removeImageBackground` aktif dan `backgroundColor` tidak diisi, komponen otomatis memakai konfigurasi terbaik:

```tsx
backgroundColor="transparent"
fade={false}
backgroundRemovalMode="canvas"
imageBackgroundRemovalAlgorithm="color-to-alpha"
```

Jadi section akan mengikuti background parent dan tidak ada fade overlay berwarna yang mengganggu.

Secara default fitur ini memakai `backgroundRemovalMode="canvas"` dan `imageBackgroundRemovalAlgorithm="color-to-alpha"`. Browser akan memproses image di client-side, lalu warna background target dibuat transparan dengan edge yang lebih halus.

Untuk gambar seperti logo-logo di card putih, konfigurasi yang biasanya paling bagus:

```tsx
<ImageMarquee
  src="/wide-img.png"
  alt="Logo list"
  height={220}
  removeImageBackground
  imageBackgroundRemovalAlgorithm="color-to-alpha"
  imageBackgroundTolerance={18}
  imageBackgroundSoftness={20}
/>
```

Jika background putihnya tidak hilang semua, naikkan tolerance:

```tsx
<ImageMarquee
  src="/wide-img.png"
  alt="Logo list"
  height={220}
  removeImageBackground
  imageBackgroundTolerance={60}
  imageBackgroundSoftness={24}
/>
```

Jika warna background yang mau dihapus bukan putih murni, atur target color:

```tsx
<ImageMarquee
  src="/wide-img.png"
  alt="Logo list"
  removeImageBackground
  imageBackgroundColor="#f8f8f8"
/>
```

Untuk fallback CSS-only, gunakan mode `blend`:

```tsx
<ImageMarquee
  src="/wide-img.png"
  alt="Logo list"
  removeImageBackground
  backgroundRemovalMode="blend"
  imageBlendMode="multiply"
/>
```

> Catatan: mode `canvas` bekerja paling aman untuk image dari origin yang sama, misalnya `/sample.png` di folder `public`. Untuk remote image, server image harus mengizinkan CORS; jika tidak, browser akan memblokir pembacaan pixel canvas.

## Dengan title/content di atas marquee

```tsx
<ImageMarquee src="/wide-img.png" alt="Logo partner" height={180}>
  <h2>Dipercaya oleh banyak brand</h2>
</ImageMarquee>
```

## Contoh konfigurasi lengkap

```tsx
<ImageMarquee
  src="/wide-img.png"
  alt="Logo list"
  height="clamp(120px, 18vw, 260px)"
  speed={28}
  direction="right"
  pauseOnHover
  repeat={2}
  gap={0}
  padding="50px 0 72px"
  backgroundColor="transparent"
  fade={false}
  fadeWidth="min(10vw, 120px)"
  removeImageBackground
/>
```

## Props

| Prop | Type | Default | Keterangan |
| --- | --- | --- | --- |
| `src` | `string` | wajib | Sumber gambar. Bisa public path, URL, atau hasil import asset string. |
| `alt` | `string` | wajib | Teks alternatif untuk gambar pertama. Duplikat otomatis disembunyikan dari screen reader. |
| `height` | `number \| string` | `220` | Tinggi gambar. Angka akan dianggap px. Lebar otomatis mengikuti rasio gambar. |
| `speed` | `number` | `47` | Durasi animasi dalam detik. Makin kecil makin cepat. |
| `duration` | `number` | - | Alias untuk `speed`. Jika ada, `duration` diprioritaskan. |
| `direction` | `'left' \| 'right'` | `'left'` | Arah gerak marquee. |
| `pauseOnHover` | `boolean` | `true` | Pause animasi saat hover. |
| `repeat` | `number` | `2` | Jumlah copy gambar. Minimum otomatis `2` agar loop seamless. |
| `gap` | `number \| string` | `0` | Jarak antar copy gambar. |
| `padding` | `number \| string` | `'50px 0 72px'` | Padding section luar. |
| `backgroundColor` | `string` | `'#f2f4ff'`, atau `'transparent'` saat `removeImageBackground` aktif | Warna background section. Set manual jika ingin section punya warna sendiri. |
| `fade` | `boolean` | `true`, atau `false` saat `removeImageBackground` aktif | Tampilkan fade overlay kiri-kanan. |
| `fadeColor` | `string` | `backgroundColor` atau `'#f2f4ff'` saat background transparan | Warna fade overlay. Jika parent background berbeda dan `backgroundColor` transparan, sebaiknya set `fadeColor` manual. |
| `fadeWidth` | `number \| string` | `'min(10vw, 120px)'` | Lebar fade overlay. |
| `removeImageBackground` | `boolean` | `false` | Menghapus background image. Default memakai canvas agar pixel target benar-benar menjadi transparan di browser. |
| `backgroundRemovalMode` | `'canvas' \| 'blend'` | `'canvas'` | Method penghapusan background. `canvas` memproses pixel, `blend` hanya CSS-only. |
| `imageBackgroundRemovalAlgorithm` | `'color-to-alpha' \| 'chroma-key'` | `'color-to-alpha'` | Algoritma canvas. `color-to-alpha` lebih halus untuk logo/card putih; `chroma-key` adalah threshold sederhana. |
| `imageBackgroundColor` | `string` | `'#ffffff'` | Warna target yang dihapus oleh mode `canvas`. Support hex dan rgb sederhana. |
| `imageBackgroundTolerance` | `number` | `18` | Toleransi removal. Naikkan jika background putih/off-white masih terlihat. |
| `imageBackgroundSoftness` | `number` | `20` | Area transisi agar tepi hasil removal lebih halus. |
| `imageBlendMode` | `CSSProperties['mixBlendMode']` | `'multiply'` | Blend mode yang dipakai saat `backgroundRemovalMode="blend"`. |
| `ImageComponent` | `ComponentType` | `<img>` | Renderer gambar custom, misalnya `next/image`. |
| `imageProps` | `object` | - | Props tambahan untuk image renderer. |
| `children` | `ReactNode` | - | Konten opsional di atas marquee. |
| `className` | `string` | - | Class untuk root section. |
| `wrapperClassName` | `string` | - | Class untuk wrapper marquee. |
| `trackClassName` | `string` | - | Class untuk track animasi. |
| `imageClassName` | `string` | - | Class untuk image. |
| `style` | `CSSProperties` | - | Inline style root. |
| `wrapperStyle` | `CSSProperties` | - | Inline style wrapper. |
| `trackStyle` | `CSSProperties` | - | Inline style track. |
| `imageStyle` | `CSSProperties` | - | Inline style image. |

## Styling tambahan

Import CSS bawaan satu kali di entry file aplikasi Anda:

```tsx
import "image-marquee/styles.css";
```

Di Next.js App Router, import CSS ini bisa diletakkan di `app/layout.tsx` atau file global stylesheet Anda.

Class CSS utama:

```css
.image-marquee {}
.image-marquee__content {}
.image-marquee__wrapper {}
.image-marquee__track {}
.image-marquee__image {}
```

## Lisensi

MIT © [Kang Cahya](https://github.com/dyazincahya)
