import { parseCssStyleSheet, safeParseTemplateContent } from "./helpers.js";
import { defineCustomElements } from "./init.js";
import { definition as nzHead } from "../nz-head/nz-head.js";

/**
 * @param {Parameters<typeof defineCustomElements>} args
 * @returns {Promise<void>}
 */
export async function bootstrap(...args) {
  const moduleBaseUrl = import.meta.url.replace("bootstrap.js", "");

  /**
   * @param {string | URL} templatePath
   */
  const getParseTemplateContentArgs = (templatePath) => ({
    path: templatePath,
    fallbackPath: new URL(templatePath, moduleBaseUrl),
    message: `Make sure that your custom template is available at \`${templatePath}\` when requested from the index.html of your page.`,
  });

  const loadingContent = await safeParseTemplateContent(
    getParseTemplateContentArgs("templates/loading.html"),
  );

  const bootstrapContent = await safeParseTemplateContent(
    getParseTemplateContentArgs("templates/bootstrap.html"),
  );

  const bodyContent = document.body.cloneNode(true);

  document.body.innerHTML = "";

  if (bootstrapContent) {
    document.head.appendChild(bootstrapContent.cloneNode(true));
  }

  const styleSheets = await Promise.all(
    Array.from(document.head.querySelectorAll(`link[rel="stylesheet"]`)).map(
      (linkElement) =>
        parseCssStyleSheet(linkElement.getAttribute("href") ?? ""),
    ),
  );

  args[1] = args[1] ? [...args[1], ...styleSheets] : styleSheets;
  const adoptedStyleSheets = args[1] ?? [];

  document.adoptedStyleSheets = adoptedStyleSheets;

  if (loadingContent) {
    document.body.appendChild(loadingContent.cloneNode(true));
  }

  args[0].push(nzHead);
  await defineCustomElements(...args);

  document.body.replaceWith(bodyContent);
}
