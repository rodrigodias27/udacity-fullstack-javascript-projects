import path from 'path';
import { getData, appendData } from '../../utilities/storeData';
import { PathLike, promises as fs } from 'fs';

describe('expect storeData load and save data on csv', () => {
  describe('expect getData load data from csv', () => {
    it('expect getData return {} when images.csv is empty', async () => {
      var csvEmptyPath = path.resolve(__dirname, '../assets/data/imagesEmpty.csv');
      expect(await getData(csvEmptyPath)).toEqual([]);
    });

    it('expect getData return as expected', async () => {
      var csvSamplePath = path.resolve(__dirname, '../assets/data/imagesSample.csv');
      expect(await getData(csvSamplePath)).toEqual([
        { indexName: 'fjord-200x200', fileName: 'thumb/fjord-200x200.jpg' },
      ]);
    });

    it('expect getData trown an error if file does not exists', async () => {
      var csvNotPath = path.resolve(__dirname, '../../assets/data/imagesNotFind.csv');
      await expectAsync(getData(csvNotPath)).toBeRejected();
    });
  });

  describe('expect appendData append data correctly', () => {
    const csvAppendNothing: PathLike = path.resolve(__dirname, '../assets/data/imagesAppendNothing.csv');
    const csvNameAppendSample: PathLike = path.resolve(__dirname, '../assets/data/appendSample.csv');

    beforeAll(async () => {
      // Setup, clean files
      var text: string = 'indexName, fileName';
      await fs.writeFile(csvAppendNothing, text);
      await fs.writeFile(csvNameAppendSample, text);
    });

    it('expect appendData append nothing if data is []', async () => {
      // Act
      await appendData([], csvAppendNothing);
      // Assert
      var expectedCsvText: string = 'indexName, fileName';
      expect(await fs.readFile(csvAppendNothing, 'utf-8')).toEqual(expectedCsvText);
    });

    it('expect appendData append data correctly', async () => {
      // Arrange
      var jsonData: { [key: string]: string }[] = [
        { indexName: 'fjord-200x200', fileName: 'thumb/fjord-200x200.jpg' },
        { indexName: 'fjord-200x300', fileName: 'thumb/fjord-200x300.jpg' },
      ];
      // Act
      await appendData(jsonData, csvNameAppendSample);
      // Assert
      var expectedCsvText: string =
        'indexName, fileName' + '\nfjord-200x200, thumb/fjord-200x200.jpg' + '\nfjord-200x300, thumb/fjord-200x300.jpg';
      expect(await fs.readFile(csvNameAppendSample, 'utf-8')).toEqual(expectedCsvText);
    });

    it('expect appendData trown an error if csv file does not exists', async () => {
      // Setup
      var csvNotPath = path.resolve(__dirname, '../../assets/data/imagesNotFind.csv');
      // Act and Assert
      await expectAsync(appendData([], csvNotPath)).toBeRejected();
    });
  });
});
