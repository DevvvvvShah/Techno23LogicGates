const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Level = require("./level");
const userSchema = new schema({
  username: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  leveltime: [
    {levelno:Number,time:Number}
  ]
});

module.exports = mongoose.model("User", userSchema);
