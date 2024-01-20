const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const wishlistSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    required: true,
    ref: "users",
  },
  product: [{
      productId: {
        type: String,
        required: true,
        ref: "Product",
      },
    }],
});

module.exports = mongoose.model("Wishlist", wishlistSchema);