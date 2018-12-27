'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Volunteer = mongoose.model('Volunteer'),
  User = mongoose.model('User'),
  //Student = mongoose.model('Student'),
  //Update = mongoose.model('volunteerUpdates'),
  //User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Volunteer
 */

exports.create = function(req, res) {

    //console.log("data: ",data);

    //console.log("req.body: ",req.body);
    var volunteer = new Volunteer(req.body);

    volunteer.application.firstName = req.body.firstName;
    volunteer.application.lastname = req.body.lastName;
    volunteer.application.email = req.body.email;
    volunteer.application.user = req.body.user;
    volunteer.application.address = req.body.address;
    volunteer.application.username = req.body.username;


    console.log("volunteer: ",volunteer);

    volunteer.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
          User.findOneAndUpdate({ _id: data._id}, {roles: req.body.application.roles},
          function(err) {
               if (err) throw err;
             });
        res.jsonp(volunteer);
      }
    });

};

/**
 * Show the current Volunteer
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var volunteer = req.volunteer ? req.volunteer.toJSON() : {};

  res.jsonp(volunteer);
};

/**
 * Update a Volunteer
 */
exports.update = function(req, res) {

console.log("update volunteer");
console.log("req.body: ",req.body);
var volunteer = new Volunteer(req.body);
volunteer.sessions = req.body.application.sessions;
volunteer.areaofexpertise = req.body.application.areaofexpertise;
volunteer.roles = req.body.application.roles;

console.log("volunteer: ",volunteer);

Volunteer.findOneAndUpdate({username: req.body.username}, {active: req.body.active, application: req.body.application, sessions: req.body.application.sessions, areaofexpertise: req.body.application.areaofexpertise, roles: req.body.application.roles}, {upsert: false}).then(function(data){
  console.log("updated data: ",data);

  User.findOneAndUpdate({username: req.body.username}, {roles: req.body.application.roles}, {upsert: false}).then(function(userData){
    console.log("updated user data: ",userData);
    res.json({status: '200', message: 'success'});
  });
});
};

/**
 * Delete a Volunteer
 */
exports.delete = function(req, res) {
  var volunteer = req.volunteer;

  volunteer.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(volunteer);
    }
  });
};

/**
 * List of Volunteers
 */
exports.list = function(req, res) {
  Volunteer.find({ active: true }).sort('-created').populate('user', 'displayName').exec(function(err, volunteers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(volunteers);
    }
  });
};

exports.listMentors = function(req, res) {
  Volunteer.find({ active: true, roles: "mentor" }).sort('-created').exec(function(err, volunteers){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(volunteers);
    }
  });
};

exports.listAll = function (req, res) {
  Volunteer.find().sort('-created').populate('user', 'displayName').exec(function (err, volunteers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(volunteers);
    }
  });
};

exports.updateRank = function(req, res) {
console.log("updateRank");

};

exports.listDeactivated = function (req, res) {
  Volunteer.find({active:false}).sort('-created').exec(function (err, volunteers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(volunteers);
    }
  });
};

exports.volunteerByUsername = function(req, res){
  console.log("req.params: ",req.params);
  console.log("req.params.username: ", req.params.username);
  Volunteer.findOne({username: req.params.username}).exec().then(function(data){
    if(data === null){
      return res.json({
        status: 404,
        message: 'Volunteer does not exist.'
      });
    }
    else{
      res.json(data);
    }
  });
};

/**
 * Volunteer middleware
 */
exports.volunteerByID = function(req, res, next, id) {

  // Volunteer.findById(id).populate('user', 'displayName').exec(function (err, volunteer) {
  //   if (err) {
  //     return next(err);
  //   } else if (!volunteer) {
  //     return res.status(404).send({
  //       message: 'No Volunteer with that identifier has been found'
  //     });
  //   }
  //   req.volunteer = volunteer;
  //   next();
  // });

  Volunteer.findOne({
    'user': id
  }).exec(function(err, volunteer) {
    console.log(id);
    if (err) {
      console.log(err);
      return next(err);
    } else {
      //console.log(student);
      req.volunteer = volunteer;
      next();
    }
  });




};
