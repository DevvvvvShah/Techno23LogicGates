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
  levels:[{
    levelno:{type:Number},
    points:{type:Number,default:0},
    done:{type:Boolean,default:false},
    time:{type:Number,default:0}
  }]
});

module.exports = mongoose.model("User", userSchema);
