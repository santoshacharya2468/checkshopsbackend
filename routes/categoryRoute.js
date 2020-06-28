const express = require("express");
const router = express.Router();
const Category = require("../models/category");
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();

    res.json(categories);
  } catch (e) {
    res.status(500).send({ message: "Error retrieving categories" });
  }
});
module.exports=router;

