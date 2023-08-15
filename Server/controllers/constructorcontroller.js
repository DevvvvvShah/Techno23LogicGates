const Constructor = require('../Models/Constructor');
const TruthLine = require('../Models/truthLine');

exports.getConstructor = async (req, res) => {
  try {
    const constructor = await Constructor.find(req.body).populate("func");
    res.status(201).json(constructor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.setConstructor = async (req, res) => {
  try {
    //input truth table as [{input:[0,0,0],output:1}]
    if (!req.body.img) {
      res.json({
        success: false,
        message: "You must provide at least 1 file"
      });
    } else {
      let objs = []
      console.log(req.body.func)
      for (let index = 0; index < req.body.func.length; index++) {
        console.log(req.body.func[index]);
        const truthline = new TruthLine(req.body.func[index]);
        await truthline.save();
        objs.push(truthline._id);
      }
      

        // truthobj.push(truthline._id);
      let consobj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
          data: req.body.img.data,
          contentType: req.body.img.mime
        },
        func:objs
      };
      const constructor = new Constructor(consobj);
      await constructor.save();
      res.status(201).json(constructor);
    } 
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};