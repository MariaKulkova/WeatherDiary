/// <reference path="../typings/jquery.d.ts"/>

$(() => {
    Kinvey.initializeKinvey((succeeded: boolean, activeUser: any) => {
        if (succeeded && activeUser != null) {
            window.location.assign("/home.html")
        }
        else {
            window.location.assign("/login.html")
        }
    })
});