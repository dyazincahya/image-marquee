declare module "next/image" {
  import type { ComponentType } from "react";
  import type { ImageMarqueeImageComponentProps } from "./types";

  const Image: ComponentType<ImageMarqueeImageComponentProps>;
  export default Image;
}
