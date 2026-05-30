import "./styles.css";

import { useEffect, useState, type CSSProperties } from "react";
import type {
  ImageMarqueeImageComponentProps,
  ImageMarqueeProps,
} from "./types";

const Img = (props: ImageMarqueeImageComponentProps) => <img {...props} />;

const toCssLength = (value?: number | string) => {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
};

const clampRepeat = (repeat?: number) => Math.max(2, Math.floor(repeat ?? 2));

const parseColor = (color: string): [number, number, number] => {
  const normalized = color.trim().toLowerCase();

  if (normalized.startsWith("#")) {
    const hex = normalized.slice(1);
    const fullHex =
      hex.length === 3
        ? hex
            .split("")
            .map((char) => char + char)
            .join("")
        : hex;

    return [
      Number.parseInt(fullHex.slice(0, 2), 16),
      Number.parseInt(fullHex.slice(2, 4), 16),
      Number.parseInt(fullHex.slice(4, 6), 16),
    ];
  }

  const rgb = normalized.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgb) {
    return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  }

  return [255, 255, 255];
};

const clamp = (value: number, min = 0, max = 255) =>
  Math.min(max, Math.max(min, value));

const applyChromaKeyRemoval = (
  data: Uint8ClampedArray,
  target: [number, number, number],
  tolerance: number,
  softness: number,
) => {
  const [targetRed, targetGreen, targetBlue] = target;

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const alpha = data[index + 3];
    const distance = Math.hypot(
      red - targetRed,
      green - targetGreen,
      blue - targetBlue,
    );

    if (distance <= tolerance) {
      data[index + 3] = 0;
    } else if (softness > 0 && distance <= tolerance + softness) {
      const opacity = (distance - tolerance) / softness;
      data[index + 3] = Math.round(alpha * opacity);
    }
  }
};

const getChannelAlpha = (value: number, target: number) => {
  if (value < target) {
    return target === 0 ? 0 : (target - value) / target;
  }

  return target === 255 ? 0 : (value - target) / (255 - target);
};

const applyColorToAlphaRemoval = (
  data: Uint8ClampedArray,
  target: [number, number, number],
  tolerance: number,
  softness: number,
) => {
  const [targetRed, targetGreen, targetBlue] = target;
  const alphaThreshold = Math.min(0.95, Math.max(0, tolerance / 255));
  const alphaSoftness = Math.min(0.95, Math.max(0, softness / 255));

  for (let index = 0; index < data.length; index += 4) {
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    const originalAlpha = data[index + 3];
    const sourceAlpha = Math.max(
      getChannelAlpha(red, targetRed),
      getChannelAlpha(green, targetGreen),
      getChannelAlpha(blue, targetBlue),
    );

    let outputAlpha = sourceAlpha;
    if (sourceAlpha <= alphaThreshold) {
      outputAlpha = 0;
    } else if (
      alphaSoftness > 0 &&
      sourceAlpha <= alphaThreshold + alphaSoftness
    ) {
      outputAlpha = (sourceAlpha - alphaThreshold) / alphaSoftness;
    }

    if (outputAlpha === 0) {
      data[index + 3] = 0;
      continue;
    }

    data[index] = clamp((red - (1 - sourceAlpha) * targetRed) / sourceAlpha);
    data[index + 1] = clamp(
      (green - (1 - sourceAlpha) * targetGreen) / sourceAlpha,
    );
    data[index + 2] = clamp(
      (blue - (1 - sourceAlpha) * targetBlue) / sourceAlpha,
    );
    data[index + 3] = Math.round(originalAlpha * outputAlpha);
  }
};

