const isAuth = require("../middleware/jwt.middleware");
const User = require("../models/User.model");
const router = require("express").Router();

//Get user by id
router.get("/:id", isAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
