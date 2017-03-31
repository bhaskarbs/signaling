'use strict';
angular.module('saintApp').provider('UrlService', [function () {
  var _options = {
    'useFixture': false,
    'Environment': null
  };
  return {
    'setOptions': function (options) {
      if (options) {
        if (options.hasOwnProperty('useFixture')) {
          _options.useFixture = options.useFixture;
        }
        if (options.hasOwnProperty('Environment')) {
          _options.Environment = options.Environment;
        }
      }
    },
    '$get': function () {
      var url = function () {
      };

      url.fixtures = {
        'COUNTRY_CODES': 'fixtures/countrycodes.json',
        'SAMPLE_FILTER_DATA': 'fixtures/old-filters.json',
        'CASE_LIST_TRACKING': 'fixtures/caseListTracking.json',
        'QUERY_LIBRARY_TILES': 'fixtures/queryLibrary-tiles.json',
        'QUERY_LIBRARY_SORT': 'fixtures/queryLibrary-sort.json',
        'QUERY_LIBRARY_FILTER': 'fixtures/queryLibrary-filter.json',
        'SHARE_QUERY_LIBRARY': 'fixtures/selectedUserGroupInfo.json',
        //'GET_NOTIFICATIONS_LIST': 'fixtures/notification.json'
      };
      url.partials = {
        'LOGOUT': 'index.html',
        'APP': 'dashboard.html',
        'PROJECT_DETAILS': 'views/private/project/tooltip/projectDetails.html',
        'MANAGE_PROJECT_HEADER': 'views/private/project/manage/header.html',
        'MANAGE_PROJECT_STATE_SELECTION': 'views/private/project/manage/stateRepresentation.html',
        'MANAGE_PROJECT_NAVIGATION': 'views/private/project/manage/navigation.html',
        'LIBRARY_LIST': 'views/private/caselist/library/list.html',
        'LIBRARY_LIST_FILTER': 'views/private/caseListLibrary/filter.html',
        'SAVE_AS_CASE_LIST': 'views/private/caselist/manage/saveas.html',
        'GANTT_CHART_MONTH_VIEW': 'views/private/gantt/gantt-chart.html',
        'PROJECT_LIST_SECONDARY_NAVIGATION': 'views/private/project/list/navigation.html',
        'PROJECT_LIST_FILTER': 'views/private/project/list/filters.html',
        'CASE_LIST_DETAILS_ACTIONS': 'views/private/caselist/list/actions.html',
        'CASE_LIST_SOURCE_FILTERS': 'views/private/caselist/list/sourceFilters.html',
        'CASE_LIST_ANALYTICAL_FILTERS': 'views/private/caselist/list/analyticalFilters.html',
        'DASHBOARD_WORKSPACE': 'views/private/home/workspace.html',
        'DASHBOARD_METRICS': 'views/private/home/metrics-kpi.html',
        'DASHBOARD_LAUNCHPAD': 'views/private/home/launchpad.html',
        'CASE_LIST_LIBRARY_SECOND_NAVIGATION': 'views/private/caseListLibrary/secondaryNavigation.html',
        'CASE_LIST_LIBRARY_FILTER_SECTION': 'views/private/caseListLibrary/filtersBar.html',
        'CASE_LIST_LIBRARY_CASE_LISTS': 'views/private/caseListLibrary/caseListsSection.html',
        'CASE_LIST_DATA_VIEWS_NAVIGATION': 'views/private/caselist/dataviews/navigation.html',
        'CASE_LIST_DATA_VIEWS_AVAILABLE': 'views/private/caselist/dataviews/availableViewsList.html',
        'CASE_LIST_DATA_VIEWS_SELECTED': 'views/private/caselist/dataviews/selectedViewsList.html',
        'REGULATORY_REPORT_STATUS_CONFIRM': 'views/private/regulatory-report/detail/confirmMessage.html',
        'REGULATORY_REPORT_FILTERS': 'views/private/regulatory-report/library/filters.html',
        'REGULATORY_REPORT_SECONDARY_NAVIGATION': 'views/private/regulatory-report/navigation.html',
        'REGULATORY_REPORT_LIST': 'views/private/regulatory-report/library/list.html',
        'REGULATORY_REPORT_DETAIL_ACTIONS': 'views/private/regulatory-report/detail/actions.html',
        'REGULATORY_REPORT_DETAIL': 'views/private/regulatory-report/detail/details.html',
        'REGULATORY_REPORT_CASE_LIST_MANAGE': 'views/private/regulatory-report/detail/caseList.html',
        'CASE_LIST_DETAILS_NAVIGATION': 'views/private/case/details/navigation.html',
        'CASE_LIST_DETAILS_VIEW': 'views/private/case/details/details.html',
        'CASE_LIST_CASE_ANNOTATION_VIEW': 'views/private/case/details/annotation.html',
        'CASE_LIST_SUMMARY_VIEW': 'views/private/case/details/summary.html',
        'CASE_LIST_EVENTS_VIEW': 'views/private/case/details/events.html',
        'CASE_LIST_SUSPECT_PRODUCTS_VIEW': 'views/private/case/details/suspect-products.html',
        'CASE_LIST_SUBMISSION_HISTORY_VIEW': 'views/private/case/details/submission-history.html',
        'CASE_LIST_NARRATIVE_VIEW': 'views/private/case/details/narrative.html',
        'OPERATIONAL_DASHBOARD_VIEW': 'views/private/operational-dashboard/navigation.html',
        /*'OPERATIONAL_DASHBOARD_COMPLIANCE':'views/private/operational-dashboard/compliance.html',
         'OPERATIONAL_DASHBOARD_PRODUCTIVITY':'views/private/operational-dashboard/productivity.html',
         'OPERATIONAL_DASHBOARD_USER_DEFINED':'views/private/operational-dashboard/userDefined.html',*/
        'REPORT_BASIC_DETAILS': 'views/private/reports-library/create-report/report-basic-details.html',
        'REPORT_DETAILS': 'views/private/reports-library/create-report/report-details.html',
        'REPORT_MILESTONES': 'views/private/reports-library/create-report/milestones.html',
        'REPORT_SIGNALING': 'views/private/reports-library/create-report/signaling.html',
        'REPORT_CONFIRMATION': 'views/private/reports-library/create-report/report-confirmation.html',
        'OPERATIONAL_DASHBOARD_LEFT_PANEL_COMPLIANCE': 'views/private/operational-dashboard/left-panel-compliance.html',
        'OPERATIONAL_DASHBOARD_LEFT_PANEL_PRODUCTIVITY': 'views/private/operational-dashboard/left-panel-productivity.html',
        'OPERATIONAL_DASHBOARD_LEFT_PANEL_USERDEFINED': 'views/private/operational-dashboard/left-panel-user-defined.html',
        'OPERATIONAL_DASHBOARD_LEFT_PANEL': 'views/private/operational-dashboard/left-panel.html',
        'OPERATIONAL_DASHBOARD_RIGHT_PANEL': 'views/private/operational-dashboard/right-panel.html',
        'ADHOC_ANALYSIS_NAVIGATION': 'views/private/adhoc-analysis/navigation.html',
        'ADHOC_ANALYSIS_LEFT_PANEL': 'views/private/adhoc-analysis/left-panel.html',
        'ADHOC_ANALYSIS_RIGHT_PANEL': 'views/private/adhoc-analysis/right-panel.html',
        'MANAGE_METRICS_VIEW': 'views/private/manage-metrics/navigation.html',
        'MANAGE_METRICS_SELECTED_CHARTS': 'views/private/manage-metrics/selectedCharts.html',
        'MANAGE_METRICS_KPI': 'views/private/manage-metrics/kpiCharts.html',
        'REPORTS_LIBRARY_REPORT_PANEL_VIEW': 'views/private/reports-library/report-panel/report-panel.html',
        'REPORTS_LIBRARY_FILTER_SORT_PANEL_VIEW': 'views/private/reports-library/filter-sort-panel/index.html',
        'REPORTS_LIBRARY_TILE_PANEL_VIEW': 'views/private/reports-library/tile-panel/index.html',
        'REPORTS_LIBRARY_FILTER_PANEL_VIEW': 'views/private/reports-library/filter-sort-panel/filter/index.html',
        'REPORTS_LIBRARY_SORT_PANEL_VIEW': 'views/private/reports-library/filter-sort-panel/sort/index.html',
        'REPORTS_LIBRARY_SECONDARY_NAVIGATION': 'views/private/reports-library/navigation/reports-library-navigation.html',
        'REPORTS_STATUS_FILTER_VIEW': 'views/private/reports-library/filter-sort-panel/filter/status-filter.html',
        'REPORTS_LIBRARY_TILE_VIEW': 'views/private/reports-library/tile-panel/tile-template.html',
        'CREATE_REPORT': 'views/private/reports-library/create-report/create-report.html',
        'REPORTS_DATE_FILTER_VIEW': 'views/private/reports-library/filter-sort-panel/filter/date-filter.html',
        'CASE_LIST_LIBRARY_SECONDARY_NAVIGATION': 'views/private/case-list-library/navigation/case-list-library-navigation.html',
        'CASE_LIST_LIBRARY_FILTER_SORT_PANEL_VIEW': 'views/private/case-list-library/filter-sort-panel/filter-sort-panel.html',
        'CASE_LIST_LIBRARY_TILE_PANEL_VIEW': 'views/private/case-list-library/tilePanel/tile-panel.html',
        'CASE_LIST_LIBRARY_FILTER_PANEL_VIEW': 'views/private/case-list-library/filter-sort-panel/filter/filter-panel.html',
        'CASE_LIST_LIBRARY_SORT_PANEL_VIEW': 'views/private/case-list-library/filter-sort-panel/sort/sort-panel.html',
        'CASE_LIST_LIBRARY_TILE_VIEW': 'views/private/case-list-library/tilePanel/tile-template.html',
        'CASE_LIST_NAVIGATION': 'views/private/case-list-library/case-list-view/navigation.html',
        'CASE_LIST_COUNT_DETAILS': 'views/private/case-list-library/case-list-view/header/count-details.html',
        'CASE_LIST_ADVANCED_QUERY': 'views/private/case-list-library/case-list-view/display-query/display-query.html',
        'CASE_LIST_TABLE_VIEW': 'views/private/case-list-library/case-list-view/table-view/tableview.html',
        'CASE_LIST_VISUAL_VIEW': 'views/private/case-list-library/case-list-view/visual-view/visual.html',
        'CASE_LIST_DATA_VIEW':'views/private/case-list-library/case-list-view/data-view/index.html',
        'EXCLUDE_VIEW': 'views/private/case-list-library/case-list-view/table-view/cases/exclude.html',
        'INCLUDE_VIEW': 'views/private/case-list-library/case-list-view/table-view/cases/include.html',
        'CASE_TRACK_VIEW': 'views/private/case-list-library/case-list-view/table-view/cases/track.html',
        'CASE_LIST_DATE_FILTER_VIEW': 'views/private/case-list-library/filter-sort-panel/filter/date-filter.html',
        'CASES_HEADER': 'views/private/case-list-library/case-list-view/header/cases-header.html',
        'GANTT_CHART_EXPANDED_REPORT': 'views/private/reports-library/report-panel/report-panel.html',
	      'MILESTONE_POPOVER_GANTT_CHART': 'views/private/gantt/milestone-popover/milestone-popover.html',
        'MILESTONE_POPOVER_REPORT_SUMMARY': 'views/private/reports-library/report-panel/milestone-popover-summary.html',
        'DATE_SUBMITTED_POPOVER':'views/private/reports-library/report-panel/date-submitted-popover/date-submitted-popover.html',
        'QUERY_BUILDER_DIRECTIVE_TEMPLATE': 'views/private/query-builder/query-builder.html',
        'QUERY_LIBRARY_SECONDARY_NAVIGATION': 'views/private/query-library/navigation/query-library-navigation.html',
        'QUERY_LIBRARY_BUILDER_SECONDARY_NAVIGATION': 'views/private/query-library/query-builder/navigation/query-builder-navigation.html',
        'QUERY_LIBRARY_BUILDER_SECONDARY_HEADER': 'views/private/query-library/query-builder/header/query-header.html',
        'QUERY_LIBRARY_BUILDER_ADVANCED_QUERY': 'views/private/query-library/query-builder/advanced-query/advanced-query.html',
        'QUERY_LIBRARY_BUILDER_SAVE_QUERY': 'views/private/query-library/query-builder/save-query/save-query.html',
        'QUERY_LIBRARY_BUILDER_SHARE_QUERY': 'views/private/query-library/query-builder/share-query/share-query.html',
        'QUERY_LIBRARY_BUILDER_ERROR_SAVE_QUERY': 'views/private/query-library/query-builder/save-query/error-save-query.html',
        'QUERY_LIBRARY_DELETE_QUERY':'views/private/query-library/tile-panel/delete-query/delete-query.html',
        'QUERY_LIBRARY_FILTER_SORT_PANEL_VIEW': 'views/private/query-library/filter-sort-panel/filter-sort-panel.html',
        'QUERY_LIBRARY_FILTER_PANEL_VIEW': 'views/private/query-library/filter-sort-panel/filter/filter-panel.html',
        'QUERY_LIBRARY_SORT_PANEL_VIEW': 'views/private/query-library/filter-sort-panel/sort/sort-panel.html',
        'QUERY_LIBRARY_TILE_PANEL_VIEW': 'views/private/query-library/tile-panel/tile-panel.html',
        'QUERY_LIBRARY_TILE_VIEW': 'views/private/query-library/tile-panel/tile-template.html',
        'QUERY_LIBRARY_BREADCRUMB_VIEW': 'views/private/query-library/filter-breadcrumbs/filter-breadcrumbs.html',
        'SAVE_CASE_LIST_MODAL':'views/private/case-list-library/case-list-view/header/save-case-list-modal.html',
        'ANALYSIS' : 'views/private/analysis/index.html',
        'ANALYSIS_ADHOC' : 'views/private/analysis/adhoc/index.html',
        'ANALYSIS_OPEN' : 'views/private/analysis/open/index.html',
        'GENERATE_REPORT': _options.Environment.saintContext+'/views/private/reports-library/report-panel/generate-report/generate-report.html',
        'REPORT_LIBRARY_REPORT_DELETE': 'views/private/reports-library/tile-panel/report-delete.html',
        'ANALYSIS_LIBRARY' : 'views/private/analysis/library/index.html',
        'LIST_TAGS' : 'views/private/case/details/list-tags.html',
        'DATA_VIEW_CANCEL_MODAL':'views/private/case-list-library/case-list-view/data-view/cancel-milestone-modal/data-view-cancel-modal.html',
        'INSERT_QUERY_MODAL_VIEW' : 'views/private/query-builder/query-library/query-library-modal.html',
        'SHARE_CASE_LIST': 'views/private/case-list-library/case-list-view/share-case-list/share-case-list.html',
        'QUERY_BUILDER_SAVE_QUERY': 'views/private/case-list-library/case-list-view/query-builder/save-query/save-query.html',
        'QUERY_BUILDER_ERROR_SAVE_QUERY': 'views/private/case-list-library/case-list-view/query-builder/save-query/error-save-query.html',
        'FILTER_NOTIFICATION': 'views/private/notification/notification-filter-panel/index.html',
        'NOTIFICATION_PANEL':'views/private/notification/notification-panel/index.html',
        'NOTIFICATION_SECONDARY_NAVIGATION':'views/private/notification/navigation/secondary-navigation.html',
        'NOTIFICATION_RIGHT_PANEL' : 'views/private/notification/notification-right-panel/index.html',
        'NOTIFICATION_POPOVER':'views/private/notification/notification-modal.html',
        'SET_OPERATIONS_CONFIRM_DELETE':'views/private/case-list-library/case-list-view/query-builder/setOperation/delete-query-modal.html',
        'FILTER_VIEW_CASELIST_MODAL':'views/private/report-output/report-output-case-list/filter-view-modal.html',
        'DEFAULT_VIEW_CASELIST_MODAL':'views/private/report-output/report-output-case-list/default-view-modal.html',
        'REPORT_OUTPUT_TILE_PANEL': 'views/private/report-output/report-output-case-list/tile-panel.html',
        'REPORT_OUTPUT_TILE_TEMPLATE': 'views/private/report-output/report-output-case-list/tile-template.html',
        'SAVE_REPORT_OUTPUT_MODAL':'views/private/report-output/save-report-output-modal.html'
      };
      url.services = {
        'USER_ROLES': _options.Environment.backendHanaContext + '/reports/ReportsService.xsodata/UserGroups?$format=json',
        'ASSIGNED_USERS': _options.Environment.backendHanaContext + '/reports/ReportsService.xsodata/UserGroups?$format=json&$expand=UsersUsergroups',
        'REPORT_LIST': _options.Environment.backendHanaContext + '/reports/ReportsService.xsodata/ReportTypes?$format=json',
        'CREATE_PROJECT': _options.Environment.backendHanaContext + '/saint/services/xsjs/addproj.xsjs',
        'UPDATE_PROJECT': _options.Environment.backendHanaContext + '/saint/services/xsjs/editproj.xsjs',
        'GET_USER_SESSION': _options.Environment.backendHanaContext + _options.Environment.userInfoService,
        'WORKSPACE_COUNTS': _options.Environment.backendHanaContext + '/common/CommonService.xsodata/Dashboard?$format=json',
        'FILTER_BY_CATEGORY': _options.Environment.backendHanaContext + '/reports/ReportsService.xsodata/ReportDetailsFilterParameters(IN_DESCRIPTION=\'\')/Results',
        'OPEN_DOCUMENT_ANALYSIS': _options.Environment.boeContext + '/OpenDocument/opendoc/openDocument.jsp',
        'GET_SAVED_LUMIRA_IDS': _options.Environment.backendHanaContext + '/common/CommonService.xsodata/LumiraDetails',
        'GET_INGREDIENTS': _options.Environment.backendHanaContext + '/reports/ReportsService.xsodata/Ingredients?$format=json&$expand=productsList/Licenses',
        'LOGOUT_GET_TOKEN': _options.Environment.backendSapContext + '/hana/xs/formLogin/token.xsjs?X-CSRF-Token=Fetch&x-sap-origin-location=/sap/hana/xs/formLogin/',
        'LOGOUT_APPLICATION': _options.Environment.backendSapContext + '/hana/xs/formLogin/logout.xscfunc',
        'GET_CASES_COUNT': _options.Environment.backendHanaContext + '/caselist/CaseCounts.xsjs?BCL_KEY=',
        'INCLUDE_EXCLUDE_CASES': _options.Environment.backendHanaContext + '/caselist/BclIncludeExclude.xsjs',
        'INCLUDE_SELECT_CASE': _options.Environment.backendHanaContext + '/caselist/CaselistService.xsodata/SelectCase',
        'CASES_UPLOAD': _options.Environment.backendHanaContext + '/caselist/CaseFileUpload.xsjs',
        'CASE_LIST_TABLE_VIEW': _options.Environment.backendHanaContext + '/caselist/CaselistService.xsodata/TableViewParameters(IN_BCL_KEY=',
        'GET_ALL_CASES_LIST': _options.Environment.backendHanaContext + '/caselist/CaselistService.xsodata/CaseListDetailsParameters(IN_BCL_KEY=',
        'REPORT_GENERATION': _options.Environment.backendHanaContext + '/xsjs/crystal/GenerateReport.xsjs?reportKey=',
        'REPORT_TILE_LIBRARY': _options.Environment.backendHanaContext + '/reports/ReportLibrary.xsjs',
        'REPORT_FILTER_CONFIGURATION': _options.Environment.backendHanaContext + '/common/CommonService.xsodata/Configurations',
        'GET_MASTER_REPORT_STATUS': _options.Environment.backendHanaContext + '/reports/ReportDetailsPanel.xsodata/ReportStatusList?$format=json',
        'REPORT_PANEL_LIST': _options.Environment.backendHanaContext + '/reports/ReportDetailsPanel.xsodata/ReportDetails?$format=json&$expand=ReportAssignees,ReportMilestones/MilestoneAssignees,ReportIngredients/ReportIngredientProducts,IngredientsLicense/ReportIngredientLicenses,ReportSetQuery,ReportPackage&$filter=RPT_KEY eq ',
        'REPORT_MILESTONE_SAVE': _options.Environment.backendHanaContext + '/reports/MilestoneStatusUpdate.xsjs',
        'PERSISTED_USER_DATA': _options.Environment.backendHanaContext + '/common/CommonService.xsodata/UserPreferences',
        'GET_CASE_LIST_LIBRARY': _options.Environment.backendHanaContext + '/caselist/CaselistService.xsodata/CaseListLibraryParameters(IN_TEXT_SEARCH=\'\',IN_DESCRIPTION=\'\')/Results',
        'SAVE_CREATED_REPORT': _options.Environment.backendHanaContext + '/reports/CreateReport.xsjs',
        'CASELIST_FILTER_BY_CATEGORY': _options.Environment.backendHanaContext + '/caselist/CaselistService.xsodata/CaseListLibraryParameters(IN_DESCRIPTION=\'',
        'CASE_LIST_LIBRARY_TILE_DATA': _options.Environment.backendHanaContext + '/caselist/CaselistLibrary.xsjs',
        'CASELIST_DEFAULT_FILTER':_options.Environment.backendHanaContext +'/caselist/CaselistService.xsodata/CaseListLibraryParameters',
        'SAVE_EDITED_REPORT': _options.Environment.backendHanaContext + '/reports/EditReport.xsjs',
        'DATE_FLAG_PARAMS': _options.Environment.backendHanaContext + '/caselist/CaselistService.xsodata/DateFlagsParameters(IN_BCL_KEY=',
        'GANTT_CHART_DATA': _options.Environment.backendHanaContext + '/reports/ReportsService.xsodata/ReportDetailsFilterParameters(IN_DESCRIPTION=\'\')/Results?$format=json&$expand=ReportMilestones/MilestoneAssignees',
        'UPDATE_REPORT_STATUS': _options.Environment.backendHanaContext + '/reports/edit/ReportEdit.xsodata',
        'COMPARATOR_PERIOD_DATA': _options.Environment.backendHanaContext + '/reports/ReportsService.xsodata/ComparatorPeriod',
        'SAVE_ANNOTATIONS': _options.Environment.backendHanaContext + '/caselist/CaseAnnotationTags.xsjs',
        'CASE_LIST_FILTER_DETAILS': _options.Environment.backendHanaContext + '/querybuilder/CaselistFilterDetails.xsjs?',
        'CASE_LIST_TRACKING': _options.Environment.backendHanaContext + '/caselist/CaselistService.xsodata/CaseListTracking',
        // Will remove commented code after testing
        //'CHART_DIMENSIONS': _options.Environment.backendHanaContext + '/caselist/CaselistService.xsodata/ChartDimensions',
        'CHART_DIMENSIONS': _options.Environment.backendHanaContext + '/caselist/CaselistService.xsodata/ChartDimensionsParameters(IN_BCL_KEY=',
        'CASENAME_FILTERQUERY': _options.Environment.backendHanaContext + '/caselist/CaselistService.xsodata/FilterQueryStringParameters(BCL_KEY=',
        'CREATE_CASE_LIST': _options.Environment.backendHanaContext + '/querybuilder/CaseListManagement.xsjs',
        'OPERATOR_INFO': _options.Environment.backendHanaContext + '/querybuilder/QueryBuilderService.xsodata/OperatorInfo?$format=json',
        'DIMENSION_INFO': _options.Environment.backendHanaContext + '/querybuilder/QueryBuilderService.xsodata/DimensionInfo?$format=json&$orderby=COLUMN_LABEL',
        'LOV_SERVICE': _options.Environment.backendHanaContext + '/querybuilder/LOV.xsjs',
        'SESSION_CLEANUP': _options.Environment.backendHanaContext + '/common/SessionCleanup.xsjs',
        'BOE_INFOSTORE':_options.Environment.boeRestContext + '/infostore',
        'UPDATE_REPORT_MODE':_options.Environment.backendHanaContext + '/reports/ReportDetailsPanel.xsodata/UpdateStatusMode',
        'UPDATE_CASELIST': _options.Environment.backendHanaContext + '/querybuilder/CaseListManagement.xsjs',
        'CASE_LIST_DETAILS': _options.Environment.backendHanaContext + '/querybuilder/CaseListManagement.xsjs?data=',
        'GET_QUERY_LIBRARY': _options.Environment.backendHanaContext + '/querylibrary/querylist.xsodata/QueryDetailsFilterParameters',
        'GET_QUERY_LIBRARY_SEARCH': _options.Environment.backendHanaContext + '/querylibrary/querylist.xsodata/SearchQueryParameters',
        'REPORT_PACKAGE_TEMPLATE': _options.Environment.backendHanaContext + '/reports/ReportPackage.xsodata/ReportCategory?$format=json&$expand=SubReports',
        'REPORT_LIST_UPDATE': _options.Environment.backendHanaContext + '/xsjs/crystal/AddCustomerReports.xsjs',
        'BOE_LOGOFF': _options.Environment.boeRestContext + '/logoff',
        'EXPORT_EXCEL':_options.Environment.backendHanaContext + '/caselist/CaselistExportCSV.xsjs',
        'QUERY_LIBRARY_BUILDER_CREATE': _options.Environment.backendHanaContext + '/querylibrary/QueryManagement.xsjs',
        'SHARE_QUERY_LIBRARY': _options.Environment.backendHanaContext + '/querylibrary/ShareQuery.xsjs',
        'SHARE_CASE_LIST': _options.Environment.backendHanaContext + '/caselist/ShareCaselist.xsjs',
        'GET_USER_GROUP': _options.Environment.backendHanaContext + '/common/CommonService.xsodata/Assignees',
        'GET_CASE_ANNOTATION': _options.Environment.backendHanaContext + '/caselist/CaselistService.xsodata/CaseAnnotationTag?$expand=CaseAnnotationTag&$format=json&$filter=FK_CASE_KEY%20eq%20',
        'GET_ALL_TAGS': _options.Environment.backendHanaContext + '/caselist/CaselistService.xsodata/ListCaseTags',
        'DELETE_QUERY': _options.Environment.backendHanaContext + '/querylibrary/QueryManagement.xsjs?',
        'DELETE_REPORT':  _options.Environment.backendHanaContext + '/reports/delete/ReportDelete.xsodata/DeleteReport',
        'SAVING_DATA_VIEW': _options.Environment.backendHanaContext +'/caselist/DataViews.xsjs',
        'DASHBOARD_LIBRARY_READ': _options.Environment.backendHanaContext + '/common/CommonService.xsodata/dashlibrary?$format=json&$expand=dashboardSummary',
        'DASHBOARD_LIBRARY_DATA_REFRESHED_ON': _options.Environment.backendHanaContext + '/common/CommonService.xsodata/LastUpdated?$format=json&$orderby=ETL_TIMESTAMP%20desc&$top=1&$select=ETL_TIMESTAMP',
        'GET_NOTIFICATION_FILTER_LIST': _options.Environment.backendHanaContext + '/common/CommonService.xsodata/Configurations?$filter=CONFIG_TYPE%20eq%20%27FILTER%27%20and%20SCREEN_NAME%20eq%20%27NOTIFICATION_CENTER%27%20and%20VALUE%20eq%201&$format=json',
        'GET_NOTIFICATIONS_COUNT': _options.Environment.backendHanaContext + '/notification/NotificationService.xsodata/EventNotifications?$format=json&$filter=IS_READ%20eq%20%200&$inlinecount=allpages&$select=EVENT_NOTIFICATION_DETAILS_KEY',
        'GET_NOTIFICATIONS_IS_READ': _options.Environment.backendHanaContext + '/notification/UpdateIsReadFlag.xsjs',
        'GET_NOTIFICATIONS_LIST' : _options.Environment.backendHanaContext + '/notification/NotificationService.xsodata/EventNotifications?$orderby=CREATED_ON%20desc',
        'GET_NOTIFICATIONS_FILTER_LIST' : _options.Environment.backendHanaContext + '/notification/NotificationService.xsodata/EventNotifications',
        'GET_MILESTONE_ASSIGNEES_GANTT':_options.Environment.backendHanaContext +'/reports/ReportDetailsPanel.xsodata/Milestones',
        'CALL_OVERDUE_NOTIFICATION_SERVICE' : _options.Environment.backendHanaContext + '/notification/NotificationJob.xsjs',
        'NOTIFICATION_POLLING_SERVICE':_options.Environment.backendHanaContext +'/notification/NotificationService.xsodata/EventNotifications?$format=json&$filter=IS_READ%20eq%20%200&$inlinecount=allpages&$select=EVENT_NOTIFICATION_DETAILS_KEY',
        'SAVE_REPORT_OUTPUT' :_options.Environment.backendHanaContext +'/reports/SaveReportPkgService.xsjs'
};
      url.getService = function (urlKey, queryParams) {
        var temp = '';
        if (_options.useFixture) {
          temp = url.fixtures[urlKey];
        } else {
          temp = url.services[urlKey];
          if (!(temp === null || temp === undefined)) {
            temp = _options.Environment.apiEndpoint + temp;


            var tempAppend = '';
            angular.forEach(queryParams, function (value, key) {
              tempAppend += (key + '=' + value + '&');
            });
            if (tempAppend.length !== 0) {
              temp += '?';
              temp += tempAppend;
              temp = temp.substring(0, temp.length - 1);
            }
          }
        }
        return angular.copy(temp);
      };
      url.getBOEService = function (urlKey, queryParams) {
        var temp = '';
        if (_options.useFixture) {
          temp = url.fixtures[urlKey];
        } else {
          temp = url.services[urlKey];
          if (temp) {
            temp = _options.Environment.boeEndpoint + temp;
            var tempAppend = '';
            angular.forEach(queryParams, function (value, key) {
              tempAppend += (key + '=' + value + '&');
            });
            if (tempAppend.length !== 0) {
              temp += '?';
              temp += tempAppend;
              temp = temp.substring(0, temp.length - 1);
            }
          }
        }
        return angular.copy(temp);
      };

      url.getView = function (partialkey) {
        return angular.copy(url.partials[partialkey]);
      };
      url.getFixture = function (fixtureKey) {
        return angular.copy(url.fixtures[fixtureKey]);
      };
      return url;
    }
  };
}]);
