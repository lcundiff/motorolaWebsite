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
          url: '/api/files/cloud-storage',
        },
      });


    angular.extend(GoogleCloud, {
      upload: function(file) {
        console.log(file);
        return this.put_file(file).$promise;
      },
      download: function() {
        return this.get_file().$promise;
      },
    });

    return GoogleCloud;
  }
}());
