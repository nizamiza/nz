/**
 * @param {string | URL} url
 * @returns {Promise<DocumentFragment>}
 */
export async function parseTemplateContent(url) {
  const templateFileResponse = await fetch(url);
  const templateFile = await templateFileResponse.text();

  const templateDocument = new DOMParser().parseFromString(
    templateFile,
    "text/html",
  );

  const templates = templateDocument.getElementsByTagName("template");

  if (templates.length === 0) {
    throw Error(`Failed to find template at ${url}.`);
  }

  const content = templates[0].content;
  return content;
}

/**
 * @param {string | URL} url
 * @returns {Promise<CSSStyleSheet>}
 */
export async function parseCssStyleSheet(url) {
  const cssFileResponse = await fetch(url);
  const cssFile = await cssFileResponse.text();

  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(cssFile);

  return styleSheet;
}
