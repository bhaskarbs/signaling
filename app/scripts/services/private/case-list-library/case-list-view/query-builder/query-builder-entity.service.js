'use strict';
angular.module('saintApp').service('QueryBuilderEntity', [ 'ConstantService', function (ConstantService) {
  return {
    'expressionEntity': [],
    'setEntities': [],
    'type': ConstantService.QUERY_BUILDER_CONTEXT
  };
}]).service('QuerySetEntity', function () {
  return {
    'setId': null,
    'name': '',
    'sQLQuery': '', // Actual SQL Query
    'jSON': {}, // JSON Data
    'isSelected': false
  };
}).service('QueryGroupEntity', function () {
  return {
    'group':{
        'isCollapsed': false,
        'source': '',
        'groupOperator': {key: 1, name: 'AND'},
        'rules': []
    }
  };
}).service('QueryRuleEntity', function () {
  return {
    'operator': null,
    'operators': [],
    'dimension': null,
    'selectedValues':[],
    'value': ''
  };
}).service('QueryDimensionEntity', function () {
  return {
     'columnName': '',
     'displayName': '',
     'dataType': '',
     'isLOV': false,
     'group':''
  };
}).service('QueryOperatorEntity', function () {
  return {
    'dataType': '',
    'dataTypeDisplayName': '',
    'sQLValue': '',
    'sQLDisplayName': ''
  };
}).service('QuerySetOperatorEntity', function () {
  return {
    'type': '',
    'key': '',
    'name': ''
  };
});



/***

Query BUILDER Entity:
setEntities: array of Query SET Entities
type: 'setOperation' or 'queryBuilder'

Query SET OPERATOR Entity:
type: 'parenthesis' or 'operator'

Query GROUP Entity:
group.source : 'source' or 'visual' or 'queryBuilder'

Query RULE Entity:
value : Can be an array, string, date object, integer, number, etc adhering to QueryDimension.datatype
dimension : Query DIMENSION Entity
operator : Query OPERATOR Entity

Query SET Entity:
sQLQuery : Actual SQL Query
jSON : JSON Data

***/
