const Constructor = require('../Models/constructor');

// exports.getLevel = async (req, res) => {
//   try {
//     const data = JSON.parse(req.body);
//     const level = await Level.find(req.body);
//     res.status(201).json(level);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

exports.setConstructor = async (req, res) => {
  try {
    const {name,desc,img,func}=req.body;
    const constructor = new Constructor();
    await constructor.save();
    res.status(201).json(level);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};