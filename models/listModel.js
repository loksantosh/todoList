const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  item: {
    type: String,
   },
   tag:{
    type:String,
    default:"Today"
   }
});

module.exports = mongoose.model("list", listSchema);
