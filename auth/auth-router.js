/*
 ** This file and the folder that it is in was generated by the
 ** Node Package dukeapi found at: https://www.npmjs.com/package/dukeapi
 **
 ** Version: 1.0.0
 ** Author: David H. Isakson II
 ** License: MIT
 ** Github: https://github.com/ikeman32/duke-api-wauth
 ** Contact: david.isakson.ii@gmail.com
 */

require("dotenv").config();
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // installed this
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
const { userValidationRules, validate } = require("../middleware/validation");

const User = require("../models/auth-model");

const facebook =
  "https://dev-506473.okta.com/oauth2/v1/authorize?idp=0oaaezi5m10RWEjJl4x6&client_id=0oaaf18wlI2z2Xy5X4x6&response_type=id_token&response_mode=fragment&scope=openid%20email&redirect_uri=https://dev-506473.okta.com/oauth2/v1/authorize/callback&state=WM6D&nonce=YsG76jo";
const google =
  "https://dev-506473.okta.com/oauth2/v1/authorize?idp=0oaafizlpuzAWnV9G4x6&client_id=0oaaf18wlI2z2Xy5X4x6&response_type=id_token&response_mode=fragment&scope=openid%20email&redirect_uri=https://dev-506473.okta.com/oauth2/v1/authorize/callback&state=MW8C&nonce=XqH58lp";

// Oauth End Points
//Contributors David Isakson and Seth Cox
router.get("/facebook", (req, res) => {
  res.status(200).json({ facebook });
});

router.get("/google", (req, res) => {
  res.status(200).json({ google });
});

//JWT End Points generated by dukeapi
router.post("/register", userValidationRules(), validate, (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, SALT_ROUNDS); // 2 ^ n
  user.password = hash;

  User.add(user)
    .then((saved) => {
      res.status(201).json(saved);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post("/login", userValidationRules(), validate, (req, res) => {
  let { email, password } = req.body;

  
  User.findBy({ email })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // sign token
        const token = signToken(user); // new line

        // send the token
        res.status(200).json({
          token, // added token as part of the response sent
          message: `Welcome User ${user.email}!`,
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// this functions creates and signs the token
function signToken(user) {
  const payload = {
    email: user.email,
  };

  const secret = process.env.JWT_SECRET;

  const options = {
    expiresIn: "1h",
  };

  return jwt.sign(payload, secret, options); // notice the return
}

module.exports = router;
