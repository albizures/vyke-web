type Listener = (value: string | undefined, attrName: string) => void;

const observers = new WeakMap<Node, MutationObserver>();
const attrsByTarget = new WeakMap<Node, Set<string>>();
const listenersByTarget = new WeakMap<Node, Map<string, Set<Listener>>>();

function watchNewAttr(
  observer: MutationObserver,
  target: Node,
  attrName: string
) {
  const mutationList = observer.takeRecords();
  observer.disconnect();

  handleAttrMutation(mutationList, observer);

  const newAttrs = attrsByTarget.get(target) ?? new Set();

  newAttrs.add(attrName);

  const attributeFilter = [...newAttrs];
  observer.observe(target, {
    attributeFilter,
  });

  attrsByTarget.set(target, newAttrs);
}
const noListeners = new Set<Listener>();

function handleAttrMutation(
  mutationList: Array<MutationRecord>,
  observer: MutationObserver
) {
  const target = mutationList[0]?.target as Element;

  if (!target) {
    return;
  }

  const listenersByAttr = listenersByTarget.get(target);

  if (!listenersByAttr) {
    // let's disconnect since nobody is listening
    observer.disconnect();
    return;
  }

  for (const mutation of mutationList) {
    const { type, attributeName } = mutation;
    if (type === "attributes" && attributeName) {
      const listeners = listenersByAttr.get(attributeName) ?? noListeners;
      for (const listener of listeners) {
        listener(
          target.getAttribute(attributeName) ?? undefined,
          attributeName
        );
      }
    }
  }
}

export function watchAttr(target: Node, attrName: string, listener: Listener) {
  const observer = observers.get(target);

  const listenersByAttrs =
    listenersByTarget.get(target) ?? new Map<string, Set<Listener>>();

  const listeners = listenersByAttrs.get(attrName) ?? new Set();

  listeners.add(listener);
  listenersByAttrs.set(attrName, listeners);
  listenersByTarget.set(target, listenersByAttrs);

  if (observer) {
    watchNewAttr(observer, target, attrName);
  } else {
    const observer = new MutationObserver(handleAttrMutation);

    const newAttrs = attrsByTarget.get(target) ?? new Set();

    newAttrs.add(attrName);

    attrsByTarget.set(target, newAttrs);

    observers.set(target, observer);

    observer.observe(target, {
      attributeFilter: [attrName],
    });
  }

  return () => {
    listeners.delete(listener);
  };
}
