var Kinvey;
(function (Kinvey_1) {
    function initializeKinvey() {
        Kinvey.initialize({
            appKey: 'kid_r1QVc221Z',
            appSecret: '719b3f1141ff44b2be957713973860ac',
            apiHostname: 'https://baas.kinvey.com'
        }).then(function (activeUser) {
            console.log(activeUser);
        })["catch"](function (error) {
        });
    }
    Kinvey_1.initializeKinvey = initializeKinvey;
    var AuthManager = (function () {
        function AuthManager() {
        }
        AuthManager.prototype.signup = function (username, password) {
            var user = new Kinvey.User();
            var promise = user.signup({
                username: username,
                password: password
            }).then(function onSuccess(user) {
                console.log("sign up! " + user);
            })["catch"](function onError(error) {
                // ...
            });
        };
        AuthManager.prototype.login = function (username, password) {
        };
        AuthManager.prototype.logout = function () {
            var promise = Kinvey.User.logout();
            promise = promise.then(function onSuccess() {
                console.log("Log out!");
            })["catch"](function onError(error) {
                // ...
            });
        };
        return AuthManager;
    }());
    Kinvey_1.AuthManager = AuthManager;
})(Kinvey || (Kinvey = {}));
//# sourceMappingURL=KinveyAuth.js.map