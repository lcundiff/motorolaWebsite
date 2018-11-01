'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  UserReq = mongoose.model('UserReq'),
  nodemailer = require('nodemailer'),
  async = require('async'),
  crypto = require('crypto');

var smtpTransport = nodemailer.createTransport(config.mailer.options);

/**
 * Forgot for reset password (forgot POST)
 */

exports.sendFormFixEmail = function (req, res, next) {
  async.waterfall([
    // Generate random token
    function (done) {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        console.log('1');
        done(err, token);
      });
    },
    // Lookup user by username
    function (token, done) {
      if (req.body.email) {
        console.log("req.body: ",req.body);

        var email = Promise.resolve(String(req.body.email).toLowerCase());
        var firstName = Promise.resolve(String(req.body.firstName));
        var lastName = Promise.resolve(String(req.body.lastName));
        var form = Promise.resolve(String(req.body.formName));

        Promise.all([email, firstName, lastName, form]).then(async function([ue, uf, ul, f]){
          var err;
          var fields;
          await(fields = {
            email: ue,
            firstName: uf,
            lastName: ul,
            formName: f
          });
          await(console.log('2'));
          await(done(err, fields, f));
        });

      } else {
        return res.status(422).send({
          message: 'Email field must not be blank'
        });
      }
    },
    function (fields, formName, done) {
      console.log('a');
      console.log("fields: ",fields);
      console.log("formName: ",formName);

      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      var baseUrl = config.domain || httpTransport + req.headers.host;
      res.render(path.resolve('modules/users/server/templates/forms-fix-email'), {
        name: fields.firstName + ' '+ fields.lastName,
        appName: config.app.title,
        formName: formName,
        url: baseUrl + '/authentication/signin'
      }, function (err, emailHTML) {
        console.log('3');
        done(err, emailHTML, fields);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, fields, done) {
      console.log("user email: ",fields.email);
      var mailOptions = {
        to: fields.email,
        from: config.mailer.from,
        subject: 'IMPORTANT: Form Error Encountered',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.send({
            message: 'An email has been sent to the provided email with further instructions.'
          });
        } else {
          return res.status(400).send({
            message: 'Failure sending email'
          });
        }
        console.log('4');
        done(err);
      });
    }
  ], function (err) {
    console.log('5');
    if (err) {
      return next(err);
    }
  });
};

/**
 * Reset password GET from email token
 */
exports.validateSignupToken = function (req, res) {
  console.log("token: ", req.params.token);
  UserReq.findOne({
    signupLinkToken: req.params.token,
    signupLinkExpires: {
      $gt: Date.now()
    }
  }, function (err, userReq) {
    if (err || !userReq) {
      return res.redirect('/authentication/signup/invalid');
    }

    res.redirect('/authentication/signup/' + req.params.token);
  });
};
