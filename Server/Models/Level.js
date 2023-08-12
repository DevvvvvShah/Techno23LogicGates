const mongoose = require("mongoose");
const Constructor = require("./constructor")
const Truth = require("./truth")
const schema = mongoose.Schema;

const levelSchema = new schema({
  //maybe dict for constructors and truth table, but this should work too
  constructors:[   //list for now
        {
            type:mongoose.Schema.Types.ObjectId, ref: `Constructor`
        }
  ],
  truth_table:[
    {
        type:mongoose.Schema.Types.ObjectId, ref: `Truth`
    }
  ]
});

module.exports = mongoose.model("level", levelSchema);
