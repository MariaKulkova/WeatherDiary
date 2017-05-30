/// <reference path="../typings/jquery.d.ts"/>
/// <reference path="./KinveyAuth.ts"/>

class LoginForm {
    public container: HTMLFormElement;
    public authManager: Kinvey.AuthManager;

    constructor(container: HTMLFormElement, authManager: Kinvey.AuthManager) {
        this.container = container;
        this.authManager = authManager;

        console.log("In constructor")
        
        let form = $(this.container)
        form.submit((e: MouseEvent) => {
            e.preventDefault()
            console.log("login")
            this.authManager.signup("MariaKulkova", "1234")
        });
    }
}

$(() => {
    Kinvey.initializeKinvey()

    let loginActionForm = document.getElementById("login-action-form") as HTMLFormElement
    console.log(loginActionForm)
    let manager = new Kinvey.AuthManager()
    let login = new LoginForm(loginActionForm, manager)
});

