/** @type {CustomElementDefinition<"nz-head">} */
export const definition = {
  name: "nz-head",
  moduleUrl: import.meta.url,
  init({ slots }) {
    document.head.append(...slots.default);
  },
};
