const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");
const cohortRouter = require("./routes/cohort.routes");
const studentRouter = require("./routes/student.routes");
const userRouter = require("./routes/user.routes");
const authRouter = require("./routes/auth.routes");
const connectDB = require("./config/mongoose.config");
require("dotenv").config();

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
app.use("/api/cohorts", cohortRouter);
app.use("/api/students", studentRouter);
app.use("/auth", authRouter);
app.use("/api/users", userRouter);

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// START SERVER
connectDB();
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
