import type { Query } from "@vyke/dom";

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getNamePart(sideValue: string) {
  return sideValue === "full" ? "" : capitalize(sideValue);
}

type BorderModifierField<TElement> = Query<TElement> & {
  name: (sideValue: string) => string;
  id: string;
};

export const borderStyle: BorderModifierField<HTMLSelectElement> = {
  name(sideValue: string) {
    return `border${getNamePart(sideValue)}Style`;
  },
  instance: undefined,
  selector: ".border-style-select",
  id: "border-style-select",
  type: "one",
};

export const borderWidth: BorderModifierField<HTMLInputElement> = {
  name(sideValue: string) {
    return `border${getNamePart(sideValue)}Width`;
  },
  instance: undefined,
  selector: ".border-width-input",
  id: "border-width-input",
  type: "one",
};
