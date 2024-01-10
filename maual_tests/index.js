import { writeFileSync } from "node:fs";
import { div, compile, h1, button, pile } from "../dist/index.js";

const HTML = div(
  h1("Are we srr yet? yes", {
    style: { backgroundColor: "grey", margin: "auto" },
  }),
  div({ "data-naxt-load": "/q" }),
  div({ "data-naxt-load": "/b" }),
  div({ "data-naxt-load": "/c" }),
  div({ "data-naxt-load": "/d" }),
  button(
    {
      "data-num": "0",
      onclick() {
        const idx = Number(this.getAttribute("data-num")) + 1;
        this.innerText = "current count is " + idx;
        this.setAttribute("data-num", idx);
      },
    },
    "click to test"
  )
);
writeFileSync("test.html", await compile("maual_tests/index.html", HTML));

console.log(pile(HTML));
