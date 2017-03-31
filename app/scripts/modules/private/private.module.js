'use strict';

/**
 * @ngdoc overview
 * @name saintApp
 * @description
 * # saintApp
 *
 * Main module of the application.
 */
angular
    .module('saintApp', ['ui.date', 'ngLocalize', 'angularUtils.directives.dirPagination', 'saint-config', 'ui.router', 'ui.bootstrap', 'icomps', 'ngynSelect2', 'gantt', 'ngTouch', 'ui.select', 'saint-authorize', 'as.sortable', 'angularTreeview', 'common.providers', 'ui.tree'])
    .config(['$stateProvider', '$urlRouterProvider', 'UrlServiceProvider', 'logServiceProvider', 'CookieServiceProvider', 'Environment', '$httpProvider', 'XHRInterceptProvider', 'AuthorizeServiceProvider', 'ConstantServiceProvider', 'UserServiceProvider', function($stateProvider, $urlRouterProvider, UrlServiceProvider, logServiceProvider, CookieServiceProvider, Environment, $httpProvider, XHRInterceptProvider, AuthorizeServiceProvider, ConstantServiceProvider, UserServiceProvider) {
        var ConstantService = ConstantServiceProvider.$get();
        var STATES = ConstantService.STATE;
        var URLS = ConstantService.URL;
        var PARAMS = ConstantService.PARAMS;

        //configure the global http provider to prevent caching
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get.Pragma = 'no-cache';

        AuthorizeServiceProvider.setOptions(
            (function() {
                var oUser = UserServiceProvider.createUserObject(window.saint.userObject);
                UserServiceProvider.setUserObject(oUser);
                var temp = angular.copy(oUser.privileges);
                delete window.saint;
                return { privileges: temp };
            })()
        );
        $httpProvider.defaults.cache = false;
        $httpProvider.interceptors.push(XHRInterceptProvider.isSessionValid());
        CookieServiceProvider.setCookieParsing();
        UrlServiceProvider.setOptions({ 'useFixture': false, 'Environment': Environment });
        CookieServiceProvider.setOptions({ 'Environment': Environment });
        XHRInterceptProvider.setOptions({ 'Environment': Environment });
        logServiceProvider.setLog(true);
        logServiceProvider.setLogLevel('INFO');
        $urlRouterProvider
            .otherwise('/home');
        var VIEWS = UrlServiceProvider.$get().partials;
        $stateProvider
            .state('main', {
                abstract: true,
                views: {
                    'headerNavigation@': {
                        templateUrl: 'views/private/header/header.html',
                        controller: 'HeaderController'
                    },
                    'footerNavigation@': {
                        templateUrl: 'views/private/footer/footer.html'
                    },
                    'actionTray@': {
                        templateUrl: 'views/private/actionTray/tray.html',
                        controller: 'ActionTrayController'
                    }
                }
            })
            .state('home', {
                parent: 'main',
                url: '/home',
                views: {
                    'main@': {
                        templateUrl: 'views/private/home/index.html',
                        controller: 'HomeController'
                    }
                }
            })
            .state('signaling', {
                parent: 'main',
                url: '/signaling',
                views: {
                    'main@': {
                        templateUrl: 'views/private/signaling/index.html'
                    }
                }
            })
            .state('signaling.validation', {
                parent: 'signaling',
                url: '/validation',
                views: {
                    'signalingView': {
                        templateUrl: 'views/private/signaling/validation/index.html'

                    }
                }
            })
            .state('signaling.dashboard', {
                parent: 'signaling',
                url: '/dashboard',
                views: {
                    'signalingView': {
                        templateUrl: 'views/private/signaling/dashboard/index.html',
                        controller: 'DashboardSignalingController'
                    }
                }
            })
            .state(STATES.ANALYSIS, {
                parent: STATES.MAIN,
                abstract: true,
                url: URLS.ANALYSIS,
                views: {
                    'main@': {
                        templateUrl: VIEWS.ANALYSIS
                    }
                }
            })
            .state(STATES.ANALYSIS_LIBRARY, {
                parent: STATES.ANALYSIS,
                url: URLS.LIBRARY,
                views: {
                    'AnalysisView': {
                        templateUrl: VIEWS.ANALYSIS_LIBRARY,
                        controller: 'DashboardLibraryController'
                    }
                },
                privilege: ConstantService.PRIVILEGES.ACCESS_DASHBOARD_LIBRARY
            })
            .state(STATES.ANALYSIS_ADHOC, {
                parent: STATES.ANALYSIS,
                url: URLS.ADHOC,
                views: {
                    'AnalysisView': {
                        templateUrl: VIEWS.ANALYSIS_ADHOC,
                        controller: 'AdhocAnalysisController'
                    }
                }
            })
            .state(STATES.ANALYSIS_OPEN, {
                parent: STATES.ANALYSIS,
                url: URLS.OPEN + '?' + PARAMS.OPEN_ANALYSIS_NAME + '&' + PARAMS.OPEN_ANALYSIS_TYPE + '&' + PARAMS.OPEN_ANALYSIS_ID + '&' + PARAMS.OPEN_ANALYSIS_REFRESH + '&' + PARAMS.OPEN_ANALYSIS_STORY + '&' + PARAMS.OPEN_ANALYSIS_PAGE + '&' + PARAMS.OPEN_ANALYSIS_CHART_TYPE + '&' + PARAMS.OPEN_ANALYSIS_LOGON_TOKEN,
                views: {
                    'AnalysisView': {
                        templateUrl: VIEWS.ANALYSIS_OPEN,
                        controller: 'OpenAnalysisController'
                    }
                }
            })
            .state('reportslibrary', {
                parent: 'main',
                url: '/reportslibrary',
                views: {
                    'main@': {
                        templateUrl: 'views/private/reports-library/index.html',
                        controller: 'ReportsLibraryController'
                    }
                }
            }).state('reportPackage', {
                parent: 'main',
                url: '/reportPackage?reports?key?collapse',
                views: {
                    'main@': {
                        templateUrl: 'views/private/report-output/build-report-package.html',
                        controller: 'BuildReportPackageController'
                    }
                }
            })
            /* caselist main state for all the Case List related code
             ** library state for List of case list
             ** view state will be common for visual and table
             ** visuals state for showing visuals/graphs
             ** table state to display cases in table format
             ** details state to display case details
             ** query state to display query builder
             ** manage state can be used for managing case list
             * */
            .state('caselist', {
                parent: 'main',
                url: '/caselist',
                abstract: true,
                views: {
                    'main@': {
                        templateUrl: 'views/private/case-list-library/index.html'
                    }
                }
            })
            .state('caselist.library', {
                parent: 'caselist',
                url: '/library',
                views: {
                    'caseListView': {
                        templateUrl: 'views/private/case-list-library/case-list-library.html',
                        controller: 'CaseListLibraryController'
                    }
                },
                privilege: ConstantService.PRIVILEGES.CASE_LIST_VIEW_LIBRARY
            })
            .state('caselist.manage', {
                parent: 'caselist'
            })
            .state('caselist.view', {
                parent: 'caselist',
                url: '/:id/:page/:pageMode',
                abstract: true,
                views: {
                    'caseListView': {
                        templateUrl: 'views/private/case-list-library/case-list-view/index.html',
                        controller: 'CasesController'
                    }
                }
            })
            .state('caselist.view.visuals', {
                parent: 'caselist.view',
                url: '/visuals',
                views: {
                    'casesView': {
                        templateUrl: 'views/private/case-list-library/case-list-view/visual-view/visual.html'
                    }
                },
                onExit: function() {
                    angular.element('.d3-tip').remove();
                },
                privilege: ConstantService.PRIVILEGES.CASE_LIST_VIEW
            })
            .state('caselist.view.query', {
                parent: 'caselist.view',
                url: '/query',
                views: {
                    'casesView': {
                        templateUrl: 'views/private/case-list-library/case-list-view/query-builder/query-builder.html'
                    }
                },
                privilege: ConstantService.PRIVILEGES.CASE_LIST_VIEW
            })
            .state('caselist.view.table', {
                parent: 'caselist.view',
                url: '/table',
                views: {
                    'casesView': {
                        templateUrl: 'views/private/case-list-library/case-list-view/table-view/tableview.html'
                    }
                },
                privilege: ConstantService.PRIVILEGES.CASE_LIST_VIEW
            })
            .state('caselist.view.details', {
                parent: 'caselist.view',
                url: '/details/:caseKey',
                views: {
                    'main@': {
                        templateUrl: 'views/private/case/details/case-list-details-index.html'
                    }
                },
                privilege: ConstantService.PRIVILEGES.CASE_LIST_VIEW
            })
            .state('reportslibrary.list', {
                url: '/list?persist&STATUS_NAME&DAYS_UNTIL_DUE&RPT_CAT_KEY',
                views: {
                    'listView': {
                        templateUrl: 'views/private/reports-library/report-list.html'
                    }
                },
                privilege: ConstantService.PRIVILEGES.REPORT_VIEW_LIBRARY
            })
            .state('reportslibrary.gantt', {
                url: '/gantt',
                views: {
                    'ganttView': {
                        templateUrl: 'views/private/reports-library/gantt-chart/gantt-index.html' //gantt-index.html
                    }
                }
            })
            .state('reportslibrary.gantt.chart', {
                url: '/chart',
                views: {
                    'chartView': {
                        templateUrl: 'views/private/reports-library/gantt-chart/gantt-view.html' //gantt-index.html
                    }
                }
            })
            .state('reportslibrary.gantt.report', {
                url: '/report',
                views: {
                    'reportView': {
                        templateUrl: 'views/private/reports-library/gantt-chart/report-view.html'
                    }
                }
            })
            .state('reportslibrary.report', {
                url: '/report/:id',
                views: {
                    'reportView': {
                        templateUrl: 'views/private/reports-library/gantt-chart/report-view.html'
                    }
                }
            })
            .state('query', {
                parent: 'main',
                url: '/query',
                abstract: true,
                views: {
                    'main@': {
                        templateUrl: 'views/private/query-library/index.html'
                    }
                }
            })
            .state('query.library', {
                parent: 'query',
                url: '/library',
                views: {
                    'queryListView': {
                        templateUrl: 'views/private/query-library/query-library.html',
                        controller: 'QueryLibraryController'
                    }
                },
                privilege: ConstantService.PRIVILEGES.QUERY_VIEW_LIBRARY
            })
            .state('query.library.builder', {
                parent: 'query',
                url: '/builder/:id/:pageMode',
                views: {
                    'queryListView': {
                        templateUrl: 'views/private/query-library/query-builder/query-builder.html',
                        controller: 'QueryLibraryBuilderController'
                    }
                }
            })
            .state('notification', {
                parent: 'main',
                url: '/notification',
                views: {
                    'main@': {
                        templateUrl: 'views/private/notification/index.html',
                        controller: 'NotificationController'
                    }
                }
            });
    }]).run(['SaintService', function(SaintService) {
        SaintService.initiateApplication();
    }]).run(['NotificationsPollingService', function(NotificationsPollingService) {
        NotificationsPollingService.fnInitializePoller();
    }]);
