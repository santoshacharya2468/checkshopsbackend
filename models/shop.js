const mongoose = require("mongoose");
const shopSchema = mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  businessName: {
    type: String,
    required: true,
    unique: true,
  },
  businessLogo: {
    type: String,
    required: true,
  },
  address: {
    type: Object,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
    required: true,
  },
  packageDuration: {
    duration: {
      //like 3 months 6 months and 1 year
      //we have to provide duration  as a number of months
      type: Number,
      required: true,
    },
    startOn: {
      type: Date,
      required: true,
    },
  },
  activated: {
    type: Boolean,
    default: false,
  },
  categories: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
  ],
});
module.exports = mongoose.model("Shop", shopSchema);
