const mongoose = require("mongoose");
const Joi = require("joi");

const rentalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  dateout: {
    type: String, // Store as a string to maintain the desired format
    default: () => {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, "0");
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based
        const year = currentDate.getFullYear();
        const hours = String(currentDate.getHours()).padStart(2, "0");
        const minutes = String(currentDate.getMinutes()).padStart(2, "0");
        const seconds = String(currentDate.getSeconds()).padStart(2, "0");

        return `${day-2}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    },
  },
  dateIn:{
    type:String,
    default: 0
  },
  rentalFee : {
    type:Number,
    default:0
  }
});

const Rental = mongoose.model("Rental", rentalSchema);
function validateRental(input) {
  const schema = Joi.object({
    title: Joi.string().required(),
    genre: Joi.string().required(),
    dailyRentalRate: Joi.number().required(),
    user: Joi.string().required(),
    email: Joi.string().required(), 
  });
  return schema.validate(input);
}
module.exports = { Rental, validateRental };
