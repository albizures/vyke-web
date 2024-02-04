import { on, query, select, selectIn } from "@vyke/dom";
import { unwrap } from "@vyke/results";
import { borderStyle, borderWidth } from "./borderModifierHelpers";
import { createDataAttr } from "../../entities/dataId";
import { createComponent } from "../../entities/component";
import { initCssValues } from "../cssValue/cssValue";

const side = createDataAttr<HTMLDivElement>(["side", "side"]);
const borderModifier = createDataAttr<HTMLFieldSetElement>([
  "border-modifier",
  "borderModifier",
]);
const allBorderModifiers = borderModifier.all();

export function initBorderModifier(root: HTMLFieldSetElement) {
  const offEvents: Array<() => void> = [];
  const [
    removeModifierBtn,
    miniBox,
    sideSelect,
    borderStyleSelect,
    borderWidthInput,
  ] = unwrap(
    selectIn(
      root,
      query<HTMLButtonElement>(".remove-modifier-btn"),
      query<HTMLDivElement>(".mini-box"),
      query<HTMLButtonElement>(".side-select"),
      borderStyle,
      borderWidth
    )
  );

  side.set(miniBox, sideSelect.value);

  offEvents.push(
    on(removeModifierBtn, "click", (event) => {
      event.preventDefault(); // avoid the submit event
      event.stopPropagation();
      root.remove();
    }),
    on(sideSelect, "change", () => {
      const sideValue = sideSelect.value;

      side.set(miniBox, sideValue);
      borderStyleSelect.name = borderStyle.name(sideValue);
      borderWidthInput.name = borderWidth.name(sideValue);
    })
  );

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
