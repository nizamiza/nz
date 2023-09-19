import { parseTemplateContent } from "./helpers.js";
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
  document.adoptedStyleSheets.push(...(args[1] ?? []));

  document.body.appendChild(loadingContent.cloneNode(true));

  args[0].push(nzHead);
  await defineCustomElements(...args);

  document.body.replaceWith(bodyContent);
}
