const fs = require("fs");
const readline = require("readline");

// Parse CSV data and convert to JSON
async function processCsvToJsonData(csvFilePath) {
    // using streams than readFile will make my code to execute faster as it read it in chunk
  const readStream = fs.createReadStream(csvFilePath, "utf-8");
  const rl = readline.createInterface({ input: readStream });

  const result = [];
  let headers = null;

  await new Promise((resolve, reject) => {
    rl.on("line", (line) => {
      if (!headers) {
        headers = line.split(",").map((header) => header.trim());
      } else {
        const row = line.split(",");
        const obj = {};

        row.forEach((value, j) => {
          const property = headers[j];
          const trimmedValue = value.trim();

          if (property === "name.firstName") {
            obj.name = trimmedValue;
          } else if (property === "name.lastName") {
            obj.name += ` ${trimmedValue}`;
          } else if (property === "age") {
            obj.age = trimmedValue;
          } else if (property === "gender") {
            obj.additional_info = { gender: trimmedValue };
          } else {
            //for nested properties
            const nestedProperties = property.split(".");
            let currentObj = obj;

            for (let k = 0; k < nestedProperties.length; k++) {
              const nestedProp = nestedProperties[k];

              if (!currentObj[nestedProp]) {
                currentObj[nestedProp] = {};
              }

              if (k === nestedProperties.length - 1) {
                currentObj[nestedProp] = trimmedValue;
              } else {
                currentObj = currentObj[nestedProp];
              }
            }
          }
        });

        result.push(obj);
      }
    });

    rl.on("close", () => {
      resolve();
    });
  });
  
  return result;
}

module.exports = { processCsvToJsonData };
