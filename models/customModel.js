const mongoose = require("mongoose");

const customSchema = new mongoose.Schema({
  name: String,
  items: [{ type: Object }],
});

module.exports = mongoose.model("custom", customSchema);
