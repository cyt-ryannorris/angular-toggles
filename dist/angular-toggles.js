// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Config
angular.module('angularToggles.config', [])
    .value('angularToggles.config', {
        debug: true
    });

// Modules
angular.module('angularToggles.directives', [], function() {
});

angular.module('angularToggles.services', []);
angular.module('angularToggles',
    [
        'angularToggles.config',
        'angularToggles.directives',
        'angularToggles.services'
    ]);
angular.module('angularToggles.directives')
.directive('toggle', function(Toggles) {
  return {
    scope: {
      feature: '@'
    },
    restrict: 'A',
    transclude: true,
    template: '<div ng-show="enabled" ng-transclude></div>',
    link: function(scope, elem, attrs) {
      attrs.$observe('feature', function(value) {
        Toggles.resolveRule(value).then(function() {
          scope.enabled = true;
        }, function() {
          scope.enabled = false;
        });
      });
    }
  };
});

angular.module('angularToggles.services')
    .factory('Toggles', function ($http, Endpoints, $q) {

        var rules = {};
        var cached = false;

        function resolve(deferred, name) {
            var resolution = rules[name] || false;
            if (rules[name] === false) {
                deferred.reject();
            } else {
                deferred.resolve();
            }
        }

        return {
            resolveRule: function (name) {
                var deferred = $q.defer();

                /* if the data has already been fetched, we should just store that locally
                 */

                if (cached) {
                    console.log("cache hit!");
                    resolve(deferred, name);
                } else {
                    // load and cache the rules
                    console.log("cache not hit!");

                    $http.get(Endpoints.togglesConfigUrl)
                        .success(function (data, status, headers) {
                            cached = true;
                            rules = data;
                            resolve(deferred, name);
                        });
                }

                return deferred.promise;
            }
        };
    });
