'use strict';

var defaultEnvConfig = require('./default');

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
  twitter: {
    username: '@TWITTER_USERNAME',
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/api/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/github/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: true
  },
  googleCloudStorage: {
    projectId: 'motorola-careers-mentoring',
    bucketName: 'motorola-careers-mentoring.appspot.com',
  },
  NODE_ENV: "development",
  GOOGLE_APPLICATION_CREDENTIALS: {
    type: "service_account",
    project_id: "motorola-careers-mentoring",
    private_key_id: "84d67d4f1bd0224f4772a8a3dd633d09635378a3",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCk2QqmPXSUccla\nJM/+o0L8Rn990MMco1VO9pxQp1IbLm+lHUsLcogwsKEV65gW53T4g0Tng0CAUWXc\nJ6Yfs6K+SQfUJes2kbqXJv/1pSShBObAAkMnv9pOTsrqI9ylDQlDe7so6mfdr/Jp\nyZKluhMrwVFC2hapyeg/nt7D89qJ/i+Oz0I29ZS8zCnypxBFvFcxjsg5NJBxrec/\nR7G8ILLLREOJoVbLwbO1FZHMK/eAkLENQeJtGCvs27b8dxeHsLkXa7lTu/7I4cmX\nFaLw2TV86I60CItfpdAdweRkx/ZXJVXNnqLNiOSMx32GiKcJIM5RVsgOBfTtHXkY\n2wPjh22jAgMBAAECggEAAtAVAglu8p05oakSFAf4mZHuHWG+I54GZJ80GK7iNk7s\nIqKWymxqAwd6ILcXewDWL9oKXK7OH1nd0EgBttw7kCJQNq8qJ13zV+tTG5C582km\nqo0jmQK0HOgWNgYqoP5Z85Syo2R9nK+zwb9p1deykz7S8Vfht6ZbyzkMfeiKXfRj\n4jF80pxO/rsAyZepaaEwuUBsvcMo+dKxZ1hzWbCRzfX+VRmiiU8bEmH/S+FxjtPm\ntOk5RbtQpU6FuESUcyYr5GPSyncARD6Kui34whP3Pi50kJ1GofZlp59gHXhYhsH3\nF/d13xiaXes3jArAPaSVoEbS8bdfmbMN1cRXs2JuwQKBgQDf+JqDRmuQWJ04ioXB\nH8AxHyBJITOcqQ20ly/0hyEghDRgF13GWcsbaQK6NLskN21sxyqS9DaIkkSFric+\nx7bh2+FpnjuF6yTcRQvib/muxqnuznbo/r7dbo6lyvQMgAJERfssa6xIF1VptqA9\nC5oaqwwXhdPJaCyf2Zhh/8iL0wKBgQC8a/vFLKfOhhhnq7ptxeGaoaD73HmgI1st\npFdX3h3QVRaJVcM0cfQgfNl4co03824AyKALP01E1UWFZnLIyYJ4LRtVIyDrQfHI\n7IpQzorLyIFz4ZtUeVRPOhcSBriv9aOynhlZtyhfBIsLtb37lqgMTl9w0/lW1KPp\n/+n9+vGE8QKBgFtpH8cMasJTKHf3MXgM+WgTCB5QyrvZ05otSolGzaJz0tyVLNTT\nuS3Kwi41b1vss2B+OUYZHljHOehFmAbrhBzSnUF6L1kNC9JK6/rTMNjAhILPCYE2\n17eQc+/+0XR4mnQ7C7SpjXsu6tFmlCfWIGNaBGllWXcOaYgkSylUOAm5AoGBALjJ\nqjxgpB3+Etcxav+XTr9I/kmjm0B7DEPB5csN0e1sVVLQ4kV/8G0gJGNk7KxPt7Vb\nDOKa7VuxUaIXrEDQp3zWt/SSJAm1PbvQh4HiXeqnNJYCT0TUTOP6U3/hSaV/4VAe\njzwWTaiKGxeb4LtpsFuJTT6pFOKcXjjyO3hTcCPxAoGAVdiuVx3lEEjYh94D9pRg\nillph4y1B2sHEYN84KFcOLv885o6FL2zIBcqLpU8r9A7y3UGilVLRbrsO+CpavUA\nnn0iudUZUIzRSsdbQ0ZdhftHDj99g2rd9Lgj0uGTFtbEY4VDDbzjOGwKXwoNKHbW\n9C87n1Gq/DhqTrElNLXyn2w=\n-----END PRIVATE KEY-----\n",
    client_email: "motorola-careers-mentoring@appspot.gserviceaccount.com",
    client_id: "101111851601137531049",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/motorola-careers-mentoring%40appspot.gserviceaccount.com",
  },
  mailer: {
    from: 'alexmarron@mentoringcoach.org',
    options: {
      name: 'motorola-careers-mentoring.appspot.com',
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
      auth: {
        type: 'OAuth2',
        user: 'alexmarron@mentoringcoach.org',
        clientId: '452625639526-p74grpfn08cu5bkgvbn03d078vpjcb1a.apps.googleusercontent.com',
        clientSecret: 's41HAbEyHGQdK8HYJNT1gMcC',
        refreshToken: '1/JktbbRa3L0AProGPGAsEnVAA_AdjZYivnynrZUwHr8Q',
        activeToken: 'ya29.Glv7BvyDInao1V-5u2vfpk0GWwH1ENOlLhRFinBlx76n71J-O82Q8Z52pM0LF_kfcrZIWRNh8SMimTT9z2XvnilUvMJrJhaS-s23AGOPqZlzJQnSQeqKtl1kMCC_'
        //user: process.env.MAILER_EMAIL_ID || 'motorolamentoring@gmail.com',
        //pass: process.env.MAILER_PASSWORD || 'Shadow-Mentor'
      },
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
