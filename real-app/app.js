const mongoose = require("mongoose");
const express = require("express");

const PORT = 3000;

const app = express();
app.use(require("morgan")("dev"));

connect();

async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://neveenbader:N205548704@cluster0.sy0nh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("coneccted to db");

    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
  } catch (e) {
    console.log("failed to connect to db", e.message);
  }
}
