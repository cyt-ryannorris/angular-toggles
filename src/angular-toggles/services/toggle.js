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
                    // resolve against the existing cache
                    resolve(deferred, name);
                } else {
                    // load and cache the rules

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
