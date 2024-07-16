import * as CSS from "csstype";

type DataAttributes = { [key: `data-${string}`]: string };

type Attributes = {
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
  onmount?: (this: HTMLElement & Attributes) => void;
};

export type VJS_params_TYPE<E = HTMLElement> =
  // children type
  (
    | string
    | undefined
    | HTMLElement
    | HTMLElement[]
    // property type
    | Attributes
    | (() => HTMLElement)
    | Partial<Attributes>
    | Partial<E>
    | Record<string, (this: E) => void>
    | Partial<DataAttributes>
    | CSS.Properties<string | number>
    //
    | Partial<HTMLElement>
  )[];
