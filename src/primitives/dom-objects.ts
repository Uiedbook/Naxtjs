import { VJS_params_TYPE } from "./types";
import { Rhoda } from "./functions";
import { Element, naxt } from "./classes";

export const makeElement = (
  element: any,
  ElementChildrenAndPropertyList: VJS_params_TYPE
) => {
  let props: Record<string, any> | undefined = undefined,
    text: string | number | undefined = undefined;
  //? getting children ready
  if (ElementChildrenAndPropertyList.length) {
    for (let i = 0; i < ElementChildrenAndPropertyList.length; i++) {
      let child = ElementChildrenAndPropertyList[i] as any;

      if (typeof child === "function") {
        child = child() as any;
        if (typeof child === "function") {
          child = child() as any;
        }
      }
      // appending child
      if (child instanceof Element) {
        element.appendChild(child);
        continue;
      }
      // children array
      if (Array.isArray(child)) {
        element.appendChild(Rhoda(child));
        continue;
      }
      // getting innerText
      if (typeof child === "string" || typeof child === "number") {
        text = child;
        continue;
      }
      // getting props
      if (typeof child === "object") {
        if (!props) {
          props = child;
        } else {
          props = Object.assign(props, child);
        }
        continue;
      }
    }
  } else {
    return element;
  }

  //? adding props
  if (typeof props === "object") {
    // adding attributes
    for (const [prop, value] of Object.entries(props)) {
      // adding styles
      if (prop === "style" && typeof value === "object") {
        Object.assign(element.style, value);
        continue;
      }

      // data-(s)
      if (prop.includes("data-")) {
        element.setAttribute(prop, value as string);
        continue;
      }

      // aria-(s)
      if (prop.includes("aria-")) {
        element.setAttribute(prop, value as string);
        continue;
      }

      // for compatibility
      if (
        typeof element.style[prop as unknown as number] !== "undefined" &&
        prop !== "src"
      ) {
        element.style[prop as unknown as number] = value as string;
        continue;
      }
      // trying to set other values
      (element as unknown as Record<string, unknown>)[prop] = value;
      // event of error and it checking has been removed, because this happens at runtime
    }
  }
  if (text) {
    element.appendChild(naxt.createTextNode(text as string));
  }
  return element;
};

export const cra = <E extends HTMLElement>(tag: string) => {
  const extend = (...Children_and_Properties: VJS_params_TYPE): E =>
    makeElement(new Element(tag), Children_and_Properties);
  return extend;
};

export const a = cra<HTMLAnchorElement>("a");
export const script = cra<HTMLAnchorElement>("script");
export const style = cra<HTMLAnchorElement>("style");
export const article = cra<HTMLElement>("article");
export const audio = cra<HTMLAudioElement>("audio");
export const br = cra<HTMLBRElement>("br");
export const button = cra<HTMLButtonElement>("button");
export const canvas = cra<HTMLCanvasElement>("canvas");
export const caption = cra<HTMLTableCaptionElement>("caption");
export const col = cra<HTMLTableColElement>("col");
export const colgroup = cra<HTMLOptGroupElement>("colgroup");
export const datalist = cra<HTMLDataListElement>("datalist");
export const details = cra<HTMLDetailsElement>("details");
export const dialog = cra<HTMLDialogElement>("dialog");
export const div = cra<HTMLDivElement>("div");
export const em = cra<HTMLElement>("em");
export const embed = cra<HTMLEmbedElement>("embed");
export const figure = cra<HTMLElement>("figure");
export const footer = cra<HTMLElement>("footer");
export const form = cra<HTMLFormElement>("form");
export const h1 = cra<HTMLHeadingElement>("h1");
export const h2 = cra<HTMLHeadingElement>("h2");
export const h3 = cra<HTMLHeadingElement>("h3");
export const h4 = cra<HTMLHeadingElement>("h4");
export const h5 = cra<HTMLHeadingElement>("h5");
export const h6 = cra<HTMLHeadingElement>("h6");
export const head = cra<HTMLHeadElement>("head");
export const header = cra<HTMLHeadElement>("header");
export const hr = cra<HTMLHRElement>("hr");
export const i = cra<HTMLLIElement>("i");
export const iframe = cra<HTMLIFrameElement>("iframe");
export const img = cra<HTMLImageElement>("img");
export const input = cra<HTMLInputElement>("input");
export const label = cra<HTMLLabelElement>("label");
export const li = cra<HTMLLIElement>("li");
export const main = cra<HTMLElement>("main");
export const nav = cra<HTMLElement>("nav");
export const ol = cra<HTMLOListElement>("ol");
export const optgroup = cra<HTMLOptGroupElement>("optgroup");
export const option = cra<HTMLOptionElement>("option");
export const p = cra<HTMLParagraphElement>("p");
export const progress = cra<HTMLProgressElement>("progress");
export const q = cra<HTMLQuoteElement>("q");
export const section = cra<HTMLElement>("section");
export const select = cra<HTMLSelectElement>("select");
export const source = cra<HTMLSourceElement>("source");
export const span = cra<HTMLSpanElement>("span");
export const strong = cra<HTMLElement>("strong");
export const summary = cra<HTMLElement>("summary");
export const table = cra<HTMLTableElement>("table");
export const tbody = cra<HTMLTableColElement>("tbody");
export const td = cra<HTMLTableCellElement>("td");
export const template = cra<HTMLTemplateElement>("template");
export const textarea = cra<HTMLTextAreaElement>("textarea");
export const th = cra<HTMLTableSectionElement>("th");
export const title = cra<HTMLTitleElement>("title");
export const tr = cra<HTMLTableRowElement>("tr");
export const track = cra<HTMLTrackElement>("track");
export const u = cra<HTMLUListElement>("u");
export const ul = cra<HTMLUListElement>("ul");
export const video = cra<HTMLVideoElement>("video");
export const svg = (
  svg: string,
  ...properties: VJS_params_TYPE
): HTMLSpanElement => {
  return span(svg, ...properties);
};
