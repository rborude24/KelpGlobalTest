const express = require("express");
const bodyParser = require("body-parser");
const { csvProcessorService } = require("./csv-convert/csv-processor-service");
require("dotenv").config(); // Load environment variables from .env
const PORT = process.env.PORT || 3000;

const app = express();

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// API endpoint for handling CSV data
app.post("/process-csv", async (req, res) => {
  try {
    const result = await csvProcessorService();
    if (!result.success) {
      res.status(500).json(result);
    } else {
      res.status(200).json({ message: "Data processed successfully", result });
    }
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
