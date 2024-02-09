import { on, query, selectIn } from "@vyke/dom";
import { unwrap } from "@vyke/results";
import { borderStyle, borderWidth } from "./borderModifierHelpers";
import { createDataAttr } from "../../entities/dataId";
import { createComponent } from "../../entities/component";
import { cssValue, initCssValues } from "../cssValue/cssValue";

const side = createDataAttr<HTMLDivElement>("side");
const borderModifier = createDataAttr<HTMLFieldSetElement>("border-modifier");
const allBorderModifiers = borderModifier.all();

export function initBorderModifier(root: HTMLFieldSetElement) {
  const [
    removeModifierBtn,
    miniBox,
    sideSelect,
    borderStyleSelect,
    widthCssValue,
  ] = unwrap(
    selectIn(
      root,
      query<HTMLButtonElement>(".remove-modifier-btn"),
      query<HTMLDivElement>(".mini-box"),
      query<HTMLButtonElement>(".side-select"),
      borderStyle,
      cssValue
    )
  );

  side.set(miniBox, sideSelect.value);

  on(removeModifierBtn, "click", (event) => {
    event.preventDefault(); // avoid the submit event
    event.stopPropagation();
    root.remove();
  });

  on(sideSelect, "change", () => {
    const sideValue = sideSelect.value;

    cssValue.set(widthCssValue, borderWidth.name(sideValue));
    borderStyleSelect.name = borderStyle.name(sideValue);
    side.set(miniBox, sideValue);
  });

  initCssValues(root);
}

export function initBorderModifiers(container: ParentNode = document) {
  const [elements] = unwrap(selectIn(container, allBorderModifiers));

  for (const element of elements) {
    initBorderModifier(element);
  }
}

export function createBorderModifier() {
  const root = createComponent(`#v-border-modifier-template`, borderModifier);

  initBorderModifier(root);

  return root;
}
