/// <reference path="../typings/jquery.d.ts"/>
$(() => {
    Kinvey.initializeKinvey((succeeded, activeUser) => {
        if (succeeded && activeUser != null) {
            window.location.assign("/login.html");
        }
    });
});
//# sourceMappingURL=start.js.map