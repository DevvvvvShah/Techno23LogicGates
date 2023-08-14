const { default: mongoose } = require('mongoose');
const User = require('../Models/user');

exports.createUser = async (req, res) => {
  try {
    const {name,password}=req.body;
    const user = new User({name,password});
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find(req.body);
    res.status(201).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUsers = async (req, res) => {
  try {
    const {objectid,level,time} = req.body;
    const users = await User.updateOne({_id: objectid},{$set: {leveltime:{levelno:level,time:time}}});
    res.status(201).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};