const removeBackgroundFromImage = ({
  src,
  color,
  tolerance,
  softness,
  algorithm,
}: {
  src: string;
  color: string;
  tolerance: number;
  softness: number;
  algorithm: "color-to-alpha" | "chroma-key";
}) => {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", { willReadFrequently: true });

      if (!context) {
        reject(new Error("Canvas 2D context is not available."));
        return;
      }

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      context.drawImage(image, 0, 0);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const target = parseColor(color);
      const safeTolerance = Math.max(0, tolerance);
      const safeSoftness = Math.max(0, softness);

      if (algorithm === "chroma-key") {
        applyChromaKeyRemoval(data, target, safeTolerance, safeSoftness);
      } else {
        applyColorToAlphaRemoval(data, target, safeTolerance, safeSoftness);
      }

      context.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to create transparent image blob."));
          return;
        }

        resolve(URL.createObjectURL(blob));
      }, "image/png");
    };

    image.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`));
    };

    image.src = src;
  });
};

export function ImageMarquee({
  src,
  alt,
  height = 220,
  speed,
  duration,
  direction = "left",
  pauseOnHover = true,
  repeat = 2,
  gap = 0,
  padding = "50px 0 72px",
  backgroundColor,
  fade,
  fadeColor,
  fadeWidth = "min(10vw, 120px)",
  removeImageBackground = false,
  backgroundRemovalMode = "canvas",
  imageBackgroundRemovalAlgorithm = "color-to-alpha",
  imageBackgroundColor = "#ffffff",
  imageBackgroundTolerance = 18,
  imageBackgroundSoftness = 20,
  imageBlendMode = "multiply",
  ImageComponent = Img,
  children,
  className,
  wrapperClassName,
  trackClassName,
  imageClassName,
  style,
  wrapperStyle,
  trackStyle,
  imageStyle,
  imageProps,
}: ImageMarqueeProps) {
  const copyCount = clampRepeat(repeat);
  const resolvedDuration = duration ?? speed ?? 47;
  const gapLength = toCssLength(gap) ?? "0px";
  const [canvasProcessedSrc, setCanvasProcessedSrc] = useState<string>();
  const resolvedBackgroundColor =
    backgroundColor ?? (removeImageBackground ? "transparent" : "#f2f4ff");
  const resolvedFade = fade ?? !removeImageBackground;

  useEffect(() => {
    if (!removeImageBackground || backgroundRemovalMode !== "canvas") {
      setCanvasProcessedSrc(undefined);
      return;
    }

    let isCancelled = false;
    let objectUrl: string | undefined;

    removeBackgroundFromImage({
      src,
      color: imageBackgroundColor,
      tolerance: imageBackgroundTolerance,
      softness: imageBackgroundSoftness,
      algorithm: imageBackgroundRemovalAlgorithm,
    })
      .then((processedSrc) => {
        objectUrl = processedSrc;
        if (isCancelled) {
          URL.revokeObjectURL(processedSrc);
          return;
        }

        setCanvasProcessedSrc(processedSrc);
      })
      .catch(() => {
        if (!isCancelled) {
          setCanvasProcessedSrc(undefined);
        }
      });

    return () => {
      isCancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [
    backgroundRemovalMode,
    imageBackgroundColor,
    imageBackgroundRemovalAlgorithm,
    imageBackgroundSoftness,
    imageBackgroundTolerance,
    removeImageBackground,
    src,
  ]);

  const renderedSrc = canvasProcessedSrc ?? src;

  const cssVars = {
    "--image-marquee-height": toCssLength(height),
    "--image-marquee-duration": `${resolvedDuration}s`,
    "--image-marquee-gap": gapLength,
    "--image-marquee-padding": toCssLength(padding),
    "--image-marquee-background": resolvedBackgroundColor,
    "--image-marquee-fade-color":
      fadeColor ??
      (resolvedBackgroundColor === "transparent"
        ? "#f2f4ff"
        : resolvedBackgroundColor),
    "--image-marquee-fade-width": toCssLength(fadeWidth),
    "--image-marquee-image-blend-mode": imageBlendMode,
    "--image-marquee-translate": `calc(-${100 / copyCount}% - (${gapLength} / ${copyCount}))`,
  } as CSSProperties;

  const rootClassName = [
    "image-marquee",
    `image-marquee--${direction}`,
    pauseOnHover && "image-marquee--pause-on-hover",
    resolvedFade && "image-marquee--fade",
    removeImageBackground &&
      backgroundRemovalMode === "blend" &&
      "image-marquee--remove-image-background",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const imageClasses = ["image-marquee__image", imageClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={rootClassName} style={{ ...cssVars, ...style }}>
      {children ? (
        <div className="image-marquee__content">{children}</div>
      ) : null}
      <div
        className={["image-marquee__wrapper", wrapperClassName]
          .filter(Boolean)
          .join(" ")}
        style={wrapperStyle}
      >
        <div
          className={["image-marquee__track", trackClassName]
            .filter(Boolean)
            .join(" ")}
          style={trackStyle}
        >
          {Array.from({ length: copyCount }, (_, index) => {
            const isDuplicate = index > 0;

            return (
              <ImageComponent
                key={index}
                src={renderedSrc}
                alt={isDuplicate ? "" : alt}
                aria-hidden={isDuplicate ? true : undefined}
                className={imageClasses}
                style={imageStyle}
                draggable={false}
                {...imageProps}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