/* This is the initialization of the saintApp angular application*/
angular.element(document).ready(function() {
    window.saint = {};
    window.saint.ngModuleInjector = angular.injector(['ng']);
    window.saint.saintConfigModuleInjector = angular.injector(['saint-config']);
    window.saint.saintCommonProvidersModuleInjector = angular.injector(['common.providers']);
    window.saint.$http = window.saint.ngModuleInjector.get('$http');
    window.saint.Environment = window.saint.saintConfigModuleInjector.get('Environment');
    window.saint.CookieService = window.saint.saintCommonProvidersModuleInjector.get('CookieService');
    window.saint.fnHandleNoSession = function() {
        window.saint.CookieService.remove('application');
        window.location.href = window.saint.Environment.saintContext;
    };
    window.saint.$http.get(window.saint.Environment.apiEndpoint + window.saint.Environment.backendHanaContext + window.saint.Environment.userInfoService)
        .success(function(response) {
            try {
                //XXX Session validation is done by validating the below if condition
                if (response.hasOwnProperty('UserID') && response.UserID.length > 0 && response.hasOwnProperty('Email') && response.Email.length > 0 && response.hasOwnProperty('privileges')) {
                    window.saint.userObject = response;
                } else {
                    window.saint.fnHandleNoSession();
                }
            } catch (e) {
                window.saint.fnHandleNoSession();
            }
        })
        .error(function() {
            window.saint.fnHandleNoSession();
        })
        .then(function() {
            var boeSessionToken = window.saint.userObject.boeToken;

            if (boeSessionToken && boeSessionToken.length > 0) {
                angular.bootstrap(document, ['saintApp'], { strictDi: true });
            } else {
                window.saint.$http.get(window.saint.Environment.boeEndpoint + window.saint.Environment.boeRestContext + window.saint.Environment.boeSessionService)
                    .success(function(response) {
                        if (response && response.logonToken) {
                            window.saint.userObject.boeToken = angular.copy(window.encodeURIComponent(response.logonToken));
                            angular.bootstrap(document, ['saintApp'], { strictDi: true });
                        } else {
                            window.saint.fnHandleNoSession();
                        }
                    })
                    .error(function() {
                        window.saint.fnHandleNoSession();
                    });
            }
        });
});
