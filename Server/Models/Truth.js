const mongoose = require("mongoose");
const schema = mongoose.Schema;

const TruthSchema = new schema({
  input:[
    {type:Boolean}
  ],
  output:[
    {type:Boolean}
  ]
});

module.exports = mongoose.model("truth", TruthSchema);