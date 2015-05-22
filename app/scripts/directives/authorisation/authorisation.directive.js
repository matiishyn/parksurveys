angular.module('parksurveys').directive('authorisation', (AuthService, $rootScope) => {
    "use strict";
    return {
        //transclude: true,
        templateUrl: '/scripts/directives/authorisation/authorisation.html',
        link: (scope) => {
            /**
             * States of 'authorisation' directive
             * - authentication - shows screen with phone number input
             * - authorisation - shows screen with CodeFromSms input
             */

            scope.state = 'authentication';
            scope.sendPhoneNumber = sendPhoneNumber;
            scope.verifySmsCode = verifySmsCode;
            scope.goToAuthentication = goToAuthentication;

            // models
            scope.model = {
                phoneNumber: null,
                smsCode: null
            };
            //scope.phoneNumber = '';
            //scope.smsCode = '';

            function sendPhoneNumber() {
                AuthService.sendPhoneNumber({phone: '' + scope.model.phoneNumber}).$promise.then((response)=> {
                    console.log(response);
                    goToAuthorisation();
                });
            }

            function verifySmsCode() {
                AuthService.verifyCode({
                    phone: '' + scope.model.phoneNumber,
                    code: '' + scope.model.smsCode
                }).$promise
                    .then((response)=> {
                        console.log(response);
                        if (data.token) {
                            $rootScope.authRef.$authWithCustomToken(data.token).then((authData) => {
                                const id = authData.uid;
                                const phone = parseInt(this.user.phone);

                                this.user.uid = id;

                                if (!($firebaseObject(usersRef.child(id)).phone)) {
                                    usersRef.child(id).set({
                                        phone: phone,
                                        role: 'user'
                                    });
                                }
                            });
                        }
                    });
            }

            function goToAuthorisation() {
                scope.state = 'authorisation';
            }

            function goToAuthentication() {
                scope.state = 'authentication';
            }
        }
    };
});