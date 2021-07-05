import path from 'path';
import { promises as fs } from 'fs';
import csv from 'csvtojson';

const getData = async (path: string): Promise<any> => {
  try {
    // Open csv and read as json
    var readData = await csv({ flatKeys: true }).fromFile(path);
    return readData;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const appendData = async (data: { [key: string]: string }[], path: string): Promise<void> => {
  try {
    // Convert json to csv rows
    var csvText = '';
    data.forEach((row) => {
      csvText += `\n${row['indexName']}, ${row['fileName']}`;
    });
    // Append data
    await fs.appendFile(path, csvText);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export { getData, appendData };
