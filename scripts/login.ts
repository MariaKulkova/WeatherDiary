/// <reference path="typings/jquery.d.ts"/>
/// <reference path="./KinveyAuth.ts"/>

class LoginForm {
    public container: HTMLFormElement;
    public authManager: Kinvey.AuthManager;

    constructor(container: HTMLFormElement, authManager: Kinvey.AuthManager) {
        this.container = container;
        this.authManager = authManager;

        console.log("In constructor")
        
        let form = $(this.container)
        form.submit(function (e) {
            e.preventDefault()
            console.log("Signup! Yeah!");
        });
    }
}

$(() => {
    Kinvey.initializeKinvey();

    let loginActionForm = document.getElementById("login-action-form") as HTMLFormElement
    console.log(loginActionForm)
    let manager = new Kinvey.AuthManager()
    let login = new LoginForm(loginActionForm, manager)
});

