import path from 'path';
import {promises as fs} from 'fs';
import csv from 'csvtojson'


const getData = async (path: string): Promise<any> => {
  try {
    // Open csv and read as json
    var readData = await csv({flatKeys:true})
    .fromFile(path)
    .on('error', (err) => {
      console.log(err)
      throw err
    })
    console.log(`Read data from ${path}`);
    return readData
  } catch(err) {
    console.error(err.message);
    throw new err
  };
};


const appendData = async (data: { [key: string]: string }[], path: string): Promise<void> => {
  try {
    // Convert json to csv rows
    var csvText = "";
    data.forEach( (row) => {
      csvText += `\n${row["indexName"]}, ${row["fileName"]}`
    });
    // Append data
    await fs.appendFile(path, csvText);
    console.log(`Append data to ${path}`);
  } catch(error) {
    console.error(error.message);
    throw new error;
  };
};


export {getData, appendData}
