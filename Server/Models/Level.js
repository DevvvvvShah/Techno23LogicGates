const mongoose = require("mongoose");
const schema = mongoose.Schema;
// const Constructor = require("./Constructor")
// const TruthLine = require("./truthLine")

const levelSchema = new schema({
  number:
  {
    required: true,
    type: Number
  },
  constructors:[   //list for now
  
        {
            name:{
            type:String
            },
            amount:{
              type:Number
            }
        }
      
  ],
  truthTable:[
    {
      input:{
        x:
        {
          type:Boolean
        },
        y:
        {
          type:Boolean
        },
        z:
        {
          type:Boolean
        },
        w:
        {
          type:Boolean
        }
      },
      output:
        {
          type:Boolean
        }
    }
  ]
});

module.exports = mongoose.model("Level", levelSchema);