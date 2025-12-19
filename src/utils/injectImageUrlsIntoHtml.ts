const injectImageUrlsIntoHtml = (html: string, imageUrls: string[]): string => {
  if (!imageUrls.length) return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const imgTags = Array.from(doc.querySelectorAll('img'));

  imgTags.forEach((imgTag, index) => {
    const url = imageUrls[index];
    if (!url) return;

    imgTag.setAttribute('src', url);
  });

  return doc.body.innerHTML;
};

export default injectImageUrlsIntoHtml;
