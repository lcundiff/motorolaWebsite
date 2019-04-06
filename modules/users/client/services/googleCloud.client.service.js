(function () {
  'use strict';

  // TODO this should be Users service
  angular
    .module('users.services')
    .factory('GoogleCloudService', GoogleCloudService);

  GoogleCloudService.$inject = ['$resource'];

  function GoogleCloudService($resource) {
    var GoogleCloud = $resource('/api/student/', {}, {
        put_file: {
          method: 'PUT',
          url: '/api/files/cloud-storage',
        },
        get_file: {
          method: 'GET',
          url: '/api/files/cloud-storage/:filename',
        },
      });


    angular.extend(GoogleCloud, {
      uploadForm: function(filename) {
        return this.put_file(filename).$promise;
      },
      downloadForm: function(filename) {
        return this.get_file({
          filename: filename
        }).$promise;
      },
    });

    return GoogleCloud;
  }
}());
