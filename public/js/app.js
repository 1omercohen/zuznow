var app = angular.module("zuznow", ['ui.bootstrap']);

app.controller('resultCtrl', function ($scope, $uibModalInstance, search_data) {
    $scope.search_data = JSON.parse(search_data);
  
    $scope.ok = function () {
      $uibModalInstance.close();
    };
  });

app.controller('main', function($scope, $uibModal, dataSrv, searchSrv, logSrv){
    $scope.values;
    $scope.logs;
    $scope.search_results = [];
    logSrv.getLogs()
        .then(logsData => {
            $scope.logs = logsData;
        })
    $scope.openResult = function(search_result){
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'search_result.html',
            controller: 'resultCtrl',
            size: 'lg',
            resolve: {
              search_data: function () {
                return search_result;
              }
            }
          });
    }
    $scope.$watch('search_type', function(){
        switch ($scope.search_type) {
            case 'Category':
                $scope.values = dataSrv.getCategories();
                break;
            case 'Actor':
                $scope.values = dataSrv.getActors();
                break;
            case 'Language':
                $scope.values = dataSrv.getLanguages();
                break;
            default:
        }   
    });
    $scope.search = function(){
        $scope.search_results = [];
        $scope.search_data = {
            search_type: $scope.search_type,
            search_value: $scope.select_value ? JSON.parse($scope.select_value).name : $scope.search_value,
            search_value_id: $scope.select_value ? JSON.parse($scope.select_value).id : null,
        }
        var log = {
            search_type: $scope.search_type,
            search_value: $scope.search_data.search_value,
            search_time: new Date()
        }
        searchSrv.search($scope.search_data, results => {
            $scope.search_results = results;
            log.search_result = JSON.stringify(results);
            logSrv.addLog(log);
            $scope.logs = logSrv.getLogs();
            $scope.select_value = null;
        });
    }
})

app.factory('logSrv', function($q, $http){
    var self = this;
    var logs;
   
    self.addLog = function(log){
        $http.post('/api/logs/create', log)
            then(() => {
                log.search_id = logs.length;
                logs.push(log);
            })
    }
    self.removeLog = function(logId){
        $http.delete('/api/logs/'+logId)
            .then(() => {
                logs = logs.filter(log => {
                    return log.search_id != logId;
                })
            })
    }
    self.getLogs = function(){
        var deferred = $q.defer();
        var promise =  $http.get('/api/logs');
        promise.then(search_logs => {
            logs = search_logs.data;
            deferred.resolve(logs)
        })
        return deferred.promise;
    }
    return self;
})

app.factory('searchSrv', function($http){
    var self = this;
    self.search = function(search, callback){
        $http.post(`/api/:${search.search_type}`, search)
            .then(searchData => {
                callback(searchData.data);
            })
    }
    return self;
});

app.factory('dataSrv', function($http){
    var self = this;
    var actors;
    var categories;
    var languages;
    $http.get('/api/actors')
        .then(actorsList => {
            actors = actorsList.data.map(actorDetails => {
                actorDetails.name = `${actorDetails.first_name} ${actorDetails.last_name}`;
                actorDetails.id = actorDetails.actor_id;
                return actorDetails;
            });
        })
    $http.get('/api/categories')
        .then(categoriesList => {
            categories = categoriesList.data.map(categoryDetails => {
                categoryDetails.id = categoryDetails.category_id;
                return categoryDetails;
            });
        })
    $http.get('/api/languages')
        .then(languagesList => {
            languages = languagesList.data.map(languageDetails => {
                languageDetails.id = languageDetails.language_id;
                return languageDetails;
            });
        })
    self.getActors = function(){
        return actors;
    }
    self.getCategories = function(){
        return categories;
    }
    self.getLanguages = function(){
        return languages;
    }
    return self;
})