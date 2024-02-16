const { processCsvToJsonData } = require("./csv-json-convertor");
const { insertDataIntoUsersTable } = require("./postgres-db-service");
const { calculateAgeDistribution } = require("./calculate-age-distribution");

async function csvProcessorService() {
  
// Read CSV file from configurable location (using .env file)
  const csvFilePath = process.env.CSV_FILE_PATH;

// convert csv data into JSON array
  const jsonData = await processCsvToJsonData(csvFilePath);

// insert into database
  const result = await insertDataIntoUsersTable(jsonData);

  if (!result.success) {
    return result;
  }

// get all data from DB, & calculate age distribution
  const getData = await calculateAgeDistribution();
  return getData;
}

module.exports = { csvProcessorService };
