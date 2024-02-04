import { on, selectIn } from "@vyke/dom";
import throttleit from "throttleit";
import { unwrap } from "@vyke/results";
import { createDataAttr } from "../../entities/dataId";
import { createComponent } from "../../entities/component";

export const cssValue = createDataAttr<HTMLDivElement>([
  "css-value",
  "cssValue",
]);
export const allCssValue = cssValue.all();
export const valueId = createDataAttr<HTMLInputElement>([
  "css-value-value",
  "cssValueValue",
]);
export const unitId = createDataAttr<HTMLSelectElement>([
  "css-value-unit",
  "cssValueUnit",
]);

export type CssValueProps = {
  valueClassId?: string;
  unitClassId?: string;
  placeholder?: string;
  defaultValue?: number;
  name: string;
};

export function initCssValues(container: ParentNode = document) {
  const [elements] = unwrap(selectIn(container, allCssValue));

  for (const element of elements) {
    initCssValueName(element);
    initCssValue(element);
  }
}

function initCssValue(element: HTMLDivElement) {
  const [input] = unwrap(selectIn(element, valueId));

  input.size = input.value.length;

  on(input, "pointerdown", (event) => {
    const { clientY: initialClientY } = event;
    // saving the original value so the subtraction below is
    // relative to it and the movement of the mouse
    const originalValue = Number(input.value);

    const fireChangeEvent = throttleit(() => {
      input.dispatchEvent(
        new Event("change", {
          bubbles: true,
        })
      );
    }, 100);

    const moveOff = on(window, "pointermove", (event) => {
      const { clientY } = event;

      // subtracting the different so moving the mouse up increments the value
      const value = `${originalValue - (clientY - initialClientY)}`;
      input.size = value.length;
      input.value = value;
      fireChangeEvent();
    });

    const upOff = on(window, "pointerup", () => {
      // removing the events
      moveOff();
      upOff();
      // triggering manually the change event since updating
      // the value with javascript doesn't do it
      fireChangeEvent();
    });
  });
}

const values = new Set<HTMLDivElement>();

export function initCssValueName(element: HTMLDivElement) {
  const [value, unit] = unwrap(selectIn(element, valueId, unitId));

  function setName() {
    const name = cssValue.from(element);

    value.name = `${name}:value`;
    unit.name = `${name}:unit`;
  }

  setName();

  if (!values.has(element)) {
    new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === "attributes") {
          setName();
        }
      }
    }).observe(element, {
      attributeFilter: [cssValue.attr],
    });
    values.add(element);
  }
}

export function createCssValue(name: string) {
  const root = createComponent(`#v-css-value-template`, cssValue);

  cssValue.set(root, name);

  initCssValueName(root);
  initCssValue(root);

  return root;
}
