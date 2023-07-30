require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
//import routes
const workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/user");

//Express app
const app = express();

const cors = require('cors')

const { PORT, MONGO_URI } = process.env;

//Middleware
//If theres any body(data) to the req object then it attaches it to the req object in json
app.use(cors())
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//Routes
app.use("/api/workouts", workoutRoutes);
app.use('/api/user', userRoutes)

//connect to db
mongoose.connect(MONGO_URI)
  .then(() => {
    //App listener
    app.listen(PORT, () => {
      console.log(`Connected to db and listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
