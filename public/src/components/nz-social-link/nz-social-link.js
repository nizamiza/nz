/** @type {CustomElementDefinition<"nz-social-link">} */
export const definition = {
  moduleUrl: import.meta.url,
  name: "nz-social-link",
  attributeMap: {
    a: {
      href: true,
      style() {
        const iconName = this.attributes.getNamedItem("icon")?.value;
        return `--icon-url: url("/public/assets/icons/${iconName}.svg")`;
      },
    },
  },
};
