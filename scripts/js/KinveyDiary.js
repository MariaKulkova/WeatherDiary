var Kinvey;
(function (Kinvey_1) {
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