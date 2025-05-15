import Resizer from "react-image-file-resizer";

// Your existing function
export const resizeImage = (
  file,
  maxWidth,
  maxHeight,
  compressQuality
) => {
  return new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      file,
      maxWidth,
      maxHeight,
      "JPEG", // or 'PNG', depending on your use case
      compressQuality,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64" // or 'file' for returning a file object
    );
  });
};
