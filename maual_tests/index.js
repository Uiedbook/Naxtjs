import { writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";

import {
  div,
  h1,
  button,
  table,
  td,
  tr,
  th,
  tbody,
  span,
  naxt,
} from "../dist/index.js";

const HTML = () => {
  return div(
    {
      style: {
        display: "flex",
        flexDirection: "column",
      },
    },
    Orders(OrderData),
    h1("Are we srr yet? yes", {
      style: {
        // backgroundColor: "grey",
        margin: "auto",
      },
    }),
    button("click to find out!", {
      style: {
        padding: "1rem",
        borderRadius: "12px",
        margin: "3rem auto",
        maxWidth: "200px",
      },
      onclick() {
        alert("Seems like!");
      },
    }),
    div({ "data-naxt-load": "/q" }),
    div({ "data-naxt-load": "./index2.html" }),
    // div({ "data-naxt-load": "./index2.html" }),
    // div({ "data-naxt-load": "./index2.html" }),
    // div({ "data-naxt-load": "./index2.html" }),
    button(
      {
        "data-num": "0",
        style: {
          padding: "1rem",
          borderRadius: "12px",
          margin: "3rem auto",
          maxWidth: "200px",
        },
        onclick() {
          const idx = Number(this.getAttribute("data-num")) + 1;
          this.innerText = "current count is " + idx;
          this.setAttribute("data-num", idx);
        },
      },
      "click to run the counter"
    )
  );
};
const Orders = (data) => {
  return div(
    table(
      tr(th("Name"), th("Amount"), th("Status")),
      tbody(
        ...data.map((data) =>
          tr(
            td(data.name),
            td(data.amount),
            td(
              span(
                {
                  className: "status " + data.status.toLowerCase(),
                },
                data.status
              )
            )
          )
        )
      )
    )
  );
};

const OrderData = [{ status: "success", amount: 200, name: "john" }];

const writeH = async (file, HTML) => {
  let html = undefined;
  try {
    if (file.endsWith(".html")) {
      html = await readFile(file, "utf-8");
    } else {
      html = file;
    }
    html = html.replace("{mount}", HTML);
  } catch (error) {
    if (String(error).includes(".html")) {
      throw new Error("naxt err: " + file + " not found");
    } else {
      throw new Error(String(error));
    }
  }
  return html;
};

writeFileSync("index.html", await writeH("templ.html", naxt.pile(HTML())));

console.log(naxt.pile(HTML()));
console.log(naxt.pile(Orders(OrderData)));
console.log(naxt.pile(Orders(OrderData)));
writeFileSync("index2.html", naxt.pile(Orders(OrderData)));
