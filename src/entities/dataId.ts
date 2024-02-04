import { type QueryType, type TypeClass } from "@vyke/dom";

export type DataAttr<TElement extends HTMLOrSVGElement> = {
  attr: string;
  selector: string;
  type: QueryType;
  instance?: TypeClass<TElement>;
  toString: () => string;
  from: (target: TElement) => string | undefined;
  set: (target: TElement, value: unknown) => void;
  all: () => AllDataQuery<TElement>;
};

export type AllDataQuery<TElement extends HTMLOrSVGElement> = {
  selector: string;
  type: QueryType;
  instance?: TypeClass<TElement[]>;
};

export function createDataAttr<TElement extends HTMLOrSVGElement>(
  names: [attr: string, prop: string]
): DataAttr<TElement> {
  const [attrName, prop] = names;

  const attr = `data-${attrName}`;
  const selector = `[${attr}]`;

  const data: DataAttr<TElement> = {
    selector,
    attr,
    type: "one",
    toString() {
      return attr;
    },
    set(target: TElement, value: unknown) {
      target.dataset[prop] = `${value}`;
    },
    from(target: TElement) {
      return target.dataset[prop];
    },
    all() {
      const dataAll: AllDataQuery<TElement> = {
        selector,
        type: "all",
      };

      return dataAll;
    },
  };

  return data;
}
