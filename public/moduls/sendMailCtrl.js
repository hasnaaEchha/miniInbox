
(function(){
    'use strict';

    angular.module('miniApp')
        .controller('SendMailCtrl',[
            'GoogleService',
            'FacebookService',
            'CommonService',
            'blockUI',
            '$rootScope',
            '$state',
            '$location',
            '$window',
            '$timeout',
            '$localStorage',
            '$sce',
            SendMailCtrl]);
    function SendMailCtrl(GoogleService,FacebookService,CommonService,blockUI,$rootScope,$state,$location,$window,$timeout, $localStorage,$sce){
        var vm=this;
        var socket = io.connect("http://localhost:3000");
        socket.on('checkMail', function(msg){
            GoogleService.getUnreadCount($localStorage['googleToken']).then(function(response){
                vm.unreadMail=response.data;
            },function(error){
                console.log(error);
            })
        });
        function init(){
            GoogleService.getUnreadCount($localStorage['googleToken']).then(function(response){
                vm.unreadMail=response.data;
            },function(error){
                console.log(error);
            })
            vm.identifier = {};
            if(CommonService.getData('socialMedia').localeCompare('google')==0){
                blockUI.start();
                GoogleService.getContacts($localStorage['googleToken']).then(function(response){
                    blockUI.stop();
                    CommonService.storeData('author',response['data'].feed.author[0]);
                    var entries = response['data'].feed.entry;
                    vm.contacts= [];
                    for (var i=0;i<entries.length;i++){
                        vm.contacts.push(
                            {name:entries[i]['title']['$t'],
                            identifier:entries[i]['gd$email'][0]['address']}
                        )
                    }
                }, function(error){
                    $window.location.href("/");
                    console.log(error);
                })
            }
            if(CommonService.getData('socialMedia').localeCompare('facebook')==0){

                FacebookService.getContacts($localStorage['facebookToken']).then(function(response){
                    var entries = response['data']['data'];

                    vm.contacts= [];
                    for (var i=0;i<entries.length;i++){
                        vm.contacts.push(
                            {identifier:entries[i]['name'],
                            id:entries[i]['id'],
                            img:entries[i]['picture']['data']['url']}
                        )
                    }
                    
                }, function(error){
                    console.log(error);
                })
            }
        }
        init();
        vm.sendMail=function(){
            if(CommonService.getData('socialMedia').localeCompare('google')==0){
                blockUI.start();
                GoogleService.sendMail(vm.identifier.value,vm.subject,vm.message).then(function(response){
                    vm.message="";
                    vm.subject="";
                    vm.identifier={};

                    blockUI.stop();
                },function(error){
                    console.log(error);
                })
            }
            if(CommonService.getData('socialMedia').localeCompare('facebook')==0){
                /*FacebookService.send(vm.message,$rootScope.idFacebook,$localStorage['facebookToken']).then(function(response){
                    vm.identifier={};
                },function(error){
                    console.log(error);
                })*/
                
            }

        }
        function suggest_state(term) {
            var q = term.toLowerCase().trim();
            var results = [];

            // Find first 10 states that start with `term`.
            for (var i = 0; i < vm.contacts.length ; i++) {
              var state = vm.contacts[i].identifier;
              if (state.toLowerCase().indexOf(q) === 0)
                results.push({ label: state, value: state,id:vm.contacts[i].id,img:vm.contacts[i].img});
            }
            return results;
          }

        vm.autocomplete_options = {
            suggest: suggest_state
        };
    }
    
    

}());