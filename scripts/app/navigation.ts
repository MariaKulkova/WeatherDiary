/// <reference path="./KinveyAuth.ts"/>
/// <reference path="./island.ts"/>

var currentFragment = ""
var fragmentLoadedCallbacks = {}

function loadFragment(fragment, target) {
    if (currentFragment == fragment) {
        return
    }

    currentFragment = fragment
    $.ajax({
        url: currentFragment,
        async: true,
        success: function(data) {
            $(target).html(data);

            let callback = fragmentLoadedCallbacks[currentFragment]
            if (callback) {
                callback()
            }
        }               
    });         
}

function setFragmentLoadedCallback(tag, callback) {
    fragmentLoadedCallbacks[tag] = callback
}

var fragmentMap = {
    "#stat": "statistics.html",
    "#profile": "profile.html",
    "#island": "conditions.html",
    "": "conditions.html"
}

function updateFragment(tag) {
    console.log(tag)
    loadFragment(fragmentMap[tag], ".content-section")
}

setFragmentLoadedCallback("conditions.html", () => {
    console.log("Island intialize")
    Kinvey.initializeKinvey(function(succeeded) {
        if (succeeded) {
            let manager = new Kinvey.WeatherConditionsManager()
            let island = new IslandArea(manager)
            island.render()
        }
    })
})

$(() => {
    $(".nav-item").click(function() {
        updateFragment($(this).attr('href'))
    });

    updateFragment(window.location.hash)
});