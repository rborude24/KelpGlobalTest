const fs = require('fs');
const readline = require('readline');
const { processCsvToJsonData } = require('../csv-json-convertor'); // replace 'yourFile' with your actual file name

jest.mock('fs');
jest.mock('readline');

describe('processCsvToJsonData', () => {
  it.only('should process CSV data into JSON', async () => {
    const mockReadStream = {
      on: jest.fn().mockImplementation(function(event, callback) {
        if (event === 'data') {
          callback('name.firstName,name.lastName,age,gender\nJohn,Doe,30,Male');
        }
        if (event === 'end') {
          callback();
        }
        return this;
      }),
    };

    fs.createReadStream.mockReturnValue(mockReadStream);

    const mockInterface = {
      on: jest.fn().mockImplementation(function(event, callback) {
        if (event === 'line') {
            callback('name.firstName,name.lastName,age,gender')
            callback('John,Doe,30,Male');
        }
        if (event === 'close') {
          callback();
        }
        return this;
      }),
    };

    readline.createInterface.mockReturnValue(mockInterface);

    const result = await processCsvToJsonData('test.csv');

    expect(result).toEqual([
      {
        name: 'John Doe',
        age: '30',
        additional_info: { gender: 'Male' },
      },
    ]);
  });
});
