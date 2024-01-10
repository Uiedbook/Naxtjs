import * as CSS from "csstype";

type DataAttributes = { [key: `data-${string}`]: string };
type AriaAttributes = { [key: `aria-${string}`]: string };

export type VJS_params_TYPE =
  // children type
  (
    | undefined
    | string
    | HTMLElement
    | HTMLElement[]
    | Partial<HTMLElement>
    | (() => HTMLElement)
    | Partial<DataAttributes>
    | Partial<AriaAttributes>
    | {
        src?: string;
        href?: string;
        placeholder?: string;
        type?: string;
        action?: string;
        name?: string;
        alt?: string;
        for?: string;
        method?: string;
        rows?: string;
        value?: string;
        target?: string;
        rel?: string;
        required?: string;
        frameBorder?: string;
        style?: CSS.Properties;
      }
  )[];
