'use strict';
describe('LoginController Controller', function() {
    var userEmail, scope, value, Environment, ctrl, alertService, CookieService, logService, LanguageService;
  Environment = {
        'loginUrl':'#?SAMLRequest=sdfsdSMPORTALURL=dfsafds&&SAMLRequest=dfsdsdfs&SMAUTHREASON=dddddd&&SMAGENTNAME=dddddd&TARGET=fZJNT%2BMwEIbvSPwHy%2Fd8tMvHympSdUGISuwS0cCBm%2BtMUwfbk%2FU4zfLvSVMq2Euv45n3fd7xzOb%2FrGE78KTRZXwSp5yBU1hpV2f8ubyLfvJ5fn42I2lNKxZd2Lon%2BNsBBTZMOhLjQ8Y77wRK0iSctEAiKLFa%2FH4Q0zgVrceACg1ny9uMy7rCdaM2%2Bs0BWrtppK2UAdeoVjW2ruq1bevGImcvR6zpHmtJ1MHSUZAuDKU0vY7Si2h6VU5%2BiMuJuLx65az4dPql3SHBKaz1oYnEfVkWUfG4KkeBna7A%2Fxm6M14j1gZihZazBRH4MODcoKPOgl%2BB32kFz08PGd%2BG0JJIkr7v46%2BhRCaEpod17DCRivYZCkmkd4N28B3wfNyrGKP5bws9DS6PKDz%2FMpsl36Tyz%2F%2Fax1jeFmi0emcLY7C%2F8SDD0Z7dobcynHbbV3QVbcZW0TlqQemNhoqzJD%2B4%2Fn8Yw7l8AA%3D%3D'
    };
    value = false;
    userEmail = 'user';
    beforeEach(function() {
        module('saintApp');
        inject(function($injector, $controller, $rootScope) {
            CookieService = $injector.get('CookieService');
            logService = $injector.get('logService');
            alertService = $injector.get('alertService');
            LanguageService = $injector.get('LanguageService');
            alertService = $injector.get('alertService');
            scope = $rootScope.$new();
            spyOn(CookieService, 'get').and.returnValue('user');
            ctrl = $controller('LoginController', {
                $scope: scope,
                Environment: Environment,
                logService: logService,
                alertService: alertService,
                LanguageService: LanguageService,
                CookieService: CookieService
            });
        });
    });

    it('Should exists', function() {
        expect(ctrl).toBeDefined();
    });

    it('Should have Methods defined in it', function() {
        expect(scope.fnInit).toBeDefined();
        expect(scope.fnEvaluateParameters).toBeDefined();
        expect(scope.fnErrorMessage).toBeDefined();
        expect(scope.fnLoadUserName).toBeDefined();
        expect(scope.fnSaveUserName).toBeDefined();
        expect(scope.$watch).toBeDefined();
    });

    it('Should call fnErrorMessage() function', function() {
        scope.fnErrorMessage();
    });

    it('Should call fnEvaluateParameters() function when condition success', function() {
        Environment = {
        'loginUrl': '#?SMQUERYDATA=-SM-7N8%2b2VnGO%2b62BhQPQ23cZuGPgXiy4I5ePEBiLEZyXo%2bcQImE5B1RNZmkzBNLjd2JOrGJzRkGZ39IgSYojWZ3nlYoWfJe4XXhDRQ%2bYisQc6dqN%2b0q8Igv%2feqHj%2fn2QmhfFG64GxBXMuSeulnlcTQ6%2bITS9hdEESMxWpSFN33rt%2bYxDf4o6qEAKfDPXP1eEpykO%2flV383fNj2bbibPvfwcg9wzoppgpvO%2bQKzh0yQBqqG5cy0IljXw3qHKq6Di%2bAWdvk5fHx0hYrMZP%2b8nD42L6JKRd2qv1hf%2biFoMJ%2bUOjPSV7jHTP0MCstj%2b93YbhMdVzzymOSA%2fcmShqOVseXMCOL8TKdR99qYKpvi2x4mIo2M%2bpEHVThqCGE1FCtV1SpjiqsROVKB%2fxTozJa%2f339PdTQvWn1zkW6tJgiT9F4GIcMtNFWV7zFfkZV3TOV9mKHxJ33mupL1cu%2bo8qtQrdnY1nW3Xk6824pJgNkYTgxNbmdEUbM5TTLpBlv3WqqCERDe5tdwvqfAIe6Gzfbt6T7AWc45jaAphfvT68fCGgF78ZAfNCDcDG%2bw1G%2fMzTp8MD9%2fZthWfYcm7zRvZl1s2r%2bFj0TiNx4mxbIW%2bfXNAe99YeUYJfPSzRKMuMfTIFtAQ3kKE8O%2bFup2jiUSn2rD4IfC3vETuPw1t6Ne%2f9HJXGVRzQhqQt6sn5tCBcZ19AR8XqPrjDaCtJ1AXC3qzNclBVdoXibuBiOU5catTj4EDPBhQ434CB97SnYmE6GEGh%2fxhtJdEBHXFbBg9Y8mHeotKfLw1zEsi%2fssBkKVPHulZMCpYuATBInipl4Bc2b6jjUp%2fwL74e%2frHVeX%2bam0nagg1ZZKgI68bAcDMc2uEL6Dn0iYY%2bPhGaneP7FmismOWg29C70ycGv0nGEomNsiyzLLZ6Cy7hWJ%2f8fvLjUBsv5uqdJDTeMSGiU2IfPDt3qXjmjXkqGB9faIMJHycXSQSUummEpZLvlbzsDnTt9qRQjBj9uIovXZ6PEmEoO79p3PeZVx2cjMaZI%2bGi%2f2zHbg6AmEjyC9o%2b9xddZtCSxYuSIkiHzkvB68FmSDomi0Yu1pBVaRn8TYGwlCsec%2bXC5lusbM8XrKM1v0zs1xxMqQE0XHbMXcAUF3UUViZXrLqmzEsRtq9dVKUlKPpjjXxWUVjcXReKDf22X6%2bKGuNOWRkmj9iN35UN8dnYQuNg57L1whj3MDfBBGbOZCb98RBLEhwUK82G2ClAD2iekjfX2F5yvK3HyYe2c3Nj5Fcsi30jkJ9xpPhEiqsh17aexOihIgCc%2f6Z7wDHbmM1lV%2bmdQjTMzrTGaETSUqs1Ka8dM8ysW5xYTQxGyt7gkFCIn%2fqrJZ%2fTfFZCmpbmlNLF1iMRUydMb8J4Nq0iLbxqNT4392b8AejJTAWfPCc'
    };
    
        scope.fnEvaluateParameters();
        
    });
    it('Should call fnEvaluateParameters() function when condition failed', function() {
        scope.fnEvaluateParameters();
      });

    it('Should call fnLoadUserName() function', function() {
        scope.fnLoadUserName();
        expect(scope.login.userName).toBe(userEmail);
        expect(scope.login.remember).toBe(true);

    });

    it('Should call fnSaveUserName() function', function() {
        scope.loginForm = {
            USER: 'user'
        };
        scope.fnSaveUserName();
    });

    it('Should call $watch() when value true', function() {
        scope.loginForm = {
            USER: 'user'
        };
        scope.$digest();
    });

    it('Should call $watch() when value false', function() {
        scope.login = {
            userName: 'user',
            remember: false
        };
        scope.loginForm = {
            USER: 'user'
        };
        scope.$digest();
        expect(userEmail).toBe('user');
    });
});
