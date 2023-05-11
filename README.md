<br/>
<p align="center">
  <a href="https://github.com/uiedbook/Naxtjs">
    <img src="naxt.png" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">Naxtjs</h1>

  <p align="center">
    Naxtjs is a Cradova based framework for server side rendering.
    <br/>
    <br/>
    <a href="https://github.com/uiedbook/Naxtjs#examples"><strong>Explore the 🎙️ docs »</strong></a>
    <br/>
    <br/>
    <a href="https://t.me/Naxtjsframework">Join Community</a>
    .
    <a href="https://github.com/uiedbook/Naxtjs/issues">Report Bug</a>
    .
    <a href="https://github.com/uiedbook/Naxtjs/issues">Request Feature</a>
  </p>
</p>

![Contributors](https://img.shields.io/github/contributors/Uiedbook/Naxtjs?color=dark-green) ![Issues](https://img.shields.io/github/issues/Uiedbook/Naxtjs) ![License](https://img.shields.io/github/license/Uiedbook/Naxtjs)
[![npm Version](https://img.shields.io/npm/v/Naxtjs.svg)](https://www.npmjs.com/package/Naxtjs)[![npm Downloads](https://img.shields.io/npm/dm/Naxtjs.svg)](https://www.npmjs.com/package/Naxtjs)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/uiedbook/Naxtjs.js/blob/next/contributing.md)![Forks](https://img.shields.io/github/forks/uiedbook/Naxtjs?style=social) ![Stargazers](https://img.shields.io/github/stars/uiedbook/Naxtjs?style=social)

# Contents

- [What is Naxtjs](#what-is-Naxtjs)
- [Why Naxtjs?](#whats-the-benefit)
- [Installation](#installation)
- [Examples](#examples)
- [Documentation](#documentation)
- [Getting Help](#getting-help)

## What is Naxtjs?

    Naxtjs is a Cradova based framework for server side rendering.

Naxt is an ultra fast, and performant, ssr framework for javascript and typescript.

Naxtjs follows the [VJS specification](https://github.com/uiedbook/Naxtjs/blob/main/spec.md)

## What's the benefit?

Naxtjs is aimed to be fast and simple with and fewer abstractions and yet easily composable.

## Is this a big benefit?

Undoubtedly, this provides a significant advantage. You can experience it firsthand and decide.

[current version changes](https://github.com/uiedbook/Naxtjs/blob/main/CHANGELOG.md#v100)

## Installation

### CDN sources

```html
<!-- unpkg -->

<script src="https://unpkg.com/Naxtjs/dist/index.js"></script>

<!--    js deliver -->

<script src="https://cdn.jsdelivr.net/npm/Naxtjs/dist/index.js"></script>
```

### npm

```bash
npm i Naxtjs
```

## Examples

Many aspects of Naxtjs are not reflected in the following example. More functionality will be entailed in future docs.

## A basic component in Naxtjs:

```js
import { div, h1, compileHTML } from "Naxtjs";

function Hello(name) {
  return h1("Hello " + name, {
    className: "title",
    style: {
      color: "grey",
    },
  });
}

const html = compileHTML(div(Hello("peter"), Hello("joe")));

document.body.append(html);
```

## A simple naxt app:

```js
import {
  Screen,
  Router,
  div,
  img,
  a,
  p,
  header,
  style,
  compileHTML,
} from "naxt";
const h = async function () {
  console.log(this._params);
  return div(
    { className: "App" },
    header(
      { className: "App-header" },
      img({ src: "/src/naxt.png", className: "App-logo", alt: "logo" }),
      p("Edit <code>src/index.js</code> and save and reload."),
      a(
        {
          className: "App-link",
          href: "/",
          onclick() {
            console.log("hello people of the world");
          },
        },
        "Hello Thomas"
      )
    ),
    // a simple way to add styles
    style(`
    html, body {
      padding: 0;
      margin: 0;
    }
    `)
  );
};

const s = new Screen({
  name: "Naxtjs ssr",
  template: h,
  persist: false,
});
Router.BrowserRoutes({
   "/home/:user": s,
   "/": s
   // no html route
   "/api": ()=>{
    return JSON.stringify({foo:"bar"})
   }
   });

   // if you want to use naxt basic server
Router.listen({ debug: true });

naxtjs basic server has

file serving
support for no html routes
fast compilation
and more



// example visit http://127.0.0.1:3000/home/john
```

## Documentation

At the moment, we're in the process of creating a documentation website for Naxtjs, and we have limited resources. If you're interested in lending a hand, we invite you to join our community, gain firsthand experience, and contribute to the advancement of Naxtjs.

## Getting Help and Contributing

To get further insights and help on Naxtjs, visit our [Discord](https://discord.gg/b7fvMg38) and [Telegram](https://t.me/cradovaframework) Community Chats.
