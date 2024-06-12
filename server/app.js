const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");
const mongoose = require("mongoose");

const Student = require("./models/Student.model");
const Cohort = require("./models/Cohort.model");

const studentData = require("./students.json");
const cohortData = require("./cohorts.json");
// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// COHOTS ROUTES:
// GET /api/cohorts - Retrieves all of the cohorts in the database collection
app.get("/api/cohorts", (req, res) => {
  try {
    res.json(cohortData);
  } catch (error) {
    res.send(500).json({ message: "Problem getting all cohorts, sorry" });
  }
});

// POST /api/cohorts - Creates a new cohort
app.post("/api/cohorts", async (req, res) => {
  try {
    const newCohort = await Cohort.create(req.body);
    res.status(201).json(newCohort);
  } catch (error) {
    res.status(500).json({ message: "Cohort created" });
  }
});

// GET /api/cohorts/:cohortId - Retrieves a specific cohort by id
app.get("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const theCohort = await Cohort.findById(req.params.id);
    res.status(200).json(theCohort);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Issue getting the Cohort - ${req.params.id}` });
  }
});

// PUT /api/cohorts/:cohortId - Updates a specific cohort by id
app.put("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const updatedCohort = Cohort.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedCohort);
  } catch (error) {
    res.status().json({ message: "Cohort updated" });
  }
});

// DELETE /api/cohorts/:cohortId - Deletes a specific cohort by id
app.delete("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const deletedCohort = Cohort.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `Cohort ${req.params.id} was deleted.` });
  } catch (error) {
    res.status(500).json({ message: "Cohort deleted" });
  }
});

app.get("/api/students", (req, res) => {
  res.json(studentData);
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
