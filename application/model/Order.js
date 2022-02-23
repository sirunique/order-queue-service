const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: Object },
    products: { type: [Object] },
    total: { type: Number },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = {
  OrderModel,
};
