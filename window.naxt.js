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
  if (html.includes("<")) {
    element.innerHTML = html;
  }
  naxt.hydrate();
};
naxt.hydrate = async () => {
  // load links
  const lds = Array.from(document.querySelectorAll("[data-naxt-load]"));
  await Promise.all(
    lds.map((el) => {
      const link = el.getAttribute("data-naxt-load");
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
    const d = {}; //${JSON.stringify(HTML[1])}
    for (const k in d) {
      naxt.fns[k] = new Function("return " + d[k] + "")();
    }
    naxt.done = true;
  }
};
naxt.hydrate();
