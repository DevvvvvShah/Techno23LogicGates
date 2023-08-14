const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ConstructorSchema = new schema({
  name: {
    required: true,
    type: String,
  },
  desc: {
    type: String,
  },
  img: {
    data: Buffer,
    contentType: String,
  },
  func:{
    type:String //we'll define different functions to be different ints
  }
});

module.exports = mongoose.model("constructor", ConstructorSchema);
