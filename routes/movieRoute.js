const express = require("express");
const router = express.Router();
const { Movie, validateMovie } = require("../models/movieModel");
const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");

router.get("/", auth, (req, res) => {
  const isAdmin = req.user.isAdmin;
  console.log("isAdmin:", isAdmin);
  if(isAdmin){
    res.render("movie", { logout: true, isAdmin: isAdmin });
  }else{
    res.render("movie", { logout: true, isAdmin: false });
  }
});

router.get("/movies", async (req, res) => {
  const movies = await Movie.find({}, { __v: 0 }).sort({ title: 1 });
  res.send(movies);
});

router.get("/movies", async (req, res) => {
  try {
    const { genre } = req.query;
    const movies = await Movie.find(genre ? { genre } : {}).sort({ title: 1 });
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const validation = validateMovie(req.body);
    if (!validation) {
      res.status(400).send(validation.error.details[0].message);
    }
    const existingMovie = await Movie.findOne({ title: req.body.title });
    if (existingMovie) {
      return res.status(409).send("Movie already exists.");
    }
    const addMovie = new Movie({
      title: req.body.title,
      genre: req.body.genre,
      dailyRentalRate: req.body.dailyRentalRate,
      IMDBRating: req.body.IMDBRating,
    });
    const movie = await addMovie.save();
    res.status(200).render("movie");
  } catch (error) {
    console.log(error.message);
    res.send(error);
  }
});

module.exports = router;
