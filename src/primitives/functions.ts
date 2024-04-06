import { randomBytes } from "node:crypto";
import { VJS_params_TYPE } from "./types";
import { naxt, Element as E } from "./classes";
import { readFile } from "node:fs/promises";

export function Rhoda(l: any[]): any[] {
  const fg = [];
  for (let ch of l) {
    if (Array.isArray(ch)) {
      fg.push(Rhoda(ch));
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
        fg.push(naxt.createTextNode(ch as string));
        continue;
      }
      if (ch instanceof E) {
        fg.push(ch);
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
  if (!element) {
    throw new Error("invalid element!", element);
  }
  if (typeof element === "string" || typeof element === "number") {
    return element as string;
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
          element["data-naxt-activate"] = uid;
          element[key] = undefined;
        } else {
          element[key] = "naxt.fns." + uid + "()";
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
    dom += `<!-- naxt-script-start --> \n <script>const ${fn}=${JSON.stringify(
      dependency
    )};for(const n in ${fn})window.naxt.fns[n]=new Function("return "+${fn}[n])();document.querySelectorAll("[data-naxt-activate]").forEach((el) => {naxt.fns[el.getAttribute("data-naxt-activate")](el);});</script> \n <!-- naxt-script-end -->`;
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
  const naxt_script = `<script>
  // ? naxt object
const naxt = {};
window.naxt = naxt;
// ? naxt values
naxt.fns = {};
naxt.done = false;
// ? naxt methods
naxt.update = async function (element, api) {
  const xhres = await fetch(api);
  const html = await xhres.text();
  console.log('naxt updating boohoo 1...', html)
  if (html.includes("<")) {
    element.innerHTML = html;
    const tc = document.createElement("div");
    tc.innerHTML = html;
    const ses = tc.querySelectorAll("body script");
    console.log('naxt updating boohoo 2...', ses)
    ses.forEach((se) => {
      console.log('naxt updating boohoo 3...', se)
      const jsCode = se.textContent?.trim();
      console.log('naxt updating boohoo 4...', jsCode)
      const ns = document.createElement("script");
      ns.textContent = jsCode || "";
      document.body.appendChild(ns);
      // ns.remove();
    });
  }
  naxt.hydrate();
};
naxt.refresh = (el) => {  
    if (el) {
      const link = el.getAttribute("data-naxt-refresh-load");
      return naxt.update(el, link);
    }
};
naxt.hydrate = async () => {
  // load links
  const lds = Array.from(document.querySelectorAll("[data-naxt-load]"));
  await Promise.all(
    lds.map((el) => {
      const link = el.getAttribute("data-naxt-load");
      el.setAttribute("data-naxt-refresh-load", link);
      el.removeAttribute("data-naxt-load");
      return naxt.update(el, link);
    })
  );
  if (lds.length) {
    await naxt.hydrate();
  }
  // handle click licks
  const as = Array.from(document.querySelectorAll("[data-naxt-id]"));
  await Promise.all(
    as.map(async (ae) => {
      ae.onclick = (e) => {
        e.preventDefault();
        return naxt
          .update(
            document.getElementById(ae.getAttribute("data-naxt-id")),
            ae.href
          )
          .then(() => {
            naxt.hydrate();
          });
      };
    })
  );
  // call dom waiters
  if (!naxt.done) {
    const d =  ${JSON.stringify(HTML[1])};
    for (const k in d) {
      naxt.fns[k] = new Function("return " + d[k] + "")();
    }
    document.querySelectorAll("[data-naxt-activate]").forEach((el) => {naxt.fns[el.getAttribute("data-naxt-activate")](el);});
    naxt.done = true;
  }
};
naxt.hydrate();
  </script>`;

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
