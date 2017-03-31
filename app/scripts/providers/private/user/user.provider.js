'use strict';
angular.module('saintApp').provider('UserService', [function () {
  var userImplementation = {
    data: {list: [], groups: [], 'oUser': {}}
  };
  userImplementation.createUserObject = function (tempObject) {
    var userObject = {};//FIXME this json should be userEntity
    userObject.name = tempObject.UserNAME;
    userObject.groupKey = tempObject.groupID;
    userObject.userName = tempObject.UserNAME;
    userObject.firstName = tempObject.FIrstName;
    userObject.lastName = tempObject.LastName;
    userObject.userId = tempObject.UserID;
    userObject.email = tempObject.Email;
    userObject.boeToken = tempObject.boeToken;
    userObject.roles = [];
    userObject.privileges = [];
    for (var key in tempObject.Roles) {
      userObject.roles.push(tempObject.Roles[key].ROLE_NAME);
    }
    userObject.privileges = _.keys(_.pick(tempObject.privileges, function (value) {
      return _.isBoolean(value) && value;
    }));
    return userObject;
  };
  userImplementation.setUserObject = function (userObject) {
    userImplementation.data.oUser = userObject;
  };
  return {
    createUserObject: userImplementation.createUserObject,
    setUserObject: userImplementation.setUserObject,
    '$get': ['UserEntity', '$http', '$q', 'UrlService', 'alertService', 'LanguageService', 'ConstantService', 'logService', function (UserEntity, $http, $q, UrlService, AlertService, LanguageService, ConstantService, LogService) {
      var user = function (data) {
        angular.extend(this, data);
      };
      user.data = userImplementation.data;
      user.getGroups = function () {
        var deferred = $q.defer();
        $http.get(UrlService.getService('USER_ROLES'))
          .success(function (response) {
            try {
              var userRoles = response.d.results;
              userRoles = _.map(userRoles, function (object) {
                return {
                  'roleId': object.USER_GRP_KEY,
                  'roleName': object.USER_GRP_NAME,
                  'actualRoleName': object.DESCRIPTION,
                  'checked': false
                };
              });
              user.data.groups = userRoles;
              deferred.resolve({'data': userRoles, 'message': ''});
            } catch (e) {
              AlertService.warn(LanguageService.MESSAGES.FAILED_GET_PROJECT_USER_GROUPS);
              deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_PROJECT_USER_GROUPS});
            }
          })
          .error(function () {
            AlertService.warn(LanguageService.MESSAGES.FAILED_GET_PROJECT_USER_GROUPS);
            deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_PROJECT_USER_GROUPS});
          });
        return deferred.promise;
      };
      user.getGroupUsers = function (userGroup) {
        var deferred = $q.defer();
        var filter = '';
        if (userGroup) {
          filter = '&$filter=';
          for (var i = 0; i < userGroup.length; i++) {
            filter = filter + 'USER_GRP_KEY eq ' + userGroup[i].roleId;
            if (userGroup.length > 1 && i < userGroup.length - 1) {
              filter = filter + ' or ';
            }
          }
        }
        $http.get(UrlService.getService('ASSIGNED_USERS') + filter)
          .success(function (response) {
            try {
              var userNames = angular.copy(response.d.results);
              var requiredUsers = [];
              angular.forEach(userNames, function (userGroupValue) {
                angular.forEach(userGroupValue.UsersUsergroups.results, function (userValue) {
                  var actualObject = angular.copy(UserEntity);
                  actualObject.userName = userValue.USER_NAME;
                  actualObject.userKey = userValue.USER_KEY;
                  actualObject.userId = userValue.USER_ID; //Key field is undefined hence using ID
                  actualObject.checked = false;
                  actualObject.roles = [];
                  actualObject.groupKey = userGroupValue.USER_GRP_KEY;
                  requiredUsers.push(actualObject);
                });
              });
              deferred.resolve({'data': requiredUsers, 'message': ''});
            } catch (e) {
              AlertService.warn(LanguageService.MESSAGES.FAILED_GET_PROJECT_USERS_IN_GROUP);
              deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_PROJECT_USERS_IN_GROUP});
            }
          })
          .error(function () {
            AlertService.warn(LanguageService.MESSAGES.FAILED_GET_PROJECT_USERS_IN_GROUP);
            deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_PROJECT_USERS_IN_GROUP});
          });
        return deferred.promise;
      };
      user.getSession = function () {
        var deferred = $q.defer();
        $http.get(UrlService.getService('GET_USER_SESSION'))
          .success(function (response) {
            try {
              user.data.oUser = userImplementation.createUserObject(response);
              deferred.resolve({'data': angular.copy(user.data.oUser), 'message': ''});
            } catch (e) {
              deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_USER_SESSION});
            }
          })
          .error(function () {
            deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_GET_USER_SESSION});
          });
        return deferred.promise;
      };

      user.getUserGroups = function () {
        var deferred = $q.defer();
        $http.get(UrlService.getService('REPORT_USER_GROUPS'))
          .success(function (response) {
            try {
              var userRoles = response.d.results;
              userRoles = _.map(userRoles, function (object) {
                return {
                  'roleId': object.ROLE_ID,
                  'roleName': object.ROLE_NAME.split('::')[1],
                  'actualRoleName': object.ROLE_NAME,
                  'checked': false
                };
              });
              user.data.groups = userRoles;
              deferred.resolve({'data': userRoles, 'message': ''});
            } catch (e) {
              AlertService.warn(LanguageService.MESSAGES.FAILED_GET_PROJECT_USER_GROUPS);
              deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_PROJECT_USER_GROUPS});
            }
          })
          .error(function () {
            AlertService.warn(LanguageService.MESSAGES.FAILED_GET_PROJECT_USER_GROUPS);
            deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_PROJECT_USER_GROUPS});
          });
        return deferred.promise;
      };

      user.getLogoutToken = function () {
        var deferred = $q.defer();
        $http.get(UrlService.getService('LOGOUT_GET_TOKEN'))
          .success(function (response, status, headers) {
            try {
              LogService.log(response, status);
              var requiredToken = headers(ConstantService.X_CSRF_TOKEN);
              deferred.resolve({'data': requiredToken, 'message': ''});
            } catch (e) {
              AlertService.warn(LanguageService.MESSAGES.FAILED_GET_LOGOUT_TOKEN);
              deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_LOGOUT_TOKEN});
            }
          })
          .error(function () {
            AlertService.error(LanguageService.MESSAGES.FAILED_GET_LOGOUT_TOKEN);
            deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_LOGOUT_TOKEN});
          });
        return deferred.promise;
      };

      user.doLogout = function (token) {
        var deferred = $q.defer();
        var payload = {};
        payload[ConstantService.X_CSRF_TOKEN] = token;
        payload[ConstantService.X_CSRF_TOKEN_URL_KEY] = ConstantService.X_CSRF_TOKEN_URL;
        var headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        $http({
          'method': 'POST', 'url': UrlService.getService('LOGOUT_APPLICATION'), 'data': payload, 'headers': headers,
          transformRequest: function (obj) {
            var str = [];
            for (var p in obj) {
              str.push(window.encodeURIComponent(p) + '=' + window.encodeURIComponent(obj[p]));
            }
            return str.join('&');
          }
        })
          .success(function (response, status) {
            try {
              if ((status === 200 || status === 304) && (arguments[2]('x-sap-login-page').indexOf(ConstantService.X_CSRF_TOKEN_URL) > -1)) {
                deferred.resolve({'data': response, 'message': ''});
              } else {
                AlertService.warn(LanguageService.MESSAGES.FAILED_LOGOUT);
                deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_LOGOUT});
              }
            } catch (e) {
              AlertService.warn(LanguageService.MESSAGES.FAILED_LOGOUT);
              deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_LOGOUT});
            }
          })
          .error(function () {
            AlertService.error(LanguageService.MESSAGES.FAILED_LOGOUT);
            deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_LOGOUT});
          });
        return deferred.promise;
      };

      user.doSessionCleanup = function () {
        var deferred = $q.defer();
        var errorMessage = LanguageService.MESSAGES.FAILED_TO_DO_SESSION_CLEANUP;
        var url = UrlService.getService('SESSION_CLEANUP');
        $http.get(url)
          .success(function (result) {
            if (!result.error) {
              deferred.resolve({'data': result, 'message': ''});
            } else {
              AlertService.warn(errorMessage);
              deferred.resolve({'error': 'ok', 'message': errorMessage});
            }
          })
          .error(function () {
            AlertService.error(errorMessage);
            deferred.resolve({'error': 'ok', 'message': errorMessage});
          });
        return deferred.promise;
      };

      user.doBOELogoff = function () {
        var deferred = $q.defer();
        var headers = {'Accept': 'application/xml', 'X-SAP-LogonToken': window.decodeURIComponent(user.data.oUser.boeToken)};
        var url = UrlService.getBOEService('BOE_LOGOFF');
        $http({ 'method': 'POST', 'url': url, 'headers': headers})
          .success(function (response) {
            if (response !== null) {
              deferred.resolve({'data': response,'message':''});
            } else {
              deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_LOGOUT_TO_BOE});
            }
          })
          .error(function () {
            deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_TO_LOGOUT_TO_BOE});
          });
        return deferred.promise;
      };

      user.normalizeUserGroupInfo = function (userGroupInfo) {

        var normalizedUserGroup = [];
        var tempObj;
        _.each(userGroupInfo, function (element) {
          _.extend(element, {consolidatedGroup: [element.USER_GRP_KEY]});
        });

        for (var i = 0; i < userGroupInfo.length; i++) {
          tempObj = _.findWhere(normalizedUserGroup, {
              'USER_KEY': userGroupInfo[i].USER_KEY,
              'TYPE': ConstantService.USER_ENTITY
            }
          );

          if (tempObj) {
            normalizedUserGroup = _.without(normalizedUserGroup, tempObj);
            tempObj.consolidatedGroup.push(userGroupInfo[i].USER_GRP_KEY);
            normalizedUserGroup.push(tempObj);
          } else {
            normalizedUserGroup.push(userGroupInfo[i]);
          }
        }
        return normalizedUserGroup;
      };

      user.getUserGroupInfo = function () {
        var deferred = $q.defer();
        var headers = {'content-type': 'application/json'};
        var errorMessage = LanguageService.MESSAGES.FAILED_TO_GET_USER_GROUP_INFO;
        var url = UrlService.getService('GET_USER_GROUP');
        url += '?$orderby=TYPE desc';
        $http({ 'method': 'GET', 'url': url, 'headers': headers})
          .success(function (response) {
            if (response !== null) {
              var processedResponse = user.normalizeUserGroupInfo(response.d.results);
              user.data.userGroupInfo = {'data': processedResponse};
              deferred.resolve({'data': processedResponse});
            } else {
              AlertService.warn(errorMessage);
              deferred.resolve({'error': 'ok', 'message': errorMessage});
            }
          })
          .error(function () {
            AlertService.error(errorMessage);
            deferred.resolve({'error': 'ok', 'message': errorMessage});
          });
        return deferred.promise;
      };

      return user;
    }]
  };
}]);

