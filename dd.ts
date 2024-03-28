const tc = document.createElement("div");
tc.innerHTML = html;
const ses = tc.querySelectorAll("body script");
ses.forEach((se) => {
  const jsCode = se.textContent?.trim();
  const ns = document.createElement("script");
  ns.textContent = jsCode || "";
  document.body.appendChild(ns);
  ns.remove();
});
