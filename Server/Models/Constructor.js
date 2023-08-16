const mongoose = require("mongoose");
const schema = mongoose.Schema;
const TruthLine = require('../Models/truthLine');
const ConstructorSchema = new schema({
  name: {
    required: true,
    type: String,
  },
  desc: {
    type: String,
  },
  img: {
    data: Buffer,
    contentType: String,
  },
  func:[{
      type:mongoose.Schema.Types.ObjectId, ref: 'TruthLine'
    }]
});

module.exports = mongoose.model("Constructor", ConstructorSchema);
