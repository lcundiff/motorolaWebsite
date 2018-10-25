(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserReqController', UserReqController);

  UserReqController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve', 'Notification', 'AdminService', 'UsersService'];

  function UserReqController($scope, $state, $window, Authentication, reqId, Notification, AdminService, UserService) {
    var vm = this;
    vm.authentication = Authentication
    vm.remove = remove;
    vm.sendSignupEmail = sendSignupEmail;
    console.log("user: ",reqId);

    AdminService.retrieveUserReq(reqId).then(async function(data){

        console.log(data);
        vm.userReq = data;
        console.log("vm.user: ",vm.userReq);
    });

    function remove() {
      console.log("userReqId: ", userReq._id);
      if ($window.confirm('Are you sure you want to delete this sign-up request?')){
        UsersService.deleteReq(reqId).then(function(data){
          vm.userReqs.splice(vm.userReqs.indexOf(userReq), 1);
          Notification.success({message: '<i class="glyphicon glyphicon-ok"></i> Request deleted successfully!'})
        })
      }
    }

    function sendSignupEmail() {
      /*AdminService.retrieveUserReq(reqId).then(async function(data){

          console.log(data);
          vm.userReq = data;
          console.log("vm.user: ",vm.user);
          vm.isContextUserSelf();
      });
      var user = vm.user;

      console.log("update vm user: ",vm.user);


      AdminService.updateUser(userId, user).then(function(data){
        console.log("user: ",user);
        console.log("update data: ",data);

        $state.go('admin.user', {
          userId: user._id
        });
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });

      });*/
    }
  }
}());
