import sharp from 'sharp';

const resizeImage = async (fileName: string, newFileName: string, width: number, height: number): Promise<void> => {
  var widthNumber: number = 1 * width;
  var heightNumber: number = 1 * height;

  await sharp(fileName)
    .resize(widthNumber, heightNumber)
    .toFile(newFileName)
    .then((dataImage) => {
      return;
    })
    .catch((err) => {
      console.error(err.message);
      throw err;
    });
};

export default resizeImage;
