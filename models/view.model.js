const { Schema, model } = require("mongoose");

const viewSchema = new Schema({
  ip: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
});

const View = model("View", viewSchema);
module.exports = View;
