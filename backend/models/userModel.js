const mongoose = require("mongoose");
//bcrypt to hash the password
const bcrypt = require('bcrypt')
//npm i validator
//a package for validation instead of writing the whole logic
const validator = require('validator')

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//static SIGNUP method
//this has to be a regula function cause we use the 'this' keyword
userSchema.statics.signUp = async function(email, password){

  //validation
  if (!email || ! password) {
    throw Error('All fields must be filled')
  }
  if(!validator.isEmail(email)){
    throw Error('Email is not valid')
  }
  if(!validator.isStrongPassword(password)){
    throw Error('Password is not strong enough')
  }


  const exists = await this.findOne({email})

  if(exists){
    throw Error('Email already in use')
  }

  //this generates salt that adds chars to the password
  //has to be await cause this takes some time
  const salt = await bcrypt.genSalt(10)
  //hashing the password and adding the salt to it
  const hash = await bcrypt.hash(password, salt)

  //the 'this' refers to this userSchema
  const user = await this.create({email, password: hash})

  return user

}




//static LOGIN method
userSchema.statitcs.login = async function(email,password){
  if (!email || ! password) {
    throw Error('All fields must be filled')
  }

  const user = await this.findOne({email})

  if(!user){
    throw Error('Incorrect email')
  }

  const match = await bcrypt.compare(password, user.password)
  
  if(!match) {
    throw Error('Incorrect password')
  }

  return user

}



module.exports = mongoose.model('User', userSchema)