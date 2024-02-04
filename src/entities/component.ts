import { query, select, selectIn, type Query } from "@vyke/dom";
import { unwrap } from "@vyke/results";

export function createComponent<TRoot extends Node>(
  templateId: string,
  rootId: Query<TRoot>
) {
  const [template] = unwrap(select(query<HTMLTemplateElement>(templateId)));
  const [elementTemplate] = unwrap(selectIn(template.content, rootId));

  return elementTemplate.cloneNode(true) as TRoot;
}
