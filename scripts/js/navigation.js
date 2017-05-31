/// <reference path="./KinveyAuth.ts"/>
/// <reference path="./island.ts"/>
var currentFragment = "";
var fragmentLoadedCallbacks = {};
function loadFragment(fragment, target) {
    if (currentFragment == fragment) {
        return;
    }
    currentFragment = fragment;
    $.ajax({
        url: currentFragment,
        async: true,
        success: function (data) {
            $(target).html(data);
            let callback = fragmentLoadedCallbacks[currentFragment];
            if (callback) {
                callback();
            }
        }
    });
}
function setFragmentLoadedCallback(tag, callback) {
    fragmentLoadedCallbacks[tag] = callback;
}
var fragmentMap = {
    "#stat": "statistics.html",
    "#profile": "profile.html",
    "#island": "island.html",
    "": "island.html"
};
function updateFragment(tag) {
    console.log(tag);
    loadFragment(fragmentMap[tag], ".content-section");
}
setFragmentLoadedCallback("island.html", () => {
    console.log("Island intialize");
    Kinvey.initializeKinvey(function (succeeded) {
        if (succeeded) {
            let manager = new Kinvey.WeatherConditionsManager();
            let island = new IslandArea(manager);
            island.render();
        }
    });
});
setFragmentLoadedCallback("statistics.html", () => {
    console.log("Statistics intialize");
    let stat = new Statistcis();
    stat.render();
});
$(() => {
    $(".menu-link").click(function () {
        updateFragment($(this).attr('href'));
    });
    $("#bottom-nav-item").click((e) => {
        console.log("Logout was tapped");
        let manager = new Kinvey.AuthManager();
        manager.logout((succeeded) => {
            if (succeeded) {
                window.location.assign("/login.html");
            }
            else {
                alert("Can't log out. Please, try again later");
            }
        });
    });
    updateFragment(window.location.hash);
});
//# sourceMappingURL=navigation.js.map