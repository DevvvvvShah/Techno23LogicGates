const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Level = require("./Level");
const userSchema = new schema({
  name: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  level: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: `Level`,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
