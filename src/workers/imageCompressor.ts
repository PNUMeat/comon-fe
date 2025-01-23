/**
  (12/06) JPG만 압축가능한데 JPG는 압축 잘 되는데 PNG는 오히려 크기가 커진다.
  OffscreenCanvas를 처음써봐서 잘 모르지만, OffscreenCanvas가 문제인가 싶어서
  다른 레퍼런스들 처럼 그냥 Canvas를 사용해봤는데 이거로 해도 PNG는 그냥 크기가 커짐.
  그래도 PNG까지는 해보고 싶음.
  다른 확장자도 필요하다면 그냥 browser-image-compression 쓰는게 나을듯함

  (12/06) PNG의 무손실 압축을 구현할 수 없어서 PNG면 JPG로 변환해서 압축후 그냥 PNG로 변환한다.
  진짜 돌아만 가는 코드지만 압축은 된다.
  여기서 더 개선이나 추가 기능이 필요하다면 그냥 brower-image-compression 써야함.
  나중에 이미지 압축 관련해서도 알아보고 싶다.
 */

function compressImage(
  requestId: string,
  image: ImageBitmap,
  fileType: string,
  quality: number = 1,
  maxSizeMb: number = -1
): Promise<{ requestId: string; compressedImage: File; path: number }> {
  return new Promise((resolve, reject) => {
    const canvas = new OffscreenCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject('Failed to create canvas context');
      return;
    }

    if (fileType === 'image/png') {
      const imageData = ctx.getImageData(0, 0, image.width, image.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        data[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
    }

    ctx.drawImage(image, 0, 0);

    if (maxSizeMb !== -1) {
      const compressImageRecursively = (
        currentQuality: number
      ): Promise<{
        requestId: string;
        compressedImage: File;
        path: number;
      }> => {
        return new Promise((resolve, reject) => {
          canvas
            .convertToBlob({
              type: 'image/jpeg',
              quality: currentQuality,
            })
            .then((blob) => {
              if (
                blob.size <= maxSizeMb * 1_000_000 ||
                currentQuality <= 0.01
              ) {
                const compressedFile = new File([blob], requestId, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve({
                  requestId,
                  compressedImage: compressedFile,
                  path: currentQuality,
                });
              } else {
                resolve(compressImageRecursively(currentQuality - 0.01));
              }
            })
            .catch(reject);
        });
      };

      return compressImageRecursively(quality).then(resolve).catch(reject);
    }

    const compressOptions = {
      quality: quality,
      type: 'image/jpeg',
    };

    canvas
      .convertToBlob(compressOptions)
      .then((blob) => {
        const fileLastModified = Date.now();
        const compressedFile = new File([blob], requestId, {
          type: 'image/jpeg',
          lastModified: fileLastModified,
        });
        resolve({
          requestId: requestId,
          compressedImage: compressedFile,
          path: quality,
        });
      })
      .catch(reject);
  });
}

self.onmessage = (e) => {
  /*
    이거 왜 매개변수 5개까지만 넘어가냐
   */
  const { requestId, src, fileType, quality, maxSizeMb } = e.data;
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
      compressImage(
        requestId,
        imageBitmap,
        fileType,
        // fileName,
        quality,
        maxSizeMb
      )
    )
    .then((compressedImage) => {
      self.postMessage({
        compressedImage: compressedImage.compressedImage,
        requestId: compressedImage.requestId,
        maxSizeMb: maxSizeMb,
        path: compressedImage.path,
      });
    })
    .catch((error) => {
      self.postMessage({ error: 'Image Compression failed: ' + error });
    });
};

/*
  이거 그레이 스케일됨
 */
// function png32bitColorTo8bitColor(data: Uint8ClampedArray, canvas: OffscreenCanvas) {
//   // Create a simple 256 color palette (you can customize this if necessary)
//   const colorPalette: number[][] = [];
//   for (let i = 0; i < 256; i++) {
//     const r = (i * 255) / 255;
//     const g = (i * 255) / 255;
//     const b = (i * 255) / 255;
//     colorPalette.push([r, g, b]);
//   }
//
//   // Function to find the closest color from the palette
//   function findClosestColor(r: number, g: number, b: number): number[] {
//     let closestColor = colorPalette[0];
//     let minDistance = Infinity;
//
//     for (let i = 0; i < colorPalette.length; i++) {
//       const [cr, cg, cb] = colorPalette[i];
//       // Calculate the Euclidean distance between the current pixel and palette color
//       const distance = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2);
//       if (distance < minDistance) {
//         minDistance = distance;
//         closestColor = colorPalette[i];
//       }
//     }
//
//     return closestColor;
//   }
//
//   // Floyd-Steinberg dithering
//   for (let y = 0; y < canvas.height; y++) {
//     for (let x = 0; x < canvas.width; x++) {
//       const i = (y * canvas.width + x) * 4;
//       const r = data[i]; // Red channel
//       const g = data[i + 1]; // Green channel
//       const b = data[i + 2]; // Blue channel
//
//       // Find the closest color in the palette
//       const [closestR, closestG, closestB] = findClosestColor(r, g, b);
//
//       // Set the pixel color to the closest palette color
//       data[i] = closestR;
//       data[i + 1] = closestG;
//       data[i + 2] = closestB;
//
//       // Calculate the error between the original color and the quantized color
//       const errorR = r - closestR;
//       const errorG = g - closestG;
//       const errorB = b - closestB;
//
//       // Spread the error to neighboring pixels using Floyd-Steinberg dithering
//       if (x + 1 < canvas.width) {
//         const i1 = (y * canvas.width + (x + 1)) * 4;
//         data[i1] += (errorR * 7) / 16;
//         data[i1 + 1] += (errorG * 7) / 16;
//         data[i1 + 2] += (errorB * 7) / 16;
//       }
//
//       if (y + 1 < canvas.height) {
//         if (x > 0) {
//           const i2 = ((y + 1) * canvas.width + (x - 1)) * 4;
//           data[i2] += (errorR * 3) / 16;
//           data[i2 + 1] += (errorG * 3) / 16;
//           data[i2 + 2] += (errorB * 3) / 16;
//         }
//         const i3 = ((y + 1) * canvas.width + x) * 4;
//         data[i3] += (errorR * 5) / 16;
//         data[i3 + 1] += (errorG * 5) / 16;
//         data[i3 + 2] += (errorB * 5) / 16;
//
//         if (x + 1 < canvas.width) {
//           const i4 = ((y + 1) * canvas.width + (x + 1)) * 4;
//           data[i4] += errorR / 16;
//           data[i4 + 1] += errorG / 16;
//           data[i4 + 2] += errorB / 16;
//         }
//       }
//     }
//   }
// }
