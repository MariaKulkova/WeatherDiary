/// <reference path="../typings/jquery.d.ts"/>
/// <reference path="./KinveyAuth.ts"/>
class LoginForm {
    constructor(container, authManager) {
        this.container = container;
        this.authManager = authManager;
        console.log("In constructor");
        let form = $(this.container);
        form.submit(function (e) {
            e.preventDefault();
            console.log("Signup! Yeah!");
        });
    }
}
$(() => {
    Kinvey.initializeKinvey();
    let loginActionForm = document.getElementById("login-action-form");
    console.log(loginActionForm);
    let manager = new Kinvey.AuthManager();
    let login = new LoginForm(loginActionForm, manager);
});
//# sourceMappingURL=login.js.map