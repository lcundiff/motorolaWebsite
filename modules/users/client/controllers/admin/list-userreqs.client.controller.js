(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('ReqListController', ReqListController);

  ReqListController.$inject = ['$scope', '$filter', 'AdminService', 'UsersService', 'Notification'];

  function ReqListController($scope, $filter, AdminService, UsersService, Notification) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.sendSignupEmail = sendSignupEmail;

    AdminService.retrieveUserReqs().then(async function (data) {
      console.log("data: ",data);

      vm.userreqs = data.userreqs;
      await(vm.buildPager());

    });
    /*AdminService.retrieveUsers(function (data) {
      console.log("data: ",data);
      console.log("YO");
      vm.users = data.users;
      vm.buildPager();
    });*/

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }


    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.userreqs, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    function sendSignupEmail(userReq) {
      console.log("roles: ",userReq.roles);

      AdminService.updateUserReq(userReq._id, userReq).then(function(data){
        console.log("data");
      });
      UsersService.sendSignupLink(userReq).then(function(data){
        console.log("YEAH DONE: ",data);
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Email sent successfully.' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Email send error.' });

      }, function(err){
        console.log("err: ",err);
      });
    }
  }
}());
