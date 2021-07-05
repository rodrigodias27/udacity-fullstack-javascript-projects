import path from 'path';
import { getData, appendData } from './storeData';
import resizeImage from './resizeImage';

var imagesFolderDefault: string = '../../images/';
var thumbFolderDefault: string = '../../thumb/';
var csvFileNameDefault: string = '../../data/images.csv';

const checkAndCreateThumb = async (
  image: string,
  width: number,
  height: number,
  imagesFolder: string = imagesFolderDefault,
  thumbFolder: string = thumbFolderDefault,
  csvFileName: string = csvFileNameDefault,
): Promise<string> => {
  try {
    // Var definition
    var thumbName: string = `${image}-${width}x${height}`;
    var fileName: string = path.resolve(__dirname, imagesFolder, `${image}.jpg`);
    var newFileName: string = path.resolve(__dirname, thumbFolder, `${thumbName}.jpg`);
    var csvPath: string = path.resolve(__dirname, csvFileName);
    // Read data
    var data = await getData(csvPath);
    // Check if image was already resized according to width and height
    var imageData: { [key: string]: string }[] = data.map((row: { [key: string]: string }) => {
      if (row['indexName'] == thumbName) {
        return row;
      }
    });
    // Check if is needed to resize the image
    if (imageData[0] === undefined) {
      await resizeImage(fileName, newFileName, width, height);
      var imageData: { [key: string]: string }[] = [{ indexName: thumbName, fileName: newFileName }];
      await appendData(imageData, csvPath);
    }
    // Return filename
    return imageData[0]['fileName'];
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export default checkAndCreateThumb;
