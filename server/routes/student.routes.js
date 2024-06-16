const router = require("express").Router();
const Student = require("../models/Student.model");


//Student Routes
//GET ALL STUDENTS
router.get("/", async (req, res) => {
    try {
      const allStudents = await Student.find().populate("cohort");
      res.status(200).json(allStudents);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  
  //CREATE A NEW STUDENT
  router.post("/", async (req, res) => {
    try {
      const createStudent = await Student.create(req.body);
      res.status(201).json(createStudent);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  });
  
  //GET ALL STUDENTS FROM GIVEN COHORT
  router.get("/cohort/:cohortId", async (req, res) => {
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
  router.get("/:studentId", async (req, res) => {
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
  router.put("/:studentId", async (req, res) => {
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
  router.delete("/:studentId", async (req, res) => {
    try {
      const { studentId } = req.params;
      await Student.findByIdAndDelete(studentId);
      res.json({ message: "Student deleted successfully." });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  });

  module.exports = router;

