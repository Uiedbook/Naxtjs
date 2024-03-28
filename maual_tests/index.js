import { writeFileSync } from "node:fs";
import {
  div,
  compile,
  h1,
  button,
  pile,
  p,
  h3,
  table,
  td,
  tr,
  th,
  tbody,
  span,
} from "../dist/index.js";

const HTML = () => {
  return div(
    {
      style: {
        display: "flex",
        flexDirection: "column",
      },
      onmount() {
        alert("hurray!");
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
    div({ "data-naxt-load": "/b" }),
    div({ "data-naxt-load": "/c" }),
    div({ "data-naxt-load": "/d" }),
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
writeFileSync("test.html", await compile("maual_tests/index.html", HTML()));

// console.log(pile(HTML()));
// console.log(pile(Orders(OrderData)));
// console.log(pile(Orders(OrderData)));
