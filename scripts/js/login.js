/// <reference path="../typings/jquery.d.ts"/>
/// <reference path="./KinveyAuth.ts"/>
class LoginForm {
    constructor(container, authManager) {
        this.container = container;
        this.authManager = authManager;
        let form = $(this.container);
        form.submit((e) => {
            e.preventDefault();
            let username = $("#login-username").value;
            let password = $("#login-password").value;
            this.authManager.login(username, password, (succeeded) => {
                if (succeeded) {
                    window.location.assign("/home.html");
                }
                else {
                    alert("Error occured during login process. Please, try again later");
                }
            });
        });
    }
}
$(() => {
    // Kinvey.initializeKinvey((succeeded: boolean, activeUser: any) => {
    //     if (succeeded && activeUser != null) {
    //         window.location.assign("/home.html")
    //     }
    // })
    let loginActionForm = document.getElementById("login-action-form");
    console.log(loginActionForm);
    let manager = new Kinvey.AuthManager();
    let login = new LoginForm(loginActionForm, manager);
});
//# sourceMappingURL=login.js.map