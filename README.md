# To start the Application development

### Step 1 :

We have the _**ngconstant**_ task mentioned below is configured in the Gruntfile.js, And we have _**test**_, _**local**_, _**dev**_ profile configured. To Start development make sure your _**local**_ profile environment is configured with respectively.

    grunt.initConfig({
    ....
    ....
    ngconstant :{
    ...
      local:{
      ...
        Environment: { // ENV is the service which we inject into the application to access these keys
          isHttps: true,
          apiEndpoint: '',
          boeEndpoint: '',
          backendHanaContext:'/secure/xsapi',
          userInfoService:'/admin/UserInfo.xsjs',
          boeSessionService: '/logon/trusted',
          backendSapContext:'/sap',
          saintContext:'/ui',
          boeContext:'/BOE',
          loginUrl:'/secure/xsapi/login.xsjs',
          boeRestContext:'/secure/rptapi'
        }
        ...
      }
    ...
    }
    ...
    ...
    })


> We have _**isHttps**_ which is about storing the cookies in _HTTPS_ or _HTTP_ mode, it depends on the SAINT portal deployed on _HTTPS_ or _HTTP_

> We have _**apiEndpoint**_ which points to the Server for Backend API calls

> We have _**boeEndpoint**_   ...TBD

> We have _**backendHanaContext**_ which is the context path for SAINT backend API calls

> We have _**userInfoService**_   The XSJS service which is used to get the complete User Information

> We have _**boeSessionService**_   The XSJS service which is used to get the complete User BOE token

> We have _**backendSapContext**_ which is the context path for SAINT Login & Logout API calls

> We have _**saintContext**_ which is the SAINT application context path, used to open the SAINT portal

> We have _**boeContext**_   ...TBD

> We have _**loginUrl**_ which is the SAINT Login URL, used to open the SAINT Login Page

> We have _**boeRestContext**_   ...TBD

### Step 2 :

Pass the profile value for any grunt task, For example :
> grunt serve --P=local

Note : If you omit the _**--P**_ argument, default profile will be _**dev**_


----

# Grunt Tasks Available

#### To start the development for coding application functionality and test cases
> grunt server

or

> grunt serve

#### To validate the dist files are working and to run tests with all the available browsers
> grunt serve:dist

#### To validate build is working for the app folder, this excludes test
> grunt build

#### To validate test-cases are working for build
> grunt test

#### To validate test-cases are working in all the browsers
> grunt test:dist

#### To debug test-cases using the '_**Chrome**_' browser
> grunt test:debug

Note : 

 1. For any task which listed above can be used to send the profile value. If the profile value is ignored, the default profile is _**local**_.

 2. These tasks _**grunt test**_, _**grunt test:dist**_, _**grunt test:debug**_ runs on test profile, you should not pass any profile for testing.

----

# To Debug the Test Cases

We have _**grunt test**_ configured to debug the test cases. You need do the
following steps to start debugging.


### Step 1 :
Modify the _**plugins**_ in the _**test/karma.conf.js**_ as mentioned below


      plugins: [
          ...
         //'karma-coverage' //Comment this line
         ....
      ],

Note : Do not commit these changes which are done for debugging.


### Step 2 :
And now run the below command to start debugging the test cases.

> grunt test:debug

#Application privileges implementation in the UI


### UI controls
Check authorize.module.js for different decorators implementation 
To implement application privileges we need to add the privilege in constant.provider.js file under  constant.PRIVILEGES
 >To hide/show a control add authorize directive with the appropriate privilege 
 
    <div authorize="{{PRIVILEGES.PRIVILEGE_NAME}}">
    
 >To enable/disable call decorator.disbaled
 
    <button data-ng-disabled="decorator.disabled(PRIVILEGES.PRIVILEGE_NAME)">
    
 >To enable/disable click call decorator.disabled, if there is function call pass it with parameters
 
    <button data-ng-click="decorator.disabled(PRIVILEGES.PRIVILEGE_NAME,function,[function parameters within array])" 
 >Click function on charts
    .on('click', function (d) {
              if(AuthorizeService.hasPrivilege(ConstantService.PRIVILEGES.PRIVILEGE_NAME)) {
                  .. implementation
                  ..
                  ..
              }
            });

### Test Cases
   For test case we need to inject Authorize service, refer to the code snippet below:
   describe('ControllerClassName Controller', function () {
     var  AuthorizeService,otherServices;
     beforeEach(function () {
       module('saintApp');
       module('saint-authorize');
       inject(function ($injector,$controller, $rootScope) {
        
         AuthorizeService=$injector.get('AuthorizeService');
   
         ctrl = $controller('BipolarChartController', {
           $scope: scope,
           AuthorizeService: AuthorizeService
         });
       });
     });

 ### Confluence link for security matrix
    https://confluence.tools.deloitteinnovation.us/pages/viewpage.action?spaceKey=SAIN&title=Security+Matrix  
