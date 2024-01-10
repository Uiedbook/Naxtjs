import { randomBytes } from "node:crypto";
import { VJS_params_TYPE } from "../types";
import { naxt } from "./classes";
import { readFile } from "node:fs/promises";

export function Rhoda(l: any[]) {
  const fg = naxt.createElement("div");
  for (let ch of l) {
    if (Array.isArray(ch)) {
      fg.appendChild(Rhoda(ch));
    } else {
      if (ch?.render) {
        ch = ch.render() as any;
      }
      if (typeof ch === "function") {
        ch = ch();
        if (typeof ch === "function") {
          ch = ch();
        }
      }
      if (typeof ch === "string" || typeof ch === "number") {
        fg.appendChild(naxt.createTextNode(ch as string));
        continue;
      }
      if (ch instanceof Element) {
        fg.appendChild(ch);
      } else {
        if (typeof ch !== "undefined") {
          throw new Error(
            "  ✘  Cradova err:  invalid child type: " +
              ch +
              " (" +
              typeof ch +
              ")"
          );
        }
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

export function $if(condition: boolean, ...elements: VJS_params_TYPE) {
  if (condition) {
    return elements as HTMLElement[];
  }
  return undefined;
}

export function $ifelse(
  condition: boolean,
  ifTrue: VJS_params_TYPE,
  ifFalse: VJS_params_TYPE
) {
  if (condition) {
    return ifTrue;
  }
  return ifFalse;
}

export function $case(value: any, ...elements: VJS_params_TYPE) {
  return (key: any) => {
    if (key === value) {
      return elements as HTMLElement[];
    }
    return undefined;
  };
}
export function $switch(
  key: unknown,
  ...cases: ((key: any) => HTMLElement[] | undefined)[]
) {
  if (cases.length) {
    for (let i = 0; i < cases.length; i++) {
      const case_N = cases[i];
      const elements = case_N(key);
      if (elements) {
        return elements;
      }
    }
  }
  return undefined;
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
  if (typeof component !== "function") {
    throw new Error(
      " ✘  Cradova err :  Invalid component type, must be a function that returns html  "
    );
  }
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

export function pile(
  element: any,
  dependency?: Record<string, string>,
  s = true
) {
  if (typeof element === "string") {
    return element;
  }
  let topLevel = false;
  const initial_dependency = typeof dependency;
  if (initial_dependency === "boolean") {
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
    throw new Error("elements can't be compile twince");
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
        element[key] = "naxt.fns." + uid + ".apply(this)";
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
      element[key] = undefined;
      continue;
    }
  }

  //? dom attributes
  dom = `<${tagName}${" " + joinProps(element)}>${children.join(
    ""
  )}</${tagName}>`;
  if (topLevel) {
    return [dom, dependency];
  }
  if (s) {
    const fn = uuid();
    dom += `<script>const ${fn}=${JSON.stringify(
      dependency
    )};for(const n in ${fn})window.naxt.fns[n]=new Function("return "+${fn}[n])();</script>`;
  }
  //   dom += `
  // <script>
  // const ${fn} = ${JSON.stringify(dependency)};
  // for (const k in ${fn}) {
  //   window.naxt.fns[k] = new Function('return '+${fn}[k]+'')()
  // }
  // </script>`;
  return dom;
}

export async function compile(file: string, Naxt_Element_Tree: any) {
  const HTML = pile(Naxt_Element_Tree, false as any, false);
  //? The naxt hydration script
  const naxt_script = `<script>const naxt={};window.naxt=naxt,naxt.fns={},naxt.done=!1,naxt.update=async function(t,a){const n=await fetch(a),e=await n.text();e.includes("<")&&(t.innerHTML=e),naxt.hydrate()},naxt.hydrate=async()=>{const t=Array.from(document.querySelectorAll("[data-naxt-load]"));await Promise.all(t.map((t=>{const a=t.getAttribute("data-naxt-load");return t.removeAttribute("data-naxt-load"),naxt.update(t,a)}))),t.length&&await naxt.hydrate();const a=Array.from(document.querySelectorAll("[data-naxt-id]"));if(await Promise.all(a.map((async t=>{t.onclick=a=>(a.preventDefault(),naxt.update(document.getElementById(t.getAttribute("data-naxt-id")),t.href).then((()=>{naxt.hydrate()})))}))),!naxt.done){const t=${JSON.stringify(
    HTML[1]
  )};for(const a in t)naxt.fns[a]=new Function("return "+t[a])();naxt.done=!0}},naxt.hydrate();</script>`;
  let html: string | undefined = undefined;
  try {
    html = await readFile(file, "utf-8");
    html = html.replace("{mount}", HTML[0] + "\n" + naxt_script);
  } catch (error) {
    if (String(error).includes(".html")) {
      throw new Error("naxt err: " + file + " not found");
    } else {
      throw new Error(String(error));
    }
  }
  return html;
}
