const mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')

const registerSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
        type: Boolean,
        default : false
      }
  });
  
const Register = mongoose.model('Register',registerSchema)

function validateRegister(input) {
    const schema = Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
      confirmpassword: Joi.string().valid(Joi.ref('password')).required(),
      isAdmin: Joi.boolean()
    });
    return schema.validate(input);
  }

module.exports = {Register,validateRegister}