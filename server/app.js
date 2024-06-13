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

app.get("/api/cohorts", async (req, res) => {
  try {
    const allCohorts = await Cohort.find();
    res.status(200).json(allCohorts);
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
    const { cohortId } = req.params;
    console.log("========>", cohortId);
    const theCohort = await Cohort.findById(cohortId);
    res.status(200).json(theCohort);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Issue getting the Cohort" });
  }
});

// PUT /api/cohorts/:cohortId - Updates a specific cohort by id
app.put("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const { cohortId } = req.params;
    const updatedCohort = await Cohort.findByIdAndUpdate(cohortId, req.body, {
      new: true,
    });
    res.status(200).json(updatedCohort);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// DELETE /api/cohorts/:cohortId - Deletes a specific cohort by id
app.delete("/api/cohorts/:cohortId", async (req, res) => {
  try {
    await Cohort.findByIdAndDelete(req.params.cohortId);
    res
      .status(200)
      .json({ message: `Cohort ${req.params.cohortId} was deleted.` });
  } catch (error) {
    res.status(500).json({ message: "Cohort deleted" });
  }
});

//Student Routes
//GET ALL STUDENTS
app.get("/api/students", async (req, res) => {
  try {
    const allStudents = await Student.find().populate("cohort");
    res.status(200).json(allStudents);
  } catch (error) {
    res.status(500).json(error);
  }
});

//CREATE A NEW STUDENT
app.post("/api/students", async (req, res) => {
  try {
    const createStudent = await Student.create(req.body);
    res.status(201).json(createStudent);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//GET ALL STUDENTS FROM GIVEN COHORT
app.get("/api/students/cohort/:cohortId", async (req, res) => {
  try {
    const { cohortId } = req.params;
    const students = await Student.find().populate("cohort");
    res.status(200).json(students);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//GET STUDENT BY ID
app.get("/api/students/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId).populate("cohort");
    res.status(200).json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error while getting single student" });
  }
});

//UPDATE STUDENT BY ID
app.put("/api/students/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.json({
      message: "Student updated successfully. -> ",
      student: updatedStudent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//DELETE STUDENT BY ID
app.delete("/api/students/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    await Student.findByIdAndDelete(studentId);
    res.json({ message: "Student deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
