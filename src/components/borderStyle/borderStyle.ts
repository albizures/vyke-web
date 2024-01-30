// import { selectIn, query, on } from "@vyke/dom";
// import { unwrap } from "@vyke/results";

export class BorderStyle extends HTMLElement {
  constructor() {
    super();

    const root = this;
    // const [select] = unwrap(selectIn(root, query<HTMLSelectElement>("select")));
  }
}

customElements.define("v-border-style", BorderStyle);
