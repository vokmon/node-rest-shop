const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 200
  },
  price: { type: Number, required: true, min: [0, "Price cannot be nagative"] },
  productImage: {type: String, required: true}
});

module.exports = mongoose.model("Product", productSchema);
