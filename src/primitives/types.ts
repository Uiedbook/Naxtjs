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
        alt?: string;
        for?: string;
        rel?: string;
        href?: string;
        type?: string;
        name?: string;
        rows?: string;
        value?: string;
        accept: string;
        action?: string;
        target?: string;
        method?: string;
        checked?: boolean;
        required?: string;
        frameBorder?: string;
        placeholder?: string;
        autocomplete?: string;
        style?: CSS.Properties;
        onmount?: () => void;
      }
  )[];
