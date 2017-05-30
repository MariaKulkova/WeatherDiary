/// <reference path="../typings/jquery.d.ts"/>
/// <reference path="./KinveyAuth.ts"/>

class LoginForm {
    public container: HTMLFormElement;
    public authManager: Kinvey.AuthManager;

    constructor(container: HTMLFormElement, authManager: Kinvey.AuthManager) {
        this.container = container;
        this.authManager = authManager;

        let form = $(this.container)
        form.submit((e: MouseEvent) => {
            e.preventDefault()
            let username: string = $("#login-username").value
            let password: string = $("#login-password").value
            this.authManager.login(username, password, (succeeded: boolean) => {
                if (succeeded) {
                    window.location.assign("/home.html")
                }
                else {
                    alert("Error occured during login process. Please, try again later")
                }
            })
        });
    }
}
 
$(() => {
    // Kinvey.initializeKinvey((succeeded: boolean, activeUser: any) => {
    //     if (succeeded && activeUser != null) {
    //         window.location.assign("/home.html")
    //     }
    // })

    let loginActionForm = document.getElementById("login-action-form") as HTMLFormElement
    console.log(loginActionForm)
    let manager = new Kinvey.AuthManager()
    let login = new LoginForm(loginActionForm, manager)
});

