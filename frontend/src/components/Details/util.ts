import translation from "./measureTranslated.json";

export const translateMeasure = (slug: string) => {
  // @ts-ignore
  const t = translation[slug];
  if (t) {
    return t;
  }
  return `??? ${slug}`;
};
