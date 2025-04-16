export const serializeForm = (
  name: string,
  explain: string,
  image: string | null,
  topic?: string,
  memberLimit?: string | number
): string => {
  if (topic || memberLimit) {
    return name + explain + image + topic + memberLimit;
  }
  return name + explain + image;
};
