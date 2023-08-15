const Constructor = require('../Models/constructor');
const Level = require('../Models/level');
const TruthLine = require('../Models/truthLine');
exports.getLevel = async (req, res) => {
  try {
    const level = await Level.find(req.body).populate("constructors").populate("truthTable");
    res.status(201).json(level);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.setLevel = async (req, res) => {
  try {
    const {number,constructors,truthTable} = req.body;
    const level = new Level({number,constructors,truthTable});
    await level.save();
    res.status(201).json(level);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};