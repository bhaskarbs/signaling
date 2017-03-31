'use strict';
angular.module('saintApp').provider('ConstantService',[ function () {
  return {
    '$get': function () {
      var constant = function () {
      };
      constant.DELETE_REPORT_OCCURRENCE_OPTION = '1';
      constant.DELETE_REPORT_SERIES_OPTION = '2';
      constant.AFFWEBSERVICES_URL = 'affwebservices/public/saml2sso';
      constant.HOME = 'home';
      constant.HOME_URL = '/home';
      constant.MANAGE_METRICS = 'manageMetrics';
      constant.ADHOC_ANALYSIS = 'adhocAnalysisReport';
      constant.REGULATORY_REPORT_LIST = 'regulatoryReport.library';
      constant.REGULATORY_REPORT_MANAGE = 'regulatoryReport.manage';
      constant.REGULATORY_REPORT_CALENDAR = 'regulatoryReport.calendar';
      constant.NEW_CASE_LIST_STATE = 'case.add';
      constant.CASE_LIST_VISUAL_STATE = 'case.library.visuals';
      constant.CASE_LIST_VISUAL_URL = '/case/list/visuals';
      constant.CASE_LIST_TABLE_URL = '/case/list/table';
      constant.CASE_LIST_CREATE_URL = '/case/create';
      constant.GANTTVIEW = '/project/list/calendar';
      constant.PROJECT_LIST_URL = '/project/list/grid';
      constant.PROJECT_LIST_VIEW = 'project.list.grid';
      constant.PROJECT_CREATE_STATE = 'project.create.details';
      constant.PROJECT_CREATE_URL = '/project/create/details';
      constant.PROJECT_CREATE_TASKS_URL = '/project/create/tasks';
      constant.PROJECT_CREATE_MILESTONES_URL = '/project/create/milestones';
      constant.PROJECT_GANTT_VIEW = 'project.list.calendar';
      constant.DASHBOARDGANTTVIEW = '/regulatoryReport/calendar';
      constant.MANAGE_PROJECT_URL = '/project/';
      constant.CASE_PARENT_URL = '/cases/';
      constant.CASE_VISUALS_URL = '/visuals';
      constant.MANAGE_PROJECT_DETAILS_URL = '/details';
      constant.MANAGE_PROJECT_TASKS_URL = '/tasks';
      constant.MANAGE_PROJECT_MILESTONES_URL = '/milestones';
      constant.CASE_LIST_TABLE_VIEW = 'tableview';
      constant.URL_REGULATORY_REPORT_LIST = '/regulatoryReport/library';
      constant.X_CSRF_TOKEN = 'x-csrf-Token';
      constant.X_CSRF_TOKEN_URL_KEY = 'x-sap-origin-location';
      constant.X_CSRF_TOKEN_URL = '/sap/hana/xs/formLogin/';
      constant.REPORT_TYPE = 'CASE_REPORT_TYPE';
      constant.CASE_CLASSIFICATION = 'CLASSIFICATION_DESC';
      constant.COUNTRY_CODE_OF_REGION = 'COUNTRY_CODE_OF_ORIGIN';
      constant.COUNTRY_OF_INCIDENCE = 'COUNTRY_OF_INCIDENCE';
      constant.LABELLED_DESC = 'LABELLED_DESC';
      constant.FORMULATION_DESCRIPTION = 'FORMULATION_DESC';
      constant.D_CASE_SOURCE_TYPE = 'D_CASE_SOURCE_TYPE';
      constant.LICENSE_NBR = 'LICENSE_NBR';
      constant.CLASSIFICATION_DESC = 'CLASSIFICATION_DESC';
      constant.PATIENT_SEX_DESC = 'PATIENT_GENDER_DESC';
      constant.PT_DESC = 'PT_DESC';
      constant.GENDER_CODE = 'GENDER_CODE';
      constant.PREFERED_TERMS = 'PREFERED_TERMS';
      constant.STUDY_ID = 'STUDY_ID';
      constant.FEMALE_TEXT = 'Female';
      constant.MALE_TEXT = 'Male';
      constant.OTHERS_TEXT = 'Others';
      constant.GRAPH_GRAY_COLOR = '#CCCCCC';
      constant.GRAPH_GRAY_COLOR_IN_IE = '#cccccc';
      constant.BIPOLAR_LISTED_COLOR = '#1da54a';
      constant.GRAPH_WHITE_COLOR = '#ffffff';
      constant.BIPOLAR_UNLISTED_COLOR = '#1f77b4';
      constant.GRAPH_AVAILABLE_COLOR = '#007CAB';
      constant.GRAPH_AVAILABLE_COLOR_IE = '#007cab';
      constant.GRAPH_AVAILABLE_COLOR_RGB = 'rgb(0, 124, 171)';
      constant.GRAPH_ACTIVE_COLOR = '#dd8f1b';
      constant.GRAPH_ACTIVE_COLOR_IN_IE = '#dd8f1b';
      constant.IE_GRAPH_ACTIVE_COLOR = 'rgb(221,143,27)';
      constant.GRAPH_ACTIVE_COLOR_MALE='#7FCAFA';
      constant.GRAPH_AVAILABLE_COLOR_MALE='#007cab';
      constant.GRAPH_ACTIVE_COLOR_FEMALE='#D0D9AB';
      constant.GRAPH_AVAILABLE_COLOR_FEMALE='#1da54a';
      constant.GRAPH_ACTIVE_COLOR_OTHERS='#ffbf80';
      constant.GRAPH_AVAILABLE_COLOR_OTHERS='#f79722';
      constant.GRAPH_LEGEND_COLOR='#666666';
      constant.GRAPH_DISABLED_COLOR = 'rgb(204, 204, 204)';
      constant.OVERDUE = 'Overdue';
      constant.INPROGRESS = 'In-progress';
      constant.COMPLETED = 'Completed';
      constant.FINAL = 1;
      constant.DRAFT = 0;
      constant.OPEN = 'Open';
      constant.BLINDED = 'Blinded';
      constant.UNBLINDED = 'Unblinded';
      constant.LISTED = 'Listed';
      constant.UNLISTED = 'Unlisted';
      constant.PDF = 'pdf';
      constant.DATE_STRING = 'date';
      constant.DATE_STRING_TO = 'to';
      constant.XLSX = 'xlsx';
      constant.INPROGRESS_COLOR = '#F8971D';
      constant.OPEN_COLOR = '#265263';
      constant.COMPLETED_COLOR = '#18A634';
      constant.MILESTONE_WHITE_COLOR = '#ffffff';
      constant.MILESTONE_GREY_COLOR = '#999999';
      constant.OVERDUE_COLOR = '#E53A35';
      constant.Y_KEY = 'Y';
      constant.N_KEY = 'N';
      constant.CASE_LIST_TYPE_OPERATIONAL = 'Operational';
      constant.CASE_LIST_TYPE_REGULATORY = 'Regulatory';
      constant.CASE_LIBRARY_URL = '/case/library';
      constant.REPORT_TYPE_MAP_ID = 'CASE_REPORT_TYPE';
      constant.CASE_CLASSIFICATION_MAP_ID = 'CLASSIFICATION_DESC';
      constant.PRODUCT_FORMULATION_MAP_ID = 'FORMULATION_DESC';
      constant.GENDER_CODE_MAP_ID = 'GENDER_CODE';
      constant.STUDY_ID_MAP_ID = 'STUDY_ID';
      constant.COUNTRY_CODE_MAP_ID = 'COUNTRY_CODE_OF_ORIGIN';
      constant.PREFERED_TERMS_MAP_ID = 'PREFERED_TERMS';
      constant.LISTEDNESS_MAP_ID = 'LISTEDNESS';
      constant.PREGNANCY_MAP_ID = 'PREGNANCY';
      constant.LICENSE_MAP_ID = 'LICENSE';
      constant.DATA_MAPS_STATE = 'dataviews';
      constant.CASE_LIST_DIMENSIONS_STATE = 'case.dataviews';
      constant.CASE_LIST_DIMENSION_LOCKED = 'locked';
      constant.CASE_LIST_DIMENSION_SELECTED = 'selected';
      constant.AND = 'AND';
      constant.OR = 'OR';
      constant.PROJECT_IS_LICENSED = 'L';
      constant.CASE_LIST_FILTER_IS_ANALYTICAL = 'A';
      constant.CASE_LIST_FILTER_IS_SOURCE = 'S';
      constant.CASE_LIST_FILTER_IS_QUERY = 'Q';
      constant.CASE_LIST_BASE_CASELIST_KEY = 'BASE_CASELIST_KEY';
      constant.META_TAG_RESPONCE = '__metadata';
      constant.SELECT_REPORT_TYPE = 'Select Report Type';
      constant.REPORTS_LIBRARY_POPOVER_ID='reportsPanelScroll';
      constant.ONE_KEY = 1;
      constant.ZERO_KEY = 0;
      constant.NOT_IN_WORKFLOW = 'NOT IN WORKFLOW';
      constant.IN_WORKFLOW = 'IN WORKFLOW';
      constant.ONE = '1';
      constant.ZERO = '0';
      constant.OPERATIONAL_DASHBOARD_STATE = 'operationalDashBoard';
      constant.SUSPECT = 'suspect';
      constant.NO_VALUE = '--';
      constant.COUNTRY_CODE_OF_ORIGIN = 'COUNTRY_CODE_OF_ORIGIN';
      constant.REPORT_TYPE_VALUES = ['Clinical Trial', 'Literature Clinical Trial', 'Sponsored Trial', 'Compassionate Use', 'Report From Study'];
      constant.PRODUCT_NAME = 'product';
      constant.LICENCE_NAME = 'licence';
      constant.SELECT_ALL = 'Select All';
      constant.REGULATORY_REPORT_MODULE = 'R';
      constant.CASE_LIST_LIBRARY_MODULE = 'C';
      constant.STATUS_KEY = 'Status';
      constant.DB_STATUS_KEY = 'STATUS_NAME';
      constant.HIDDEN = 'HIDDEN';
      constant.COLLAPSED = 'COLLAPSED';
      constant.EXPANDED = 'EXPANDED';
      constant.FILTER_CATEGORY_NUMBER = 'number';
      constant.ALL_DATES = '_All Dates';

      constant.PRIVILEGES = {
        'SCHEDULING': 'Scheduling',
        'PROJECT_ADD': 'ProjectAdd',
        'PROJECT_EDIT': 'ProjectEdit',
        'PROJECT_GANTT_VIEW': 'ProjectGanttChart',
        'CASE_LIST': 'CaseList',
        'CASE_LIST_CREATE': 'CaseListCreate',
        'CASE_LIST_VIEW': 'CaseListView',
        'CASE_LIST_MANAGE_ANALYTICAL_FILTER': 'CaseListManageAnalyticalFilter',
        'CASE_LIST_MANAGE_SOURCE_FILTER': 'CaseListManageSourceFilter',
        'CASE_LIST_ADVANCE_QUERY': 'CaseListAdvancedQuery',
        'CASE_LIST_TABLE': 'CaseListVisualToTableView',
        'CASE_LIST_SEARCH_CASE': 'CaseListTableSearchCases',
        'CASE_LIST_INCLUDE_EXCLUDE_CASE': 'CaseListIncludeExcludeCases',
        'CASE_LIST_CASE_DETAIL': 'CaseListCaseDetail',
        'CASE_LIST_SAVE': 'CaseListSave',
        'CASE_LIST_EXPORT': 'CaseListExport',
        'CASE_LIST_ANALYSE': 'CaseListAnalyse',
        'CASE_LIST_ACCESS_MEDDRAB': 'CaseListAccessMedDRABrowser',
        'CASE_LIST_MANAGE_DATA_VIEWS': 'CaseListManageDataViews',
        'CASE_LIST_ANNOTATION': 'CaseListAnnotation',
        'CASE_LIST_VIEW_LIBRARY': 'CaseListViewLibrary',
        'CASE_LIST_VISUAL_FILTER': 'CaseListVisualFilter',
        'REGULATORY_REPORT': 'RegulatoryReports',
        'REGULATORY_REPORT_STATUS': 'RegulatoryReportStatusDropdown',
        'REGULATORY_REPORT_DESCRIPTION': 'RegulatoryReportDescription',
        'REGULATORY_REPORT_CASE_LIST_CREATE': 'RegulatoryReportCaseListCreate',
        'REGULATORY_REPORT_GENERATE': 'RegulatoryReportGenerate',
        'REGULATORY_REPORT_BLINDED_UNBLINDED': 'BlindedUnblindedtogglebutton',
        'OPERATIONAL_DASHBOARD_TILE': 'OperationalDashboardTile',
        'ADHOC_ANALYSIS_TILE': 'AdhocAnalysisTile',
        'MANAGE_METRICS_BUTTON': 'ManageMetricsButton',
        'REPORT_VIEW_LIBRARY':'ReportViewLibrary',
        'REPORT_MODIFY_STATUS':'ReportModifyStatus',
        'REPORT_GENERATE':'ReportGenerate',
        'REPORT_BLINDED_TOGGLE':'ReportBlindedTogggle',
        'REPORT_CREATE':'ReportCreate',
        'REPORT_EDIT':'ReportEdit',
        'REPORT_DELETE_OCCURANCE':'ReportDeleteOccurance',
        'REPORT_MARK_MILESTONE_AS_COMPLETED':'ReportMarkMilestoneAsCompleted',
        'REPORT_PACKAGE_CREATE_MODIFY':'ReportPackageCreateModify',
        'QUERY_VIEW_LIBRARY':'QueryViewLibrary',
        'QUERY_CREATE_MODIFY':'QueryCreateModify',
        'SHARE_CASE_LIST': 'CaseListShare',
        'QUERY_SHARE':'QueryShare',
        'ACCESS_DASHBOARD_LIBRARY': 'DashboardLibrary',
        'PUBLISH_DASHBOARD': 'DashboardPublish'
      };
      constant.REPORT_BLINDED = 'Blinded';
      constant.REPORT_UNBLINDED = 'Unblinded';
      constant.REPORT_STATUS_OPEN = 'Open';
      constant.REPORT_STATUS_IN_PROGRESS = 'In Progress';
      constant.REPORT_STATUS_COMPLETED = 'Completed';
      constant.REPORT_STATUS_FINAL = 'Final';
      constant.REPORT_STATUS_OVERDUE = 'Overdue';


      constant.CASE_VOLUME_BY_REGION = 'Case Volume by Region';
      constant.CASE_VOLUME_BY_SITE = 'Case Volume By Site';
      constant.SOURCE_ADHOC = 'ADHOC';
      constant.SOURCE_DASHBOARD = 'DASHBOARD';
      constant.RESPONSE_DATA = 'response_data';
      constant.RESPONSE_DATA_ID = 'hanalytic_id';
      constant.AUDIT_CREATED_DT = 'Audit.CreatedDt';
      constant.AUDIT_CREATED_BY = 'Audit.CreatedBy';
      constant.AUDIT_UPDATED_DT = 'Audit.UpdatedDt';
      constant.AUDIT_UPDATED_BY = 'Audit.UpdatedBy';
      constant.AUDIT_UPDATEDDT = 'Audit_UpdatedDt';
      constant.AUDIT_CREATEDDT = 'Audit_CreatedDt';
      constant.AUDIT_CREATEDBY='Audit_CreatedBy';
      constant.AUDIT_UPDATEDBY='Audit_UpdatedBy';

      constant.ICSR_CASE_VOLUME_BY_SITE ='ICSR Serious Case Volume by Site';
      constant.WORK_FLOW_CASE_VOLUME='ICSR Work Flow Case Volume';
      constant.PERIODIC_REPORT='Periodic Report Dashboard';


      //XXX new changes of constants for branching
      constant.MANAGE_REPORTS_SCREEN = 'MANAGE_REPORTS';
      constant.MANAGE_CASE_LIST_SCREEN = 'MANAGE_CASE_LIST';
      constant.MANAGE_CASE_LIST_SHARE = 'CASE_LIST_SHARE';
      constant.MANAGE_QUERY_LIBRARY_SCREEN = 'QUERY_LIBRARY';
      constant.GET_USER_PREFERENCE = 'GET_USER_PREFERENCE';
      constant.FILTER_STATUS_KEY = 'STATUS_NAME';
      constant.FILTER_DEFAULT = 'Status';
      constant.DB_KEY_DUE_DAYS = 'DAYS_UNTIL_DUE';
      constant.DB_KEY_REPORT_TYPE = 'RPT_TYPE_NAME';
      constant.DB_KEY_SUBMISSION_DUE_DATE = 'SUBMISSION_DUE_DATE';
      constant.REPORT_LIBRARY_DEFAULT_SORT_KEY = 'STATUS_KEY';
      constant.REPORT_LIBRARY_DEFAULT_SORT_NAME = 'Status';
      constant.CASE_LIST_LIBRARY_DEFAULT_SORT_KEY = 'BCL_NAME';
      constant.CASE_LIST_LIBRARY_DEFAULT_SORT_NAME = 'Case List Name';
      constant.ASCENDING = 'asc';
      constant.DESCENDING = 'desc';
      constant.FILTER_PARAM_SORT = 'SORT';
      constant.FILTER_PARAM_FILTER = 'FILTER';
      constant.FILTER_LIST_KEY_LOV = 'LOV';
      constant.FILTER_LIST_KEY_TEXT = 'TEXT';
      constant.FILTER_DATE_TEXT = 'DATE';
      constant.FILTER_DESCRIPTION_TEXT = 'DESCRIPTION';
      constant.FILTER_DESCRIPTION = 'Description';
      constant.FILTER_DATE_RANGE='DATE_RANGE';
      constant.FILTER_QUERY_NAME_COLUMN = 'QUERY_NAME';
      constant.QUERY_LIBRARY_SORT_QUERY_NAME='Query Name';
      constant.SIGNALING_REPORT_TYPE_KEY = 7;
      constant.PADER_REPORT_TYPE_KEY = 2;
      constant.IND_ANNUAL_REPORT_TYPE_KEY = 13;
      constant.LICENSE_BASED_SELECTION = 1;
      constant.PRODUCT_BASED_SELECTION = 0;
      constant.PERSIST='persist';
      constant.SUBMITTED_DATE='SUBMITTED_DATE';
      constant.DB_KEY_RPT_CAT_KEY='RPT_CAT_KEY';
      constant.FALSE_INTEGER=0;
      constant.READ_MODE ='create';
      constant.EDIT_MODE = 'edit';
      constant.SHARED_MODE = 'shared';
      constant.SAVE_QUERY = 'save';
      constant.SHARE_QUERY = 'share';
      constant.DELETE_QUERY = 'delete';
      constant.SAVE_AS_QUERY = 'save_as';
      constant.SAVE_QUERY_ERROR = 'save_error';
      constant.SHARE_CASE_LIST = 'share';

      constant.SESSION_BASED=1;
      constant.NOT_SESSION_BASED=0;

      constant.INCLUDE_SQL_VALUE = 'in(COLUMN_NAME,#value)';
      constant.NOT_EQUAL_SQL_VALUE = '!=';
      constant.SQL_NUMERIC = 'NUMERIC';
      constant.SQL_GREATER_EQUAL = '>=';
      constant.SQL_LESS_EQUAL = '<=';
      constant.SMALL_AND = 'and';
      constant.INCLUDES = 'includes';
      constant.IS = 'IS';
      constant.CONTAINS_SMALL = 'contains';
      constant.CONTAINS_BIG = 'CONTAINS';
      constant.DOESNOT_CONTAIN_SMALL = 'does not contain';
      constant.DOESNOT_CONTAIN_BIG = 'NOT CONTAINS';
      constant.IN = 'IN';
      constant.DATE_BASED = 1;

      //gantt chart
      constant.MONTH_VIEW='MONTH';
      constant.YEAR_VIEW = 'YEAR';
      constant.IS_ACTIVE_VIEW_MONTH = 'month';
      constant.IS_ACTIVE_VIEW_YEAR = 'year';
      constant.CURR_WEEK = 'Current Week';
      constant.CURR_MONTH = 'Current Month';
      constant.GANTT_CHART_VIEW = 'GANTT_CHART_VIEW';
      constant.PREV_FEW=2;
      constant.NEXT_FEW=7;

      constant.CASE_LIST_ADDED = 1;
      constant.CASE_LIST_REMOVED = 2;
      constant.CASE_LIST_ANNOTATED = 3;

      constant.USER_ENTITY = 0;
      constant.GROUP_ENTITY = 1;

      /*notification*/
      constant.NOTIFICATION_MODAL_LAZY_TOP = 5;
      constant.NOTIFICATION_MODAL_LAZY_SKIP = 0;
      constant.NOTIFICATION_MAIN_LAZY_TOP = 10;

      constant.STATE={
        MAIN : 'main',
        ANALYSIS : 'analysis',
        ANALYSIS_ADHOC : 'analysis.adhoc',
        ANALYSIS_OPEN : 'analysis.open',
        ANALYSIS_LIBRARY : 'analysis.library',
        REPORT_LIBRARY : 'reportslibrary',
        REPORT_LIBRARY_LIST: 'reportslibrary.list',
        REPORT_LIBRARY_GANTT: 'reportslibrary.gantt',
        CASE_LIST_LIBRARY : 'caselist.library',
        CASE_LIST_TABLE_STATE : 'caselist.view.table',
        CASE_LIST_VISUALS_STATE : 'caselist.view.visuals',
        CASE_LIST_QUERY_STATE : 'caselist.view.query',
        CASE_LIST_DETAILS_STATE : 'caselist.view.details',
        REPORT_LIBRARY_GANTT_EXPANDED_REPORT :'reportslibrary.gantt.report',
        REPORT_LIBRARY_GANTT_CHART : 'reportslibrary.gantt.chart',
        REPORT_EXPANDED_VIEW : 'reportslibrary.report',
        QUERY_LIBRARY : 'query.library',
        QUERY_LIBRARY_BUILDER : 'query.library.builder',
        HOME : 'home',
        NOTIFICATION_REPORT : 'reportslibrary.report',
        NOTIFICATION_SCREEN : 'notification'

    };
      constant.URL={
        ANALYSIS : '/analysis',
        ADHOC : '/adhoc',
        OPEN : '/open',
        LIBRARY : '/library'
      };
      constant.PARAMS = {
        LUMIRA_DOCUMENT_TYPE: 'sIDType',
        LUMIRA_DOCUMENT_ID: 'iDocID',
        LUMIRA_DOCUMENT_REFRESH: 'sRefresh',
        LUMIRA_DOCUMENT_STORY_NAME: 'sStoryName',
        LUMIRA_DOCUMENT_STORY_PAGE: 'sPageNumber',
        OPEN_ANALYSIS_NAME: 'name',
        OPEN_ANALYSIS_TYPE: 'type',
        OPEN_ANALYSIS_ID: 'id',
        OPEN_ANALYSIS_REFRESH: 'refresh',
        OPEN_ANALYSIS_STORY: 'story',
        OPEN_ANALYSIS_PAGE: 'page',
        OPEN_ANALYSIS_CHART_TYPE: 'cType',
        OPEN_ANALYSIS_LOGON_TOKEN:'token'
      };
      constant.LUMIRA_INTERNAL_FRAME_ID = 'openDocChildFrame';
      constant.LUMIRA_EXTERNAL_FRAME_DOCK_ID = '.openRightPanel';
      constant.CHART_MAP_TYPE = 'Map';
      constant.PAGE_NAVIGATION_REPORT = 1;
      constant.PAGE_NAVIGATION_CASE_LIST_LIBRARY = 2;
      constant.PAGE_NAVIGATION_CREATE_CASE_LIST = 3;
      constant.PERIODIC_REPORT_CATEGORY_KEY = 0;
      constant.SUBMISSION_DATE = 'submissionDate';
      constant.SUBMISSION_DUE_DATE='SUBMISSION_DUE_DATE';
      constant.RUN_DATE = 'runDate';
      constant.OTHER_COMPARATOR_KEY = 5;
      constant.EXCLUDE = 1;
      constant.INCLUDE = 2;
      constant.MINIMUM_SEARCH = 6;
      constant.OVERDUE_KEY = 1;
      constant.INPROGRESS_KEY = 3;
      constant.COMPLETED_KEY = 5;
      constant.FINAL_KEY = 4;
      constant.OPEN_KEY = 2;
      constant.BLINDED_KEY = 1;
      constant.UNBLINDED_KEY = 0;
      constant.PRODUCT_NAME_PLURAL = 'products';
      constant.LICENSE_NAME_PLURAL = 'licenses';
      constant.DEFAULT_CUMU_START_DATE = 'January 01, 1900 00:00:00';
      constant.CASE_LIST_QUERY_VISUAL = 'visual';
      constant.CASE_LIST_QUERY_EQUALS = 'equals';
      constant.CASE_LIST_QUERY_DOES_NOT_EQUAL = 'does not equal';
      constant.CASE_LIST_QUERY_IS_NOT_NULL = 'is not null';
      constant.CASE_LIST_QUERY_IS_NULL = 'is null';
      constant.CASE_LIST_QUERY_DOES_NOT_CONTAIN = 'does not contain';
      constant.CASE_LIST_QUERY_LT_OR_EQUALS = 'less than or equals';
      constant.CASE_LIST_QUERY_GT_OR_EQUALS = 'greater than or equals';
      constant.CASE_LIST_QUERY_BETWEEN = 'between';
      constant.CASE_LIST_QUERY_INCLUDES = 'includes';
      constant.CASE_LIST_QUERY_CONTAINS = 'contains';
      constant.CASE_LIST_QUERY_EXCLUDES = 'EXCLUDES';
      constant.CASE_LIST_QUERY_MANUALLY = 'MANUALLY';
      constant.CASE_LIST_QUERY_CASES = 'Cases';
      constant.CASE_LIST_QUERY_DATA_TYPE_DATE = 'DATE';
      constant.CASE_LIST_QUERY_DATA_TYPE_NUMERIC = 'NUMERIC';
      constant.CASE_LIST_QUERY_DATA_TYPE_TEXT = 'TEXT';
      constant.CASE_LIST_NOT_SAVED= 'Case List Not Saved';
      constant.SUBM_COMPL_REPORT_TYPE_KEY = 8;
      constant.FDA_SUBM_REPORT_TYPE_KEY = 6;
      constant.EMPTY = 'NA';
      constant.OPENCLASS = 'open';
      constant.DATEPICKER_FORMAT = 'dd-M-yy';
      constant.SAINT_DATE_FORMAT = 'dd-MMM-yyyy';
      constant.DATEPICKER_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      constant.YEAR_RANGE = 'c-200:c+200';
      constant.START_DATE = 'StartDate';
      constant.END_DATE = 'EndDate';
      constant.SOURCE = 'source';
      constant.PRODUCT_COLUMN_NAME = 'CPE_PROD_TRADE_NAME_FORMULATIONDESC';
      constant.LICENSE_COLUMN_NAME = 'LIC_NUMBER';
      constant.INGREDIENT_COLUMN_NAME = 'FAMILY_DESC';
      constant.INGREDIENT_KEY_COLUMN_NAME = 'FAMILY_CODE';
      constant.WORLD_MAP_COLORS = {
        'COUNT<100': '#81d4fa',
        'COUNT100-500': '#40c4ff',
        'COUNT500-1000': '#00b0ff',
        'COUNT1000-1500': '#0288d1',
        'COUNT>1500': '#01579b',
        'rgb(129, 212, 250)': '#81d4fa',
        'rgb(64, 196, 255)': '#40c4ff',
        'rgb(0, 176, 255)': '#00b0ff',
        'rgb(2, 136, 209)': '#0288d1',
        'rgb(1, 87, 155)': '#01579b'
      };
      constant.TIME_PICKER_CONFIG = {
        minuteStep: 1,
        template: 'modal',
        appendWidgetTo: 'body',
        showSeconds: false,
        showMeridian: false,
        defaultTime: false
      };
      constant.SET_QUERY_CONFIG = {
        'TAB_NAME_MAX_LENGTH': 100,
        'SET_DEFAULT_QUERY_NAME' : 'New Query',
        'SET_ADD_OPEN_PARENTHESIS' : '+(',
        'SET_ADD_CLOSE_PARENTHESIS' : '+)',
        'SET_DELETE_OPEN_PARENTHESIS' : '-(',
        'SET_DELETE_CLOSE_PARENTHESIS' : '-)',
        'UNION' : 'UNION',
        'INTERSECTION' : 'INTERSECTION',
        'MINUS' : 'MINUS',
        'NULL' : 'NULL',
        'OB' : '(',
        'CB' : ')',
        'DB_SET': {
          'UNION' : 'OR',
          'INTERSECTION' : 'AND',
          'MINUS': 'AND NOT',
          'OB' : '(',
          'CB' : ')'
        },
        'SET_OPERATION_OPERATOR' : 'operator',
        'SET_OPERATION_OPERAND' : 'operand',
        'SET_OPERATION_BRACKET' : 'bracket',
        'SET_OPERATION_OPEN_BRACKET' : 'OB',
        'SET_OPERATION_CLOSE_BRACKET' : 'CB',
        'SETS_CONFIGURATION' : {
          'SUCCESSFULLY_REFRESHED': 'successfully refreshed data',
          'DUPLICATE_KEYS': 'duplicate keys found',
          'NOT_FOUND_WITH_KEY': 'no element found with key ',
          'UPDATED_ITEM': 'Updated the item with id '
        }
      };
      constant.SET_EXPRESSION_ERROR_CODES = {
        'BRACKETS_NOT_BALANCED':{'ERROR_CODE':1,MESSAGE_CODE:'BRACKETS_NOT_BALANCED'},
        'EMPTY_SET':{'ERROR_CODE':2,MESSAGE_CODE:'EMPTY_SET'},
        'EMPTY_DIMENSION':{'ERROR_CODE':3,MESSAGE_CODE:'EMPTY_DIMENSION'},
        'EMPTY_OPERATOR':{'ERROR_CODE':4,MESSAGE_CODE:'EMPTY_OPERATOR'},
        'EMPTY_VALUE':{'ERROR_CODE':5,MESSAGE_CODE:'EMPTY_VALUE'}
      };
      constant.DONUT_CHART_COLORS = ['#007cab','#f79722', '#1ea54a','#e75b8d', '#7c4dff','#00bfa5'];
      constant.BOE_ROOT_FOLDER = '/Root%20Folder';
      constant.BOE_SAINT_FOLDER = 'Saint';
      constant.BOE_CRYSTAL_FOLDER = 'Crystal';
      constant.BOE_CUSTOM_FOLDER = 'Custom';
      constant.QUERY_BUILDER_CONTEXT = 'queryBuilder';
      constant.SET_OPERATION_CONTEXT = 'setOperations';
      constant.EMPTY_STRING = '';
      constant.DATA_TYPE = 'dataType';
      constant.GENERATE_SET_ID = function (){
        return Math.floor((Math.random() * window.performance.now()));
      };
      constant.DRAFT_STRING='Draft';
      constant.FINAL_STRING='Final';
      return constant;
    }
  };
}]);


