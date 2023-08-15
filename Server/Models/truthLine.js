const mongoose = require("mongoose");
const schema = mongoose.Schema;

const TruthLineSchema = new schema({
  input:[
    {type:Boolean}
  ],
  output:[
    {type:Boolean}
  ]
});

module.exports = mongoose.model("TruthLine", TruthLineSchema);