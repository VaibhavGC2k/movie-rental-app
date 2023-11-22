const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const { Rental, validateRental } = require("../models/rentalModel");
const jwt = require("jsonwebtoken");

router.get("/", auth, admin, (req, res) => {
  const isAdmin = req.user.isAdmin;
  console.log(isAdmin, req.user);
  if (isAdmin) {
    res.render("rental", { logout: true });
  } else {
    res.send("Access Denied");
  }
});

router.get("/rentals", async (req, res) => {
  try {
    const rentals = await Rental.find({}, { __v: 0 });
    res.send(rentals);
  } catch (error) {
    res.send(error.message);
  }
});

router.post("/", auth, async (req, res) => {
  const user = req.user.username;
  const email = req.user.email;
  try {
    const validation = validateRental(req.body);

    if (!validation) {
      return res.status(400).send(validation.error.details[0].message);
    }
    const existingRental = await Rental.findOne({
      title: req.body.title,
      user: user,
    });

    if (existingRental && existingRental.user === user) {
      return res.status(409).send("Rental Already Exists");
    }

    const addRental = new Rental({
      title: req.body.title,
      genre: req.body.genre,
      dailyRentalRate: req.body.dailyRentalRate,
      user: user,
      email: email,
    });
    const rental = await addRental.save();
    console.log(rental);
    res.status(200).render("movie");
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

function getDate(){
  let currentDate = new Date();
  let day = String(currentDate.getDate());
  let month = String(currentDate.getMonth()); // Month is zero-based
  let year = currentDate.getFullYear();
  let hours = String(currentDate.getHours());
  let minutes = String(currentDate.getMinutes());
  let seconds = String(currentDate.getSeconds());
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

router.patch('/',async(req,res)=>{
  const id = req.body._id
  const dailyRentalRate = req.body.dailyRentalRate
  const date = getDate()
  try{
    const rentals = await Rental.findByIdAndUpdate(
      id,{
        dateIn:date,
        rentalFee: dailyRentalRate * 2
      },
      {new:true}
      )
      const updateRental = await rentals.save();
      console.log(updateRental)
      res.status(200).render("rental")
    }catch(error){
      res.status(500).send(error.message) 
      console.log(error.message)
    }
})

router.delete("/", async (req, res) => {
  const rentals = await Rental.findByIdAndDelete(req.body._id);
  console.log(req.body._id);
  if (!rentals)
    return res.status(403).send("Rental with given id is not found.");
  res.send(rentals);
});

module.exports = router;
