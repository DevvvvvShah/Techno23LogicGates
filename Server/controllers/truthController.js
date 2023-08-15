const Truth = require('../Models/truth');
const TruthLine = require('../Models/truthline');

exports.setTruthLine = async(req,res) => {
    try {
      const {input,output}=req.body;
      const truthline = new TruthLine({input, output});
      await truthline.save();
      res.status(201).json(truthline);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
exports.setTruthLine = async(req,res) => {
    try {
      const {input,output}=req.body;
      const truthline = new TruthLine({input, output});
      await truthline.save();
      res.status(201).json(truthline);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };