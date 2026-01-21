const extractTextFromHtml = (html: string): string => {
  if (!html) return '';

  const text = html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();

  return text;
};

export default extractTextFromHtml;
