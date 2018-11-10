'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Student = mongoose.model('Student'),
  Volunteer = mongoose.model('Volunteer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = function (req, res) {
  console.log("HERE1");
  console.log("req.model: ",req.model);
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  console.log("HERE2");
  var user = req.model;
  console.log("server user: ",user);

  // For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  console.log("req.model: ", req.model);
  var user = req.model;

  if(user.roles.indexOf('volunteer') !== -1){
    Volunteer.deleteOne({username: user.username}).exec().then(function(response){
      console.log(response);
    });
  }

  if(user.roles.indexOf('student') !== -1){
    Student.deleteOne({username: user.username}).exec().then(function(response){
      console.log(response);
    })
  }

  user.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  User.find({}, '-salt -password -providerData').sort('-created').populate('user', 'displayName').exec(async function (err, users) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else{

      return res.status(200).send({ users });
      //await(object.users = users);

      //await(res.json(object));
    }
  });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  console.log("HERE");
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password -providerData').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });

  exports.g = function(req, res) {
    console.log(req);
    return res.status(req);
  }
};
