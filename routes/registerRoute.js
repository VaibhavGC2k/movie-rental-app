const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const router = express.Router();


const { Register, validateRegister } = require("../models/registerModel");
const { valid } = require("joi");

router.get("/", (req, res) => {
  res.render("register");
});

router.post("/", async (req, res,next) => {
  try{
    const validation = validateRegister(req.body)
    if(!validation){
      throw  new Error(res.status(400).send(validation.error.details[0].message))
    }
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    if (password === confirmpassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const register = new Register({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        isAdmin: req.body.isAdmin === "on",
      });
      // const token = await register.generateAuthToken()
      const registered = await register.save();
  
  
        //------------NODE MAILER-----------------//
  
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
            user: "vaibhavgchowdhary@gmail.com",
            pass: "nvfparchajmluipq"
          },
        });
  
        const textMessage = `Dear ${registered.username},\n
  
      Thank you for registering on Our Platform! We are thrilled to have you as a member of our community.
      
      Your account is now active, and you can log in using the credentials you provided during registration.

      Details : 
      
      username : ${req.body.username}
      Email : ${req.body.email}
      password : ${req.body.password}
      
      If you have any questions, concerns, or feedback, please don't hesitate to reach out to our support team at support@MR.com.
      
      Best regards,
      The Movie Rental Team`;
        const message = {
          from: "vaibhavgchowdhary@gmail.com",
          to: registered.email,
          subject: "Movie Rental Registration Successful",
          text: textMessage,
        };
  
        transporter.sendMail(message, (error) => {
          if (error) {
            return res.status(500).json({ error });
          } else {
            const userData = _.pick(registered, [
              "_id",
              "username",
              "email",
              "isAdmin",
            ]);
            res.send({ message: "Email sent successfully", userData });
          }
        });
  
        res.status(200).render("index");
      } else {
        throw new Error(`password don't match`);
      }
  }catch (error) {
    next(error)
  }
});

module.exports = router;
