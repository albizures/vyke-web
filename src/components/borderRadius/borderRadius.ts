import { on, selectIn } from "@vyke/dom";
import { unwrap } from "@vyke/results";
import { createDataAttr } from "../../entities/dataId";
import { cssValue, initCssValues } from "../cssValue/cssValue";
import { getNamePart } from "../borderModifier/borderModifierHelpers";

export const borderRadius = createDataAttr<HTMLDivElement>("border-radius");
export const allBorderRadius = borderRadius.all();

export const borderRadiusSide =
  createDataAttr<HTMLSelectElement>("border-radius-side");
export const sideBox = createDataAttr<HTMLDivElement>("side");

export function initAllBorderRadius(container: ParentNode = document) {
  const [elements] = unwrap(selectIn(container, allBorderRadius));

  for (const element of elements) {
    initBorderRadius(element);
  }
}

export function initBorderRadius(root: HTMLDivElement) {
  initCssValues(root);

  const [cssValueElement, borderRadiusSideSelect, sideBoxElement] = unwrap(
    selectIn(root, cssValue, borderRadiusSide, sideBox)
  );

  on(borderRadiusSideSelect, "change", () => {
    const side = borderRadiusSideSelect.value;
    const name = `border${getNamePart(side)}`;

    cssValue.set(cssValueElement, name);
    sideBox.set(sideBoxElement, side);
  });
}
