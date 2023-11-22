const mongoose = require("mongoose");
const Joi = require("joi");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: [2, "Error:title should be greater than 5 characters"],
    maxlength: [50, "Error:title should be less than 5 characters"],
    unique:true,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    required: true,
  },
  IMDBRating: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(input) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(50).required(),
    genre: Joi.string().required(),
    dailyRentalRate: Joi.number().min(0).required(),
    IMDBRating: Joi.number().min(0).max(10).required(),
  });
  return schema.validate(input);
}

module.exports = { Movie, validateMovie}
