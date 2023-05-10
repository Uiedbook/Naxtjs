<br/>
<p align="center">
  <a href="https://github.com/uiedbook/Naxtjs">
    <img src="Naxtjs.png" alt="Logo" width="80" height="80">
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

![Contributors](https://img.shields.io/github/contributors/fridaycandour/Naxtjs?color=dark-green) ![Issues](https://img.shields.io/github/issues/fridaycandour/Naxtjs) ![License](https://img.shields.io/github/license/fridaycandour/Naxtjs)
[![npm Version](https://img.shields.io/npm/v/Naxtjs.svg)](https://www.npmjs.com/package/Naxtjs)
[![License](https://img.shields.io/npm/l/Naxtjs.svg)](https://github.com/Naxtjs/Naxtjs.js/blob/next/LICENSE)
[![npm Downloads](https://img.shields.io/npm/dm/Naxtjs.svg)](https://www.npmjs.com/package/Naxtjs)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Naxtjs/Naxtjs.js/blob/next/contributing.md)![Forks](https://img.shields.io/github/forks/fridaycandour/Naxtjs?style=social) ![Stargazers](https://img.shields.io/github/stars/fridaycandour/Naxtjs?style=social)

# Contents

- [What is Naxtjs](#what-is-Naxtjs)
- [Why Naxtjs?](#whats-the-benefit)
- [Installation](#installation)
- [Examples](#examples)
- [Documentation](#documentation)
- [Getting Help](#getting-help)
- [Contributing](#contributing)

## What is Naxtjs?

    Naxtjs is a Cradova based framework for server side rendering.

Naxt is the ultra fast, and performant, ssr framework for javascript and typescript.

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
          target: "_blank",
          rel: "noopener noreferrer",
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
    .App {
  text-align: center;
}
.App-logo {
  height: 40vmin;
  pointer-events: none;
}
.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}
.App-link {
  color: #61dafb;
}
    `)
  );
};

const s = new Screen({
  name: "Naxtjs ssr",
  template: h,
  persist: false,
});
Router.BrowserRoutes({ "/home/:user": s });
Router.BrowserRoutes({ "/": s });
Router.listen({ debug: true });

// example visit http://127.0.0.1:3000/home/john
```

### More info

---

Naxtjs screens

---

screens are rendered once by default to hack
responsiveness making your app work fast as user navigates.

this behavior can be override
by passing
persist: false
in the constructor

Naxtjs screens has
onActivate() and
onDeactivate() methods which is also available in the
component function on the this variable bound to it.

this allow you manage rendering
circle for each screen in your app

## Documentation

At the moment, we're in the process of creating a documentation website for Naxtjs, and we have limited resources. If you're interested in lending a hand, we invite you to join our community, gain firsthand experience, and contribute to the advancement of Naxtjs.

## Getting Help

To get further insights and help on Naxtjs, visit our [Discord](https://discord.gg/b7fvMg38) and [Telegram](https://t.me/Naxtjsframework) Community Chats.

## Contributing

We are currently working to [set](https://github.com/uiedbook/Naxtjs/blob/main/contributing.md) up the following:

- building Naxtjs CLI (in progress)
- Naxtjs Documentation Website
- UI component libraries for Naxtjs
- Sample projects
- maintenance and promotion

## Sponsor

Your support is appreciated and needed to advance Naxtjs for more performance and improvements.

Sponsorships can be done via [Patreon](https://www.patreon.com/FridayCandour) and [KO-FI](https://www.ko-fi.com/fridaycandour).

Both monthly-recurring sponsorships and one-time donations are accepted.
