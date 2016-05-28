angular.module("miniApp").factory('CommonService',function GoogleService($http,$localStorage) {
    var common = {};
    var http;
    common.storeData = function (name,value){
        $localStorage[name]=value;
    }
    
    return common;
});

