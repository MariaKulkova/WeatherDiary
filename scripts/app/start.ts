/// <reference path="../typings/jquery.d.ts"/>
/// <reference path="./KinveyAuth.ts"/>

$(() => {
    console.log("Start initialized")
    Kinvey.initializeKinvey((succeeded: boolean, activeUser: any) => {
        console.log("Initialisation succeeded: ", succeeded, " Active user: ", activeUser)
        if (activeUser != null) {
            window.location.assign("/home.html")
        }
        else {
            window.location.assign("/login.html")
            if (!succeeded) {
                alert("Kinvey initialization failed")
            }
        }
    })
});