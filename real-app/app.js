require("dotenv/config");

const PORT = process.env.PORT;

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Card } = require("./model/cards");
const { User } = require("./model/users");
const { initialusers } = require("./seedData/initialusers");
const { initialCards } = require("./seedData/initialCards");

const app = express();
app.use(cors());
app.use(express.json());
app.use(require("morgan")("dev"));

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

connect();
async function connect() {
  try {
    await mongoose.connect(
      process.env.ENVIROMENT === "development"
        ? process.env.CONNECTION_STRING_COMPASS
        : process.env.CONNECTION_STRING_ATLAS
    );
    console.log("connected to db");
    app.listen(PORT, async () => {
      try {
        console.log(`listening on port :${PORT}`);

        const usersFromDb = await User.find();
        initialusers.forEach(async (user) => {
          if (usersFromDb.find((dbUser) => dbUser.email === user.email)) {
            return;
          }
          const newUser = new User(user);
          newUser.password = await bcrypt.hash(user.password, 12);
          await newUser.save();
        });
        initialCards.forEach(async (card) => {
          const cardsLength = await Card.find().countDocuments();
          if (cardsLength >= 3) {
            return;
          }
          const newCard = new Card(card);
          await newCard.save();
        });
      } catch (error) {
        console.log(error.message);
      }
    });
  } catch (error) {
    console.log("failed connecting to db", error.message);
  }
}
