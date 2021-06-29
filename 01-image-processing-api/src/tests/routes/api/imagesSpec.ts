import path from 'path';
import {images, check_and_create_thumb, resizeImage} from '../../../routes/api/images';
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
    await resizeImage(sampleImage, newFile, 200, 200);
    // Assert
    await expectAsync(fs.access(newFile)).toBeResolved();
  });

  it('resizeImage shouldnt save a new image if source image does not exists', async() => {
    // Arrange
    var sampleImage = path.resolve(__dirname, '../../../tests/assets/images/doNotExists.jpg');
    var newFile = path.resolve(__dirname, '../../../tests/assets/thumb/fjord-200x200.jpg');
    // Act
    await expectAsync(resizeImage(sampleImage, newFile, 200, 200)).toBeRejected()
  });

});

// describe('appendData Tests', () => {

//   beforeAll( async() => {
//     // setup files
//     var fileNameAppendNothing: PathLike = path.resolve(__dirname, '../assets/data/imagesAppendNothing.csv')
//     var fileNameAppendSample: PathLike = path.resolve(__dirname, '../assets/data/appendSample.csv');
//     var text: string = 'indexName, fileName';
//     await fs.writeFile(fileNameAppendNothing, text);
//     await fs.writeFile(fileNameAppendSample, text);
//   });

//   it('appendData should append nothing if data is []', async() => {
//     // Arrange
//     var csvEmptyPath = path.resolve(__dirname, '../assets/data/imagesAppendNothing.csv');
//     // Act
//     await appendData([], csvEmptyPath);
//     // Assert
//     var expectedCsvText: string = 'indexName, fileName'
//     expect(await fs.readFile(csvEmptyPath, 'utf-8')).toEqual(expectedCsvText)
//   });

//   it('appendData should append correctly', async() => {
//     // Arrange
//     var csvSamplePath = path.resolve(__dirname, '../assets/data/appendSample.csv');
//     var jsonData: { [key: string]: string }[] = [
//       {indexName: 'fjord-200x200', fileName: 'thumb/fjord-200x200.jpg'},
//       {indexName: 'fjord-200x300', fileName: 'thumb/fjord-200x300.jpg'}
//     ];
//     // Act
//     await appendData(jsonData, csvSamplePath);
//     // Assert
//     var expectedCsvText: string = 'indexName, fileName'
//                                 + '\nfjord-200x200, thumb/fjord-200x200.jpg'
//                                 + '\nfjord-200x300, thumb/fjord-200x300.jpg'
//     expect(await fs.readFile(csvSamplePath, 'utf-8')).toEqual(expectedCsvText)
//   });

//   // it('getData should trown an error', async() => {
//   //   var jsonNotPath = path.resolve(__dirname, '../../assets/data/imagesNotFind.csv');
//   //   expect( async () => {await getData(jsonNotPath)}).toThrowError();
//   // });

// });
