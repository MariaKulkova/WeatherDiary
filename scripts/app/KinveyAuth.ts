namespace Kinvey {
    declare var Kinvey: any;

    export function initializeKinvey(completed?: (succeeded: boolean) => void) {
        Kinvey.initialize({
            appKey: 'kid_r1QVc221Z',
            appSecret: '719b3f1141ff44b2be957713973860ac',
            apiHostname: 'https://baas.kinvey.com'
        }).then(function(activeUser) {
            console.log(activeUser)
            completed(true)
        }).catch(function(error) {
            completed(false)
        });
    }

    export class AuthManager {

        constructor() { }

        signup(username: string, password: string): void {
            var user = new Kinvey.User();
            let promise = user.signup({
                username: username,
                password: password
            }).then(function onSuccess(user) {
                console.log("sign up! " + user);
            }).catch(function onError(error) {
            // ...
            });
        }

        login(username: string, password: string): void {
        }

        logout() {
            let promise = Kinvey.User.logout();
            promise = promise.then(function onSuccess() {
                console.log("Log out!")
            }).catch(function onError(error) {
            // ...
            });
        }
    }
}