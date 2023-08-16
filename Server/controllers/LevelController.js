const Level = require('../Models/level');

exports.getLevel = async (req, res) => {
  try {
    const data = JSON.parse(req.body);
    const level = await Level.find(req.body);
    res.status(201).json(level);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.setLevel = async (req, res) => {
  try {
    const level = new Level(req.body);
    await level.save();
    res.status(201).json(level);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};