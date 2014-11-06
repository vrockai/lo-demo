'use strict';

/**
 * @ngdoc function
 * @name lochatApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the lochatApp
 */
angular.module('lochatApp')
  .controller('MainCtrl', function ($scope, $window) {

    $scope.message = {text:''};

    $scope.collection = [];

    var liveoak = new LiveOak({
      auth: {
        clientId: 'liveoak.client.lochat.lochat-html'
      }
    });

    liveoak.auth.init({ onLoad: 'login-required'}).success(function(){
      load();

      liveoak.connect(function(){
        liveoak.subscribe('/lochat/storage/chat/*', function(){
          load();
        });
      });}).error(
      function() {
        $window.alert('login not successful');
      }

    );

    function load(){
      liveoak.readMembers('/lochat/storage/chat', {
        sort: '-time',
        success: function(data) {
          $scope.$apply(function() {
            $scope.collection = data;
          });
        }
      });
    }

    $scope.create = function() {
      liveoak.create('/lochat/storage/chat', {
        time: new Date().getTime(),
        message: $scope.message.text
      }, {
        success: function(){
          load();
        },
        error: function(error) {
          $window.alert(error.data.message);
        }
      });
    };



  });
