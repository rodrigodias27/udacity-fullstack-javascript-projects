import { PathLike, promises as fs } from 'fs';
import path from 'path';
import * as resizeImage from '../../utilities/resizeImage';
import checkAndCreateThumb from '../../utilities/thumbManager';

describe('expect checkAndCreateThumb works as expected', () => {
  const fileNameNoData: PathLike = path.resolve(__dirname, '../assets/data/checkImagesNothing.csv');
  const fileNameSampleData: PathLike = path.resolve(__dirname, '../assets/data/checkImageSample.csv');
  const fileNameImage200x300: PathLike = path.resolve(__dirname, '../assets/thumb/fjord-200x300.jpg');
  const fileNameImage100x100: PathLike = path.resolve(__dirname, '../assets/thumb/fjord-100x100.jpg');
  const imagesFolder: PathLike = '../../images/';
  const thumbFolder: PathLike = '../tests/assets/thumb';

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
      await checkAndCreateThumb(
        'fjord',
        100,
        100,
        imagesFolder,
        thumbFolder,
        '../tests/assets/data/checkImagesNothing.csv',
      ),
    ).toEqual(fileNameImage100x100);
    expect(await fs.readFile(fileNameNoData, 'utf-8')).toEqual(expectedCsvText);
  });

  it('expect checkAndCreateThumb dont call resizeImage if image already exists', async () => {
    // Arrange
    var expectedCsvText: string = `indexName, fileName\nfjord-200x300, ${fileNameImage200x300}`;
    spyOn(resizeImage, 'default');
    // Assert
    expect(await fs.readFile(fileNameSampleData, 'utf-8')).toEqual(expectedCsvText);
    expect(
      await checkAndCreateThumb(
        'fjord',
        200,
        300,
        imagesFolder,
        thumbFolder,
        '../tests/assets/data/checkImageSample.csv',
      ),
    ).toEqual(fileNameImage200x300);
    expect(resizeImage.default).not.toHaveBeenCalled();
    expect(await fs.readFile(fileNameSampleData, 'utf-8')).toEqual(expectedCsvText);
  });

  it('expect checkAndCreateThumb reject if any path is wrong', async () => {
    // Assert
    await expectAsync(
      checkAndCreateThumb('fjord', 500, 300, imagesFolder, thumbFolder, 'DataNotExists'),
    ).toBeRejected();
  });
});
