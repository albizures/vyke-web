const UNINITIALIZED = Symbol("uninitialized");

export type Atom<TValue> = {
  val: TValue;
};

type HookType = "post-update";
type HookListener<TValue> = (value: TValue) => void;

type AtomConfig<TValue> = {
  defaultValue?: TValue;
  hooks?: Array<[HookType, HookListener<TValue>]>;
};

export function createAtom<TValue>(config?: AtomConfig<TValue>): Atom<TValue> {
  const { defaultValue, hooks = [] } = config ?? {};
  let value = defaultValue ?? UNINITIALIZED;

  const postUpdateListener: Array<HookListener<TValue>> = [];

  for (const hook of hooks) {
    if (hook[0] === "post-update") {
      postUpdateListener.push(hook[1]);
    }
  }

  return {
    get val() {
      if (!import.meta.env.PROD) {
        if (value === UNINITIALIZED) {
          throw new Error("Atom uninitialized");
        }
      }
      return value as TValue;
    },
    set val(update: TValue) {
      (value as TValue) = update;
    },
  };
}
