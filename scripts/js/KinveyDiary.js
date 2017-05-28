var Kinvey;
(function (Kinvey_1) {
    function directionNameForCompassPoint(point) {
        let directionString;
        switch (point) {
            case 1 /* north */: {
                directionString = "С";
                break;
            }
            case 8 /* northeast */: {
                directionString = "СВ";
                break;
            }
            case 7 /* east */: {
                directionString = "В";
                break;
            }
            case 6 /* southeast */: {
                directionString = "ЮВ";
                break;
            }
            case 5 /* south */: {
                directionString = "Ю";
                break;
            }
            case 4 /* southwest */: {
                directionString = "ЮЗ";
                break;
            }
            case 3 /* west */: {
                directionString = "З";
                break;
            }
            case 2 /* northwest */: {
                directionString = "СЗ";
                break;
            }
            default: {
                directionString = "";
                break;
            }
        }
        return directionString;
    }
    Kinvey_1.directionNameForCompassPoint = directionNameForCompassPoint;
    class WeatherCondition {
    }
    Kinvey_1.WeatherCondition = WeatherCondition;
    class WeatherConditionsManager {
        constructor() { }
        fetchCondition(date, completed) {
            let activeUser = Kinvey.User.getActiveUser();
            let query = new Kinvey.Query();
            query.equalTo("userId", activeUser.data._id);
            let dataStore = Kinvey.DataStore.collection("conditions", Kinvey.DataStoreType.Network);
            let stream = dataStore.find(query);
            stream.subscribe(function onNext(entities) {
                completed(entities[0]);
            }, function onError(error) {
                // Show error
            }, function onComplete() {
            });
        }
    }
    WeatherConditionsManager.maxTemperature = 40;
    WeatherConditionsManager.minTemperature = -40;
    WeatherConditionsManager.maxWindForce = 20;
    Kinvey_1.WeatherConditionsManager = WeatherConditionsManager;
})(Kinvey || (Kinvey = {}));
//# sourceMappingURL=KinveyDiary.js.map