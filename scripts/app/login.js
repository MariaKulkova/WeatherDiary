/// <reference path="../typings/jquery.d.ts"/>
/// <reference path="./KinveyAuth.ts"/>
var LoginForm = (function () {
    function LoginForm(container, authManager) {
        this.container = container;
        this.authManager = authManager;
        console.log("In constructor");
        var form = $(this.container);
        form.submit(function (e) {
            e.preventDefault();
            console.log("Signup! Yeah!");
        });
    }
    return LoginForm;
}());
$(function () {
    Kinvey.initializeKinvey();
    var loginActionForm = document.getElementById("login-action-form");
    console.log(loginActionForm);
    var manager = new Kinvey.AuthManager();
    var login = new LoginForm(loginActionForm, manager);
});
//# sourceMappingURL=login.js.map