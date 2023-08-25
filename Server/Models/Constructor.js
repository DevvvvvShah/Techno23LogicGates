const mongoose = require("mongoose");
const schema = mongoose.Schema;
const TruthLine = require('../Models/truthLine');
const ConstructorSchema = new schema({
  name: {
    required: true,
    type: String,
  }
});

module.exports = mongoose.model("Constructor", ConstructorSchema);
