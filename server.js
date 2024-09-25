const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mysql = require("mysql2");

dotenv.config();
app.use(express.json);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((error) => {
  if (error) {
    console.log(
      `Error occurred while connecting to the database:`,
      error.stack
    );
  }

  console.log(`Connected to the database as ID`, db.threadId);
});

// Question 1 goes here
app.get("/patients", (req, res) => {
  const queryPatients = `SELECT patient_id, first_name, last_name, date_of_birth FROM patients`;

  db.query(queryPatients, (error, results) => {
    if (error) {
      console.log(`Error executing query`, error.stack);
      res.status(500).send(`Error retrieving patients data`);
    }

    res.status(200).json(results);
  });
});

// Question 2 goes here
app.get("/providers", (req, res) => {
  const queryProviders = `SELECT  first_name, last_name, provider_speciality FROM providers`;

  db.query(queryProviders, (error, results) => {
    if (error) {
      console.log(`Error executing query`, error.stack);
      res.status(500).send(`Error retrieving providers data`);
    }

    res.status(200).json(results);
  });
});

// Question 3 goes here
app.get("/patients/filter", (req, res) => {
  const query =
    "SELECT patient_id, first_name, last_name, date_of_birth FROM patients";

  db.query(query, (err, results) => {
    if (err) {
      console.log("Error executing query:", err.stack);
      res.status(500).send("Error retrieving patients");
      return;
    }

    const filteredPatients = results.filter((patient) => {
      return patient.first_name === "John";
    });

    res.status(200).json(filteredPatients);
  });
});

// Question 4 goes here
app.get("/providers", (req, res) => {
  const query =
    "SELECT provider_id, first_name, last_name, specialty FROM providers";

  db.query(query, (err, results) => {
    if (err) {
      console.log("Error executing query:", err.stack);
      res.status(500).send("Error retrieving providers");
      return;
    }
    const { provider_speciality } = req.query;

    const filteredProviders = provider_speciality
      ? results.filter(
          (provider) => provider.speciality === provider_speciality
        )
      : results;

    res.status(200).json(filteredProviders);
  });
});

app.on("close", () => {
  db.end((err) => {
    if (err) {
      console.error("Error ending the database connection:", err.stack);
    } else {
      console.log("Database connection closed");
    }
  });
});

// listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is runnig on http://localhost:${PORT}`);
});
