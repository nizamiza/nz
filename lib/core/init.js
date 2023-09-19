import { parseTemplateContent } from "./helpers.js";

/** @type {InitCustomElement} */
export async function init({
  name,
  baseElement: BaseElement = HTMLElement,
  options,
  moduleUrl,
  init,
  attributeMap,
  adoptedStyleSheets = [],
}) {
  const templateFileName = `${name}.html`;
  const templateFileUrl = new URL(
    templateFileName,
    moduleUrl.replace(`${name}.js`, ""),
  );

  const templateContent = await parseTemplateContent(templateFileUrl);

  const element = class CustomElement extends BaseElement {
    constructor() {
      super();

      const shadowRoot = this.attachShadow({ mode: "open" });

      const content = templateContent.cloneNode(true);

      shadowRoot.appendChild(content);
      shadowRoot.adoptedStyleSheets.push(...adoptedStyleSheets);

      const slots = Array.from(shadowRoot.querySelectorAll("slot"));

      const slotMap = slots.reduce(
        (nodeMap, slot) => ({
          ...nodeMap,
          [slot.name || "default"]: slot.assignedNodes(),
        }),
        /** @type {SlotMap} */ ({}),
      );

      const attributeMapEntries = Object.entries(attributeMap ?? {});

      for (const [selector, attributes] of attributeMapEntries) {
        const element = shadowRoot.querySelector(selector);

        if (!element || !attributes) {
          continue;
        }

        for (const [name, value] of Object.entries(attributes)) {
          if (typeof value === "string") {
            element.setAttribute(name, value);
            continue;
          }

          const thisAttribute = this.attributes.getNamedItem(name);

          if (typeof value === "boolean") {
            element.setAttribute(name, thisAttribute?.value ?? "");
          } else {
            element.setAttribute(name, value?.call(this, thisAttribute) ?? "");
          }
        }
      }

      init?.call(this, { shadowRoot, slots: slotMap });
    }
  };

  return [name, element, options];
}

/**
 * @param {CustomElementDefinition<any>[]} definitions
 * @param {CSSStyleSheet[]} [adoptedStyleSheets]
 */
export async function defineCustomElements(definitions, adoptedStyleSheets) {
  return Promise.all(
    definitions.map(async (definition) => {
      customElements.define(
        ...(await init({
          ...definition,
          adoptedStyleSheets: [
            ...(definition.adoptedStyleSheets ?? []),
            ...(adoptedStyleSheets ?? []),
          ],
        })),
      );
    }),
  );
}
