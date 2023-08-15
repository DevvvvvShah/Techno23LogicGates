const mongoose = require("mongoose");
const schema = mongoose.Schema;

const TruthLine = new schema({
  input:[
    {type:Boolean}
  ],
  output:[
    {type:Boolean}
  ]
});


const  TruthSchema = new schema({
  truth:[
    TruthLine
  ]
})

module.exports = mongoose.model("truth", TruthSchema);
module.exports = mongoose.model("truthline", TruthLine);