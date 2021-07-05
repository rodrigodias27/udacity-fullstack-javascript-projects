import express from 'express';
import checkAndCreateThumb from '../../utilities/thumbManager';

const images = express.Router();

images.get('/', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    var image: string = req.query.image as unknown as string;
    var width: number = req.query.width as unknown as number;
    var height: number = req.query.height as unknown as number;
    // Check parameters and call checkAndCreateThumb
    if (image === undefined || width === undefined || height === undefined) {
      res.status(400).send('Missing params');
    } else {
      var responseFileName = await checkAndCreateThumb(image, width, height);
      res.sendFile(responseFileName);
    }
  } catch (error) {
    console.error(error.message);
    if (error.message == 'Input file is missing') {
      res.status(404).send('Image not found.');
    } else {
      res.status(500).send('Internal Error');
    }
  }
});

export default images;
