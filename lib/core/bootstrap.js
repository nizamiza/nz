import { parseCssStyleSheet, parseTemplateContent } from "./helpers.js";
import { defineCustomElements } from "./init.js";
import { definition as nzHead } from "../nz-head/nz-head.js";

/**
 * @param {Parameters<typeof defineCustomElements>} args
 * @returns {Promise<void>}
 */
export async function bootstrap(...args) {
  const loadingContent = await parseTemplateContent("templates/loading.html");
  const bootstrapContent = await parseTemplateContent(
    "templates/bootstrap.html",
  );

  const bodyContent = document.body.cloneNode(true);

  document.body.innerHTML = "";

  document.head.appendChild(bootstrapContent.cloneNode(true));

  const styleSheets = await Promise.all(
    Array.from(document.head.querySelectorAll(`link[rel="stylesheet"]`)).map(
      (linkElement) =>
        parseCssStyleSheet(linkElement.getAttribute("href") ?? ""),
    ),
  );

  args[1] = args[1] ? [...args[1], ...styleSheets] : styleSheets;
  const adoptedStyleSheets = args[1] ?? [];

  document.adoptedStyleSheets = adoptedStyleSheets;
  document.body.appendChild(loadingContent.cloneNode(true));

  args[0].push(nzHead);
  await defineCustomElements(...args);

  document.body.replaceWith(bodyContent);
}
