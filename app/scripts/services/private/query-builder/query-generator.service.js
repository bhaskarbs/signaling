'use strict';
angular.module('saintApp').service('QueryGeneratorService',[ 'DateService','ConstantService','LanguageService', function (DateService,ConstantService,LanguageService ) {
  var queryGeneratorService = function (data) {
    angular.extend(this, data);
  };
  //Takes group entity as input and return the actual DB query
  queryGeneratorService.computeActualSQL = function(group) {
    var actualSQLObject = {};
    actualSQLObject.sql = '';
    actualSQLObject.errorType = null;
    if (!group){
      //return if null
      return actualSQLObject;
    }
    //iterate through the rules array
    for (var str = ConstantService.SET_QUERY_CONFIG.OB, i = 0; i < group.rules.length; i++) {
      if(group.source===ConstantService.SOURCE){
        if(group.rules[i].group && group.rules[i].group.source !==ConstantService.SOURCE){
          return queryGeneratorService.computeActualSQL(group.rules[i].group);
        }else{
          continue;
        }
      }
      if(i > 0){
        //add the group level operator AND , OR
        str +=  ' '+group.groupOperator.name + ' ';
      }
      //if child is a group then call the method again. Recursive calling until the depth is reached
      if(group.rules[i].group){
        var tmpObjectForGroup = queryGeneratorService.computeActualSQL(group.rules[i].group);
        //check if the returned sqlObject contains errors
        if(tmpObjectForGroup.errorType !==null){
          actualSQLObject.errorType = tmpObjectForGroup.errorType;
          return actualSQLObject;
        }else {
          str += tmpObjectForGroup.sql;
        }
      }else{
        //check if the dimension is empty
        if(group.rules[i].dimension ===null) {
          actualSQLObject.errorType = ConstantService.SET_EXPRESSION_ERROR_CODES.EMPTY_DIMENSION;
        }
        //check if the operator is empty
        else if(group.rules[i].operator ===null){
          actualSQLObject.errorType = ConstantService.SET_EXPRESSION_ERROR_CODES.EMPTY_OPERATOR;
        }
        //check if the values are not selected for the rule
        else if ((group.rules[i].operator.sQLDisplayName !== ConstantService.CASE_LIST_QUERY_IS_NULL && group.rules[i].operator.sQLDisplayName !== ConstantService.CASE_LIST_QUERY_IS_NOT_NULL)&&((group.rules[i].value===null || group.rules[i].value ==='') && group.rules[i].selectedValues.length===0 && !('value1' in group.rules[i]) && !('value2' in group.rules[i])) ||(('value1' in group.rules[i] && 'value2' in group.rules[i]) && (group.rules[i].value1===null || group.rules[i].value1==='' || group.rules[i].value2===null || group.rules[i].value2===''))){
          actualSQLObject.errorType = ConstantService.SET_EXPRESSION_ERROR_CODES.EMPTY_VALUE;
        }
        else{
          var value; //stores the actual value or values for dimensions. If dimension is of date type then value stores the date in required format
          if (!(group.rules[i].value instanceof Array) && group.rules[i].operator.dataType === ConstantService.FILTER_DATE_TEXT) { //check if value is not an array and the data type is date
            value = '\''+DateService.getDateSQLFormat(group.rules[i].value)+'\'';   //get SQL date format
          } else if (group.rules[i].value instanceof Array && group.rules[i].operator.dataType === ConstantService.FILTER_DATE_TEXT) { //check if value is an array and the data type is date
            value = [];
            for (var index = 0; index < group.rules[i].value.length; index++) {  //iterate through the values and store the respective date in the format required
              var dateValue = group.rules[i].value[index];
              value.push('\''+DateService.getDateSQLFormat(dateValue)+'\'');
            }
          } else if (group.rules[i].value instanceof Array && group.rules[i].operator.dataType === ConstantService.SQL_NUMERIC) {
            value = [];
            for (var idx = 0; idx < group.rules[i].value.length; idx++) {  //iterate through the values and store the respective date in the format required
              var multiValue = group.rules[i].value[idx];
              value.push(multiValue);
            }
          } else {
            if (angular.isObject(group.rules[i].value)) {
              value = group.rules[i].value.name; //if value is an object
            } else {
              value = group.rules[i].value;  //if the value is not date type stores as it is, single value or Array
            }
          }
          // Modified the string as per required payload for query
          switch (group.rules[i].operator.sQLDisplayName) {  // check wat is the condition type
            case ConstantService.CASE_LIST_QUERY_BETWEEN:
              str += parseInt(value[1]) > parseInt(value[0]) ? '\"' + group.rules[i].dimension.columnName + '\"' + ' ' + ConstantService.SQL_GREATER_EQUAL + ' ' + value[0] + ' ' + ConstantService.SMALL_AND + ' ' + '\"' + group.rules[i].dimension.columnName + '\"' + ' ' + ConstantService.SQL_LESS_EQUAL + ' ' + value[1] :
              '\"' + group.rules[i].dimension.columnName + '\"' + ' ' + ConstantService.SQL_GREATER_EQUAL + ' ' + value[1] + ' ' + ConstantService.SMALL_AND + ' ' + '\"' + group.rules[i].dimension.columnName + '\"' + ' ' + ConstantService.SQL_LESS_EQUAL + ' ' + value[0];
              break;
            case ConstantService.INCLUDES:
              str += ConstantService.SET_QUERY_CONFIG.OB;
              value = group.rules[i].selectedValues || group.rules[i].value;
              var nullString = '', str1 = '\"' + group.rules[i].dimension.columnName + '\"' + ' ' + ConstantService.IN + ' ' + ConstantService.SET_QUERY_CONFIG.OB, flag = false;
              for (var index1 = 0; index1 < value.length; index1++) {
                var val = value[index1].name || value[index1];
                if (val !== 'null') {
                  flag = true;
                  str1 += group.rules[i].operator.dataType === ConstantService.FILTER_LIST_KEY_TEXT ? '\'' + val + '\'' : val;
                  str1 += ',';
                } else {
                  nullString = ConstantService.SET_QUERY_CONFIG.OB + '\"' + group.rules[i].dimension.columnName + '\"' + ' ' + ConstantService.IS + ' ' + val + ConstantService.SET_QUERY_CONFIG.CB;
                }
              }
              str1 = str1.slice(0, -1);
              str1 += ConstantService.SET_QUERY_CONFIG.CB;
              str += flag ? str1 + (nullString ? ' ' + ConstantService.OR + ' ' + nullString + ConstantService.SET_QUERY_CONFIG.CB : ConstantService.SET_QUERY_CONFIG.CB) : nullString + ConstantService.SET_QUERY_CONFIG.CB;
              break;
            case ConstantService.CONTAINS_SMALL:
              str += ConstantService.CONTAINS_BIG + '("' + group.rules[i].dimension.columnName + '"' + ',' + '\'*' + value + '*\')';
              break;
            case ConstantService.DOESNOT_CONTAIN_SMALL:
              str += ConstantService.DOESNOT_CONTAIN_BIG + '("' + group.rules[i].dimension.columnName + '"' + ',' + '\'*' + value + '*\')';
              break;
            case ConstantService.CASE_LIST_QUERY_IS_NULL: //check if the rule is for null
              str += '\"' + group.rules[i].dimension.columnName + '\"' + ' ' + ConstantService.CASE_LIST_QUERY_IS_NULL;
              break;
            case ConstantService.CASE_LIST_QUERY_IS_NOT_NULL: //check if the rule if for not null
              str += '\"' + group.rules[i].dimension.columnName + '\"' + ' ' + ConstantService.CASE_LIST_QUERY_IS_NOT_NULL;
              break;
            default:
              var sqlOperator = value !== 'null' ? group.rules[i].operator.sQLValue : ConstantService.IS;
              str += '\"' + group.rules[i].dimension.columnName + '\"' + ' ' + sqlOperator + ' ' + (value !== 'null' && group.rules[i].operator.dataType === ConstantService.FILTER_LIST_KEY_TEXT ? '\'' + value + '\'' : value);
          }
        }
      }
      if (actualSQLObject.errorType !== null) {
        return actualSQLObject;
      }
    }
    actualSQLObject.sql = str + ConstantService.SET_QUERY_CONFIG.CB;
    return actualSQLObject;
  };
//Takes group entity as input and return the display DB query
  queryGeneratorService.computeDisplaySQL = function(group) {
    if (!group) {
      return '';
    }  // return if null
    for (var str = ConstantService.SET_QUERY_CONFIG.OB, i = 0; i < group.rules.length; i++) {  //iterate through the rules array
      if(group.source===ConstantService.SOURCE){
        if(group.rules[i].group && group.rules[i].group.source !==ConstantService.SOURCE){
          return queryGeneratorService.computeDisplaySQL(group.rules[i].group);
        }else{
          continue;
        }
      }
      if(i > 0){
        //add the group level operator AND , OR
        str +=  ' <b>'+group.groupOperator.name + '</b> ';
      }
      if(group.rules[i].group){
        str += queryGeneratorService.computeDisplaySQL(group.rules[i].group);  //if child is a group then call the method again. Recursive calling until the depth is reached
      }else{
        var value;  //stores the actual value or values for dimensions. If dimension is of date type then value stores the date in required format
        if(!(group.rules[i].value instanceof Array) && group.rules[i].operator.dataType === ConstantService.FILTER_DATE_TEXT){  //check if value is not an array and the data type is date
          value = DateService.getDateDISPFormat(group.rules[i].value);   //get display date format
        }else if(group.rules[i].value instanceof Array && group.rules[i].operator.dataType === ConstantService.FILTER_DATE_TEXT) {//check if value is an array and the data type is date
          value = [];
          for(var index=0;index< group.rules[i].value.length;index++){  //iterate through the values and store the respective date in the format required
            var dateValue  =  group.rules[i].value[index];
            value.push(DateService.getDateDISPFormat(dateValue));
          }
        }else if(group.rules[i].value instanceof Array && group.rules[i].operator.dataType === ConstantService.SQL_NUMERIC) {
          value = [];
          for(var idx=0;idx< group.rules[i].value.length;idx++){  //iterate through the values and store the respective date in the format required
            var multiValue  =  group.rules[i].value[idx];
            value.push(multiValue);
          }
        } else {
          if(angular.isObject(group.rules[i].value)){
            value=  group.rules[i].value.name; //if value is an object
          }else{
            value = group.rules[i].value;  //if the value is not date type stores as it is, single value or Array
          }
        }
        switch(group.rules[i].operator.sQLDisplayName) { // check wat is the condition type
          case ConstantService.CASE_LIST_QUERY_BETWEEN:
            str +=  group.rules[i].dimension.displayName+ ' ' +group.rules[i].operator.sQLDisplayName+ ' ' + value[0] +' '+LanguageService.MESSAGES.DISP_SQL_SMALL_AND+' ' + value[1];
            break;
          case ConstantService.INCLUDES:
            str += group.rules[i].dimension.displayName + ' '+group.rules[i].operator.sQLDisplayName+'(\'';
            value = group.rules[i].selectedValues||group.rules[i].value;
            for(var index1=0;index1< value.length;index1++){
              var val  =  value[index1].name||value[index1];
              str += val;
              str += index1< value.length-1? ' , ':'';
            }
            str += '\')';
            break;
          case ConstantService.CONTAINS_SMALL:
            str += group.rules[i].dimension.displayName + ' ' +group.rules[i].operator.sQLDisplayName+ ' \''+ value+'\'';
            break;
          case ConstantService.DOESNOT_CONTAIN_SMALL:
            str += group.rules[i].dimension.displayName + ' ' +group.rules[i].operator.sQLDisplayName + ' \''+ value+'\'';
            break;
          case ConstantService.CASE_LIST_QUERY_IS_NULL: //check if the rule is for null
            str += '\"'+group.rules[i].dimension.columnName+'\"' + ' ' + ConstantService.CASE_LIST_QUERY_IS_NULL;
            break;
          case ConstantService.CASE_LIST_QUERY_IS_NOT_NULL: //check if the rule if for not null
            str += '\"'+group.rules[i].dimension.columnName+'\"' + ' ' + ConstantService.CASE_LIST_QUERY_IS_NOT_NULL;
            break;
          default:
            str += group.rules[i].dimension.displayName + ' ' + group.rules[i].operator.sQLDisplayName + ' ' + (group.rules[i].operator.dataType === ConstantService.FILTER_LIST_KEY_TEXT?  '\''+ value+'\'':value) ;
        }
      } }
    if(str.length === 1 && str.charAt(0) === ConstantService.SET_QUERY_CONFIG.OB){
      return ConstantService.EMPTY_STRING;
    }
    return str + ConstantService.SET_QUERY_CONFIG.CB;
  };
  /*
  * computeSQLForSets - Takes set Expression like A INTERSECTION (B UNION C) as input and returns the full expanded expression as output
  * needs setEntities Array of object type 'QuerySetEntity' to access the group object
  * returns setSQL
  * */
  queryGeneratorService.computeSQLForSets = function (querybuilderObj, sourceQry){
    // return object containing display and actual sql
    var setSql = {};
    //holds the expanded output expression for HANA
    setSql.actualSQL = '';
    //holds the expanded output expression for display
    setSql.DisplaySQL = '';
    //holds the type of error, if there is no error defaults to 0
    setSql.errorType = null;
    var expEntity = querybuilderObj.expressionEntity;
    var isParenthesesBalanced = queryGeneratorService.checkForBalancedParentheses(expEntity);
    if(!isParenthesesBalanced) {
      setSql.errorType = ConstantService.SET_EXPRESSION_ERROR_CODES.BRACKETS_NOT_BALANCED;
      return setSql;
    }
    var setEntities = querybuilderObj.setEntities;
    //store the set query config constants locally
    var setQueryConfig = ConstantService.SET_QUERY_CONFIG;
    //holds each set mapping with the name as key
    var setsMap = {};
    //instantiate the map to hold the name value pair
    angular.forEach(setEntities,function(set) {
        setsMap[''+set.setId] = set;
      //check if any of the set is Empty and its not the only set with source filter
       if((queryGeneratorService.isSetEmpty(set) && (setEntities.length>1)) ||
         (setEntities.length===1 && setEntities[0].jSON.group.source !== ConstantService.SOURCE && setEntities[0].jSON.group.rules.length===0)){
         setSql.errorType = ConstantService.SET_EXPRESSION_ERROR_CODES.EMPTY_SET;
       }
      }
    );
    if(setSql.errorType !==null){
      return setSql;
    }
    var normalizedExpEntity = queryGeneratorService.normalizeExpressionArray(expEntity);
    //loop through each item and build a expanded expression for actual sql
    angular.forEach(normalizedExpEntity,function(exp){
      if(''+exp.data.setId in setsMap){
        var tmpActualSQLObject = queryGeneratorService.computeActualSQL(setsMap[''+exp.data.setId].jSON.group);
        setSql.actualSQL = setSql.actualSQL +tmpActualSQLObject.sql + ' ' ;
        setSql.errorType = tmpActualSQLObject.errorType;
      }else{
        setSql.actualSQL = setSql.actualSQL + setQueryConfig.DB_SET[exp.data.name] + ' ' ;
      }
    });
    if(setSql.errorType !==null){
      return setSql;
    }
    //loop through each item and build a expanded expression for display sql
    // If Source Query -> (Source Query AND Rule1) <Expression> (Source Query AND Rule2)
    angular.forEach(expEntity,function(exp){
      if(''+exp.data.setId in setsMap){
        var displayQuery = queryGeneratorService.computeDisplaySQL(setsMap[''+exp.data.setId].jSON.group);
        if(displayQuery && sourceQry) {
          displayQuery = ' <b>' + ConstantService.AND + '</b> ' + displayQuery;
        }
        displayQuery = sourceQry? ConstantService.SET_QUERY_CONFIG.OB+ sourceQry + ' ' + displayQuery + ConstantService.SET_QUERY_CONFIG.CB : displayQuery;
        setSql.DisplaySQL = displayQuery?setSql.DisplaySQL + displayQuery + ' ': setSql.DisplaySQL + displayQuery ;
      }else{
        setSql.DisplaySQL = setSql.DisplaySQL +' <b>'+ setQueryConfig[exp.data.name] + '</b> ' ;
      }
    });
    return setSql;
  };

  /*
   * normalizeExpressionArray - Normalizes an expression array by adding brackets and make sure the execution happens from left to right
   * For example A UNION B INTERSECTION C will result in ((A UNION B) INTERSECTION C). By adding brackets it will negate the operator precedence
   * */
  queryGeneratorService.normalizeExpressionArray = function (expArr){
    var parenthesisConfig = [
      {'type': ConstantService.SET_QUERY_CONFIG.SET_OPERATION_BRACKET, 'name': ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPEN_BRACKET},
      {'type': ConstantService.SET_QUERY_CONFIG.SET_OPERATION_BRACKET, 'name': ConstantService.SET_QUERY_CONFIG.SET_OPERATION_CLOSE_BRACKET}
    ];
    var expArrCpy = angular.copy(expArr);
    var operatorCountAtLevel = 0;
    for (var i=0;i<expArrCpy.length;i++){
      if(expArrCpy[i].data.type === ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPERAND){
        if(operatorCountAtLevel>0){
          expArrCpy.splice(i+1,0,{'id': ConstantService.GENERATE_SET_ID(), 'data':parenthesisConfig[1]});
          i++;
        }
        operatorCountAtLevel++;
      }
      //if opening bracket is encountered
      if(expArrCpy[i].data.name === ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPEN_BRACKET){
        var bracketBalance=1;
        var operandCount =0;
        //find a matching closing bracket with bracket
        for(var m = i+1; m<expArrCpy.length && bracketBalance!==0; m++){
          if(expArrCpy[m].data.name === ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPEN_BRACKET) {
            bracketBalance++;
          }
          if(expArrCpy[m].data.name === ConstantService.SET_QUERY_CONFIG.SET_OPERATION_CLOSE_BRACKET){
            bracketBalance--;
          }
          if(expArrCpy[m].data.type === ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPERAND){
            operandCount++;
          }
        }
        //now we have the positions of the inner expression contained within brackets

        // if total number of operands is greater than 2 then send the inner expression for furthur processing
        if(operandCount>2){
          var arrSubset = expArrCpy.slice(i+1,m-1);
          //pass the inner expression for normalization
          var arrModified = queryGeneratorService.normalizeExpressionArray(arrSubset);
          //append the normalized inner expression inside the brackets replacing the previous expression
          Array.prototype.splice.apply(expArrCpy, [i+1,arrSubset.length].concat(arrModified));
          // move the counter(i) after the brackets
          i=i+arrModified.length+1;
          expArrCpy.splice(++i,0,{'id': ConstantService.GENERATE_SET_ID(), 'data':parenthesisConfig[1]});
        }
        //if operands are less than 3 then just move the i counter
        else{
          i=m-1;
          if(operatorCountAtLevel>0){
            expArrCpy.splice(++i,0,{'id': ConstantService.GENERATE_SET_ID(), 'data':parenthesisConfig[1]});
          }
        }
        operatorCountAtLevel++;
      }
    }
    if(operatorCountAtLevel>0){
      for(var j=1; j<operatorCountAtLevel; j++){
        expArrCpy.splice(0,0,{'id': ConstantService.GENERATE_SET_ID(), 'data':parenthesisConfig[0]});
      }
    }
    return expArrCpy;
  };
  /*
   * isSetEmpty -
   * returns boolean true if the set is empty and false if the set has rules
   * */
  queryGeneratorService.isSetEmpty = function (qbSet) {
    var isSetEmpty = false;
    //check if the set contains source filters
    if(qbSet.jSON.group.source===ConstantService.SOURCE){
      //iterate over
      angular.forEach(qbSet.jSON.group.rules,function(rule){
        if('group' in rule && rule.group.source !==ConstantService.SOURCE && rule.group.rules.length === 0){
          isSetEmpty= true;
        }
      });
    }
    //if the set is without source filters
    else if(qbSet.jSON.group.rules.length===0){
          isSetEmpty= true;
    }
    return isSetEmpty;
  };
  queryGeneratorService.checkForBalancedParentheses = function (expArr){
    var index = 0;
    /* Declare an empty character stack */
    var stack = [];
    /* Traverse the given expression to check matching parenthesis */
    while (expArr[index])
    {
      /*If the exp[i] is a starting parenthesis then push it*/
      if (expArr[index].data.name === ConstantService.SET_QUERY_CONFIG.SET_OPERATION_OPEN_BRACKET)
      {
        stack.push(expArr[index]);
      }
      /* If exp[i] is a ending parenthesis then pop from stack */
      if (expArr[index].data.name === ConstantService.SET_QUERY_CONFIG.SET_OPERATION_CLOSE_BRACKET)
      {
        /*If we see an ending parenthesis without a pair then return false*/
        if (stack.length === 0){
          return 0;
        }
        stack.pop();
      }
      index++;
    }
    /* If there is something left in expression then there is a starting
     parenthesis without a closing parenthesis */
    if (stack.length > 0) {
      return 0 ; /*balanced*/
    }
    else {
      return 1 ; /*not balanced*/
    }
  };
  return queryGeneratorService;
}]);
