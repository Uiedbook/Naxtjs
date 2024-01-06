import { VJS_Child_TYPE } from "../types";
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

export function $if<Type>(
  condition: boolean,
  ...elements: VJS_Child_TYPE<Type | HTMLElement>[]
) {
  if (condition) {
    return elements as HTMLElement[];
  }
  return undefined;
}

export function $ifelse<Type>(
  condition: boolean,
  ifTrue:
    | VJS_Child_TYPE<Type | HTMLElement>
    | VJS_Child_TYPE<Type | HTMLElement>[],
  ifFalse:
    | VJS_Child_TYPE<Type | HTMLElement>
    | VJS_Child_TYPE<Type | HTMLElement>[]
) {
  if (condition) {
    return ifTrue;
  }
  return ifFalse;
}

export function $case<Type>(
  value: any,
  ...elements: VJS_Child_TYPE<Type | HTMLElement>[]
) {
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
const uuid = function () {
  let t = Date.now ? +Date.now() : +new Date();
  return "_xxxxx".replace(/[x]/g, function (e) {
    const r = (t + 16 * Math.random()) % 16 | 0;
    return (t = Math.floor(t / 16)), ("x" === e ? r : (7 & r) | 8).toString(16);
  });
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
const joinProps = (
  data: { [s: string]: unknown } | ArrayLike<unknown> = {}
) => {
  let props = "";
  for (const [k, v] of Object.entries(data)) {
    if (v) {
      if (k === "style") {
        if (!Object.keys(v).length) {
          // @ts-ignore
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

function pile(dependency: Record<string, string> | false, element: any) {
  if (typeof element === "string") {
    return element;
  }
  let topLevel = false;
  if (!dependency) {
    dependency = {};
    topLevel = true;
  }
  const children = [];
  let tagName = "div";
  let dom = "";
  //sanitize
  for (const key in element) {
    // tag
    if (key === "tagName") {
      tagName = element[key];
      // @ts-ignore
      element[key] = undefined;
      continue;
    }
    // events
    if (typeof element[key] === "function") {
      if (!key.startsWith("on")) {
        element[key].apply(element);
        element[key] = undefined;
      } else {
        const uid = uuid();
        if (key === "onmount") {
          dependency[uid] =
            "function ()" + element[key].toString().split("()")[1];
          element["data-mount-id"] = uid;
          element[key] = undefined;
        } else {
          dependency[uid] =
            "function ()" + element[key].toString().split("()")[1];
          element[key] = "naxt.fns." + uid + ".bind(this)()";
        }
      }
      // @ts-ignore
      continue;
    }
    // children
    if (key == "children") {
      children.push(...element.children.map(pile.bind(undefined, dependency)));
      element[key] = undefined;
      continue;
    }
  }
  // property
  dom = `<${tagName}${" " + joinProps(element)}>${children.join(
    " "
  )}</${tagName}>`;
  if (topLevel) {
    return [dom, dependency];
  }
  return dom;
}

export async function compile(file: string, Naxt_Element_Tree: any) {
  const HTML = pile(false, Naxt_Element_Tree);
  // the naxt script
  // TODO: adding reactivity via srrRef
  //? comments
  // hydration process = 1
  // adding listeners = 2
  // calling all onmount effects = 3
  const naxt_script = `<script>
  // 1
  const naxt = {};
  naxt.fns = ${JSON.stringify(HTML[1])}
  // 2
  for (const k in naxt.fns) {  
    naxt.fns[k] = new Function('return '+naxt.fns[k]+'')()
  }
  // 3
const mountListeners = document.querySelectorAll('[data-mount-id]')
for (let i = 0; i < mountListeners.length; i++) {
  const elem = mountListeners[i] 
  naxt.fns[elem.getAttribute("data-mount-id")]() 
  elem.removeAttribute("data-mount-id")
} 
</script>`;
  let html: string | undefined = undefined;
  try {
    html = await readFile(file, "utf-8");
    html = html.replace(
      "{mount}",
      HTML[0] + (Object.keys(HTML[1]).length !== 0 ? "\n" + naxt_script : "")
    );
  } catch (error) {
    if (String(error).includes(".html")) {
      throw new Error("naxt err: " + file + " not found");
    } else {
      throw new Error(String(error));
    }
  }
  return html;
}
