const express = require('express')
const router = express.Router()
const {Genre,validateGenre} = require('../models/genreModel')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const { route } = require('./registerRoute')

router.get('/', auth,admin,(req, res) => {
  const token = req.cookies.token;
  if (token) {
    res.render('genre', { logout: true });
  } else {
    res.render('genre', { logout: false });
  }
});

router.get('/genres',async(req,res)=>{
  const genres = await Genre.find({},{__v:0}).sort({name:1})
  res.send(genres)
})

router.post('/',async(req,res)=>{
    try{
        const validation = validateGenre(req.body)
        if(!validation){
            res.status(400).send(validation.error.details[0].message)
          }
          const existingGenre = await Genre.findOne({ name: req.body.name});
        if (existingGenre) {
            return res.status(409).send('Genre already exists.');
        }
        const addGenre = new Genre({
            name : req.body.name
        })
        const genre = await addGenre.save()
        res.status(200).render("genre")
    }catch(error){
        res.send(error)
    }
})

router.delete('/:id', async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) {
      return res.status(404).send('Genre not found.');
    }
    res.status(200).send(genre);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


module.exports = router