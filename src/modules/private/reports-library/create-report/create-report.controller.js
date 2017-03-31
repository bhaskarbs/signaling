'use strict';

angular.module('saintApp')
    .controller('CreateReportController', ['$scope', 'ReportEntity', 'SignalEntity', 'UserService', 'ReportMileStoneEntity', 'alertService', 'LanguageService', 'IngredientFactory', 'ReportFactory', '$filter', 'ConstantService', 'loaderService', '$timeout', 'UpdateCustomReportFactory', function ($scope, ReportEntity, SignalEntity, UserService, ReportMileStoneEntity, AlertService, LanguageService, IngredientFactory, ReportFactory, $filter, ConstantService, loaderService, $timeout, UpdateCustomReportFactory) {
        $scope.report = angular.copy(ReportEntity);
        $scope.report.signal = angular.copy(SignalEntity);
        $scope.data = {'ingredients': [], 'reportTypes': []};
        $scope.availableUserGroups = [];
        $scope.allUsers = [];
        $scope.availableUsers = [];
        $scope.isModalInEditMode = false;
        $scope.signalingReportTypeKey = ConstantService.SIGNALING_REPORT_TYPE_KEY;
        $scope.paderReportTypeKey = ConstantService.PADER_REPORT_TYPE_KEY;
        $scope.submissionComplianceReportTypeKey = ConstantService.SUBM_COMPL_REPORT_TYPE_KEY;
        $scope.fDASubmissionReportTypeKey = ConstantService.FDA_SUBM_REPORT_TYPE_KEY;
        $scope.comparatorData = [];
        $scope.isSaving = false;
        $scope.reportCreationSelectId = 'reportCreationSelectId';
        $scope.report.selectedUsersGroup = [];
        $scope.report.reportOwner = null;
        $scope.loadUserGroupSelect = false;
        $scope.language = LanguageService.CONSTANTS;

        var fnResetIngredientSelections = function () {
            angular.forEach($scope.data.ingredients, function (availableIngredient) {
                angular.forEach(availableIngredient.licenses, function (license) {
                    license.isSelected = false;
                });
                angular.forEach(availableIngredient.products, function (product) {
                    product.isSelected = false;
                });
            });
        };

        //Performs the initial conditions and calls the create report modal

        $scope.fnCreateNewReport = function () {
            fnResetIngredientSelections();
            $scope.isModalInEditMode = false;
            $scope.report = angular.copy(ReportEntity);
            $scope.report.otherReceiptType = false;
            $scope.isIngredientSelectAll = false;
            $scope.report.includeCasesNotPreviouslyReported = true;
            $scope.report.signal = angular.copy(SignalEntity);
            $scope.report.isProductBasedSelection = ConstantService.PRODUCT_BASED_SELECTION;
            $scope.fnGetAllUsers();

            var currentUserGroupKey = null;
            angular.forEach($scope.allUsers, function (availableUser) {
                if (UserService.data.oUser.userId === availableUser.userId.toString()) { //Earlier it was userKey which was failing
                    currentUserGroupKey = availableUser.groupKey;
                }
            });
            angular.forEach($scope.availableUserGroups, function (availableGroup) {
                if (currentUserGroupKey === availableGroup.roleId) {
                    $scope.report.groups.push(availableGroup);
                }
            });
            $scope.getUsersForReportUserGroup();
            angular.forEach($scope.availableUsers, function (availableUser) {
                if (UserService.data.oUser.userId === availableUser.userId.toString()) {
                    $scope.report.users.push(availableUser);
                }
            });
            $scope.fnOpenCreateReportModal();
        };

        //Displays the create new report modal

        $scope.fnOpenCreateReportModal = function () {
            $scope.loadUserGroupSelect = true;
            angular.element('#dsui-create-new-report').modal('show');
            $scope.isIngredientSelectAll = false;
            $scope.fnInitTimePicker();
            //Scroll top function
            $timeout(function () {
                $('#dsui-create-modal-body').scrollTop(0);
            }, 500);
        };


        /**
         * Clean up the report expanded state before moving to the dashboard
         * @param state
         */
        $scope.fnWrapperNavigate = function (location) {
            if (ReportFactory.data.reportPanelState === ConstantService.EXPANDED) {
                $scope.fnPersistReportPanelState(ConstantService.HIDDEN);
            }
            $scope.fnNavigate(location);
        };

        /**
         * Persisting the state of the report summaary panel
         * @param state
         */
        $scope.fnPersistReportPanelState = function (state) {
            ReportFactory.data.reportPanelState = state;
            ReportFactory.persistPreference('REPORT_PANEL_STATE', state, null, ConstantService.SESSION_BASED);
            ReportFactory.persistPreference('CURR_REPORT_ID', ReportFactory.data.selectedTileId, null, ConstantService.SESSION_BASED);
        };

        //Calculates the report As Of Date depending on the As of Date offset and the report end date

        $scope.fnCalculateAsOfDate = function () {
            if ($scope.report.reportEndDate) {
                $scope.report.reportAsOfDateDetails = new Date($scope.report.reportEndDate.getFullYear(), $scope.report.reportEndDate.getMonth(), $scope.report.reportEndDate.getDate() + $scope.report.asOfDateOffset);
            }
        };

        //Calculates the report As Of Date offset depending on the As of Date and the report end date

        $scope.fnCalculateAsOfDateOffset = function () {
            if ($scope.report.reportEndDate) {
                $scope.report.asOfDateOffset = $scope.dateDiffInDays($scope.report.reportAsOfDateDetails, $scope.report.reportEndDate);
            }
        };


        //Performs specific form autoselections/autopopulations based on the report type
        $scope.fnProductLicenseCheck = function () {
            var ingredientSubset = null, areIngredientsUnchecked = true;
            ingredientSubset = ($scope.report.isProductBasedSelection === ConstantService.PRODUCT_BASED_SELECTION ? ConstantService.PRODUCT_NAME_PLURAL : ConstantService.LICENSE_NAME_PLURAL);
            angular.forEach($scope.report.reportIngredients, function (ingredient) {
                angular.forEach(ingredient[ingredientSubset], function (product) {
                    if (product.isSelected) {
                        areIngredientsUnchecked = false;
                    }
                });
            });
            return areIngredientsUnchecked;
        };

      $scope.fnEnableDatepicker=function(id)
      {
        angular.element(id).datepicker('show');
      };
        //Performs specific form autoselections/autopopulations based on the report type

        $scope.fnCheckReportTypeSpecificActions = function () {
            if ($scope.report.reportType.reportId === ConstantService.PERIODIC_REPORT_CATEGORY_KEY) {
                $scope.selectedDate = ConstantService.SUBMISSION_DATE;
                $scope.report.submissionRunDate = null;
                $scope.report.submissionRunTime = null;
                $scope.report.allDatesFlag = false;
                $scope.fnUpdateReportName();
                if ($scope.report.reportType.reportKey === $scope.paderReportTypeKey || $scope.report.reportType.reportKey === ConstantService.IND_ANNUAL_REPORT_TYPE_KEY) {
                    //RUN A CHECK IF HE HAS SELECTED PRODUCTS
                    if (($scope.report.isProductBasedSelection === ConstantService.PRODUCT_BASED_SELECTION) && $scope.fnProductLicenseCheck()) {
                        $scope.report.isProductBasedSelection = ConstantService.LICENSE_BASED_SELECTION;
                    }

                    $scope.report.initialReceiptDate = true;
                    $scope.report.followReceiptDate = true;
                    $scope.report.iCSRSubmissionDate = true;
                }
                else {
                    //RUN A CHECK IF HE HAS SELECTED LICENSES
                    if (($scope.report.isProductBasedSelection === ConstantService.LICENSE_BASED_SELECTION) && $scope.fnProductLicenseCheck()) {
                        $scope.report.isProductBasedSelection = ConstantService.PRODUCT_BASED_SELECTION;
                    }
                    $scope.report.initialReceiptDate = true;
                    $scope.report.followReceiptDate = true;
                }
            }
            else {
                if ($scope.report.reportType.reportKey === $scope.signalingReportTypeKey) {
                    var defCumuStartDate = ConstantService.DEFAULT_CUMU_START_DATE;
                    $scope.report.signal.cumulativeStartDate = new Date(defCumuStartDate);
                    $scope.report.signal.cumulativeEndDate = new Date();
                    $scope.report.signal.denominatorType = true;
                    if ($scope.report.allDatesFlag) {
                        angular.forEach($scope.comparatorData, function (comparatorItem) {
                            if (comparatorItem.key === ConstantService.OTHER_COMPARATOR_KEY) {
                                $scope.report.signal.comparatorPeriod = comparatorItem;
                            }
                        });
                    }
                }
                $scope.selectedDate = ConstantService.RUN_DATE;
                $scope.report.submissionDate = null;
            }
            if (angular.isDate($scope.report.reportEndDate)) {
                $scope.fnCheckReportEndDate();
            }
        };

        //Validates the milestone form details and depending on the $scope.isModalInEditMode context creates or updates the report

        var fnSaveReport = function () {
            if ($scope.report.reportType) {
                if ($scope.report.reportOwner) {
                    if (($scope.report.reportType.reportKey === $scope.submissionComplianceReportTypeKey || $scope.report.reportType.reportKey === $scope.fDASubmissionReportTypeKey || $scope.report.reportType.reportKey === $scope.paderReportTypeKey) && !$scope.report.iCSRSubmissionDate) {
                        AlertService.warn(LanguageService.MESSAGES.MANDATORY_SUBMISSION_DATE_CHECKBOX);
                    }
                    else {
                        var dateValidate = ($scope.report.reportType.reportKey === $scope.signalingReportTypeKey) ? ((($scope.report.signal.comparatorStartDate <= $scope.report.signal.comparatorEndDate) && ($scope.report.signal.cumulativeStartDate <= $scope.report.signal.cumulativeEndDate)) ? true : false) : (true);
                        if ($scope.report.reportStartDate <= $scope.report.reportEndDate || $scope.report.allDatesFlag) {
                            if (dateValidate) {
                                if ($scope.isModalInEditMode) {
                                    $scope.isSaving = true;
                                    loaderService.start();
                                    ReportFactory.fnSaveEditedReport($scope.report).then(
                                        function (result) {
                                            if (!isNaN(Number(result.data))) {
                                                $scope.report = [];
                                                $scope.updatedReportKey = result.data;
                                                $scope.fnCreateNewReportCancel();
                                                $scope.fnOpenCurrentReport();
                                            }
                                            loaderService.stop();
                                            $scope.isSaving = false;
                                        }
                                    );
                                }
                                else {
                                    $scope.isSaving = true;
                                    loaderService.start();
                                    ReportFactory.fnSaveCreatedReport($scope.report).then(
                                        function (result) {
                                            if (!isNaN(Number(result.data))) {
                                                $scope.report = [];
                                                $scope.updatedReportKey = result.data;
                                                $scope.fnManageReport();
                                            }
                                            loaderService.stop();
                                            $scope.isSaving = false;
                                        }
                                    );
                                }
                            }
                            else {
                                AlertService.warn(LanguageService.MESSAGES.INVALID_SIGNALLING_END_DATE);
                            }
                        }
                        else {
                            AlertService.warn(LanguageService.MESSAGES.INVALID_REPORT_END_DATE);
                        }
                    }
                }
                else {
                    AlertService.warn(LanguageService.MESSAGES.INVALID_REPORT_OWNER);
                }
            } else {
                AlertService.warn(LanguageService.MESSAGES.INVALID_REPORT_TYPE_SELECTION);
            }
        };

        //Applies the $scope.isIngredientSelectAll boolean value to all of the products/licenses of selected ingredients

        var applyIngredientSelectAll = function () {
            var ingredientSubset = null;
            ingredientSubset = ($scope.report.isProductBasedSelection === ConstantService.PRODUCT_BASED_SELECTION ? ConstantService.PRODUCT_NAME_PLURAL : ConstantService.LICENSE_NAME_PLURAL);
            angular.forEach($scope.report.reportIngredients, function (ingredient) {
                angular.forEach(ingredient[ingredientSubset], function (product) {
                    product.isSelected = angular.copy($scope.isIngredientSelectAll);
                });
            });
        };

        //Unchecks select all checkbox if any product/license is de-selected

        $scope.fnCheckSelectAll = function (resultVal) {
            if (!resultVal && $scope.isIngredientSelectAll) {
                $scope.isIngredientSelectAll = false;
            }
        };

        //Toggles the $scope.isIngredientSelectAll and applies the select all context to all of the products/licenses of selected ingredients

        $scope.fnCheckIngredientSelectAll = function () {
            $scope.isIngredientSelectAll = !$scope.isIngredientSelectAll;
            applyIngredientSelectAll();
        };

        //On change of report ingredients, updates the report name applies the select all context to all of the products/licenses of selected ingredients

        $scope.fnChangeIngredientSet = function () {
            $scope.fnUpdateReportName();
            if ($scope.isIngredientSelectAll) {
                applyIngredientSelectAll();
            }
        };

        //On change of report prod/lic selection, falsifies the  name applies the select all context to all of the products/licenses of selected ingredients

        $scope.fnChangeProdLicSelection = function () {
            $scope.isIngredientSelectAll = false;
            applyIngredientSelectAll();
        };

        //Checks if the save button is disabled and saves if not.

        $scope.fnCheckAndSave = function () {
            if (!$scope.isSaving) {
                fnSaveReport();
            }
        };

        //Checks for change in comparator selection and autopopulates the start and end date

        $scope.fnCheckComparatorPeriod = function () {
            //IF COMPARATOR PERIOD IS OTHER DO NOT EXECUTE THE FOLLOWING $scope.report.signal.comparatorPeriod
            if ($scope.report.signal.comparatorPeriod.key === ConstantService.OTHER_COMPARATOR_KEY) {
                $scope.report.signal.comparatorEndDate = null;
                $scope.report.signal.comparatorStartDate = null;
            }
            else {
                $scope.report.signal.comparatorEndDate = new Date();
                $scope.report.signal.comparatorStartDate = new Date($scope.report.signal.comparatorEndDate.getFullYear(), $scope.report.signal.comparatorEndDate.getMonth(), $scope.report.signal.comparatorEndDate.getDate() - $scope.report.signal.comparatorPeriod.days);
            }
        };

        //Updates the report, customreport, basecaselist name according to the form fields data

        $scope.fnUpdateReportName = function () {
            var reportName = '';
            var baseCaseListName = '';
            var reportCustomName = '';
            var baseCaseListCustomName = '';
            try {
                if ($scope.report.reportType) {
                    reportName += $scope.report.reportType.reportType + '_';
                }
                if ($scope.report.reportIngredients && $scope.report.reportIngredients.length) {
                    angular.forEach($scope.report.reportIngredients, function (ingredient) {
                        baseCaseListName += ingredient.ingredientName;
                        if (($scope.report.reportIngredients.length - 1) > $scope.report.reportIngredients.indexOf(ingredient)) {
                            baseCaseListName += '_';
                        }
                    });
                }
                reportCustomName = reportName + baseCaseListName;
                if ($scope.report.allDatesFlag) {
                    baseCaseListName += '_All Dates';
                }
                else {
                    if ($scope.report.reportEndDate && $scope.report.reportStartDate) {
                        baseCaseListName += '_' + $filter('date')($scope.report.reportStartDate, 'dd-MMM-yyyy') + '-' + $filter('date')($scope.report.reportEndDate, 'dd-MMM-yyyy');
                    }
                }
                baseCaseListCustomName = reportName + baseCaseListName;
                if ($scope.report.reportDesc) {
                    baseCaseListName += '_' + $scope.report.reportDesc.substring(0, 30);
                }
            }
            catch (e) {
            }
            $scope.report.reportName = reportName + baseCaseListName;
            $scope.report.baseCaseListName = reportName + baseCaseListName;
            $scope.report.reportCustomName = reportCustomName;
            $scope.report.baseCaseListCustomName = baseCaseListCustomName;
        };

        //If AllDates flag is selected then Reporting Type Dates should be disabled
        $scope.clearReportingPeriodDateTypesOnAllDates = function () {
            if($scope.report.allDatesFlag) {
                $scope.report.eventReceiptDate = false;
                $scope.report.initialReceiptDate= false;
                $scope.report.followReceiptDate= false;
                $scope.report.iCSRSubmissionDate= false;
                $scope.report.otherReceiptType= false;
            }
        };

        //Checks for the click on the all dates field autopopulates the comparator field if signaling report
        $scope.fnCheckAllDates = function () {
            $scope.clearReportingPeriodDateTypesOnAllDates();
            if ($scope.report.allDatesFlag) {
                $scope.report.reportStartDate = null;
                $scope.report.reportEndDate = null;
                $scope.report.reportMilestones.length = 0;
                if ($scope.report.reportType.reportKey === $scope.signalingReportTypeKey) {
                    angular.forEach($scope.comparatorData, function (comparatorItem) {
                        if (comparatorItem.key === ConstantService.OTHER_COMPARATOR_KEY) {
                            $scope.report.signal.comparatorPeriod = comparatorItem;
                        }
                    });
                }
            }
            $scope.fnUpdateReportName();
        };

        //Checks for report end date entry for autopopulation of the report As Of Date field

        $scope.fnCheckReportEndDate = function () {
            $scope.fnUpdateReportName();
            if ($scope.report.reportType) {
                if (!$scope.report.reportAsOfDateDetails) {
                    if ($scope.report.reportType.reportId === ConstantService.PERIODIC_REPORT_CATEGORY_KEY) {
                        $scope.report.reportAsOfDateDetails = new Date();
                        $scope.fnCalculateAsOfDateOffset();
                    }
                    else {
                        if (angular.isDate($scope.report.submissionRunDate)) {
                            $scope.report.reportAsOfDateDetails = angular.copy($scope.report.submissionRunDate);
                            $scope.fnCalculateAsOfDateOffset();
                        }
                    }
                }
                else {
                    $scope.fnCalculateAsOfDateOffset();
                }
            }
            if ($scope.report.reportMilestones.length) {
                angular.forEach($scope.report.reportMilestones, function (milestone) {
                    milestone.reportDateStamp = angular.copy($scope.report.reportEndDate);
                    $scope.calculateReportMilestoneOffset($scope.report.reportMilestones.indexOf(milestone));
                });
            }
        };

        //Checks for report run date entry for autopopulation of the report As Of Date field

        $scope.fnCheckRunDate = function () {
            if (!$scope.report.reportAsOfDateDetails) {
                if ($scope.report.reportType.reportId !== ConstantService.PERIODIC_REPORT_CATEGORY_KEY) {
                    $scope.report.reportAsOfDateDetails = angular.copy($scope.report.submissionRunDate);
                    $scope.fnCalculateAsOfDateOffset();
                }
            }
            else {
                $scope.fnCalculateAsOfDateOffset();
            }
        };

        //Brings up the confirmation modal on creation of a report

        $scope.fnManageReport = function () {
            $scope.fnCreateNewReportCancel();
            angular.element('#dsui-confirmation').modal({backdrop: 'static', keyboard: false});
        };

        //Handles the close/cancel actions of the create new report modal

        $scope.fnCreateNewReportCancel = function () {
            angular.element('#dsui-create-new-report').modal('hide');
            $scope.loadUserGroupSelect = false;
            $scope.report = angular.copy(ReportEntity);
        };

        $scope.fnCheckClear = function () {
            var data = $scope.report.reportIngredients;
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < data[i].products.length; j++) {
                        data[i].products[j].isSelected = false;
                    }
                    for (var k = 0; k < data[i].licenses.length; k++) {
                        data[i].licenses[k].isSelected = false;
                    }
                }
            }
        };

        //Retrieves the master list of users

        $scope.fnGetAllUsers = function () {
            UserService.getGroupUsers().then(
                function (result) {
                    $scope.allUsers = result.data;
                    $scope.fnDefaultReportOwner();
                }
            );
        };

        //Defaulting report owner to present user
        $scope.fnDefaultReportOwner = function () {
            angular.forEach($scope.allUsers, function (availableUser) {
                if (parseInt(UserService.data.oUser.userId) === parseInt(availableUser.userId)) {
                    $scope.report.reportOwner = availableUser;
                }
            });
        };

        //Retrieves the list of users for selected user groups

        $scope.getUsersForReportUserGroup = function () {
            if ($scope.report.groups.length) {
                $scope.availableUsers.length = 0;
                angular.forEach($scope.report.groups, function (selectedGroup) {
                    angular.forEach($scope.allUsers, function (availableUser) {
                        if (selectedGroup.roleId === availableUser.groupKey && $scope.availableUsers.indexOf(availableUser) === -1) {
                            $scope.availableUsers.push(availableUser);
                        }
                    });
                });
                if ($scope.report.users.length) {
                    var users = angular.copy($scope.report.users);
                    $scope.report.users.length = 0;
                    angular.forEach($scope.report.groups, function (selectedGroup) {
                        angular.forEach(users, function (copiedUser) {
                            if (selectedGroup.roleId === copiedUser.groupKey) {
                                angular.forEach($scope.availableUsers, function (availableUser) {
                                    if (copiedUser.userKey === availableUser.userKey && $scope.report.users.indexOf(availableUser) === -1) {
                                        $scope.report.users.push(availableUser);
                                    }
                                });
                            }
                        });
                    });
                }
            }
            else {
                $scope.availableUsers.length = 0;
                $scope.report.users.length = 0;
            }
        };

        //Retrieves the list of users for selected milestone user groups

        $scope.getUsersForUserGroup = function (index) {
            if ($scope.report.reportMilestones[index].assignedUserGroups.length) {
                angular.forEach($scope.report.reportMilestones[index].assignedUserGroups, function (selectedGroup) {
                    angular.forEach($scope.allUsers, function (availableUser) {
                        if (selectedGroup.roleId === availableUser.groupKey && $scope.report.reportMilestones[index].availableUsers.indexOf(availableUser) === -1) {
                            $scope.report.reportMilestones[index].availableUsers.push(availableUser);
                        }
                    });
                });
                if ($scope.report.reportMilestones[index].assignedUsers.length) {
                    var users = angular.copy($scope.report.reportMilestones[index].assignedUsers);
                    $scope.report.reportMilestones[index].assignedUsers.length = 0;
                    angular.forEach($scope.report.reportMilestones[index].assignedUserGroups, function (selectedGroup) {
                        angular.forEach(users, function (copiedUser) {
                            if (selectedGroup.roleId === copiedUser.groupKey) {
                                angular.forEach($scope.report.reportMilestones[index].availableUsers, function (availableUser) {
                                    if (copiedUser.userKey === availableUser.userKey && $scope.report.reportMilestones[index].assignedUsers.indexOf(availableUser) === -1) {
                                        $scope.report.reportMilestones[index].assignedUsers.push(availableUser);
                                    }
                                });
                            }
                        });
                    });
                }
            }
            else {
                $scope.report.reportMilestones[index].availableUsers.length = 0;
                $scope.report.reportMilestones[index].assignedUsers.length = 0;
            }
        };

        //Retrieves the master list of user groups

        $scope.getAvailableUserGroups = function () {
            UserService.getGroups().then(
                function (result) {
                    $scope.availableUserGroups = result.data;
                }
            );
        };

        //Adds a new milestone with initial conditions

        $scope.addNewMilestone = function () {
            if (angular.isDate($scope.report.reportEndDate)) {
                var newMilestone = angular.copy(ReportMileStoneEntity);
                newMilestone.milestoneKey = -1;
                newMilestone.reportDateStamp = angular.copy($scope.report.reportEndDate);
                newMilestone.reportMilestoneDate = angular.copy($scope.report.reportEndDate);
                $scope.report.reportMilestones.push(newMilestone);
                $scope.calculateReportMilestoneDate($scope.report.reportMilestones.length - 1);
            } else {
                AlertService.warn(LanguageService.MESSAGES.FAILED_CREATE_MILESTONE_WITHOUT_DATE);
            }
        };

        //Calculates the milestone date depending on the offset and report end date

        $scope.calculateReportMilestoneDate = function (index) {
            $scope.report.reportMilestones[index].reportMilestoneDate = new Date($scope.report.reportMilestones[index].reportDateStamp.getFullYear(), $scope.report.reportMilestones[index].reportDateStamp.getMonth(), $scope.report.reportMilestones[index].reportDateStamp.getDate() + $scope.report.reportMilestones[index].offsetToReportDate);
        };

        //Calculates the difference in days between two dates

        $scope.dateDiffInDays = function (a, b) {
            var _MS_PER_DAY = 1000 * 60 * 60 * 24;
            var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
            var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
            return Math.floor((utc1 - utc2) / _MS_PER_DAY);
        };

        //Calculates the milestone date offset from the report end date depending on the milestone date

        $scope.calculateReportMilestoneOffset = function (index) {
            $scope.report.reportMilestones[index].offsetToReportDate = $scope.dateDiffInDays($scope.report.reportMilestones[index].reportMilestoneDate, $scope.report.reportMilestones[index].reportDateStamp);
        };

        //Checks for a click on the other receipt type checkbox and preselects the first option

        $scope.fnCheckOtherDate = function () {
            if ($scope.report.otherReceiptType) {
                $scope.report.otherReceiptValue = 0;
            }
        };

        //Formats the report form fields to be renderable in the modal ui

        $scope.fnFormatReportToEntityObject = function () {
            $scope.fnCalculateAsOfDateOffset();
            if ($scope.report.reportMilestones.length) {
                angular.forEach($scope.report.reportMilestones, function (milestone) {
                    var copyOfMilestoneUserGroups = milestone.assignedUserGroups;
                    var copyOfMilestoneUsers = milestone.assignedUsers;
                    milestone.assignedUserGroups = [];
                    milestone.assignedUsers = [];
                    milestone.reportDateStamp = $scope.report.reportEndDate;
                    milestone.availableUsers = $scope.availableUsers;
                    angular.forEach(copyOfMilestoneUserGroups, function (milestoneUserGroup) {
                        angular.forEach($scope.availableUserGroups, function (availableGroup) {
                            if (milestoneUserGroup.roleId === availableGroup.roleId) {
                                milestone.assignedUserGroups.push(availableGroup);
                            }
                        });
                    });
                    $scope.getUsersForUserGroup($scope.report.reportMilestones.indexOf(milestone));
                    angular.forEach(copyOfMilestoneUsers, function (milestoneUser) {
                        angular.forEach(milestone.availableUsers, function (availableUser) {
                            if (milestoneUser.userKey === availableUser.userKey) {
                                milestone.assignedUsers.push(availableUser);
                            }
                        });
                    });
                });
            }
            if ($scope.report.reportType.reportId === ConstantService.PERIODIC_REPORT_CATEGORY_KEY) {
                $scope.selectedDate = ConstantService.SUBMISSION_DATE;
            }
            else {
                $scope.selectedDate = ConstantService.RUN_DATE;
            }
            $scope.fnOpenCreateReportModal();
        };

        //Performs the autopopulation of the create new report modal if an edit is triggered

        $scope.fnTriggerAndPopulateEditModal = function (selectedReport) {
            var report = selectedReport;
            $scope.report = angular.copy(report);
            $scope.report.groups = [];
            $scope.report.users = [];
            $scope.report.reportAssignees = angular.copy(selectedReport.reportAssignees);
            $scope.report.reportIngredients = [];
            angular.forEach(report.groups, function (reportContainedGroup) {
                angular.forEach($scope.availableUserGroups, function (availableGroup) {
                    if (reportContainedGroup.roleId === availableGroup.roleId) {
                        $scope.report.groups.push(availableGroup);
                    }
                });
            });

            $scope.getUsersForReportUserGroup();
            angular.forEach(report.users, function (reportContainedUser) {
                angular.forEach($scope.availableUsers, function (availableUser) {
                    if (reportContainedUser.userKey === availableUser.userKey) {
                        $scope.report.users.push(availableUser);
                    }
                });
            });

            //Assigning report owner
            angular.forEach($scope.allUsers, function (availableUser) {
                if (parseInt(report.reportOwner) === parseInt(availableUser.userId)) {
                    $scope.report.reportOwner = availableUser;
                }
            });

            fnResetIngredientSelections();
            if (report.reportLicenses.length) {
                angular.forEach(report.reportLicenses, function (reportContainedLicenses) {
                    angular.forEach($scope.data.ingredients, function (availableIngredient) {
                        if ((reportContainedLicenses.familyKey === availableIngredient.ingredientId) && ($scope.report.reportIngredients.indexOf(availableIngredient) === -1)) {
                            $scope.report.reportIngredients.push(availableIngredient);
                        }
                    });
                });
                angular.forEach(report.reportLicenses, function (reportContainedLicense) {
                    angular.forEach($scope.report.reportIngredients, function (availableIngredient) {
                        angular.forEach(availableIngredient.licenses, function (availableLicense) {
                            if (availableLicense.licenseId === reportContainedLicense.licenseKey) {
                                availableLicense.isSelected = true;
                            }
                        });
                    });
                });
            }
            if (report.reportProducts.length) {
                angular.forEach(report.reportProducts, function (reportContainedProduct) {
                    angular.forEach($scope.data.ingredients, function (availableIngredient) {
                        if ((reportContainedProduct.familyKey === availableIngredient.ingredientId) && ($scope.report.reportIngredients.indexOf(availableIngredient) === -1)) {
                            $scope.report.reportIngredients.push(availableIngredient);
                        }
                    });
                });
                angular.forEach(report.reportProducts, function (reportContainedProduct) {
                    angular.forEach($scope.report.reportIngredients, function (availableIngredient) {
                        angular.forEach(availableIngredient.products, function (availableProduct) {
                            if (availableProduct.productId === reportContainedProduct.productKey) {
                                availableProduct.isSelected = true;
                            }
                        });
                    });
                });
            }
            var reportType = angular.copy($scope.report.reportType);
            $scope.report.reportType = null;
            angular.forEach($scope.data.reportTypes, function (availableType) {
                if (reportType === availableType.reportKey) {
                    $scope.report.reportType = availableType;
                }
            });
            if ($scope.report.signal.comparatorPeriod) {
                var comparatorPeriodType = angular.copy($scope.report.signal.comparatorPeriod);
                $scope.report.signal.comparatorPeriod = null;
                angular.forEach($scope.comparatorData, function (comparatorItem) {
                    if (comparatorItem.key === comparatorPeriodType) {
                        $scope.report.signal.comparatorPeriod = comparatorItem;
                    }
                });
            }
            $scope.fnFormatReportToEntityObject();
            $scope.isModalInEditMode = true;
        };

        //Retrieves the comparator data

        $scope.fnComparatorPeriodData = function () {
            ReportFactory.getComparatorPeriodData().then(function (result) {
                    if (result.data) {
                        $scope.comparatorData = result.data;
                    }
                }
            );
        };

        //Init function

        $scope.fnInit = function () {

            $scope.$on('callEditReportEvent', function (event, selectedReport) {
                var tempSelectedReport = selectedReport;
                $scope.fnTriggerAndPopulateEditModal(tempSelectedReport);
            });
            IngredientFactory.getIngredients().then(function (result) {
                if (result.data) {
                    $scope.data.ingredients = result.data;
                }
                $scope.getCustomReportFromBOE();
            });
            $scope.fnComparatorPeriodData();
        };

        //Function to to get custom crystal reports from BOE
        $scope.getCustomReportFromBOE = function () {
            $scope.fnGetReportTypes();
            var rootFolder = ConstantService.BOE_ROOT_FOLDER;
            try {
              UpdateCustomReportFactory.getCuidFromFolder(rootFolder).then(function (result) {
                var saintFolder = _.findWhere(result.data.entries, {name: ConstantService.BOE_SAINT_FOLDER});
                saintFolder = '/cuid_' + saintFolder.cuid;
                UpdateCustomReportFactory.getCuidFromFolder(saintFolder).then(function (result) {
                  var crystalFolder = _.findWhere(result.data.entries, {name: ConstantService.BOE_CRYSTAL_FOLDER});
                  crystalFolder = '/cuid_' + crystalFolder.cuid;
                  UpdateCustomReportFactory.getCuidFromFolder(crystalFolder).then(function (result) {
                    var customFolder = _.findWhere(result.data.entries, {name: ConstantService.BOE_CUSTOM_FOLDER});
                    customFolder = '/cuid_' + customFolder.cuid;
                    UpdateCustomReportFactory.getCuidFromFolder(customFolder).then(function (result) {
                      var reportsMap = _.map(result.data.entries, function (item) {
                        return {
                          'RPT_TYPE_KEY': 0,
                          'RPT_TYPE_NAME': item.name,
                          'DESCRIPTION': item.description,
                          'FK_RPT_CAT_KEY': 0,
                          'CUID': item.cuid
                        };
                      });
                      $scope.updateAndGetReportTypes(reportsMap);
                    });
                  });
                });
              });
            }
            catch (e) {
                $scope.fnGetReportTypes();
            }
        };

        $scope.fnGetReportTypes = function () {
            ReportFactory.getReportTypes().then(function (result1) {
                if (result1.data) {
                    $scope.data.reportTypes = result1.data;
                }
                $scope.getAvailableUserGroups();
                $scope.fnGetAllUsers();
            });
        };

        //Function to update custom CR and get the updated values
        $scope.updateAndGetReportTypes = function (reportsMap) {
            ReportFactory.updateReportTypes(reportsMap).then(function () {
                $scope.fnGetReportTypes();
            });
        };

        //opens an expanded view of the newly created report
        $scope.fnOpenCurrentReport = function () {
          ReportFactory.data.selectedTileId = $scope.updatedReportKey;
          if ($scope.isModalInEditMode) {
            $scope.fnRefreshReportDetails($scope.updatedReportKey);
          }
          else {
            $scope.fnExpandReportPanelFromModal($scope.updatedReportKey);
          }
            //Update Persistence
            ReportFactory.persistPreference('REPORT_PANEL_STATE', ConstantService.EXPANDED, null, ConstantService.SESSION_BASED);
            ReportFactory.persistPreference('CURR_REPORT_ID', ReportFactory.data.selectedTileId, null, ConstantService.SESSION_BASED);
        };

        $scope.fnReturnToReportsLib = function () {
            $scope.fnCallRefreshReportTiles();
            $scope.fnCallRefreshGanttRows();
        };

        $scope.fnInitTimePicker = function () {
            $('#timepicker2').timepicker(ConstantService.TIME_PICKER_CONFIG); // This was failing hence commenting it
        };

        $scope.fnInit();

    }]);
