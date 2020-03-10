const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.users_signup = async (req, res, next) => {
  try {
    // validate email must be unique
    const u = await User.findOne({ email: req.body.email });
    if (u) {
      return res.status(409).json({
        message: 'User is already taken!'
      });
    }
  } catch(err) {
    return res.status(500).json({
      error: err,
    });
  }
  

  // add saltRounds = 10
  bcrypt.hash(req.body.password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      try {
        const user = new User({
          _id: mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash
        });
        const result = await user.save();
        console.log(result);
        res.status(201).json({
          message: 'User created!'
        })
      } catch(err) {
        return res.status(500).json({
          error: err,
        });
      }
    }
  });
}

exports.users_login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email});
    if (!user) {
      return res.status(401).json({
        message: 'Auth failed',
      });
    }

    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if(err || !result) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }
      if (result) {
        const token = jwt.sign({
          userId: result._id,
          email: result.email
        }, process.env.JWT_KEY, {
          expiresIn: '1h' // one hour
        });

        return res.status(200).json({
          message: 'Auth successful',
          token: token,
        })
      }
    });
  } catch(err) {
    return res.status(500).json({
      error: err,
    });
  }
};

exports.users_delete_user = async (req, res, next) => {
  try {
    await User.deleteOne({
      _id: req.params.userId,
    });
    res.status(200).json({
      message: 'User deleted',
    })
  } catch(err) {
    return res.status(500).json({
      error: err,
    });
  }
}