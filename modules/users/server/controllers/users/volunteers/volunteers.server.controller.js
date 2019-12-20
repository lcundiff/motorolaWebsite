'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Volunteer = mongoose.model('Volunteer'),
  User = mongoose.model('User'),
  Student = mongoose.model('Student'),
  //Update = mongoose.model('volunteerUpdates'),
  //User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Volunteer
 */

exports.create = function(req, res) {

    var volunteer = new Volunteer(req.body);
  
    volunteer.application = volunteer.application;

    volunteer.user = req.body.user;
    volunteer.username = req.body.username;
    volunteer.roles = req.body.roles;
    volunteer.sessions = req.body.sessions;
    volunteer.isAppComplete = req.body.isAppComplete;
    volunteer.areaofexpertise = req.body.areaofexpertise

    volunteer.mentee = [];
    volunteer.mentee_count_sess_1 = 0;
    volunteer.mentee_count_sess_2 = 0;
    volunteer.mentee_count_sess_3 = 0;
    volunteer.menteeID = [];
    volunteer.interviewee = [];
    volunteer.intervieweeID = [];
    volunteer.interviewee_count = 0;
    volunteer.active = true;

    volunteer.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        console.log("Volunteer added to db: ", volunteer)
        res.jsonp(volunteer);
      }
    });

};

/**
 * Show the current Volunteer
 */
exports.read = function(req, res) {
  console.log(req.params);
  console.log("VOOOL");
  console.log(req.volunteer);
  // convert mongoose document to JSON

  Volunteer.findOne({user: req.params.userId }).then(function(data){
    res.status(200).send({volunteer: data });
  });
};


/**
 * Update a Volunteer
 */
exports.update = function(req, res) {

console.log("req.body: ",req.body);
var volunteer = new Volunteer(req.body);
delete req.body.__v;
req.body.roles = req.body.application.roles;
req.body.sessions = req.body.application.sessions;
req.body.areaofexpertise = req.body.application.areaofexpertise;

User.findOne({username: req.body.username}).then(function(user){
  console.log(user);
  if(user.roles.indexOf("admin") !== -1){
    req.body.roles.push("admin");
  }

  Volunteer.findOneAndUpdate({username: req.body.username}, req.body, {upsert: true}).then(function(data){
    console.log("updated data: ",data);
  });

  updateUserVolunteerRoles(req.body.username, req.body.roles);

  res.status(200).send({ message: true});
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
  Volunteer.find({ active: true }).collation({ locale: "en" }).sort('application.lastName').populate('user', 'displayName').exec(function(err, volunteers) {
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
  Volunteer.find({ active: true, roles: "mentor" }).collation({ locale: "en" }).sort('application.lastName').exec(function(err, volunteers){
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
  Volunteer.find().collation({ locale: "en" }).sort('application.lastName').populate('user', 'displayName').exec(function (err, volunteers) {
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
  Volunteer.find({active:false}).collation({ locale: "en" }).sort('application.lastName').populate('user', 'displayName').exec(function (err, volunteers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(volunteers);
    }
  });
};

exports.getVolunteerInterviewees = async function(req, res){
  var allInterviewees = [];
  await Volunteer.findOne({username: req.params.username}).exec().then(function(data){
    console.log("data", data);
      Student.find({user: {$in: data.intervieweeID} }).exec().then(function(data){
        res.status(200).send({interviewees: data});
    });
  });
};

exports.getVolunteerMentees = function(req, res){
  Volunteer.findOne({username: req.params.username}).exec().then(function(data){
    console.log(data);
    Student.find({user: {$in: data.menteeID} }).exec().then(function(data){
      res.status(200).send({mentees: data});
    });
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
