const { Pool } = require("pg");
const format = require('pg-format');
require("dotenv").config(); // Load environment variables from .env

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
}

// PostgreSQL configuration
const pool = new Pool(config);

// Define your table structure
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id serial4 PRIMARY KEY,
        name varchar NOT NULL,
        age int NOT NULL,
        address jsonb NULL,
        additional_info jsonb NULL
    );
`;

async function insertDataIntoUsersTable(jsonData) {
  try {
    // Create the table if it doesn't exist
    console.log(createTableQuery);
    await pool.query(createTableQuery);

    // Prepare the data for bulk insert
    const values = jsonData.map(obj => [obj.name, obj.age, obj.address, obj.additional_info]);

    // Construct the insert query
    const insertQuery = format(
      'INSERT INTO users (name, age, address, additional_info) VALUES %L',
      values
    );

    // Execute the query
    console.log(insertQuery);
    const result = await pool.query(insertQuery);
    console.log("Data inserted successfully!", result);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error inserting data:", error);
    return {
      success: false,
      error: "error inserting data",
      error,
    };
  }
}


async function getDataFromDB(query) {
  try {
    // execute query
    var res = await pool.query(query);
    console.log("Data got successfully!", res);
    return {
      success: true,
      data: res?.rows,
    };
  } catch (error) {
    console.error("Error getting data:", error);
    return {
      success: false,
      error: error,
    };
  }
}

module.exports = { insertDataIntoUsersTable, getDataFromDB };
