import { on, selectIn } from "@vyke/dom";
import { unwrap } from "@vyke/results";
import { createDataAttr } from "../../entities/dataId";
import { cssValue, initCssValues } from "../cssValue/cssValue";
import { getNamePart } from "../borderModifier/borderModifierHelpers";
import { createComponent } from "../../entities/component";

export const borderRadius = createDataAttr<HTMLDivElement>("border-radius");
export const allBorderRadius = borderRadius.all();

export const borderRadiusSide =
  createDataAttr<HTMLSelectElement>("border-radius-side");
export const sideBox = createDataAttr<HTMLDivElement>("side");
export const removeRadius = createDataAttr<HTMLButtonElement>("remove");

export function initAllBorderRadius(container: ParentNode = document) {
  const [elements] = unwrap(selectIn(container, allBorderRadius));

  for (const element of elements) {
    initBorderRadius(element);
  }
}

export function initBorderRadius(root: HTMLDivElement) {
  initCssValues(root);

  const [
    cssValueElement,
    borderRadiusSideSelect,
    sideBoxElement,
    removeRadiusBtn,
  ] = unwrap(selectIn(root, cssValue, borderRadiusSide, sideBox, removeRadius));

  setNames(borderRadius.from(root) ?? "");

  function setNames(side: string) {
    const name = `border${getNamePart(side)}Radius`;

    cssValue.set(cssValueElement, name);
    sideBox.set(sideBoxElement, side);
    borderRadiusSideSelect.name = name;
  }

  on(borderRadiusSideSelect, "change", () => {
    const side = borderRadiusSideSelect.value;

    setNames(side);
  });
  on(removeRadiusBtn, "click", (event) => {
    event.preventDefault(); // avoid the submit event
    event.stopPropagation();
    root.remove();
  });
}

export function createBorderRadius() {
  const root = createComponent(`#v-border-radius-template`, borderRadius);

  initBorderRadius(root);

  return root;
}
