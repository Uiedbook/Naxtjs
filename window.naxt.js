// ? naxt object
const naxt = {};
window.naxt = naxt;
// ? naxt values
naxt.fns = {};
naxt.done = false;
naxt.fn = null;
naxt.link = {};
// ? naxt methods
naxt.update = async function (element, api) {
  const xhres = await fetch(api);
  const html = await xhres.text();
  if (html.includes("<")) {
    element.innerHTML = html;
  }
  naxt.hydrate();
};
naxt.onData = (fn, link) => {
  if (link) {
    naxt.link[link] = fn;
    return;
  }
  if (typeof fn === "function") {
    naxt.fn = fn;
  }
};
naxt.hydrate = async () => {
  // load links
  const lds = document.querySelectorAll("[data-naxt-load]");
  for (let a = 0; a < lds.length; a++) {
    const el = lds[a];
    const link = el.getAttribute("data-naxt-load");
    await naxt.update(el, link).then(() => {
      el.removeAttribute("data-naxt-load");
      if (naxt.link[link]) {
        naxt.link[link]();
      }
      naxt.hydrate();
    });
  }
  // handle click licks
  const as = document.querySelectorAll("[data-naxt-id]");
  for (let a = 0; a < as.length; a++) {
    const ae = as[a];
    ae.onclick = (e) => {
      e.preventDefault();
      naxt
        .update(
          document.getElementById(ae.getAttribute("data-naxt-id")),
          ae.href
        )
        .then(() => {
          naxt.hydrate();
          if (naxt.link[ae.href]) {
            naxt.link[ae.href]();
          }
        });
    };
  }
  // call dom waiters
  if (!naxt.done) {
    const d = {}; //${JSON.stringify(HTML[1])}
    for (const k in d) {
      naxt.fns[k] = new Function("return " + d[k] + "")();
    }
    naxt.done = true;
    naxt.fn && naxt.fn();
  }
};
naxt.hydrate();
