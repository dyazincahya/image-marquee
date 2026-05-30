import NextImage from "next/image";
import { ImageMarquee } from "./ImageMarquee";
import type { ImageMarqueeProps } from "./types";

export type NextImageMarqueeProps = Omit<ImageMarqueeProps, "ImageComponent">;

/**
 * Next.js entrypoint that renders images with next/image.
 *
 * Note: Next Image still needs width/height metadata. Provide imageProps.width
 * and imageProps.height for remote or public-path images, or import a static
 * image asset and pass its src when your Next setup exposes the dimensions.
 */
export function NextImageMarquee(props: NextImageMarqueeProps) {
  return <ImageMarquee {...props} ImageComponent={NextImage} />;
}

export { NextImageMarquee as ImageMarquee };
export type {
  ImageMarqueeBackgroundRemovalMode,
  ImageMarqueeCanvasRemovalAlgorithm,
  ImageMarqueeDirection,
  ImageMarqueeImageComponentProps,
  ImageMarqueeProps,
} from "./types";
