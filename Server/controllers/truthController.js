const TruthLine = require('../Models/truthLine');


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

exports.getTruthLine = async(req,res) => {
    try {
        const truthLine = await TruthLine.find(req.body);
        res.status(201).json(truthLine);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };