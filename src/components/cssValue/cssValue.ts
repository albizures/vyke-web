import { selectIn } from "@vyke/dom";
import { unwrap } from "@vyke/results";
import { createDataAttr } from "../../entities/dataId";
import { createComponent } from "../../entities/component";
import { initAllNumberValues, numberValue } from "../numberValue/numberValue";
import { watchAttr } from "../../entities/attr";

export const cssValue = createDataAttr<HTMLDivElement>("css-value");
export const allCssValue = cssValue.all();
export const valueId = createDataAttr<HTMLInputElement>("css-value-value");
export const unitId = createDataAttr<HTMLSelectElement>("css-value-unit");

export type CssValueProps = {
  placeholder?: string;
  defaultValue?: number;
  name: string;
};

export function initCssValues(container: ParentNode = document) {
  const [elements] = unwrap(selectIn(container, allCssValue));

  for (const element of elements) {
    initCssValue(element);
  }
}

const elements = new WeakSet<HTMLDivElement>();

function initCssValue(root: HTMLDivElement) {
  if (elements.has(root)) {
    return;
  }

  elements.add(root);

  initAllNumberValues(root);

  const name = cssValue.from(root);
  console.log("original", name);

  const [unitSelect, valueInput] = unwrap(selectIn(root, unitId, numberValue));

  function setNames(name?: string) {
    if (name) {
      unitSelect.name = `${name}:unit`;
      unitSelect.dispatchEvent(
        new Event("change", {
          bubbles: true,
        })
      );
      numberValue.set(valueInput, `${name}:value`);
    }
  }

  setNames(name);
  watchAttr(root, cssValue.attrName, setNames);
}

export function createCssValue(name: string) {
  const root = createComponent(`#v-css-value-template`, cssValue);

  cssValue.set(root, name);

  initCssValue(root);

  return root;
}
