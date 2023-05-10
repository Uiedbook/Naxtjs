import { Element, naxt } from "./utils/naxt";
import { makeElement } from "./utils/elements";
// importing types declarations

("use strict");

const make = function (txx: any) {
  if (!txx.length) {
    return ["DIV"];
  }
  if (Array.isArray(txx)) {
    txx = txx[0];
  }
  let innerValue = "";
  if (txx.includes("|")) {
    [txx, innerValue] = txx.split("|");
    if (!txx) {
      return ["P", undefined, undefined, innerValue];
    }
  }
  let tag;
  if (!txx.includes("#")) {
    txx = txx.split(".");
    tag = txx.shift();
    if (!tag) {
      tag = "DIV";
    }
    return [tag, undefined, txx.join(" "), innerValue];
  } else {
    if (!txx.includes(".")) {
      txx = txx.split("#");
      tag = txx.shift();
      if (!tag) {
        tag = "DIV";
      }
      if (txx[0].includes(" ")) {
        txx = [txx[0].split(" ")[1]];
      }
      return [tag, txx[0], undefined, innerValue];
    }
  }
  txx = txx.split(".");
  const classes = [];
  const IDs = [];
  tag = !txx[0].includes("#") && txx.shift();
  if (!tag) {
    tag = "DIV";
  }
  for (let i = 0; i < txx.length; i++) {
    if (txx[i].includes("#")) {
      const item = txx[i].split("#");
      IDs.push(item[1]);
      if (i === 0) {
        tag = item[0];
        continue;
      }
      classes.push(item[0]);
      continue;
    }
    classes.push(txx[i]);
  }
  return [tag || "DIV", IDs[0], classes.join(" "), innerValue];
};

const _: any = (...element_initials: any[]) => {
  const initials = make(element_initials.shift());

  let props: any = undefined;
  let element: Element;
  try {
    element = naxt.createElement(initials[0]);
  } catch (error) {
    throw new TypeError(" ✘  Cradova err:  invalid tag given  " + initials[0]);
  }
  if (initials[2]) {
    if (props) {
      // @ts-ignore js knows
      props["className"] = initials[2];
    } else {
      props = { className: initials[2] };
    }
  }
  if (initials[1]) {
    if (props) {
      // @ts-ignore js knows
      props["id"] = initials[1];
    } else {
      props = { id: initials[1] };
    }
  }
  if (initials[3]) {
    if (props) {
      // @ts-ignore js knows
      props["innerText"] = initials[3];
    } else {
      props = { innerText: initials[3] };
    }
  }
  return makeElement(element, props, ...element_initials);
};
export * from "./utils/elements";
// export { createSignal } from "./utils/createSignal";
export { Screen } from "./utils/Screen";
export { Router } from "./utils/ssr";
export { compileHTML } from "./utils/naxt";

export {
  assert,
  assertOr,
  loop,
  // CradovaEvent,
  // lazy,
  // reference,
  // Ref,
} from "./utils/fns";

export default _;
