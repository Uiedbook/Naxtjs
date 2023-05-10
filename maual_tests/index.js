import {
  div,
  compile,
  p,
  serve,
  h1,
  button,
  script,
  style,
} from "../dist/index.js";

const HTML = compile(
  false,
  div(
    script('console.log("hello world")'),
    style("body {color: green;}"),
    button(
      {
        "data-num": "0",
        onmount() {
          console.log(this);
        },
        onclick() {
          // this.style.color = "red";
          // console.log("hello world people");
          console.log(this);
          // lol
        },
      },
      "click to test"
    ),
    h1("Are we srr yet? yes", { style: { "background-color": "aqua" } }),
    // @ts-ignore
    p({ style: { "background-color": "red" } }, "hello world")
  )
);

const naxt_script = `<script>

const naxt = {};

naxt.fns = ${JSON.stringify(HTML[1])}

// hydration

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
</script>`;

await serve({ HTML: HTML[0], dependencies: [naxt_script] });

console.log(HTML);
