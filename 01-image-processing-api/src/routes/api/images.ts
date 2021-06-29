import express from 'express';
import path from 'path';
import sharp from 'sharp';
import { getData, appendData } from '../../utilities/storeData'

var jsonPath: string = path.resolve(__dirname, '../../../data/images.json');


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


const check_and_create_thumb = async (image: string, width: number, height: number): Promise<string> => {
  try {
    // Var definition
    var thumbName:string = `${width}x${height}`;
    var fileName: string = path.resolve(__dirname, '../../../images', `${image}.jpg`);
    var newFileName:string = path.resolve(__dirname, '../../../thumb/', `${image}-${thumbName}.jpg`);
    var data = await getData(jsonPath);
    // Logs
    console.log(thumbName);
    console.log(fileName);
    console.log(newFileName);
    console.log(data);
    // Create an object
    if (data[image] === undefined) {
      data[image] = {};
    };
    // Create a new thumb if there is no image on thumb
    if (data[image][thumbName] === undefined) {
      await resizeImage(fileName, newFileName, width, height);
      data[image][thumbName] = newFileName;
    };
    // Logs
    console.log(data);
    // Save json
    await appendData(data, jsonPath);
    return data[image][thumbName];
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

export {
  images,
  check_and_create_thumb,
  resizeImage,
};
