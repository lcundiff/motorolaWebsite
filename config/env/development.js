'use strict';

var defaultEnvConfig = require('./default');
var authInfo = require('./local');

module.exports = {
  db: {
    uri: 'mongodb://slujo:Motorola1@ds113825.mlab.com:13825/moto13b', //|| process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/mean-dev',
    options: {},
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    fileLogger: {
      directoryPath: process.cwd(),
      fileName: 'app.log',
      maxsize: 10485760,
      maxFiles: 2,
      json: false
    }
  },
  app: {
    title: defaultEnvConfig.app.title + ' - Development Environment'
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/facebook/callback'
  },
  googleCloudStorage: {
    projectId: 'motorola-new',
    bucketName: 'motorola-new.appspot.com',
  },
  NODE_ENV: "development",
  GOOGLE_APPLICATION_CREDENTIALS: authInfo.googleService,
  mailer: {
    from: authInfo.gsuiteEmail,
    options: {
      name: 'motorola-new.appspot.com',
      sendMail: true,
      host: 'smtp.gmail.com',
      port: 465,
      secure: false,
      debug:true,
      logger: true,
      tls: {
            rejectUnauthorized: false
      },
      service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
      auth: authInfo.googleKey,
      tls: {
        rejectUnauthorized: false,
      }
    }
  },
  livereload: false,
  seedDB: {
    seed: process.env.MONGO_SEED === 'true',
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS !== 'false'
    },
    // Order of collections in configuration will determine order of seeding.
    // i.e. given these settings, the User seeds will be complete before
    // Article seed is performed.
    collections: [{
      model: 'User',
      docs: [{
        data: {
          username: 'local-admin',
          email: 'admin@localhost.com',
          firstName: 'Admin',
          lastName: 'Local',
          roles: ['admin', 'user']
        }
      }, {
        // Set to true to overwrite this document
        // when it already exists in the collection.
        // If set to false, or missing, the seed operation
        // will skip this document to avoid overwriting it.
        overwrite: true,
        data: {
          username: 'local-user',
          email: 'user@localhost.com',
          firstName: 'User',
          lastName: 'Local',
          roles: ['user']
        }
      }]
    }, {
      model: 'Article',
      options: {
        // Override log results setting at the
        // collection level.
        logResults: true
      },
      skip: {
        // Skip collection when this query returns results.
        // e.g. {}: Only seeds collection when it is empty.
        when: {} // Mongoose qualified query
      },
      docs: [{
        data: {
          title: 'First Article',
          content: 'This is a seeded Article for the development environment'
        }
      }]
    }]
  }
};
