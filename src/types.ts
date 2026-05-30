import type {
  CSSProperties,
  ComponentType,
  ImgHTMLAttributes,
  ReactNode,
} from "react";

export type ImageMarqueeDirection = "left" | "right";
export type ImageMarqueeBackgroundRemovalMode = "canvas" | "blend";
export type ImageMarqueeCanvasRemovalAlgorithm =
  | "color-to-alpha"
  | "chroma-key";

export type ImageMarqueeImageComponentProps = {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  draggable?: boolean;
  priority?: boolean;
  loading?: ImgHTMLAttributes<HTMLImageElement>["loading"];
  sizes?: string;
  width?: number;
  height?: number;
  unoptimized?: boolean;
  "aria-hidden"?: boolean | "true" | "false";
};

export type ImageMarqueeProps = {
  /** Image source. Use a public path, remote URL, or imported asset string. */
  src: string;
  /** Accessible label for the first rendered image. Duplicate images are hidden from screen readers. */
  alt: string;
  /** Image height in px or any CSS length. Width is kept automatic by image ratio. */
  height?: number | string;
  /** Animation duration in seconds. Smaller value means faster movement. */
  speed?: number;
  /** Alias for speed when you prefer duration naming. */
  duration?: number;
  /** Marquee movement direction. */
  direction?: ImageMarqueeDirection;
  /** Pause animation when pointer hovers the marquee. */
  pauseOnHover?: boolean;
  /** Number of image copies. Minimum 2 to create a seamless loop. */
  repeat?: number;
  /** Space between repeated images. */
  gap?: number | string;
  /** Outer section padding. */
  padding?: number | string;
  /** Section background color. Defaults to #f2f4ff, or transparent when removeImageBackground is enabled. */
  backgroundColor?: string;
  /** Enable left/right edge fade overlays. Defaults to true, or false when removeImageBackground is enabled. */
  fade?: boolean;
  /** Fade overlay color. Defaults to backgroundColor. */
  fadeColor?: string;
  /** Fade overlay width. */
  fadeWidth?: number | string;
  /** Remove the image background. Uses canvas by default for real transparency. */
  removeImageBackground?: boolean;
  /** Background removal method. canvas changes near-white pixels to transparent; blend is CSS-only fallback. */
  backgroundRemovalMode?: ImageMarqueeBackgroundRemovalMode;
  /** Canvas algorithm. color-to-alpha gives smoother logo edges; chroma-key is a simpler threshold removal. */
  imageBackgroundRemovalAlgorithm?: ImageMarqueeCanvasRemovalAlgorithm;
  /** Target background color removed by canvas mode. */
  imageBackgroundColor?: string;
  /** Removal tolerance. Higher removes more near-background pixels. */
  imageBackgroundTolerance?: number;
  /** Soft edge range after tolerance for canvas removal. */
  imageBackgroundSoftness?: number;
  /** CSS blend mode used when backgroundRemovalMode is blend. */
  imageBlendMode?: CSSProperties["mixBlendMode"];
  /** Use a custom image component, e.g. next/image. */
  ImageComponent?: ComponentType<ImageMarqueeImageComponentProps>;
  /** Optional title or content rendered above the marquee. */
  children?: ReactNode;
  className?: string;
  wrapperClassName?: string;
  trackClassName?: string;
  imageClassName?: string;
  style?: CSSProperties;
  wrapperStyle?: CSSProperties;
  trackStyle?: CSSProperties;
  imageStyle?: CSSProperties;
  /** Passed to the rendered image component. */
  imageProps?: Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    | "src"
    | "alt"
    | "height"
    | "width"
    | "className"
    | "style"
    | "draggable"
    | "aria-hidden"
  > & {
    priority?: boolean;
    sizes?: string;
    width?: number;
    height?: number;
    unoptimized?: boolean;
  };
};
