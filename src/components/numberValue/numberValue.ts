import { unwrap } from "@vyke/results";
import { createDataAttr } from "../../entities/dataId";
import { on, selectIn } from "@vyke/dom";
import throttleit from "throttleit";
import { watchAttr } from "../../entities/attr";

export const numberValue = createDataAttr<HTMLInputElement>("number-value");
export const allNumberValues = numberValue.all();

export function initAllNumberValues(container: ParentNode = document) {
  const [elements] = unwrap(selectIn(container, allNumberValues));

  for (const element of elements) {
    initNumberValue(element);
  }
}

export function initNumberValue(input: HTMLInputElement) {
  input.size = input.value.length;

  watchAttr(input, numberValue.attrName, (value) => {
    if (value) {
      input.name = value;
      input.dispatchEvent(
        new Event("change", {
          bubbles: true,
        })
      );
    }
  });

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
