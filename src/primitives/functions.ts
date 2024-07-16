import { randomBytes } from "node:crypto";
import { VJS_params_TYPE } from "./types";
import { naxtClass, Element as E, Element } from "./classes";

export function Rhoda(l: any[]): any[] {
  const fg = [];
  for (let ch of l) {
    if (Array.isArray(ch)) {
      fg.push(Rhoda(ch));
    } else {
      if (typeof ch === "function") {
        ch = ch();
      }
      if (typeof ch === "string" || typeof ch === "number") {
        fg.push(naxtClass.createTextNode(ch as string));
        continue;
      }
      if (ch instanceof E) {
        fg.push(ch);
      }
    }
  }
  return fg;
}

/**
 *
 * @param {expression} condition
 * @param {function} elements[]
 */

export function $if<E>(condition: any, ...elements: VJS_params_TYPE<E>): any {
  if (condition) {
    return elements;
  }
}

export function $ifelse(condition: any, ifTrue: any, ifFalse?: any) {
  if (condition) {
    return ifTrue;
  }
  return ifFalse;
}

export function $case<E = HTMLElement>(
  value: any,
  ...elements: VJS_params_TYPE<E>
) {
  return (key: any) => {
    if (key === value) {
      return elements;
    }
    return undefined;
  };
}
export function $switch(key: unknown, ...cases: ((key: any) => any)[]) {
  let elements;
  if (cases.length) {
    for (let i = 0; i < cases.length; i++) {
      elements = cases[i](key);
      if (elements) {
        break;
      }
    }
  }
  return elements;
}

type LoopData<Type> = Type[];

export function loop<Type>(
  datalist: LoopData<Type>,
  component: (
    value: Type,
    index?: number,
    array?: LoopData<Type>
  ) => HTMLElement | DocumentFragment | undefined
) {
  return Array.isArray(datalist)
    ? (datalist.map(component) as unknown as HTMLElement[])
    : undefined;
}

const uuid = (): string => {
  const PROCESS_UNIQUE = randomBytes(2);
  let index = ~~(Math.random() * 0xffffff);
  const inc = (index = (index + 1) % 0xffffff);
  const buffer = Buffer.alloc(5);
  // 3-byte counter
  buffer[0] = inc & 0xff;
  buffer[1] = (inc >> 8) & 0xff;
  buffer[2] = (inc >> 16) & 0xff;
  // 2-byte process unique
  buffer[4] = PROCESS_UNIQUE[0];
  buffer[3] = PROCESS_UNIQUE[1];
  return "_" + buffer.toString("hex");
};

const joinStyles = (data: { [s: string]: unknown } | ArrayLike<unknown>) => {
  let props = "";
  for (const [k, v] of Object.entries(data)) {
    if (v) {
      props = props.concat(
        k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`) +
          ":" +
          v +
          "; "
      );
    }
  }
  return props;
};
const joinProps = (data: { [s: string]: unknown } = {}) => {
  let props = "";
  for (const [k, v] of Object.entries(data)) {
    if (v) {
      if (k === "style") {
        if (!Object.keys(v).length) {
          data["style"] = undefined;
          continue;
        }
        props = props.concat(k + '="' + joinStyles(v as any) + '" ');
        continue;
      }
      if (k === "className") {
        props = props.concat("class" + '="' + v + '" ');
        continue;
      }
      props = props.concat(k + '="' + v + '" ');
    }
  }
  return props;
};

function pile(
  element: any,
  dependency?: Record<string, string>,
  s: boolean = true
) {
  if (typeof element === "string" || typeof element === "number") {
    return element as string;
  }
  if (!(element instanceof Element)) {
    return;
  }
  let topLevel = false;
  if (typeof dependency === "boolean") {
    topLevel = true;
  }
  if (!dependency) {
    dependency = {};
  }
  const children = [];
  let tagName = "div";
  let dom = "";
  //sanitize
  if (!element.tagName) {
    throw new Error("elements can't be compile twice");
  }
  for (const key in element) {
    //? tag
    if (key === "tagName") {
      tagName = element[key];
      element[key] = undefined;
      continue;
    }
    //? events
    if (typeof element[key] === "function" && key.startsWith("on")) {
      const code: string = element[key].toString();
      const firstcidx = code.indexOf(")");
      if (firstcidx !== -1) {
        const uid = uuid();
        dependency![uid] = "function ()" + code.slice(firstcidx + 1);
        if (key === "onmount") {
          // @ts-expect-error
          element["data-naxt-activate"] = uid;
          // @ts-expect-error
          element[key] = undefined;
        } else {
          // @ts-expect-error
          element[key] = "naxt.fns." + uid + ".apply(this)";
        }
      }
      continue;
    }
    //? children
    if (key == "children") {
      if (Array.isArray(element.children)) {
        children.push(
          ...element.children.map((ch: any) => pile(ch, dependency, false))
        );
      }
      // @ts-expect-error
      element[key] = undefined;
      continue;
    }
  }

  //? dom attributes
  dom = `<${tagName}${" " + joinProps(element)}>${children.join(
    ""
  )}</${tagName}>`;
  // ? put element back in pool
  if (topLevel) {
    naxtClass.saveToPool(element);
    return [dom, dependency];
  }
  if (s) {
    const fn = uuid();
    dom += `<!-- naxt-script-start --> \n <script>if (!window.naxt) {window.naxt = { fn: {} };} const ${fn}=${JSON.stringify(
      dependency
    )};for(const n in ${fn})window.naxt.fns[n]=new Function("return "+${fn}[n])();document.querySelectorAll("[data-naxt-activate]").forEach((el) => {window.naxt?.fns[el.getAttribute("data-naxt-activate")](el);});</script> \n <!-- naxt-script-end -->`;
  }
  return dom;
}

export const naxt = { pile };
