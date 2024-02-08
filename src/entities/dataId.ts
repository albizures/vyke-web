import camelcase from "camelcase";
import { type QueryType, type TypeClass } from "@vyke/dom";

export type DataAttr<TElement extends HTMLOrSVGElement> = {
  attrName: string;
  selector: string;
  type: QueryType;
  instance?: TypeClass<TElement>;
  toString: () => string;
  from: (target: TElement) => string | undefined;
  set: (target: TElement, value: unknown) => void;
  all: () => AllDataQuery<TElement>;
  attr: (value?: unknown) => Record<string, string>;
};

export type AllDataQuery<TElement extends HTMLOrSVGElement> = {
  selector: string;
  type: QueryType;
  instance?: TypeClass<TElement[]>;
};

export function createDataAttr<TElement extends HTMLOrSVGElement>(
  attrName: string
): DataAttr<TElement> {
  const prop = camelcase(attrName);

  const attr = `data-${attrName}`;
  const selector = `[${attr}]`;

  const data: DataAttr<TElement> = {
    selector,
    attrName: attr,
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
    attr(value: unknown = "") {
      return {
        [attr]: `${value}`,
      };
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
