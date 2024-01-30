import { type Query } from "@vyke/dom";

export type ClassId<TType> = Query<TType> & {
  toString: () => string;
};

type TypeClass<TType> = {
  new (): TType;
  prototype: TType;
};

export function createClassId<TType = never>(
  name: string,
  instance?: TypeClass<TType>
) {
  return {
    selector: `.${name}`,
    instance,
    type: "one",
    toString() {
      return name;
    },
  } satisfies ClassId<TType>;
}
