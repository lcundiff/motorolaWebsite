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
  console.log("req.volunteer: ", req.volunteer);
  console.log("req.user: ", req.user);
  console.log("req.body: ", req.body);
  volunteer.user = req.user;

  volunteer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
        User.findOneAndUpdate({_id: req.user._id}, {roles: req.body.roles},
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

  var volunteer = req.volunteer;
  console.log("req vol: ", req.volunteer);
  console.log("req vol param: ", req.params.volunteer);

  volunteer.isAppComplete = req.body.isAppComplete;
  volunteer.application.name = req.body.application.name;
  volunteer.application.email = req.body.application.email;
  volunteer.application.phone = req.body.application.phone;
  volunteer.application.sessions = req.body.application.sessions;
  volunteer.application.roles = req.body.application.roles;
  volunteer.sessions = req.body.application.sessions;
  volunteer.roles = req.body.roles;
  volunteer.application.areaofexpertise = req.body.application.areaofexpertise;
  volunteer.areaofexpertise = req.body.application.areaofexpertise;
  volunteer.interviewee = req.body.interviewee;
  volunteer.intervieweeID = req.body.intervieweeID;
  volunteer.mentee = req.body.mentee;
  volunteer.menteeID = req.body.menteeID;
  volunteer.mentee_count_sess_1 = req.body.mentee_count_sess_1;
  volunteer.mentee_count_sess_2 = req.body.mentee_count_sess_2;
  volunteer.mentee_count_sess_3 = req.body.mentee_count_sess_3;
  volunteer.interviewee_count = req.body.interviewee_count;
  volunteer.active = req.body.active;

  console.log("req.volunteer:---------------------\n", req.volunteer);
  console.log("req.user:--------------------------\n", req.user);
  console.log("req.body:--------------------------\n", req.body);
  var flag = req.body.flag;
  console.log("volunteer right before volunteer.save call:-------------------------\n", volunteer);
  console.log("flag variable right before volunteer.save call:---------------------\n", flag);
  volunteer.save(function(err) {
    console.log("inside volunteer.save call");
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if(flag == "true")
      {
        console.log("inside user update if statement");
        User.findOneAndUpdate({_id: req.user._id}, {roles: req.body.roles},
        function(err) {
             if (err) throw err;
           });
      }
      res.jsonp(volunteer);
    }
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

  console.log("volId:",req.params.volId);
  var rank = req.params.rank;
  var studentId = req.params.studentId;
  var volId = req.params.volId;
  var index = -1;
  var student;

  Student.find({ user: studentId }).exec().then(function(response){
    console.log(response);
    return new Promise(function(resolve, reject){
      student = response[0];

      resolve(student);
    }).then(function(student){
      console.log("student received: ", student);
      return new Promise(function(resolve, reject){
        console.log("in here: ");
        console.log("student interviewers: ",student.interviewerID);
        console.log("student interview length: ",student.interviewerID.length);
        for(var i=0; i<student.interviewerID.length; i++){
          console.log("Are they equal?: ",volId===student.interviewerID[i].toString());
          console.log("i: ", i);
          if(volId === student.interviewerID[i].toString()){
            index = i;
            console.log("index: ", index);
            resolve(index);
          }
        }
      });
    }).then(function(index){
      console.log("index here: ", index);
      return new Promise(function(resolve, reject){
        student.indivRanks[index] = rank;

        console.log("Rank: ", student.indivRanks[index]);
        var up_student = student;

        resolve(up_student);
      });
    }).then(function(up_student){
      up_student.save(function(err){
        if(err){
          console.log(err);
        }
      }).then(function(response){
        console.log(response);
        res.jsonp(response);
      });
    });


  });
};

exports.listDeactivated = function (req, res) {
  Volunteer.find({active:false}).sort('-created').populate('user', 'displayName').exec(function (err, volunteers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(volunteers);
    }
  });
};

/**
 * Volunteer middleware
 */
exports.volunteerByID = function(req, res, next, id) {

  if (id === "undefined") {
    id = req.user.id;
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Volunteer is invalid'
    });
  }

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
