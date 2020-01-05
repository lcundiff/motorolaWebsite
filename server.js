'use strict';

/**
 * Module dependencies.
 */
require('dotenv').config();
var app = require('./config/lib/app');
//var csv = require('./node_modules/jquery-csv/src/jquery.csv');
var server = app.start();
