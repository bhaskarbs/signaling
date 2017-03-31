var structure=function(){};
structure.grunt=null;
structure.data={
  windowsPlatform : 'win32',
  macPlatform : 'darwin',
  actualBrowsers : ['PhantomJS','Firefox'],
  platform : '',
  app : '',
  src : '',
  test : ''
};

structure.loadBrowsers=function(){
  try{
    var data=structure.data;
    data.platform = process.platform;
    if(data.platform.toLowerCase()===data.windowsPlatform){
      data.actualBrowsers.push('IE');
      data.actualBrowsers.push('Chrome');
    }else if(data.platform.toLowerCase()===data.macPlatform){
      data.actualBrowsers.push('Safari');
      data.actualBrowsers.push('Chrome');
    }
  }catch(e){}
};
structure.getBrowsers=function(){
  return structure.data.actualBrowsers;
};
structure.getModifiedAppPath=function(sourceFilePath,destinationFilePath,indexToConsiderFromPath,ignoreFolderPath){
  var splitSourceFilePath = sourceFilePath.split('/');
  var modifiedAppFilePath = destinationFilePath;
  for (var j = indexToConsiderFromPath; j < splitSourceFilePath.length; j++) {
    if (ignoreFolderPath && ignoreFolderPath.length > 0 && ignoreFolderPath.indexOf(splitSourceFilePath[j]) > -1) {
      splitSourceFilePath[j] = '';
    }
    modifiedAppFilePath += splitSourceFilePath[j];
    if (j < splitSourceFilePath.length - 1 && splitSourceFilePath[j] !== '') {
      modifiedAppFilePath += '/';
    }
  }
  structure.grunt.log.write('\n >>File src path --> ' + sourceFilePath);
  structure.grunt.log.write('\n >>File identified path --> ' + modifiedAppFilePath);
  return modifiedAppFilePath;
};
structure.handleFileMove=function(action, filepath){
  var lowerCaseFilePath = filepath.toLowerCase();
  var data=structure.data;

  if (filepath.substr(0, 4) === data.src+'/') {
    var isPrivate = (function () {
      return filepath.indexOf('private/') > -1;
    })();
    var isPublic = (function () {
      return filepath.indexOf('public/') > -1;
    })();
    var isCommon = (function () {
      return filepath.indexOf('common/') > -1;
    })();
    var extension = lowerCaseFilePath.substr(lowerCaseFilePath.lastIndexOf('.'));
    var isView = (function () {
      return ['.htm', '.html'].indexOf(extension) > -1;
    })();
    var isStyle = (function () {
      return ['.scss', '.css'].indexOf(extension) > -1;
    })();
    var isImage = (function () {
      return ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].indexOf(extension) > -1;
    })();
    var isJson = (function () {
      return ['.json'].indexOf(extension) > -1;
    })();
    var isScript = (function () {
      return ['.js'].indexOf(extension) > -1;
    })();

    var index, ignoreFolderPath, destination, newModifiedAppPath;
    if (isImage) {
      index = 2;
      destination = data.app + '/images/';
      if(isCommon){
        ignoreFolderPath = 'common/images';
      }else {
        ignoreFolderPath = 'images/';
      }
    }else if (isStyle) {
      var isNeedToPlaceInStyles = (function(){
        return filepath.indexOf('private.')>-1 || filepath.indexOf('public.')>-1;
      })();
      index = 3;
      destination = data.app + '/styles/';
      if(isCommon || isNeedToPlaceInStyles){
        ignoreFolderPath = 'common/';
      }else{
        index = 2;
        ignoreFolderPath = null;
      }
    }else if (isView) {
      if (isPrivate || isPublic || isCommon) {
        destination = data.app + '/views/';
        if(isCommon){
          index = 3;
          ignoreFolderPath = 'common/';
        }else{
          index = 2;
          ignoreFolderPath = null;
        }
      } else {
        destination = data.app + '/';
        index = 1;
        ignoreFolderPath = null;
      }
    }else if (isJson) {
      ignoreFolderPath = null;
      var pathList = lowerCaseFilePath.split('/');
      var isTestJson = (function () {
        return lowerCaseFilePath.indexOf('.test.json') > -1;
      })();
      var isLangJson=(function(){
        return lowerCaseFilePath.indexOf('.lang.json')>-1;
      })();
      if(isTestJson){
        destination = data.test + '/spec/fixtures/';
        index = pathList.length-1;
      }else if(isLangJson){
        destination = data.app + '/languages/';
        index = pathList.length-2;
      }else{
        destination = data.app + '/fixtures/';
        index = pathList.length-1;
      }
    }else if (isScript) {
      var isTest = (function () {
        return lowerCaseFilePath.indexOf('.test.js') > -1;
      })();
      var isController = (function () {
        return lowerCaseFilePath.indexOf('.controller.') > -1;
      })();
      var isDirective = (function () {
        return lowerCaseFilePath.indexOf('.directive.') > -1;
      })();
      var isService = (function () {
        return lowerCaseFilePath.indexOf('.service.') > -1;
      })();
      var isFactory = (function () {
        return lowerCaseFilePath.indexOf('.factory.') > -1;
      })();
      var isFilter = (function () {
        return lowerCaseFilePath.indexOf('.filter.') > -1;
      })();
      var isProvider = (function () {
        return lowerCaseFilePath.indexOf('.provider.') > -1;
      })();
      var isConstant = (function () {
        return lowerCaseFilePath.indexOf('.constant.') > -1;
      })();
      var isModule = (function () {
        return lowerCaseFilePath.indexOf('.module.') > -1;
      })();
      if(isModule){
        index = 2;
        destination = data.app + '/scripts/modules/';
        ignoreFolderPath = null;
        if(isTest){
          destination = data.test + '/spec/modules/';
        }
        if(isCommon){
          index = 3;
          ignoreFolderPath = 'common/modules';
        }
      }else if(isConstant){
        index = 2;
        destination = data.app + '/scripts/constants/';
        ignoreFolderPath = null;
        if(isTest){
          destination = data.test + '/spec/constants/';
        }
        if(isCommon){
          index = 3;
          ignoreFolderPath = 'common/constants';
        }
      }else if(isProvider){
        index = 2;
        destination = data.app + '/scripts/providers/';
        ignoreFolderPath = null;
        if(isTest){
          destination = data.test + '/spec/providers/';
        }
        if(isCommon){
          index = 3;
          ignoreFolderPath = 'common/providers';
        }
      }else if(isFilter){
        index = 2;
        destination = data.app + '/scripts/filters/';
        ignoreFolderPath = null;
        if(isTest){
          destination = data.test + '/spec/filters/';
        }
        if(isCommon){
          index = 3;
          ignoreFolderPath = 'common/filters';
        }
      }else if(isFactory){
        index = 2;
        destination = data.app + '/scripts/factories/';
        ignoreFolderPath = null;
        if(isTest){
          destination = data.test + '/spec/factories/';
        }
        if(isCommon){
          index = 3;
          ignoreFolderPath = 'common/factories';
        }
      }else if(isService){
        index = 2;
        destination = data.app + '/scripts/services/';
        ignoreFolderPath = null;
        if(isTest){
          destination = data.test + '/spec/services/';
        }
        if(isCommon){
          index = 3;
          ignoreFolderPath = 'common/services';
        }
      }else if(isDirective){
        index = 2;
        destination = data.app + '/scripts/directives/';
        ignoreFolderPath = null;
        if(isTest){
          destination = data.test + '/spec/directives/';
        }
        if(isCommon){
          index = 3;
          ignoreFolderPath = 'common/directives';
        }
      }else if(isController){
        index = 2;
        destination = data.app + '/scripts/controllers/';
        ignoreFolderPath = null;
        if(isTest){
          destination = data.test + '/spec/controllers/';
        }
        if(isCommon){
          index = 3;
          ignoreFolderPath = 'common/controllers';
        }
      }else{
        index = 1;
        destination = data.app + '/';
        ignoreFolderPath = null;
      }
    }else{
      index = 1;
      destination = data.app + '/';
      ignoreFolderPath = null;
    }
    newModifiedAppPath = structure.getModifiedAppPath(filepath, destination, index, ignoreFolderPath);

    if (action !== 'deleted') {
      structure.grunt.file.copy(filepath, newModifiedAppPath);
    } else {
      structure.grunt.file.delete(newModifiedAppPath);
    }
    structure.grunt.log.write('\n >>File '+action+' path --> ' + newModifiedAppPath + '\n\n');
  }
};


