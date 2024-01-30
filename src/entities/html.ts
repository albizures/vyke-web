import { addClass, removeClass } from "@vyke/dom";

export function setStyleVar(
  element: HTMLElement,
  name: `--${string}`,
  value: unknown
) {
  element.style.setProperty(name, String(value));
}

const hiddenClass = "hidden";
export function hide(...elements: Array<HTMLElement>) {
  for (const element of elements) {
    addClass(element, hiddenClass);
  }
}

export function show(...elements: Array<HTMLElement>) {
  for (const element of elements) {
    removeClass(element, hiddenClass);
  }
}
