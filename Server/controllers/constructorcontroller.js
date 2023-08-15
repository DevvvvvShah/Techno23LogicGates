const Constructor = require('../Models/Constructor');




exports.setConstructor = async (req, res) => {
  try {
    //input truth table as [{input:[0,0,0],output:1}]
    if (!req.body.img) {
      res.json({
        success: false,
        message: "You must provide at least 1 file"
      });
    } else {
      let consobj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
          data: req.body.img.data,
          contentType: req.body.img.mime
        },
        func:req.body.func
      };
      const constructor = new Constructor(consobj);
      await constructor.save();
      res.status(201).json(constructor);
    } 
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};