structure.handleWatch=function(){
  structure.grunt.event.on('watch', function(changeType, modifiedFile) {
    if(structure.data.platform.toLowerCase()===structure.data.windowsPlatform){
      modifiedFile = structure.grunt.file.expand(modifiedFile);
      modifiedFile = modifiedFile[0];
    }
    structure.handleFileMove(changeType,modifiedFile);
  });
};

structure.createTasks=function(){
  structure.grunt.registerTask('copysrctoapp','Moving src/ --> app/',function(){
    var sourcePaths=[
      structure.data.src+'/**/*.{png,jpg,jpeg,gif,webp,svg,js,html,htm,scss,css,json,ico,txt}',
      structure.data.src+'/.{htaccess,buildignore}'
    ];
    for(var j=0;j<sourcePaths.length;j++){
      var files = structure.grunt.file.expand(sourcePaths[j]);
      for(var i=0;i<files.length;i++){
        structure.handleFileMove('added',files[i]);
      }
    }
  });
};
structure.init=function(data){
  if(data && data.hasOwnProperty('app')){
    structure.data.app=data.app;
  }
  if(data && data.hasOwnProperty('src')){
    structure.data.src=data.src;
  }
  if(data && data.hasOwnProperty('test')){
    structure.data.test=data.test;
  }
  if(data && data.hasOwnProperty('grunt')){
    structure.grunt=data.grunt;
  }
  structure.loadBrowsers();
  structure.handleWatch();
  structure.createTasks();
};
exports.structure=structure;
