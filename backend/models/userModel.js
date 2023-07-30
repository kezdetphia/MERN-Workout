const mongoose = require("mongoose");
//bcrypt to hash the password
const bcrypt = require('bcrypt')

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

//static signup method
//this has to be a regula function cause we use the 'this' keyword
userSchema.statics.signUp = async function(email, password){

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

module.exports = mongoose.model('User', userSchema)