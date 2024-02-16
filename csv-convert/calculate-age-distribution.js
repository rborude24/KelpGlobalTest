const { getDataFromDB } = require("./postgres-db-service");

// we can pass the curretn file json data here as well,
// but thought that we need to count whole table's age. so there might be previous insert operations,
// for that reason fetching data from DB
async function calculateAgeDistribution() {
  let total = 0;

  const query = "SELECT age, COUNT(*) as count FROM public.users GROUP BY age";
  const dbRows = await getDataFromDB(query);
  if (!dbRows.success) {
    return dbRows;
  }

  const ageDistribution = {
    "< 20": 0,
    "20 to 40": 0,
    "40 to 60": 0,
    "> 60": 0,
  };
  
  dbRows.data.map((row)=>{
    const count = parseInt(row.count);
    total += count;
    if (row.age < 20) {
      ageDistribution["< 20"] += count;
    } else if (row.age <= 40) {
      ageDistribution["20 to 40"] += count;
    } else if (row.age <= 60) {
      ageDistribution["40 to 60"] += count;
    } else {
      ageDistribution["> 60"] += count;
    }
})

  for (const ageGroup in ageDistribution) {
    ageDistribution[ageGroup] = ((ageDistribution[ageGroup] / total) * 100).toFixed(2) + ' %';
  }

  console.log("Age-Group :- % Distribution", ageDistribution);
  return ageDistribution;
}

module.exports = { calculateAgeDistribution };
