export class Element {
  [x: string]: Record<string, any>;
  children: any[] = [];
  tagName: any;
  style: any = {};
  constructor(tag: string) {
    this.tagName = tag;
  }
  appendChild(child: any /*Element*/ | string) {
    this.children.push(child);
  }
  append(child: (any /*Element*/ | string)[]) {
    this.children.push(...child);
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

class _naxtClass {
  pool: Element[] = [];
  createElement(tag: string) {
    if (this.pool.length) {
      const el = this.pool.shift();
      el!.children = [];
      el!.style = {};
      el!.tagName = tag;
      return el;
    }
    return new Element(tag);
  }
  createTextNode(Text: string) {
    return Text;
  }
  saveToPool(ele: Element) {
    this.pool.push(ele);
  }
}

export const naxtClass = new _naxtClass();
