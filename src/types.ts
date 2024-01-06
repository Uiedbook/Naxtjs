import * as CSS from "csstype";
import { Element } from "./primitives/classes";

type DataAttributes = { [key: `data-${string}`]: string };
type AriaAttributes = { [key: `aria-${string}`]: string };

export type VJSType<T> = (
  ...VJS: // children type
  (
    | undefined
    | string
    | Element
    | Element[]
    | DocumentFragment
    | DocumentFragment[]
    | TemplateStringsArray
    // property type
    | Partial<T>
    | (() => Element)
    | Partial<DataAttributes>
    | Partial<AriaAttributes>
    | CSS.Properties
    | {
        style?: CSS.Properties;
        onmount?: (this: T) => void;
      }
  )[]
) => T;

export type VJS_params_TYPE<T> =
  // children type
  (
    | undefined
    | string
    | Element
    | Element[]
    | DocumentFragment
    | DocumentFragment[]
    | TemplateStringsArray
    // property type
    | Partial<T>
    | (() => Element)
    | Partial<DataAttributes>
    | Partial<AriaAttributes>
    | CSS.Properties<string | number>
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
        onmount?: (this: T) => void;
      }
  )[];

export type VJS_Child_TYPE<T> = undefined | string | T | (() => T);

export type VJS_props_TYPE = {
  style?: CSS.Properties;
  onmount?: () => void;
};
