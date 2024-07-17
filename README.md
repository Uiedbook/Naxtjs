<br/>
<p align="center">
  <a href="https://github.com/uiedbook/Naxtjs">
    <img src="naxt.png" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">Naxt</h1>

  <p align="center">
  Naxt - SSR library for server-side javascript 
    <br/>
    <br/>
    <a href="https://github.com/uiedbook/Naxtjs#examples"><strong>Explore the 🎙️ docs »</strong></a>
    <br/>
    <br/>
    <a href="https://t.me/UiedbookHQ">Join Community</a>
    .
    <a href="https://github.com/uiedbook/Naxtjs/issues">Report Bug</a>
    .
    <a href="https://github.com/uiedbook/Naxtjs/issues">Request Feature</a>
  </p>
</p>

![Contributors](https://img.shields.io/github/contributors/Uiedbook/Naxtjs?color=dark-green) ![Issues](https://img.shields.io/github/issues/Uiedbook/Naxtjs) ![License](https://img.shields.io/github/license/Uiedbook/Naxtjs)
[![npm Version](https://img.shields.io/npm/v/naxtjs.svg)](https://www.npmjs.com/package/Naxtjs)[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/uiedbook/Naxt.js/blob/next/contributing.md)![Forks](https://img.shields.io/github/forks/uiedbook/Naxtjs?style=social) ![Stargazers](https://img.shields.io/github/stars/uiedbook/naxtjs?style=social)

# Contents

- [What is Naxtjs](#what-is-Naxtjs)
- [Installation](#installation)
- [Examples](#example)
- [Getting Help](#getting-help)

## What is Naxtjs?

Naxtjs is a javascript lib for server rending html similar to htmx.

But Naxtjs is rather light weight and simple. let see.

Naxt follows the [VJS specification](https://github.com/Uiedbook/cradova/blob/main/VJS_spec)

If you want support my telegram group (link below).

## Installation

### npm

```bash
npm i naxtjs
```

## Examples

## A basic component in Naxtjs:

```js
import { div, h1, naxt } from "naxtjs";

function Hello(name) {
  return h1("Hello " + name, {
    className: "title",
    style: {
      color: "grey",
    },
  });
}

const html = naxt.compile(div(Hello("peter"), Hello("joe"))); // html string

app.get("/", (req, res) => {
  res.send(html);
});
```

## client usage

```html
<!-- Load -->
<div data-naxt-load="/home.html"></div>
```

In the above code, Naxtjs will immediately replace the div with the html responces from the data-naxt-load attribute.

If no html comes, nothing happens.

```html
<!-- Onclick -->
<a
  data-naxt-event="main"
  data-naxt-link="/home.html"
  data-naxt-event-type="click"
>
  <span class="title">Home</span>
</a>
```

In ths above Naxtjs will replace the contents of the element with id "main" with the html responces from the href when the a tag is clicked.

If no html comes, nothing happens.

```js
const updateMain = (type, key) => {
  // ? params =   element, href
  naxt.update(
    document.getElementById("main"),
    "/o/search/?type=" +
      type +
      "&q=" +
      document.getElementById("search").value +
      "&kq=" +
      key
  );
};
```

In ths above function, Naxtjs will replace the contents of the element with the html responces from the href when the fucntion is called.

If no html comes, nothing happens.

See line 5 of dist/client.min.js to see how Naxtjs handles request headers for security measures when access content from servers

## Server Usage

```js
export const LoginPage = (req, res) => {
  const html = naxt.compile(
    div(
      img({
        src: "./logo.png",
        style: { maxWidth: "100px", margin: "4rem auto" },
      }),
      h1("Login"),
      input({ placeholder: "email", id: "email" }),
      input({ placeholder: "password", id: "password" }),
      button("Login", {
        id: "login",
        style: {
          color: "black",
        },
      })
    )
  );
  res.send(html);
};
```

There's a difference between naxt.compile and naxt.pile

Both compiles javascript to html, but can only be used on the server, but only naxt.compile can load naxtjs to the dom.
So if you are using naxt.pile on a page that has no naxtjs in the window yet, you will get errors

## Getting Help and Contributing

To get help on Naxtjs, join [Telegram](https://t.me/uiedbookHQ) Community.
