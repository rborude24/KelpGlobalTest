const { csvProcessorService } = require('../csv-processor-service'); // replace 'yourFile' with your actual file name
const { processCsvToJsonData } = require("../csv-json-convertor");
const { insertDataIntoUsersTable } = require('../postgres-db-service');
const { calculateAgeDistribution } = require("../calculate-age-distribution");

jest.mock('../csv-json-convertor');
jest.mock('../postgres-db-service');
jest.mock('../calculate-age-distribution');

describe('csvProcessorService', () => {
  it('should process CSV data, insert it into the database, and calculate age distribution', async () => {
    const mockData = [{ name: 'John Doe', age: 30, address: null, additional_info: null }];
    processCsvToJsonData.mockResolvedValueOnce(mockData);
    insertDataIntoUsersTable.mockResolvedValueOnce({ success: true });
    calculateAgeDistribution.mockResolvedValueOnce({ success: true, data: { '30-39': 1 } });

    const actualValue = await csvProcessorService('test.csv');

    expect(actualValue).toEqual({ success: true, data: { '30-39': 1 } });
    expect(processCsvToJsonData).toHaveBeenCalledWith('test.csv');
    expect(insertDataIntoUsersTable).toHaveBeenCalledWith(mockData);
    expect(calculateAgeDistribution).toHaveBeenCalledTimes(1);
  });

  it('should return an error if inserting data into the database fails', async () => {
    const mockData = [{ name: 'John Doe', age: 30, address: null, additional_info: null }];
    processCsvToJsonData.mockResolvedValueOnce(mockData);
    insertDataIntoUsersTable.mockResolvedValueOnce({ success: false, error: 'Database error' });

    const actualValue = await csvProcessorService('test.csv');

    expect(actualValue).toEqual({ success: false, error: 'Database error' });
    expect(processCsvToJsonData).toHaveBeenCalledWith('test.csv');
    expect(insertDataIntoUsersTable).toHaveBeenCalledWith(mockData);
  });
});
