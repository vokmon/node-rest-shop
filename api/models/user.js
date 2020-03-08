const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  // unique in the model is not a validation saying the field must be unique
  // it is for indexing purpose. It will tell mongo there will be only one value of this.
  // In short, it is performance improvement, not a validation
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  },
  password: { type: String, required: true},
});

module.exports = mongoose.model("User", userSchema);
