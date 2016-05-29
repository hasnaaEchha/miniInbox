
(function(){
    'use strict';

    angular.module('miniApp')
        .controller('SendMailCtrl',[
            'GoogleService',
            'FacebookService',
            'CommonService',
            '$rootScope',
            '$state',
            '$location',
            '$window',
            '$timeout',
            '$localStorage',
            '$sce',
            SendMailCtrl]);
    function SendMailCtrl(GoogleService,FacebookService,CommonService,$rootScope,$state,$location,$window,$timeout, $localStorage,$sce){
        var vm=this;
        function init(){
            vm.identifier = {};
            if(CommonService.getData('socialMedia').localeCompare('google')==0){
                GoogleService.getContacts($localStorage['googleToken']).then(function(response){
                    console.log(response);
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
                    console.log(error);
                })
            }
            if(CommonService.getData('socialMedia').localeCompare('facebook')==0){

                FacebookService.getContacts($localStorage['facebookToken']).then(function(response){
                    var entries = response['data']['data'];
                    console.log(entries);
                    console.log(response);
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
                GoogleService.sendMail(vm.identifier.value,vm.subject,vm.message).then(function(response){
                    vm.identifier={};
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