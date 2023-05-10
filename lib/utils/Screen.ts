import { Element, compileHTML, naxt } from "./naxt.js";
import { CradovaScreenType } from "../types.js";
import { frag } from "./fns.js";

/**
 *  Cradova Screen
 * ---
 * create instances of manageable pages and scaffolds
 * @param name
 * @param template
 * @param transitions
 */

export class Screen {
  /**
   * this should be a cradova screen component
   */
  public _html: Function;
  /**
   * this is a set of added html to the screen
   */
  public _secondaryChildren: Array<Element> = [];
  /**
   * error handler for the screen
   */
  public errorHandler: (() => void) | null = null;
  /**
   * used internally
   */
  public _name: string;
  private _packed = false;
  private _template = naxt.createElement("div");
  private _callBack: (() => Promise<void> | void) | undefined;
  private _persist = true;
  private _data: unknown;
  public _params: Record<string, any> | null = null;
  private _transition;
  private _compileHTML: string = "";
  //
  constructor(cradova_screen_initials: CradovaScreenType) {
    const { template, name, persist, transition } = cradova_screen_initials;
    // @ts-ignore
    this._html = template;
    this._name = name;
    this._transition = transition || "";
    this._template.setAttribute("id", "cradova-screen-set");
    if (typeof persist === "boolean") {
      this._persist = persist;
    }
  }

  get _paramData(): typeof this._params {
    return this._params;
  }

  set _paramData(params: typeof this._params) {
    if (params) {
      this._params = params;
    }
  }
  setErrorHandler(errorHandler: () => void) {
    this.errorHandler = errorHandler;
  }
  async _package() {
    // @ts-ignore
    if (this._html.render) {
      // @ts-ignore
      this._template.appendChild(this._html.render(this._data));
    }
    if (typeof this._html === "function") {
      let fuc = (await this._html.apply(this, this._data)) as any;
      if (!(fuc instanceof Element)) {
        console.error("got  ", fuc);
        throw new Error(
          " ✘  Cradova err: invalid html provided by screen" + this._name
        );
      } else {
        this._template.innerHTML = "";
        this._template.appendChild("<title>" + this._name + "</title>");
        this._template.appendChild(fuc);
      }
    }

    if (!this._template.children.length) {
      console.error(" ✘  Cradova err: expected a screen but got ", this._html);
      throw new Error(
        " ✘  Cradova err: only functions that returns a cradova element is valid as screen"
      );
    }
    if (this._secondaryChildren.length) {
      let i = 0;
      while (this._secondaryChildren.length - i !== 0) {
        if (!(this._secondaryChildren[i] instanceof Element)) {
          console.log("got  ", this._secondaryChildren[i]);
          throw new Error(
            " ✘  Cradova err: invalid html provided by screen" + this._name
          );
        } else {
          this._template.appendChild(this._secondaryChildren[i]);
        }
        i++;
      }
    }
    this._compileHTML = await compileHTML(this._template);
    // resetting if persist is false
    if (!this._persist) {
      this._template = naxt.createElement("div");
      this._template.setAttribute("id", "cradova-screen-set");
    }
  }
  onActivate(cb: () => Promise<void> | void) {
    this._callBack = cb as any;
  }
  addChild(...addOns: Element[]) {
    this._secondaryChildren.push(frag(addOns));
  }
  async _Activate(force?: boolean) {
    if (!this._persist || force) {
      await this._package();
    } else {
      if (!this._packed) {
        this._packed = true;
        await this._package();
      }
    }
    if (this._transition) {
      this._template.classList.add(this._transition);
    }
    if (this._callBack) {
      await this._callBack();
    }
    return this._compileHTML;
  }
}
