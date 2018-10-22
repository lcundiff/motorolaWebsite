
var google = require('googleapis');
var drive = google.drive('v3');
var fs = require('fs');
var path = require('path');
//Key JSON is in the node_modules
var key = require('key.json');

//get oauth from googleapi and then save it in local
var googleAuth = require('google-auth-library');
var auth = new googleAuth();
var oauth2Client = new auth.OAuth2(key.installed.client_id, key.installed.client_secret, key.installed.redirect_uris[0]);
var SCOPES = ['https://www.googleapis.com/auth/drive.file'];
var readline = require('readline');
var TOKEN_DIR = './.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-credentials.json';

// var jwtClient = new google.auth.JWT(
//   key.client_email,
//   '',
//   key.private_key, ['https://www.googleapis.com/auth/drive'], // an array of auth scopes
//   null
// );
const os = require('os');


var multer = require('multer');

//copy target file in local and then upload that file into google drive instead of the target file
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload'); // where to store it
  },
  filename: function (req, file, cb) {
    if(!file.originalname.match(/\.(png|jpg|jpeg|pdf|gif)$/)) {
      console.log("filename error");
      var err = new Error();
      err.code = 'filetype'; // to check on file type
      return cb(err);
    } else {
      console.log("produced filename");
      // console.log();
      var day = new Date();
      var d = day.getDay();
      var h = day.getHours();

      // var fileNamee = d + '_' + h + '_' + file.originalname;
      console.log(req);
      var fileNamee = req.user.firstName+'_'+req.user.lastName+'_'+file.originalname;
      console.log("filename produced is: " + fileNamee);
      cb(null, fileNamee);
    }
  }
});

//configure the copy file
var upload = multer({
  storage: storage,
  limits: { fileSize: 20971520 } // Max file size: 20MB
}).single('myfile'); // name in form

fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
          var authUrl = oauth2Client.generateAuthUrl({
              access_type: 'offline',
              scope: SCOPES
          });
          console.log('Authorize this app by visiting this url: ', authUrl);
          var rl = readline.createInterface({
              input: process.stdin,
              output: process.stdout
          });
          rl.question('Enter the code from that page here: ', function(code) {
          rl.close();
          oauth2Client.getToken(code, function(err, token) {
            if (err) {
              console.log('Error while trying to retrieve access token', err);
              return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
          });
        });
      } else {
        oauth2Client.credentials = JSON.parse(token);
      }
  });


//store oauth token from google api 
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}



exports.listDocs = function(req, res) {
console.log('Here listDocs!');
      drive.files.list({
        auth: oauth2Client
      }, function(err, resp) {
        // handle err and response
        if (err) {
          res.send(err);
          return;
        } else {
          res.jsonp(resp.files);
        }
      });
};

exports.getWaiver = function(req, res) {
console.log('Here get waiver!');
      drive.files.list({
        auth: oauth2Client
      }, function(err, resp) {
        // handle err and response
        if (err) {
          res.send(err);
          return;
        } else {
          return new Promise(function(resolve, reject){
            resp.files.forEach(function(file){
              if(file.name === "waiver.pdf"){
                resolve(file);
               //res.jsonp(file);
              }
              else if(file === resp.files[resp.files.length-1]){
                reject("Not found");
              }
            });
          }).then(function(waiver){
            res.jsonp(waiver);
          }, function(rejection){
            res.send("Waiver not found.");
          });
        }
      });
};

exports.getNDA = function(req, res) {
console.log('Here get NDA!');
      drive.files.list({
        auth: oauth2Client
      }, function(err, resp) {
        // handle err and response
        if (err) {
          res.send(err);
          return;
        } else {
          return new Promise(function(resolve, reject){
            resp.files.forEach(function(file){
              if(file.name === "NDA.pdf"){
                resolve(file);
               //res.jsonp(file);
              }
              else if(file === resp.files[resp.files.length-1]){
                reject("Not found");
              }
            });
          }).then(function(nda_form){
            res.jsonp(nda_form);
          }, function(rejection){
            res.send("NDA not found.");
          });
        }
      });
};

//download different docs
exports.getDoc = function(req, res) {
console.log('Here getDocs!');

      var fileName = req.params.docId;

      var fileId = fileName.substr(0, fileName.indexOf('.'));
      var home = os.homedir();
      // var filePath = path.join(__dirname,'../files') + '/' + fileName;
      var localfile = "";
      // var dest = fs.createWriteStream(path);
      if (fileName == '1_HeVqSsITs02VzFWNcsNYzZ6VxD_tQ97.pdf'){
        localfile = "waiver.pdf";
      } else if (fileName == '1ozdDhxcvKOBgLO-ZXlE0PvdjC6UBOv5N.pdf'){
        localfile = "NDA.pdf";
      } else if (fileName == '1JPr3KO6Dxt8SJakP9WSYx32fukvY9c3C.csv'){
        localfile = "student.csv";
      } else {
        localfile = fileName;
      }
      var dest = fs.createWriteStream('./public/download/' + localfile);

      console.log("fileId: " + fileId);
      console.log("fileName: " + fileName);

      drive.files.get({
          auth: oauth2Client,
          fileId: fileId,
          alt: 'media'
        })
      // console.log(temp);
        .on('end', function(resp) {
          console.log('Done');
          console.log('resp: ',resp);

          res.jsonp(resp);
        })
        .on('error', function(err) {
          res.send(err);
        // }));
        }).pipe(dest);
};

