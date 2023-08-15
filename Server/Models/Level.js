const mongoose = require("mongoose");
const schema = mongoose.Schema;

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
  truth_table:{
      type:mongoose.Schema.Types.ObjectId, ref: 'truth'
    }
});

const constructor = require("./constructor")
const truth = require("./truth")
module.exports = mongoose.model("level", levelSchema);
