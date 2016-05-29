
(function(){
    'use strict';

    angular.module('miniApp')
        .controller('LoginCtrl',[
            'GoogleService',
            'FacebookService',
            'CommonService',
            '$rootScope',
            '$state',
            '$location',
            '$window',
            '$timeout',
            '$localStorage',
            LoginCtrl]);
    function LoginCtrl(GoogleService,FacebookService,CommonService,$rootScope,$state,$location,$window,$timeout, $localStorage){
        var vm=this;
        vm.error=false;
        getClientCode();
        vm.initGoogleLogIn=function() {
            CommonService.storeData('socialMedia','google');
            GoogleService.getCode().then(function(response){
                $window.location.href=response.data;
            }, function(error){
                console.log(error);
            });            
        };
        vm.initFacebookLogIn=function() {
            CommonService.storeData('socialMedia','facebook');
            FacebookService.getCode().then(function(response){
                //$window.location.href=response.data;
                $window.location.href="http://www.facebook.com/dialog/send?app_id=1559740410998013&link=https://developers.facebook.com/apps&redirect_uri=http://localhost:3000/"
            }, function(error){
                console.log(error);
            });            
        };
        function getClientCode(){
            if($location.absUrl().split('?').length>1){
                var code = $location.absUrl().split('?')[1].split('=')[1];
                CommonService.storeData('code',code);
                if(CommonService.getData('socialMedia').localeCompare('google')==0){
                   GoogleService.getToken(code).then(function(response){
                    CommonService.storeData('googleToken',response['data']);
                    $state.go('sendMail');
                    },function(error){
                        console.log(error)
                    })
                     
                }
                console.log(CommonService.getData('socialMedia'))
                if(CommonService.getData('socialMedia').localeCompare('facebook')==0){
                   FacebookService.getToken(code).then(function(response){
                    CommonService.storeData('facebookToken',response['data']);
                    console.log(response);
                    $state.go('sendMail');
                    },function(error){
                        console.log(error)
                    })
                     
                }
                    
                
            }
            
        }
        
    }
    

}());