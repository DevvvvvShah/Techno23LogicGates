const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Constructor = require("./Constructor")
const TruthLine = require("./truthLine")

const levelSchema = new schema({
  number:{
    required: true,
    type: Number
  },
  //maybe dict for constructors and truth table, but this should work too
  constructors:[   //list for now
        {
          type:mongoose.Schema.Types.ObjectId, ref: 'Constructor'
        }
  ],
  truthTable:[
    {
      //type:mongoose.Schema.Types.ObjectId, ref: 'TruthLine'
      input:[
        {
          type:Boolean
        }
      ],
      output:
        {
          type:Boolean
        }
    }
  ]
});

module.exports = mongoose.model("Level", levelSchema);
