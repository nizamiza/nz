declare type KebabCase<Value extends string> =
  Value extends `${infer A}${infer B}`
    ? A extends "-" // Check if the first character is a hyphen
      ? B extends `-${string}` // Check if the next character is also a hyphen
        ? "Invalid" // If consecutive hyphens found, it's invalid
        : KebabCase<B> // Continue checking the rest of the string
      : A extends `${Lowercase<A>}${string}` // Check if the first character is lowercase
      ? KebabCase<B> // Continue checking the rest of the string
      : "Invalid" // If an uppercase letter found, it's invalid
    : "Valid"; // If the string has been fully checked, it's valid

declare type KebabCasedString<Value> = Value extends string
  ? KebabCase<Value> extends "Valid"
    ? Value
    : never
  : never;

declare interface BaseElement {
  new (): HTMLElement;
}

declare type CustomElementRegistryDefinition = Parameters<
  CustomElementRegistry["define"]
>;

declare type SlotMap = { default: Node[] } & {
  [Key in string]: Node[];
};

declare type CustomElementInitArgs = {
  shadowRoot: ShadowRoot;
  slots: SlotMap;
};

declare type CustomElementDefinition<Value extends string = string> = {
  /**
   * Name of the custom element. Must be in kebab-case (dash separated).
   */
  name: KebabCasedString<Value>;
  /**
   * Base class used for the class of the custom element. Defaults to
   * HTMLElement.
   */
  baseElement?: BaseElement;
  options?: ElementDefinitionOptions;
  /**
   * Module import url (`import.meta.url`). Used for resolving template file.
   */
  moduleUrl: string;
  /**
   * Init function called inside of the custom element's constructor.
   */
  init?: (this: HTMLElement, args: CustomElementInitArgs) => void;
  attributeMap?: {
    [CssQuerySelector in string]?: {
      [AttributeName in string]?:
        | string
        | boolean
        | ((this: HTMLElement, attr: Attr | null) => string);
    };
  };
  adoptedStyleSheets?: CSSStyleSheet[];
};

declare type InitCustomElement = (
  definition: CustomElementDefinition,
) => Promise<CustomElementRegistryDefinition>;
