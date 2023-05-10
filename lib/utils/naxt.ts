import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const _dirname = dirname(fileURLToPath(import.meta.url)).split(
  "node_modules"
)[0];

const uuid = function () {
  let t = Date.now ? +Date.now() : +new Date();
  return "_xxxxx".replace(/[x]/g, function (e) {
    const r = (t + 16 * Math.random()) % 16 | 0;
    return (t = Math.floor(t / 16)), ("x" === e ? r : (7 & r) | 8).toString(16);
  });
};

export class Element {
  [x: string]: Record<string, any>;
  children: any[] = [];
  // @ts-ignore
  nodeType: 2;
  // @ts-ignore
  tagName: string;
  // @ts-ignore
  style: Record<string, any> = {};
  constructor(tag: string) {
    this.tagName = tag;
  }
  // @ts-ignore
  appendChild(child: any /*Element*/ | string) {
    this.children.push(child);
  }
  setAttribute(key: string, value: any) {
    this[key] = value;
  }
  addEventListener(key: string, Listener: any) {
    this["on" + key] = Listener;
  }
  set innerHTML(srt: any) {
    this.children = [srt];
  }
}

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

export function compile(
  dependency: Record<string, string> | false,
  element: any
) {
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
      children.push(
        ...element.children.map(compile.bind(undefined, dependency))
      );
      // @ts-ignore
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

export async function compileHTML(Naxt_Element_Tree: any) {
  const HTML = compile(false, Naxt_Element_Tree);

  // the naxt script
  const naxt_script = `<script>

const naxt = {};

naxt.fns = ${JSON.stringify(HTML[1])}

// hydration process

// adding listeners 
for (const k in naxt.fns) {  
  naxt.fns[k] = new Function('return '+naxt.fns[k]+'')()
}
// calling all onmount effects
const mountListeners = document.querySelectorAll('[data-mount-id]')
for (let i = 0; i < mountListeners.length; i++) {
  const elem = mountListeners[i] 
  naxt.fns[elem.getAttribute("data-mount-id")]() 
  elem.removeAttribute("data-mount-id")
}
// console.log(naxt.fns) 
// console.log(mountListeners) 

// TODO: adding reactivity via srr Ref

</script>`;
  let html: string;
  try {
    html = await readFile(join(_dirname, "index.html"), "utf-8");
    html = html.replace("{mount}", HTML[0] + "\n" + naxt_script);
  } catch (error) {
    if (String(error).includes("index.html")) {
      throw new Error("cradova err: index.html not found in serving dir");
    } else {
      throw new Error(String(error));
    }
  }
  return html;
}

class naxtClass {
  createElement(tag: string) {
    return new Element(tag);
  }
  createTextNode(Text: string) {
    return Text;
  }
}

export const naxt = new naxtClass();
