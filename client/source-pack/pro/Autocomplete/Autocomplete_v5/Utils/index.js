export const partHighlight = (part, highlight, element, entity) => {
  return part.toLowerCase() === highlight.toString().toLowerCase() ? element : entity;
};

export const makeToStringAndLower = (element, value) => {
  return element
    .toString()
    .toLowerCase()
    .includes(value.toString().toLowerCase());
};

export const scrollToElement = (parent, element) => parent.scrollTo({ top: element });
