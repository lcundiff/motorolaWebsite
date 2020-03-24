'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Student = mongoose.model('Student'),
  Volunteer = mongoose.model('Volunteer'),
  School = mongoose.model('School'),
  config = require(path.resolve('./config/config')),
  nodemailer = require('nodemailer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

  var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'motorolamentoring2020@gmail.com',
      pass: 'Motorola123!'
    }
  });

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
    console.log('userById: ' + req);
    return res.status(req);
  }
};
/**
 * Add school
 */
exports.updateSchools = function(req, res) {

  var school = new School(req.body);
  console.log("req.body: ",req.body);
  school.name = req.body['name'];

  school.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log("School: ",school);
      res.json(school);
    }
  });
};

exports.sendCorrection = function(req,res){
  var no_form_students = req.body["credentials"]  

  for(var i =0; i< no_form_students.length; i++){ 
    var student = no_form_students[i]
    console.log(student)
    var mailOptions = {
      from: 'motorolamentoring2020@gmail.com',
      to: student["application"]["email"],
      subject: "Motorola Mentoring Application Form Correction",
      text: "Dear "+student['application']["firstname"] +" "+ student["application"]['lastname']+",\n"+" \n"+
      "There is an issue with your application. Please review that your forms are updated and/or approved. \n"+
      " \n"+"Best Regards, \n"+"Motorola Mentoring Team"
    }
    console.log("trying to send email")
    smtpTransport.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.status(400)
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  res.status(200).send("done");
};

exports.sendThankYou = function(req,res){
  console.log("Hello from send thank you server controller.")
  var credentials = req.body['credentials']

  for(var i =0; i<credentials.length; i++){
    var credential = credentials[i]
    var mailOptions = {
      from: 'motorolamentoring2020@gmail.com',
      to: credential["email"],
      subject: "Motorola Mentoring Application",
      text: "Dear "+credential['firstname'] +" "+ credential['lastname']+",\n"+" \n"+
      "Thank you for applying to the Motorola mentoring program. Unfortunately, we are unable to accept your application. We encourage you to apply again next year. \n"+
      " \n"+"Best Regards, \n"+"Motorola Mentoring Team"
    }
    smtpTransport.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.status(400)
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
  res.status(200).send("Sent all consolation emails.");
};

