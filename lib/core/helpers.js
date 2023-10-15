/**
 * @param {string | URL} path
 * @returns {Promise<DocumentFragment>}
 * @throws {Error}
 */
export async function parseTemplateContent(path) {
  const templateFileResponse = await fetch(path);
  const templateFile = await templateFileResponse.text();

  const templateDocument = new DOMParser().parseFromString(
    templateFile,
    "text/html",
  );

  const templates = templateDocument.getElementsByTagName("template");

  if (templates.length === 0) {
    throw Error(`Failed to find template at ${path}.`);
  }

  const content = templates[0].content;
  return content;
}

/**
 * @param {string | URL} path
 * @returns {Promise<CSSStyleSheet>}
 */
export async function parseCssStyleSheet(path) {
  const cssFileResponse = await fetch(path);
  const cssFile = await cssFileResponse.text();

  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(cssFile);

  return styleSheet;
}

/**
 * @param {object} params
 * @param {string | URL} params.path
 * @param {string | URL} [params.fallbackPath]
 * @param {string} [params.message]
 * @param {"warn" | "error"} [params.messageSeverity]
 *
 * @returns {Promise<DocumentFragment | null>}
 */
export async function safeParseTemplateContent({
  path,
  fallbackPath,
  message,
  messageSeverity = "warn",
}) {
  /** @type {DocumentFragment | null} */
  let content = null;

  try {
    content = await parseTemplateContent(path);
  } catch (error) {
    console.warn(`Failed to find template at ${path} using a fallback.`);

    if (message) {
      console[messageSeverity](message);
    }

    if (fallbackPath) {
      content = await safeParseTemplateContent({
        path: fallbackPath,
      });
    }
  }

  return content;
}
