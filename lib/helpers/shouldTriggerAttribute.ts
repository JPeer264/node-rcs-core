import { Attribute } from 'parse5';

export interface Attr extends Attribute {
  val: string;
}

const shouldTriggerAttribute = (attr: Attr, item: string | RegExp): boolean => (
  item instanceof RegExp
    ? !!attr.name.match(new RegExp(item))
    : item === attr.name
);

export default shouldTriggerAttribute;
