const { mongoose } = require("mongoose");

module.exports = async function connectionDB() {
  try {
    const connection = await mongoose.connect(
      "mongodb://127.0.0.1:27017/cohort-tools-api"
    );

    console.log("connected to DB -> ", connection.connections[0].name);
  } catch (error) {
    console.log(error);
  }
};
