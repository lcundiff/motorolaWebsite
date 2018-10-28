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
  console.log("req.body: ",req.body);
  /*var volunteer = new Volunteer(req.body);
  console.log("req.volunteer: ", req.volunteer);
  volunteer.user = req.user;

  volunteer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
        User.findOneAndUpdate({ _id: req.user}, {roles: req.body.roles},
        function(err) {
             if (err) throw err;
           });
      res.jsonp(volunteer);
    }
  });*/
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

  /*Student.find({ user: studentId }).exec().then(function(response){
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


  });*/
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
