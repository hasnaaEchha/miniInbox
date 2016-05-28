
(function(){
    'use strict';

    angular.module('miniApp')
        .controller('SendMailCtrl',[
            'GoogleService',
            'CommonService',
            '$state',
            '$location',
            '$window',
            '$timeout',
            '$localStorage',
            SendMailCtrl]);
    function SendMailCtrl(GoogleService,CommonService,$state,$location,$window,$timeout, $localStorage){
        var vm=this;
        function init(){
            GoogleService.getContacts($localStorage['token']).then(function(response){
                console.log(response);
                console.log($localStorage['token']);
                CommonService.storeData('author',response['data'].feed.author[0]);
                var entries = response['data'].feed.entry;
                vm.contacts= [];
                for (var i=0;i<entries.length;i++){
                    vm.contacts.push(
                        {name:entries[i]['title']['$t'],
                        email:entries[i]['gd$email'][0]['address']}
                    )
                }
                console.log(vm.contacts);
            }, function(error){
                console.log(error);
            })
        }
        init();
        vm.sendMail=function(){
            console.log(vm.email);
            GoogleService.sendMail("hello").then(function(response){
                console.log(response);
            },function(error){
                console.log(error);
            })
        }
    }
    

}());