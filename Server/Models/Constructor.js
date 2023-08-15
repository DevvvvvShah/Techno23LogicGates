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
  func:[{input:[Number],output:[Number]}]
});

module.exports = mongoose.model("Constructor", ConstructorSchema);
