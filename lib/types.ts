export type ElementType<T> = (
  ...VJS: (
    | string
    | undefined
    | Partial<T>
    | HTMLElement
    | (() => HTMLElement)
    | {
        /**
         * Inline css style fof this element
         */
        style?: Partial<CSSStyleDeclaration>;
        /**
         * called when this element get rendered
         */
        onmount?: () => void;
        /**
         * an innerText value for this element
         */
        text?: string;
        /**
         * a cradova reference object to bind this element to when it's created
         */
        reference?: any;
      }
  )[]
) => T;

export type RouterRouteObject = {
  _name: string;
  _html: any;
  _paramData: Record<string, any> | null | undefined;
  _delegatedRoutes: number | boolean;
  _Activate: (force: boolean) => Promise<void>;
  _deActivate: (params: object) => void;
  _package: (params: any) => void;
};

export type CradovaScreenType = {
  /**
   * Cradova screen
   * ---
   * title of the page
   */
  name: string;
  /**
   * Cradova screen
   * ---
   * a css className to add to screen when rendering it
   * Usually for adding css transitions
   *
   */
  transition?: string;
  /**
   * Cradova screen
   * ---
   * The component for the screen
   * @param data
   * @returns void
  
   */
  template: Function | HTMLElement;
  /**
   * Cradova screen
   * ---
   * Should this screen be cached after first render?
   * you can use Route.navigate(url, null, true) to force later
  
   */
  persist?: boolean;
};
