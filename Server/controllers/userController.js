const { default: mongoose } = require('mongoose');
const User = require('../Models/User');

exports.login = async (req,res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username, password })
    // Check if username and password is provided
    if (!username || !password) {
      return res.status(402).json({
        message: "Username or Password not present",
      })
    }
    if (!user) {
      res.status(401).json({
        message: "Login not successful",
        error: "User not found (username or password incorrect)",
      })
    } else {
      res.status(200).json({
        message: "Login successful",
        user,
      })
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    })
  }
}

exports.createUser = async (req, res) => {
  try {
    const userdata=req.body;
    const user = new User(userdata);
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
    const level = req.body.levels[0];
    const users = await User.updateOne({username: req.params.name, 'levels.levelno': level.levelno },
    {'$set':{'levels.$.done':level.done,'levels.$.time':level.time,'levels.$.points':level.points}});
    res.status(201).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

exports.getUserByName = async (req, res) => {
  try {
    const users = await User.findOne({username: req.params.name});
    res.status(201).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}