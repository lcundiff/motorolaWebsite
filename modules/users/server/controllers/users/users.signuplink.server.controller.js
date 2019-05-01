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

exports.requestLink = function (req, res) {
      if (req.body.email) {

        var email = Promise.resolve(String(req.body.email).toLowerCase());
        var firstName = Promise.resolve(String(req.body.firstName));
        var lastName = Promise.resolve(String(req.body.lastName));

        Promise.all([email, firstName, lastName]).then(async function([ue, uf, ul]){
          var userReq = new UserReq();
          await(userReq);
          await(userReq.firstName = uf);
          await(userReq.lastName = ul);
          await(userReq.email = ue);

          await(userReq.save(function (err) {
            res.send({
              message: 'Your request has been submitted.'
            });
          }));
        })

      } else {
        return res.status(422).send({
          message: 'Email field must not be blank'
        });
      }
};

exports.signupLink = function (req, res, next) {
  async.waterfall([
    // Generate random token
    function (done) {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },
    // Lookup user by username
    function (token, done) {
      if (req.body.email) {
        var email = Promise.resolve(String(req.body.email).toLowerCase());
        var signupLinkToken = Promise.resolve(token);
        var signupLinkExpires = Promise.resolve(Date.now() + (3600000*24)); // 1 hour

        Promise.all([email, signupLinkToken, signupLinkExpires]).then(async function([ue, ut, us]){
          await(req.body.email = ue);
          await(req.body.signupLinkToken = ut);
          await(req.body.signupLinkExpires = us);
          await(delete req.body.__v);

          await(UserReq.findOneAndUpdate({email: ue}, req.body, {upsert: true})
          .then(function(response){
            done(null, token, req.body);
          })
          .catch(function(err){
            res.status(400).send({
              message: 'Failure sending email'
            });
          }));
        });
      } else {
        return res.status(422).send({
          message: 'Email field must not be blank'
        });
      }
    },
    function (token, user, done) {
      var httpTransport = 'https://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      var baseUrl = config.domain || httpTransport + req.headers.host;
      res.render(path.resolve('modules/users/server/templates/signup-link-email'), {
        name: user.firstName + ' '+ user.lastName,
        appName: config.app.title,
        url: baseUrl + '/api/auth/signup/' + token
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'IMPORTANT: MSI Career Mentoring and Shadowing Program Sign-Up',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.send({
            message: 'An email has been sent to the provided email with further instructions.'
          });
        } else {
          console.log(err);
          return res.status(400).send({
            message: 'Failure sending email'
          });
        }

        done(err);
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Reset password GET from email token
 */
exports.validateSignupToken = function (req, res) {
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
