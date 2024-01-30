import { on, query, select, selectIn } from "@vyke/dom";
import { unwrap } from "@vyke/results";
import { borderStyle, borderWidth } from "./borderModifierHelpers";

export class BorderModifier extends HTMLElement {
  static vname = "v-border-modifier";

  offEvents: Array<() => void> = [];

  constructor() {
    super();
  }

  connectedCallback() {
    const root = this;

    const [template] = unwrap(
      select(query<HTMLTemplateElement>(`#v-border-modifier-template`))
    );

    root.style.display = "block";

    let templateContent = template.content;

    const isEmpty = root.childNodes.length === 0;

    if (isEmpty) {
      root.append(templateContent.cloneNode(true));
    }

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

    miniBox.dataset.side = sideSelect.value;

    root.offEvents.push(
      on(removeModifierBtn, "click", (event) => {
        event.preventDefault(); // avoid the submit event
        event.stopPropagation();
        root.remove();
      }),
      on(sideSelect, "change", () => {
        const sideValue = sideSelect.value;

        miniBox.dataset.side = sideSelect.value;
        borderStyleSelect.name = borderStyle.name(sideValue);
        borderWidthInput.name = borderWidth.name(sideValue);
      })
    );
  }
}

customElements.define(BorderModifier.vname, BorderModifier);
