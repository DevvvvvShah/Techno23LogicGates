const Constructor = require('../Models/constructor');
const Level = require('../Models/level');
exports.getLevel = async (req, res) => {
  try {
    const level = await Level.find(req.body).populate({path:"constructors"});
    res.status(201).json(level);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.setLevel = async (req, res) => {
  try {
    const {number,constructors} = req.body;
    const level = new Level({number,constructors});
    await level.save();
    res.status(201).json(level);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};