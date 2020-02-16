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
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/google/callback'
  },
  googleCloudStorage: {
    projectId: 'motorola-new',
    bucketName: 'motorola-new.appspot.com',
  },
  NODE_ENV: "development",
  GOOGLE_APPLICATION_CREDENTIALS: {
    type: "service_account",
    project_id: "motorola-new",
    private_key_id: "21b77790e7ed39c2872f4358c7ea77d522c3a1dd",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDSl0Q0LOrjg9XI\nvhbs/UjtjlmyngzOTWD+5IHyfM5f6yhnfKPoRpzewkCnhCKNJJkYbn5g4aXx553C\ny6ItIdd0JUFJufHzYUSjy87ZZLcPxJdqfyHxAj3qkqh2C36q7zVqh/THC6+lyaT+\nDDEpn4iTEjqG+SiZGyQ+9hnpq5NwTujqJUW8kzFCvnYsRToyxCMWo4zDjTwDU6Dp\nB9EgVb9tw4YkBULfxWjhjFBKNNJVvIt9pyO2ZNaYq9fmepIyblgIDg6SMXZDaw2S\njgPX2KAsNktb+qC8tBLtSRu6boH5PnYSKS0pa2drVsA+HvxpP+JjxtT+7ft0E/1n\ne9qRoP4bAgMBAAECggEAAWL0lIFdNI1IKY+y1/Gc+s9uoMHwpKUWx+baQi33L+N8\n+x1zeNKKMt9FjLTOg25jwajslRe3P33+aGtt0G1CHWYnZWRfhvIzgP6VCJJksCpj\nstROdWdF4BcCG/DcbySvDdoCTxMxH17SAsgyxKrju9ApaX0XetaWaQG2zvaNvHYN\ne8YSFuPlwphaMgvYVgdmPVKwusWHxL810NFUQaf0ka2gkULXToiaYcADcG7FiUow\nVKQ+aqcPEmwVvhzUDcG3xE9WepqsOlIxVrkht0sSM1xc0Phkcxi0PhDXl97TmQKp\nJhX2b9PxSDVXQne7FBcu/NPQ6x2nMrXf0DBOFkDZQQKBgQD0b+sRqLvh6SAReCLE\ncLiTeujt/yNRN2Qg/2pUOQLZUdEF6BwpWfZ3IKc3IdMX0j1YJS45tBDvzd/Dzdlh\nqQkKTCDOBGBRmg3ORzUxlAoTY/KtxsEXDfhzttAmkAM7w6W7H3q1FRmjaMMjTzJa\nfe0T9Wh1h0uaHEjLDp/fYLBu2wKBgQDcjXoP6SH5VDZlp1rkLsWw/yUVJiaOYJCJ\nr2NNczZJs2nmpBXaHb3KF0d4aTiDmVCOg7zPX3y0X+nw+bytqw0wDby6gdyD4vWg\nDHoUwbVW1ZNOerM1JZge54QiuNqIdOyVuMVMARwCNwJHUWoVawUKWIilg8ELZf1Q\nkSaSJWixwQKBgCIF2fBRTiV5r27/C8fP8MEGYJmP47iQPy2gn4otjUn2a2OpFRJk\nZTvbnaq82Ib+Sm+UbUS23YyjWTwF0PYY8xst0XsbfNSe3sERhEPsWSKtzL+HZKTy\n2twwW/SiIvEUoGLVVN0TnMfz8wVdJqMV2APpKqsBM/K1cSRiWrpa2PP1AoGAVHdO\nVweW/lD1IEtOsPMEvTuJ7SaWP5LV6BUmd8P295ThqvYOdGFNjTcLJR9PCH9P7bSg\nO986+C1/f811KCHJRC0OqXMQi+YA4dHFc2uYUnArITQ2q9UBBFzwKwgWkYoODW0d\nCnWmT2bX1Y5ljVxWKtcrRhBGf2II+LEOT4xKI0ECgYBiVd5VfZdBnid2IL4RBwb6\ncvZ3xdS8VGNMsDZU9Ziub4pBeKw0dMlIEYjaexaybtOjQHoEPuYFnwj7AUs5Hnta\niFKOEDQmun6hZ3YW4QMdyYRcj/ieLkXSN8fLMVgoff51Ed4i+ocNafsUY7w4LV7l\nrE9maTbt7ex7srzxPLPODA==\n-----END PRIVATE KEY-----\n",
    client_email: "motorola-new@appspot.gserviceaccount.com",
    client_id: "101628990559814163302",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/motorola-new%40appspot.gserviceaccount.com",
  },
  mailer: {
    from: 'alexmarron@mentoringcoach.org',
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
