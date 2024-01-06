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

class naxtClass {
  createElement(tag: string) {
    return new Element(tag);
  }
  createTextNode(Text: string) {
    return Text;
  }
}

export const naxt = new naxtClass();
