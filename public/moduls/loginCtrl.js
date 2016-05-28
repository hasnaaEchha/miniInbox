
(function(){
    'use strict';

    angular.module('miniApp')
        .controller('LoginCtrl',[
            'GoogleService',
            'CommonService',
            '$state',
            '$location',
            '$window',
            '$timeout',
            '$localStorage',
            LoginCtrl]);
    function LoginCtrl(GoogleService,CommonService,$state,$location,$window,$timeout, $localStorage){
        var vm=this;
        vm.error=false;
        getClientGoogleCode();
        vm.initGoogleLogIn=function() {
            GoogleService.getCode().then(function(response){
                console.log(response);
                $window.location.href=response.data;
            }, function(error){
                console.log(error);
            });            
        };

        function getClientGoogleCode(){
            if($location.absUrl().split('?').length>1){
                var code = $location.absUrl().split('?')[1].split('=')[1];
                CommonService.storeData('googleCode',code);
                console.log(code);
                GoogleService.getToken(code).then(function(response){
                    console.log(response);
                    CommonService.storeData('token',response['data']);
                    $state.go('sendMail');
                },function(error){
                    console.log(error)
                })
                console.log(code);    
                
            }
            
        }
        
    }
    

}());