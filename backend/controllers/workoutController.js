const Workout = require("../models/workoutModel");
const mongoose = require("mongoose");

//get all workouts
const getWorkouts = async (req, res) => {
  const workouts = await Workout.find({}).sort({ createdAt: -1 });
  res.status(200).json(workouts);
};

//get a single workout
const getWorkout = async (req, res) => {
  const { id } = req.params;

  //this checks if the id is a valid mongo id,(need to require mongoose for this)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such workout" });
  }

  const workout = await Workout.findById(id);
  if (!workout) {
    return res.status(404).json({ error: "No such workout" });
  }
  res.status(200).json(workout);
};

//create new workout
const createWorkout = async (req, res) => {
  const { title, load, reps } = req.body;

  let emptyFields = []

    if(!title){
      emptyFields.push('title')
    }
    if(!load){
      emptyFields.push('load')
    }
    if(!reps){
      emptyFields.push('reps')
    }
    if(emptyFields.length>0){
      return res.status(400).json({error: 'Please fill in all the fields', emptyFields})
    }

  //add doct to db
  try {
    const workout = await Workout.create({ title, load, reps });
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params;

  //Checks if the id is a valid mongoose id, so cant be 
  //a string it has to be a number thats 24 characters
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such workout" });
  }

  const workout = await Workout.findOneAndDelete({ _id: id });

  //Need to check if we even have this workout
  if (!workout) {
    return res.status(404).json({ error: "No such workout" });
  }
  res.status(200).json(workout);
};

//update a workout
const updateWorkout = async (req,res)=>{
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such workout" });
  }

  //first parameter is selecting what id'd property to update
  //second parameter is what to update it to
  const workout = await Workout.findOneAndUpdate({_id:id}, {
    ...req.body
  })

  if (!workout) {
    return res.status(404).json({ error: "No such workout" });
  }
  res.status(200).json(workout);
};



module.exports = {
  createWorkout,
  getWorkouts,
  getWorkout,
  deleteWorkout,
  updateWorkout
};
