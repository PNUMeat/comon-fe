/*
  JPG랑 PNG만 압축가능한데 다른 확장자도 필요하다면 그냥 browser-image-compression 쓰는게 나을듯함
 */
function compressImage(
  image: ImageBitmap,
  fileType: string,
  fileName: string,
  quality?: number
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = new OffscreenCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject('Failed to create canvas context');
      return;
    }

    ctx.drawImage(image, 0, 0);

    const compressOptions = {
      type: fileType,
      quality: fileType === 'image/jpeg' ? quality : undefined,
    };

    canvas
      .convertToBlob(compressOptions)
      .then((blob) => {
        const fileLastModified = Date.now();
        const compressedFile = new File([blob], fileName, {
          type: fileType,
          lastModified: fileLastModified,
        });
        resolve(compressedFile);
      })
      .catch(reject);
  });
}

self.onmessage = (e) => {
  const { src, fileType, fileName, quality } = e.data;
  /*
    worker는 Web API에 접근할 수 없어서,
    const image = new Image() <- 이게 안되서 이렇게 해야함
    그냥 이미지 만드는 작업임
   */
  const imagePromise = fetch(src)
    .then((res) => res.blob())
    .then((blob) => createImageBitmap(blob))
    .catch((error) => {
      self.postMessage({ error: 'Image Creation failed: ' + error });
      return Promise.reject(error);
    });

  imagePromise
    .then((imageBitmap) =>
      compressImage(imageBitmap, fileType, fileName, quality)
    )
    .then((compressedImage) => {
      self.postMessage({ compressedImage: compressedImage });
    })
    .catch((error) => {
      self.postMessage({ error: 'Image Compression failed: ' + error });
    });
};
