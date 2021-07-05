import path from 'path';
import images from '../../../routes/api/images';
import { PathLike, promises as fs } from 'fs';

describe('expect images module resizeFile and save thumb correctly', () => {
  describe('expect resizeImage works as expected', () => {
    const thumbFile: PathLike = path.resolve(__dirname, '../../../tests/assets/thumb/fjord-200x200.jpg');
    const imageSampleFile: PathLike = path.resolve(__dirname, '../../../tests/assets/images/fjord.jpg');
    const imageNotExists: PathLike = path.resolve(__dirname, '../../../tests/assets/images/doNotExists.jpg');

    afterAll(async () => {
      // Delete files
      await fs.rm(thumbFile);
    });

    it('expect resizeImage should save a new image correctly', async () => {
      // Act
      await images.resizeImage(imageSampleFile, thumbFile, 200, 200);
      // Assert
      await expectAsync(fs.access(thumbFile)).toBeResolved();
    });

    it('expect resizeImage dont save a new image if source image does not exists', async () => {
      // Act
      await expectAsync(images.resizeImage(imageNotExists, thumbFile, 200, 200)).toBeRejected();
    });
  });

  describe('expect checkAndCreateThumb works as expected', () => {
    const fileNameNoData: PathLike = path.resolve(__dirname, '../../../tests/assets/data/checkImagesNothing.csv');
    const fileNameSampleData: PathLike = path.resolve(__dirname, '../../../tests/assets/data/checkImageSample.csv');
    const fileNameImage200x300: PathLike = path.resolve(__dirname, '../../../tests/assets/thumb/fjord-200x300.jpg');
    const fileNameImage100x100: PathLike = path.resolve(__dirname, '../../../tests/assets/thumb/fjord-100x100.jpg');
    const imagesFolder: PathLike = '../../../images/';
    const thumbFolder: PathLike = '../../tests/assets/thumb';

    beforeAll(async () => {
      // Setup files
      // Save file with no data
      var text: string = 'indexName, fileName';
      await fs.writeFile(fileNameNoData, text);
      // Save file with sample data
      var text: string = text + `\nfjord-200x300, ${fileNameImage200x300}`;
      await fs.writeFile(fileNameSampleData, text);
    });

    it('expect checkAndCreateThumb call resizeImage if image does not exists', async () => {
      // Arrange
      var expectedCsvText: string = `indexName, fileName\nfjord-100x100, ${fileNameImage100x100}`;
      // Assert
      expect(
        await images.checkAndCreateThumb(
          'fjord',
          100,
          100,
          imagesFolder,
          thumbFolder,
          '../../tests/assets/data/checkImagesNothing.csv',
        ),
      ).toEqual(fileNameImage100x100);
      expect(await fs.readFile(fileNameNoData, 'utf-8')).toEqual(expectedCsvText);
    });

    it('expect checkAndCreateThumb dont call resizeImage if image already exists', async () => {
      // Arrange
      var expectedCsvText: string = `indexName, fileName\nfjord-200x300, ${fileNameImage200x300}`;
      spyOn(images, 'resizeImage');
      // Assert
      expect(await fs.readFile(fileNameSampleData, 'utf-8')).toEqual(expectedCsvText);
      expect(
        await images.checkAndCreateThumb(
          'fjord',
          200,
          300,
          imagesFolder,
          thumbFolder,
          '../../tests/assets/data/checkImageSample.csv',
        ),
      ).toEqual(fileNameImage200x300);
      expect(images.resizeImage).not.toHaveBeenCalled();
      expect(await fs.readFile(fileNameSampleData, 'utf-8')).toEqual(expectedCsvText);
    });

    it('expect checkAndCreateThumb reject if any path is wrong', async () => {
      // Assert
      await expectAsync(
        images.checkAndCreateThumb('fjord', 500, 300, imagesFolder, thumbFolder, 'DataNotExists'),
      ).toBeRejected();
    });
  });
});
