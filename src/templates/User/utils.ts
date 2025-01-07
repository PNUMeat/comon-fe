export const serializeForm = (
  name: string,
  explain: string,
  image: File | null
): string => {
  return name + explain + image?.name + image?.size + image?.type;
};
