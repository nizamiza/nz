# nz

`nz` - is a simple helper library for working with Web Components.

## Installation

### CDN

You can use `nz` via CDN:

```javascript
import { bootstrap } from "https://cdn.jsdelivr.net/npm/nzjs/lib/core/bootstrap.js";
```

You can install type declarations via NPM:

```bash
npm install nzjs
```

## Usage

Before using `nz`, make sure to setup `bootstrap.html` and `loading.html`
template files. They should be available under `templates` folder when requested
from browser:

```
.
└── public/
    └── templates/
        ├── bootstrap.html
        └── loading.html
```

### bootstrap.html

The bootstrap file contains parts of `<head>` element that you want to include
on every page. Here is an example:

```html
<!-- bootstrap.html -->
<template>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="css/base.css" />
</template>
```

### loading.html

The loading template is used as a placeholder while loading custom elements.
Here is an example:

```html
<template>
  <main>
    <p>⏰ Loading...</p>
  </main>
</template>
```

### Initializing custom elements

Once you have bootstrap and loading templates setup, create your main JavaScript
entry file and include it in every page you have:

```html
<!doctype html>
<html lang="en">
  <head>
    <script src="src/main.js" blocking="render" type="module"></script>
  </head>
  <body>
    <!-- the rest of your page -->
  </body>
</html>
```

This will be the minimal `<head>` that you will have to include in every page of
your website.

In the `main.js` you need to call the `bootstrap` function and pass all of your
custom elements:

```javascript
import { bootstrap } from "https://cdn.jsdelivr.net/npm/nzjs/lib/core/bootstrap.js";
import { definition as footer } from "./components/nz-footer/nz-footer.js";
import { definition as layout } from "./layouts/nz-layout/nz-layout.js";
import { definition as homePage } from "./pages/nz-home/nz-home.js";

await bootstrap([footer, layout, homePage]);
```

You can also pass `CSSStyleSheet` objects that will be adopted by every custom
element that you define:

```javascript
import baseStyles from "../css/base.css" assert { type: "css" };

await bootstrap([footer, layout, homePage], [baseStyles]);
```

> **CSS asserts are not widely supported yet!** As a workaround, `nz` will pick
> up any styles that you define in your `bootstrap.html` and adopt them
> automatically.

### Defining custom element

`nz` requires each custom element to be in a separate folder. The folder and all
files inside of it should share the custom element name. To avoid conflicts with
existing HTML elements, all custom element names must be at least 2 words
separated by the dash symbol (`<nz-footer>`, not `<footer>`). For consistency,
it is recommended to use a prefix that will be shared across all custom elements.

> If you don't want to invent your own prefix, you can just use `nz` 🙃.

Below is an example file structure:

```
.
└── public/
    └── src/
        └── components/
            └── nz-footer/
                ├── nz-footer.html
                └── nz-footer.js
```

#### Template file

The HTML file in the custom element folder is expected to be an HTML template
of the element. Here is an example:

```html
<template>
  <style>
    footer {
      display: grid;
      place-content: center;
      text-align: center;
      padding: 1.5rem;
      font-size: 0.875rem;
      opacity: 0.75;
    }
  </style>
  <footer>
    <p>
      For additional inquiries contact us via email
      <a href="mailto:contact@nzjs.org">contact@nzjs.org</a>.
    </p>
    <p>Niza Toshpulatov © <span id="current-year"></span></p>
  </footer>
</template>
```

It's important to put all of your markup inside of the `<template>` element,
otherwise it won't be parsed.

#### Definition file

The JavaScript file in the custom element folder is expected to export a custom
element definition object. Here is an example:

```javascript
/** @type {CustomElementDefinition<"nz-footer">} */
export const definition = {
  name: "nz-footer",
  moduleUrl: import.meta.url,
  init({ shadowRoot }) {
    const currentYearSpan = shadowRoot.querySelector("#current-year");

    if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear().toString();
    }
  },
};
```

- `name` - name of the custom element (must be at least 2 words separated by a dash).
- `moduleUrl` - import URL that will be used to resolve the template file.

## TypeScript

In order to get type safety, you can install the `nzjs` package via NPM:

```bash
npm install nzjs
```

Then add types in your `tsconfig.json` or `jsconfig.json` file:

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "target": "ESNext",
    "checkJs": true,
    "strict": true,
    "module": "ESNext",
    "moduleResolution": "nodenext",
    "types": ["nzjs"],
    "paths": {
      "https://cdn.jsdelivr.net/npm/nzjs/*": ["./node_modules/nzjs/*"]
    }
  }
}
```

## Example project

Navigate to the [public](./public) folder of this repository for an example
usage of `nz`.

## Resources

- [Using custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)
