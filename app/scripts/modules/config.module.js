'use strict';

 angular.module('saint-config', [])

.constant('Environment', {isHttps:false,apiEndpoint:'https://safety-02.dev.deloitteinnovation.space',boeEndpoint:'https://safety-02.dev.deloitteinnovation.space',backendHanaContext:'/secure/xsapi',userInfoService:'/admin/UserInfo.xsjs',boeSessionService:'/logon/trusted',backendSapContext:'/sap',saintContext:'/ui',boeContext:'/BOE',loginUrl:'dashboard.html',boeRestContext:'/secure/rptapi'})

;