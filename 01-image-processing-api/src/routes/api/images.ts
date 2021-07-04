import express from 'express';
import path from 'path';
import sharp from 'sharp';
import { getData, appendData } from '../../utilities/storeData'

var imagesFolderDefault: string = '../../../images/';
var thumbFolderDefault: string = '../../../thumb/';
var csvFileNameDefault: string = '../../../data/images.csv';

const resizeImage = async (fileName: string, newFileName: string, width: number, height: number): Promise<void> => {
  var widthNumber: number = 1 * width;
  var heightNumber: number = 1 * height;

  console.info(`Resizing ${fileName}`);

  await sharp(fileName)
  .resize(widthNumber, heightNumber)
  .toFile(newFileName)
  .then( dataImage => {
    console.info(`Created ${newFileName}`)
  })
  .catch( err => {
    console.error(err.message);
    throw err;
  });
};


const check_and_create_thumb = async (
    image: string,
    width: number,
    height: number,
    imagesFolder: string = imagesFolderDefault,
    thumbFolder: string = thumbFolderDefault,
    csvFileName: string = csvFileNameDefault
  ): Promise<string> => {
  try {
    // Var definition
    var thumbName:string = `${image}-${width}x${height}`;
    var fileName: string = path.resolve(__dirname, imagesFolder, `${image}.jpg`);
    var newFileName: string = path.resolve(__dirname, thumbFolder, `${thumbName}.jpg`);
    var csvPath: string = path.resolve(__dirname, csvFileName)
    // Read data
    var data = await getData(csvPath);
    // Check if image was already resized according to width and height
    var imageData: { [key: string] : string }[] = data.map( (row: { [key: string]: string }) => {
      if (row["indexName"] == thumbName) {
        return row
      }
    });
    // Check if is needed to resize the image
    if (imageData[0] === undefined) {
      await resizeImage(fileName, newFileName, width, height);
      var imageData: { [key: string] : string }[] = [
        {"indexName": thumbName, "fileName": newFileName}
      ];
      await appendData(imageData, csvPath);
    }
    // Return filename
    return imageData[0]["fileName"];
  } catch(error) {
    console.error(error.message);
    throw error;
  };
};

const images = express.Router();

images.get('/', async (req, res) => {
  try {
    var image: string = (req.query.image as unknown) as string;
    var width: number = (req.query.width as unknown) as number;
    var height: number = (req.query.height as unknown) as number;
    var responseFileName = await check_and_create_thumb(image, width, height);
    res.sendFile(responseFileName);
  } catch(error) {
    console.error(error.message);
    res.status(500).send("Internal Error");
  };
});

export default {
  images,
  check_and_create_thumb,
  resizeImage,
};
