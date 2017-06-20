var Kinvey;
(function (Kinvey_1) {
    function initializeKinvey(completed) {
        Kinvey.initialize({
            appKey: 'kid_r1QVc221Z',
            appSecret: '719b3f1141ff44b2be957713973860ac',
            apiHostname: 'https://baas.kinvey.com'
        }).then(function (activeUser) {
            console.log("Kinvey auth " + activeUser);
            completed(true, activeUser);
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
                console.log("User signed up successfully: " + user);
            }).catch(function onError(error) {
                console.log("User signup failed. Reason: ", error);
            });
        }
        // Performs user login to Kinvey asynchroniously
        // Takes username and password
        // Uses callback to notify about results
        login(username, password, completed) {
            console.log("Login performed");
            var promise = Kinvey.User.login({
                username: username,
                password: password
            }).then(function onSuccess(user) {
                completed(true);
            }).catch(function onError(error) {
                console.log("User login failed. Reason: ", error);
                completed(false);
            });
        }
        logout(completed) {
            let promise = Kinvey.User.logout();
            promise = promise.then(function onSuccess() {
                console.log("Logout was performed successfully");
                completed(true);
            }).catch(function onError(error) {
                console.log("Error occured during logout. Reason: ", error);
                completed(false);
            });
        }
    }
    Kinvey_1.AuthManager = AuthManager;
})(Kinvey || (Kinvey = {}));
//# sourceMappingURL=KinveyAuth.js.map