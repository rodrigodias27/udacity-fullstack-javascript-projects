import express, { json } from 'express';
import path from 'path';
import {promises as fs} from 'fs';
import sharp from 'sharp';

const app = express();
const port = 3000;

const errorMiddleware = (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

var jsonData: { [key: string]: any };
var jsonPath: string = path.resolve(__dirname, '../data/images.json');


const getJsonData = async (): Promise<{ [key: string]: any }> => {
  try {
    if (jsonData === undefined) {
      var dataString = await fs.readFile(jsonPath, 'utf-8');
      jsonData = JSON.parse(dataString);
    };
    console.log(jsonData);
    return jsonData;
  } catch(error) {
    console.error(error.message);
    return error.message;
  };
};

const saveJsonData = async (): Promise<void> => {
  try {
    if (jsonData !== undefined) {
      await fs.writeFile(jsonPath, JSON.stringify(jsonData));
    }
  } catch(error) {
    console.error(error.message);
  };
};


const check_and_create_thumb = async (image: string, width: number, height: number): Promise<string> => {
  try {
    var thumbName = `${width}x${height}`;
    var fileName: string = path.resolve(__dirname, '../images', `${image}.jpg`);
    var newFileName = path.resolve(__dirname, `../thumb/${image}-${thumbName}.jpg`);
    var data = await getJsonData();

    console.log(thumbName);
    console.log(fileName);
    console.log(newFileName);
    console.log(data);

    if (data[image] === undefined) {
      data[image] = {};
      console.log(data);
    }

    if (data[image][thumbName] === undefined) {
      var widthNumber: number = 1 * width;
      var heightNumber: number = 1 * height;

      console.log('Resizing');

      await sharp(fileName)
      .resize(widthNumber, heightNumber)
      .toFile(newFileName)
      .then( dataImage => {
        data[image][thumbName] = newFileName;
        console.log(data);
      })
      .catch( err => { console.error(err.message) });

    }

    console.log(data);

    await saveJsonData();
    return data[image][thumbName]
  } catch(error) {
    console.error(error.message);
    return error.message;
  };
};


app.get('/images', async (req, res) => {
  var image: string = (req.query.image as unknown) as string;
  var width: number = (req.query.width as unknown) as number;
  var height: number = (req.query.height as unknown) as number;
  var responseFileName = await check_and_create_thumb(image, width, height);
  res.sendFile(responseFileName);
});


app.use(errorMiddleware);


app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
