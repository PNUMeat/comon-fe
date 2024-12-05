/**
  (12/06) JPG만 압축가능한데 JPG는 압축 잘 되는데 PNG는 오히려 크기가 커진다.
  OffscreenCanvas를 처음써봐서 잘 모르지만, OffscreenCanvas가 문제인가 싶어서
  다른 레퍼런스들 처럼 그냥 Canvas를 사용해봤는데 이거로 해도 PNG는 그냥 크기가 커짐.
  그래도 PNG까지는 해보고 싶음.
  다른 확장자도 필요하다면 그냥 browser-image-compression 쓰는게 나을듯함
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
      // quality: fileType === 'image/jpeg' ? quality : undefined,
      quality: quality,
    };

    // if (fileType === 'image/png') {
    //   // const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    //   const cvs = ctx.canvas;
    //
    // }

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
