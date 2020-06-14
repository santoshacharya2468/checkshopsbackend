const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("../models/user");
router.post("/register", async (req, res) => {
  var { email, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).json({ message: "email or password invalid" });
    }
    let result = bcrypt.compare(password, user.password);
    if (result) {
      try {
        let token = jsonwebtoken.sign(
          { email: user.email, id: user._id },
          "53465FDSFf##%#%$%",
          {
            expiresIn: "30 days",
          }
        );
        res.json({ token: token, id: user._id });
      } catch (error) {
        res.status(401).json({ message: "email or password invalid" });
      }
    }
  } catch (error) {
    res.status(401).json({ message: "email or password invalid" });
  }
});
router.post("/login", async (req, res) => {
  var { email, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (user != null) {
      try {
        let status = await bcrypt.compare(password, user.password);
        if (status) {
          try {
            let token = jsonwebtoken.sign(
              { email: user.email, id: user._id },
              "53465FDSFf##%#%$%",
              {
                expiresIn: "30 days",
              }
            );
            res.json({ token: token, id: user._id });
          } catch (e) {
            res.status(500).send({ message: "error signin...." });
          }
        } else {
          res.status(401).send({ message: "email/password error...." });
        }
      } catch (e) {
        res.status(401).send({ message: "email/password error...." });
      }
    } else {
      res.status(401).send({ message: "email/password error...." });
    }
  } catch (e) {
    res.status(500).send({ message: "Server error try again..." });
  }
});
module.exports = router;
