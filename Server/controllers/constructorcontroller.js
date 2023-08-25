const Constructor = require("../Models/Constructor");
const TruthLine = require("../Models/truthLine");

exports.getConstructor = async (req, res) => {
  try {
    const constructor = await Constructor.find(req.body);
    res.status(201).json(constructor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.setConstructor = async (req, res) => {
  try {
    consobj = req.body;
    const constructor = new Constructor(consobj);
    await constructor.save();
    res.status(201).json(constructor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
