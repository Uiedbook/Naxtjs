import { createServer } from "node:http";
import { RouterRouteObject } from "../types";
import { readFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const _dirname = dirname(fileURLToPath(import.meta.url)).split(
  "node_modules"
)[0];

/**
 * Cradova Router
 * ---
 * Facilitates navigation within the application and initializes
 * page views based on the matched routes.
 */

const RouterBox: Record<string, any> = {};

RouterBox["errorHandler"] = null;
RouterBox["routes"] = {};

const checker = (url: string) => {
  // first strict check
  if (RouterBox.routes[url]) {
    return [RouterBox.routes[url], { path: url }];
  }
  // check for extra / in the route
  if (RouterBox.routes[url + "/"]) {
    return [RouterBox.routes[url], { path: url }];
  }
  // place holder route check
  for (const path in RouterBox.routes) {
    if (!path.includes(":")) {
      continue;
    }
    // check for extra / in the route by normalize before checking
    if (url.endsWith("/")) {
      url = url.slice(0, path.length - 2);
    }
    const urlFixtures = url.split("/");
    const pathFixtures = path.split("/");
    let fixturesX = 0;
    let fixturesY = 0;
    // remove empty string after split operation
    urlFixtures.shift();
    pathFixtures.shift();
    // length check of / (backslash)
    if (pathFixtures.length === urlFixtures.length) {
      const routesParams = { _path: "" };
      for (let i = 0; i < pathFixtures.length; i++) {
        // let's jump place holders in the path since we can't determine from them
        // we increment that we skipped a position because we need later
        if (pathFixtures[i].includes(":")) {
          fixturesY += 1;
          continue;
        }
        // if this is part of the path then let increment a value for it
        // we will need it later
        if (
          urlFixtures[i] === pathFixtures[i] &&
          pathFixtures.indexOf(urlFixtures[i]) ===
            pathFixtures.lastIndexOf(urlFixtures[i])
        ) {
          fixturesX += 1;
        }
      }
      // if after the checks it all our count are equal then we got it correctly
      if (fixturesX + fixturesY === pathFixtures.length) {
        for (let i = 0; i < pathFixtures.length; i++) {
          if (pathFixtures[i].includes(":")) {
            // @ts-ignore
            routesParams[pathFixtures[i].split(":")[1]] = urlFixtures[i];
          }
        }
        routesParams._path = path;
        return [RouterBox.routes[path], routesParams];
      }
    }
  }
  return [];
};

RouterBox.route = (path: string, screen: any) => {
  if (!screen || (!screen._Activate && typeof screen !== "function")) {
    console.error(" ✘  Cradova err:  not a valid screen  ", screen);
    throw new Error(" ✘  Cradova err:  Not a valid cradova screen component");
  }
  RouterBox.routes[path] = screen;
  return RouterBox.routes[path];
};

RouterBox.loadAsset = async function (link: string) {
  const ctx = [];
  const len = link.split(".");
  switch (len[len.length - 1]) {
    case "js":
      ctx[0] = "application/javascript";
      break;
    case "pdf":
      ctx[0] = "application/pdf";
      break;
    case "css":
      ctx[0] = "text/css; charset=utf-8";
      break;
    case "html":
      ctx[0] = "charset=utf-8";
      break;
    case "png":
      ctx[0] = "image/png";
      break;
    case "avif":
      ctx[0] = "image/avif";
      break;
    case "webp":
      ctx[0] = "image/webp";
      break;
    case "jpg":
      ctx[0] = "image/jpeg";
      break;
    case "svg":
      ctx[0] = "image/svg+xml";
      break;
    case "ico":
      ctx[0] = "image/vnd.microsoft.icon";
      break;
    default:
      ctx[0] = "application/JSON";
      break;
  }
  try {
    const data = await readFile(_dirname + link.slice(1), {
      // encoding: "utf-8",
    });
    if (data) {
      ctx[1] = data;
      return ctx;
    } else {
      return ["text/html", "Not Found"];
    }
  } catch (error) {
    console.log(error);
    return ["text/html", "Not Found"];
  }
};

/**
 * Naxt Router
 * ---
 * Facilitates navigation within the application and initializes
 * page views based on the matched routes.
 */

class naxtrouter {
  /**
   * Cradova
   * ---
   * Starts a server that renders your app
   *
   * @param option
   */
  async listen(option: { port?: number; debug?: boolean } = {}) {
    option.port = 3000;
    const start_callback = () => {
      console.log("\x1B[32m Naxt Running on port " + option.port + " \x1B[39m");
    };
    const handler = async (req: any, res: any) => {
      if (option.debug) {
        const clientIP = req.connection.remoteAddress;
        const connectUsing = req.connection.encrypted ? "SSL" : "HTTP";
        console.log(
          "Request received: " + connectUsing + " " + req.method + " " + req.url
        );
        console.log("Client IP: " + clientIP);
      }
      res.writeHead(200, "OK", { "Content-Type": "text/html" });
      // send processed html
      if (req.url.includes(".")) {
        const [type, file] = await RouterBox.loadAsset(req.url);
        if (file) {
          res.writeHead(200, "OK", { "Content-Type": type });
          res.write(file);
        } else {
          res.writeHead(404, "OK", { "Content-Type": "text/html" });
          res.write("Not Found");
        }
      } else {
        const html = await this.loadScreen(req.url);
        if (html) {
          res.writeHead(200, "OK", { "Content-Type": "text/html" });
          res.write(html);
        } else {
          res.writeHead(404, "OK", { "Content-Type": "text/html" });
          res.write("Not Found");
        }
      }
      res.end();
    };
    createServer(handler).listen(option.port, start_callback);
  }
  /**
   * Cradova Router
   * ----
   * -
   *  it loads and displays the target page.
   * @param  url string
   * @param force boolean
   */
  async loadScreen(url: string, data?: unknown, force = false) {
    let route: RouterRouteObject | undefined, params;
    [route, params] = checker(url);
    if (route) {
      try {
        if (params) {
          params.data = data;
          route._paramData = params;
        } else {
          route._paramData = { data };
        }
        if (typeof route === "function") {
          //  @ts-ignore
          return await route(params);
        }
        return await route._Activate(force);
      } catch (error) {
        if (RouterBox.routes[params && params._path]) {
          const errorHandler =
            RouterBox.routes[params._path].errorHandler ||
            RouterBox.errorHandler;
          if (errorHandler) {
            return errorHandler(error);
          }
          {
            throw error;
          }
        }
      }
    } else {
      // or 404
      if (RouterBox.routes["/404"]) {
        return RouterBox.routes["/404"]._Activate();
      }
    }
  }
  /**
   * cradova router
   * ---
   * Registers routes.
   *
   * accepts an object containing
   * @param {any} pathObject the cradova screen.
   */
  BrowserRoutes(pathObject: Record<string, Screen>) {
    for (const path in pathObject) {
      RouterBox.route(path, pathObject[path]);
    }
  }

  /** cradova router
   * ---
   * get a screen ready before time.
   *
   * @param {string}   path Route path.
   * @param {any} data data for the screen.
   */

  async packageScreen(path: string, data: any = {}) {
    if (!RouterBox.routes[path]) {
      console.error(" ✘  Cradova err:  no screen with path " + path);
      throw new Error(
        " ✘  Cradova err:  cradova err: Not a defined screen path"
      );
    }
    const [route, params] = checker(path);
    // handled asynchronously
    route._package(Object.assign(data, params || {}));
    route._packed = true;
  }

  addErrorHandler(callback: () => void) {
    if (typeof callback === "function") {
      RouterBox["errorHandler"] = callback;
    } else {
      throw new Error(
        " ✘  Cradova err:  callback for ever event event is not a function"
      );
    }
  }
}

export const Router = new naxtrouter();
