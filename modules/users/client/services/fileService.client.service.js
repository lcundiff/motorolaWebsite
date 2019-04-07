(function () {
  'use strict';
  // Users service used for communicating with the users REST endpoint
  angular
    .module('users.files.services')
    .factory('FileService', FileService);

  FileService.$inject = ['$http'];

  function FileService($http) {
    var methods = {
      upload: function(file, filename) {
        var fd = new FormData();
        fd.append("myFile", file);

        console.log('YO');
        console.log(fd);
        console.log('Here upload!!');

        return $http.post('/api/files/upload/' + filename, fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
        });
      },
      uploadNDA: function(file) {
        var fd = new FormData();
        fd.append("myFile", file.upload);

        console.log('YO');
        console.log(fd);

        console.log('Here upload!!');

        return $http.post('/api/files/uploadNDA', fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
        });
      },
      uploadWaiver: function(file) {
        var fd = new FormData();
        fd.append("myFile", file.upload);

        console.log('Here upload!!');

        return $http.post('/api/files/uploadWaiver', fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
        });
      },
      uploadFile: function(file, filename){
        var fd = new FormData();
        fd.append("myFile", file.upload);

        console.log('Here upload!!');
        return $http.post('/api/files/uploadFile' + filename, fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
        });
      },
      download: function(filename) {
        console.log("DOWNLOADING");
        console.log("filename: ", filename);

        return $http.get('/api/files/get/' + filename, { responseType: 'arraybuffer' });
      },
      downloadCSV: function(filename) {
        console.log("DOWNLOADING CSV");
        console.log("filename csv: ", filename);

        return $http.get('/api/files/csv/get/' + filename, { responseType: 'arraybuffer' });
      }
    };
    return methods;
  }

}());
