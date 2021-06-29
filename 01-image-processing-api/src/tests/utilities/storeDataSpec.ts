import path from 'path';
import { getData, appendData } from '../../utilities/storeData';
import {PathLike, promises as fs} from 'fs';


describe('getData Tests', () => {

  it('getData should return {} when images.json is empty', async() => {
    var jsonEmptyPath = path.resolve(__dirname, '../assets/data/imagesEmpty.csv');
    expect(await getData(jsonEmptyPath)).toEqual([])
  });

  it('getData should return as expected', async() => {
    var jsonSamplePath = path.resolve(__dirname, '../assets/data/imagesSample.csv');
    expect(await getData(jsonSamplePath)).toEqual(
      [
        {indexName: 'fjord-200x200', fileName: 'thumb/fjord-200x200.jpg'}
      ]
    );
  });

  // it('getData should trown an error', async() => {
  //   var jsonNotPath = path.resolve(__dirname, '../../assets/data/imagesNotFind.csv');
  //   expect( async () => {await getData(jsonNotPath)}).toThrowError();
  // });

});

describe('appendData Tests', () => {

  beforeAll( async() => {
    // setup files
    var fileNameAppendNothing: PathLike = path.resolve(__dirname, '../assets/data/imagesAppendNothing.csv')
    var fileNameAppendSample: PathLike = path.resolve(__dirname, '../assets/data/appendSample.csv');
    var text: string = 'indexName, fileName';
    await fs.writeFile(fileNameAppendNothing, text);
    await fs.writeFile(fileNameAppendSample, text);
  });

  it('appendData should append nothing if data is []', async() => {
    // Arrange
    var csvEmptyPath = path.resolve(__dirname, '../assets/data/imagesAppendNothing.csv');
    // Act
    await appendData([], csvEmptyPath);
    // Assert
    var expectedCsvText: string = 'indexName, fileName'
    expect(await fs.readFile(csvEmptyPath, 'utf-8')).toEqual(expectedCsvText)
  });

  it('appendData should append correctly', async() => {
    // Arrange
    var csvSamplePath = path.resolve(__dirname, '../assets/data/appendSample.csv');
    var jsonData: { [key: string]: string }[] = [
      {indexName: 'fjord-200x200', fileName: 'thumb/fjord-200x200.jpg'},
      {indexName: 'fjord-200x300', fileName: 'thumb/fjord-200x300.jpg'}
    ];
    // Act
    await appendData(jsonData, csvSamplePath);
    // Assert
    var expectedCsvText: string = 'indexName, fileName'
                                + '\nfjord-200x200, thumb/fjord-200x200.jpg'
                                + '\nfjord-200x300, thumb/fjord-200x300.jpg'
    expect(await fs.readFile(csvSamplePath, 'utf-8')).toEqual(expectedCsvText)
  });

  // it('getData should trown an error', async() => {
  //   var jsonNotPath = path.resolve(__dirname, '../../assets/data/imagesNotFind.csv');
  //   expect( async () => {await getData(jsonNotPath)}).toThrowError();
  // });

});
