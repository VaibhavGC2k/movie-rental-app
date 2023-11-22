const express = require("express");
const router = express.Router();
const { Register } = require("../models/registerModel");
const Joi = require("joi");
const jwt = require('jsonwebtoken') 
const bcrypt = require("bcrypt");
const { route } = require("./registerRoute");

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = validate(req.body);
    if (error) throw new Error(error.message);
  let user = await Register.findOne({ email: req.body.email });
  if (!user) {
    throw new Error("Invalid email");
  }
  let isValid = await bcrypt.compare(req.body.password, user.password);

  if (isValid) {
    const token = jwt.sign(
        {userId : user._id, username:user.username,email:user.email, isAdmin:user.isAdmin},
        'mynameisvinodbahadurthapayoutuber',
        {expiresIn:'1h'}
    );
    res.cookie('token',token,{httpOnly:true})
    console.log(token)
    res.status(200).render("index",{ logout: true });
  } else {
    throw new Error("Invalid password");
  }
}catch(error){
    next(error)
}
});

function validate(input) {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(input);
}

module.exports = router
