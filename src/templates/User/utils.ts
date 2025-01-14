export const serializeForm = (
  name: string,
  explain: string,
  image: File | null,
  topic?: string,
  memberLimit?: string | number
): string => {
  if (topic || memberLimit) {
    return (
      name +
      explain +
      image?.name +
      image?.size +
      image?.type +
      topic +
      memberLimit
    );
  }
  return name + explain + image?.name + image?.size + image?.type;
};
