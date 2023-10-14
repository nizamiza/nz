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
