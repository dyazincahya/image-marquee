<p align="center">
  <img src="./assets/icon.svg" alt="image marquee component icon" width="720" />
</p>

<p align="center">
  <strong>🇬🇧 English</strong> | <a href="./README-id.md">🇮🇩 Indonesia</a>
</p>

# Image Marquee

A lightweight React + TypeScript component for displaying very wide images as a smooth horizontal marquee, with hover pause, direction control, edge fade, and optional client-side background removal.

It is ideal for logo strips, partner sections, brand clouds, visual timelines, and wide panorama-style banners.

<p align="center">
  <img src="./assets/demo.gif" alt="Image Marquee animated demo" width="900" />
</p>

## Features

- ✅ React + TypeScript
- ✅ Height-based sizing: set the image height and the width follows the image ratio
- ✅ Pause on hover
- ✅ Configurable animation speed/duration
- ✅ Direction: `left` or `right`
- ✅ Customizable edge fade
- ✅ Next.js support through `image-marquee/next` using `next/image`
- ✅ Accessible duplicates: repeated images are automatically `aria-hidden`
- ✅ Respects `prefers-reduced-motion`
- ✅ Optional white/background removal via canvas `color-to-alpha`

## Installation

```bash
npm install image-marquee
```

or:

```bash
yarn add image-marquee
pnpm add image-marquee
```

> Note: if the `image-marquee` name is already taken on npm, change the `name` field in `package.json` before publishing, for example `@dyazincahya/image-marquee` or `react-image-marquee`.

## Basic React usage

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

## Next.js usage

For Next.js, use the dedicated entrypoint so images are rendered with `next/image`.

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

`next/image` requires `width` and `height` metadata for public-path or remote images, so provide `imageProps.width` and `imageProps.height` when using `image-marquee/next`.

If you prefer importing from the main entrypoint and passing the Next image renderer manually:

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

## Removing a white image background

If your wide image contains logos on white cards/backgrounds, enable `removeImageBackground`:

```tsx
<ImageMarquee
  src="/wide-img.png"
  alt="Logo list"
  height={220}
  removeImageBackground
/>
```

When `removeImageBackground` is enabled and `backgroundColor` is not set, the component automatically applies the recommended configuration:

```tsx
backgroundColor="transparent"
fade={false}
backgroundRemovalMode="canvas"
imageBackgroundRemovalAlgorithm="color-to-alpha"
```

This lets the section inherit the parent background and avoids colored fade overlays that may not match your layout.

By default, background removal uses `backgroundRemovalMode="canvas"` and `imageBackgroundRemovalAlgorithm="color-to-alpha"`. The browser processes the image client-side and converts the target background color into transparency with smoother edges.

Recommended configuration for logo strips on white cards:

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

If some white/off-white background remains, increase the tolerance:

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

If the target background is not pure white, configure the target color:

```tsx
<ImageMarquee
  src="/wide-img.png"
  alt="Logo list"
  removeImageBackground
  imageBackgroundColor="#f8f8f8"
/>
```

For a CSS-only fallback, use `blend` mode:

```tsx
<ImageMarquee
  src="/wide-img.png"
  alt="Logo list"
  removeImageBackground
  backgroundRemovalMode="blend"
  imageBlendMode="multiply"
/>
```

> Note: canvas mode works best for same-origin images, for example `/sample.png` in your `public` folder. For remote images, the image server must allow CORS; otherwise the browser will block canvas pixel reads.

## With title/content above the marquee

```tsx
<ImageMarquee src="/wide-img.png" alt="Partner logos" height={180}>
  <h2>Trusted by many brands</h2>
</ImageMarquee>
```

## Full configuration example

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

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | required | Image source. Use a public path, remote URL, or imported asset string. |
| `alt` | `string` | required | Alternative text for the first rendered image. Duplicates are hidden from screen readers. |
| `height` | `number \| string` | `220` | Image height. Numbers are treated as px. Width follows the image ratio. |
| `speed` | `number` | `47` | Animation duration in seconds. Smaller values move faster. |
| `duration` | `number` | - | Alias for `speed`. If provided, `duration` takes priority. |
| `direction` | `'left' \| 'right'` | `'left'` | Marquee movement direction. |
| `pauseOnHover` | `boolean` | `true` | Pause the animation on hover. |
| `repeat` | `number` | `2` | Number of image copies. Minimum is automatically clamped to `2` for seamless looping. |
| `gap` | `number \| string` | `0` | Gap between image copies. |
| `padding` | `number \| string` | `'50px 0 72px'` | Outer section padding. |
| `backgroundColor` | `string` | `'#f2f4ff'`, or `'transparent'` when `removeImageBackground` is enabled | Section background color. Set it manually if the section should own its background. |
| `fade` | `boolean` | `true`, or `false` when `removeImageBackground` is enabled | Show left/right edge fade overlays. |
| `fadeColor` | `string` | `backgroundColor`, or `'#f2f4ff'` when background is transparent | Fade overlay color. If the parent background differs and `backgroundColor` is transparent, set this manually. |
| `fadeWidth` | `number \| string` | `'min(10vw, 120px)'` | Fade overlay width. |
| `removeImageBackground` | `boolean` | `false` | Remove the image background. Defaults to canvas processing so target pixels become transparent in the browser. |
| `backgroundRemovalMode` | `'canvas' \| 'blend'` | `'canvas'` | Background removal method. `canvas` processes pixels; `blend` is CSS-only. |
| `imageBackgroundRemovalAlgorithm` | `'color-to-alpha' \| 'chroma-key'` | `'color-to-alpha'` | Canvas algorithm. `color-to-alpha` is smoother for logos/cards; `chroma-key` is a simpler threshold. |
| `imageBackgroundColor` | `string` | `'#ffffff'` | Target color removed by canvas mode. Supports hex and simple rgb strings. |
| `imageBackgroundTolerance` | `number` | `18` | Removal tolerance. Increase it if white/off-white background remains. |
| `imageBackgroundSoftness` | `number` | `20` | Transition range for smoother removal edges. |
| `imageBlendMode` | `CSSProperties['mixBlendMode']` | `'multiply'` | Blend mode used when `backgroundRemovalMode="blend"`. |
| `ImageComponent` | `ComponentType` | `<img>` | Custom image renderer, for example `next/image`. |
| `imageProps` | `object` | - | Additional props passed to the image renderer. |
| `children` | `ReactNode` | - | Optional content rendered above the marquee. |
| `className` | `string` | - | Class for the root section. |
| `wrapperClassName` | `string` | - | Class for the marquee wrapper. |
| `trackClassName` | `string` | - | Class for the animated track. |
| `imageClassName` | `string` | - | Class for the image. |
| `style` | `CSSProperties` | - | Inline style for the root section. |
| `wrapperStyle` | `CSSProperties` | - | Inline style for the wrapper. |
| `trackStyle` | `CSSProperties` | - | Inline style for the track. |
| `imageStyle` | `CSSProperties` | - | Inline style for the image. |

## Styling

Import the default CSS once in your app entry file:

```tsx
import "image-marquee/styles.css";
```

In Next.js App Router, import this CSS in `app/layout.tsx` or your global stylesheet.

Main CSS classes:

```css
.image-marquee {}
.image-marquee__content {}
.image-marquee__wrapper {}
.image-marquee__track {}
.image-marquee__image {}
```

## License

MIT © [Kang Cahya](https://github.com/dyazincahya)
