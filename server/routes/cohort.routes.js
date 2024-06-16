const router = require("express").Router();
const Cohort = require("../models/Cohort.model");

// COHOTS ROUTES:
// GET /api/cohorts - Retrieves all of the cohorts in the database collection

router.get("/", async (req, res) => {
    try {
      const allCohorts = await Cohort.find();
      res.status(200).json(allCohorts);
    } catch (error) {
      res.send(500).json({ message: "Problem getting all cohorts, sorry" });
    }
  });
  
  // POST /api/cohorts - Creates a new cohort
  router.post("/", async (req, res) => {
    try {
      const newCohort = await Cohort.create(req.body);
      res.status(201).json(newCohort);
    } catch (error) {
      res.status(500).json({ message: "Cohort created" });
    }
  });
  
  // GET /api/cohorts/:cohortId - Retrieves a specific cohort by id
  router.get("/:cohortId", async (req, res) => {
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
  router.put("/:cohortId", async (req, res) => {
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
  router.delete("/:cohortId", async (req, res) => {
    try {
      await Cohort.findByIdAndDelete(req.params.cohortId);
      res
        .status(200)
        .json({ message: `Cohort ${req.params.cohortId} was deleted.` });
    } catch (error) {
      res.status(500).json({ message: "Cohort deleted" });
    }
  });
  
  module.exports = router;