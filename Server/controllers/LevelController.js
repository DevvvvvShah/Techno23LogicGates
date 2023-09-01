const Level = require('../Models/Level');
// const TruthLine = require('../Models/trthLine');
exports.getLevel = async (req, res) => {
  try {
    const level = await Level.find(req.body);
    res.status(201).json(level);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getLevelByNumber = async (req, res) => {
  try {
    const level = await Level.find({number:req.params.number});
    res.status(201).json(level);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.setLevel = async (req, res) => {
  try {
    const levelb = req.body;
    const level = new Level(levelb);
    await level.save();
    res.status(201).json(level);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};