//create docs
exports.createDocs = function(req, res) {
console.log('Here createDocs!');
  // console.log(req.body);
      drive.files.create({
        auth: oauth2Client,
        resource: {
          name: req.body.name,
          mimeType: req.body.mimeType //'text/csv'
        },
        media: {
          mimeType: req.body.mimeType, //'text/csv',
          body: req.body.content //'This, is, the, test, document! Sunny Huang '
        }
      }, 
	  function(err, resp) {
        if (err) {
          res.send(err);
        } else {

          res.send(resp);
          console.log("Success upload document");
        }

      });

};

exports.deleteDocs = function(req, res) {
console.log('Here deleteDocs!');

      drive.files.delete({
        auth: oauth2Client,
        fileId: req.params.docId
      }, function(err, resp) {
        if (err) {
          //  console.log(err);
          res.send(err);
        } else {
          console.log("Success deleted document");
          res.send('Success');
        }
      });
};

exports.updateDocs = function(req, res) {
console.log('Here updateDocs!');
      drive.files.update({
        auth: oauth2Client,
        fileId: req.params.docId,
        resource: {
          name: req.body.name,
          mimeType: req.body.mimeType //'text/csv'
        },
        media: {
          mimeType: req.body.mimeType, //'text/csv',
          body: req.body.content //'This, is, the, test, document! Sunny Huang '
        }
      }, function(err, resp) {
        if (err) {
          res.send(err);
        } else {
          res.send(resp);
        }
      });

};

//upload docs
exports.updateByUpload = function(req, res) {
//alert("uploadDoc Server called");
  console.log('Here updateByUploadServer!');
  upload(req, res, function (err) {
  // console.log("1");
    if (err) {
      // console.log("2(1)");
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.json({ success: false, message: 'File size is too large. Max limit is 20MB' });
      } else if (err.code === 'filetype') {
        res.json({ success: false, message: 'File type is invalid. Accepted types are .png/.jpg/.jpeg/.pdf' });
      } else {
        console.log('err = ' + err);
        res.json({ success: false, message: 'File was not able to be uploaded' });
      }
    } else {
        // jwtClient.authorize(function(err, tokens) {
          // console.log("2(2)");
    if (err) {
      console.log(err);
      return;
    } else {

      var fileMetadata = {
        // name: req.user._id + '_' + d + '_' + h + '_' + req.file.originalname,
        name: req.body.fileName,
        mimeType: req.body.mimeType,
        //fields: req.user._id
       // fields: 'id'

      };



      // var dir = 'public/upload/' + d + '_' + h + '_' + req.file.originalname;
      var dir = 'public/upload/' + req.body.fileName;

      console.log(req.params.docId);
      //upload copy file to google api
      drive.files.update({
        auth: oauth2Client,
        resource: fileMetadata,
        fileId:req.params.docId,
        media: {
          mimeType: req.body.mimeType,
            body: fs.createReadStream(dir)
        },
        fields: 'id'
      }, function(err, resp) {
        //console.log('Here');
        if (err) {
          // Handle error
          console.log(err);
          res.jsonp(err);
        } else {
          // console.log("4");
          res.jsonp(resp);
        }
      });


    }

  // });
}
});

};


exports.uploadDocs = function(req, res) {
//alert("uploadDoc Server called");
  console.log('Here uploadDocs!');
  upload(req, res, function (err) {
  // console.log("1");
    if (err) {
      // console.log("2(1)");
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.json({ success: false, message: 'File size is too large. Max limit is 20MB' });
      } else if (err.code === 'filetype') {
        res.json({ success: false, message: 'File type is invalid. Accepted types are .png/.jpg/.jpeg/.pdf' });
      } else {
        console.log('err = ' + err);
        res.json({ success: false, message: 'File was not able to be uploaded' });
      }
    } else {
        // jwtClient.authorize(function(err, tokens) {
          // console.log("2(2)");
    if (err) {
      console.log(err);
      return;
    } else {

     // console.log("3");
      var fileMetadata = {
        name: req.body.fileName,
        mimeType: req.body.mimeType
       // fields: 'id'

      };

// var name = req.file.originalname
     //  console.log(req.file.originalname);

     var day = new Date();
      var d = day.getDay();
      var h = day.getHours();

      var fileMetadata = {
        // name: req.user._id + '_' + d + '_' + h + '_' + req.file.originalname,
        name: req.user.firstName+'_'+req.user.lastName+'_'+req.file.originalname,
        mimeType: req.body.mimeType,
        //fields: req.user._id
       // fields: 'id'

      };



      // var dir = 'public/upload/' + d + '_' + h + '_' + req.file.originalname;
      var dir = 'public/upload/' + req.user.firstName+'_'+req.user.lastName+'_'+req.file.originalname;

      console.log(dir);
      drive.files.create({
        auth: oauth2Client,
        resource: fileMetadata,
        media: {
          mimeType: req.body.mimeType,
            body: fs.createReadStream(dir)
        },
        fields: 'id'
      }, function(err, resp) {
        //console.log('Here');
        if (err) {
          // Handle error
          console.log(err);
          res.jsonp(err);
        } else {
          console.log("4");
          res.jsonp(resp);
        }
      });


    }

  // });
}
});
};
