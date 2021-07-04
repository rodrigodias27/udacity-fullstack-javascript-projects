import path from 'path';
import images from '../../../routes/api/images';
import {PathLike, promises as fs} from 'fs';


describe('Test resizeImage', () => {

  afterAll( async() => {
    // Delete files
    var file = path.resolve(__dirname, '../../../tests/assets/thumb/fjord-200x200.jpg');
    await fs.rm(file);
  });

  it('resizeImage should save a new image', async() => {
    // Arrange
    var sampleImage = path.resolve(__dirname, '../../../tests/assets/images/fjord.jpg');
    var newFile = path.resolve(__dirname, '../../../tests/assets/thumb/fjord-200x200.jpg');
    // Act
    await images.resizeImage(sampleImage, newFile, 200, 200);
    // Assert
    await expectAsync(fs.access(newFile)).toBeResolved();
  });

  it('resizeImage shouldnt save a new image if source image does not exists', async() => {
    // Arrange
    var sampleImage = path.resolve(__dirname, '../../../tests/assets/images/doNotExists.jpg');
    var newFile = path.resolve(__dirname, '../../../tests/assets/thumb/fjord-200x200.jpg');
    // Act
    await expectAsync(images.resizeImage(sampleImage, newFile, 200, 200)).toBeRejected();
  });

});


describe('Tests check_and_create_thumb', () => {

  beforeAll( async() => {
    // Setup files
    var fileNameNoData: PathLike = path.resolve(__dirname, '../../../tests/assets/data/checkImagesNothing.csv')
    var fileNameSampleData: PathLike = path.resolve(__dirname, '../../../tests/assets/data/checkImageSample.csv');
    // Save file with no data
    var text: string = 'indexName, fileName';
    await fs.writeFile(fileNameNoData, text);
    // Save file with sample data
    var fileNameImage: PathLike = path.resolve(__dirname, '../../../tests/assets/thumb/fjord-200x300.jpg');
    var text: string = text + `\nfjord-200x300, ${fileNameImage}`;
    await fs.writeFile(fileNameSampleData, text);
  });

  it('check_and_create_thumb should call resizeImage if image does not exists', async() => {
    // Arrange
    var fileNameImage: string = path.resolve(__dirname, '../../../tests/assets/thumb/fjord-100x100.jpg')
    var fileNameNoData: string = path.resolve(__dirname, '../../../tests/assets/data/checkImagesNothing.csv')
    var expectedCsvText: string = `indexName, fileName\nfjord-100x100, ${fileNameImage}`;
    // Assert
    expect(await images.check_and_create_thumb(
      'fjord',
      100,
      100,
      '../../../images/',
      '../../tests/assets/thumb',
      '../../tests/assets/data/checkImagesNothing.csv'
    )).toEqual(fileNameImage);
    expect(await fs.readFile(fileNameNoData, 'utf-8')).toEqual(expectedCsvText);
  });

  it('check_and_create_thumb should call resizeImage if image already exists', async() => {
    // Arrange
    var fileNameImage: string = path.resolve(__dirname, '../../../tests/assets/thumb/fjord-200x300.jpg')
    var fileNameSampleData: string = path.resolve(__dirname, '../../../tests/assets/data/checkImageSample.csv')
    var expectedCsvText: string = `indexName, fileName\nfjord-200x300, ${fileNameImage}`;
    // Assert
    expect(await images.check_and_create_thumb(
      'fjord',
      200,
      300,
      '../../../images/',
      '../../tests/assets/thumb',
      '../../tests/assets/data/checkImageSample.csv'
    )).toEqual(fileNameImage);
    expect(await fs.readFile(fileNameSampleData, 'utf-8')).toEqual(expectedCsvText);
  });

  // TODO: test async Reject
});

// TODO: test route
