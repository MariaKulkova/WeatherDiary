var Kinvey;
(function (Kinvey_1) {
    function initializeKinvey(completed) {
        Kinvey.initialize({
            appKey: 'kid_r1QVc221Z',
            appSecret: '719b3f1141ff44b2be957713973860ac',
            apiHostname: 'https://baas.kinvey.com'
        }).then(function (activeUser) {
            console.log("Kinvey auth " + activeUser);
            completed(true);
        }).catch(function (error) {
            completed(false);
            console.log(error);
        });
    }
    Kinvey_1.initializeKinvey = initializeKinvey;
    class AuthManager {
        constructor() { }
        signup(username, password) {
            var user = new Kinvey.User();
            let promise = user.signup({
                username: username,
                password: password
            }).then(function onSuccess(user) {
                console.log("sign up! " + user);
            }).catch(function onError(error) {
                // ...
            });
        }
        login(username, password) {
        }
        logout() {
            let promise = Kinvey.User.logout();
            promise = promise.then(function onSuccess() {
                console.log("Log out!");
            }).catch(function onError(error) {
                // ...
            });
        }
    }
    Kinvey_1.AuthManager = AuthManager;
})(Kinvey || (Kinvey = {}));
//# sourceMappingURL=KinveyAuth.js.map