import { Builder } from 'xml2js';

export const buildXML = (obj: Object): string => {
  const builder = new Builder();
  return builder.buildObject(obj);
};
