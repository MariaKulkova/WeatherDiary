var Kinvey;
(function (Kinvey_1) {
    class StatData {
        constructor(value, dateString) {
            this.value = value;
            this.date = new Date(dateString);
        }
    }
    Kinvey_1.StatData = StatData;
    class StatisticsManager {
        constructor() { }
        fetchCondition(startDate, endDate, completed) {
            let activeUser = Kinvey.User.getActiveUser();
            console.log("Stat", startDate);
            let query = new Kinvey.Query();
            query.equalTo("_acl.creator", activeUser.data._id);
            query.ascending("date");
            query.greaterThanOrEqualTo("date", startDate.toISOString());
            query.lessThanOrEqualTo("date", endDate.toISOString());
            console.log(startDate, " ", endDate);
            let dataStore = Kinvey.DataStore.collection("conditions", Kinvey.DataStoreType.Network);
            let stream = dataStore.find(query);
            stream.subscribe(function onNext(entities) {
                console.log(entities);
                let temperatureValues = [];
                for (let item of entities) {
                    let statData = new StatData(item.temperature, item.date);
                    temperatureValues.push(statData);
                }
                completed(temperatureValues);
            }, function onError(error) {
                completed([], error);
            }, function onComplete() {
            });
        }
    }
    Kinvey_1.StatisticsManager = StatisticsManager;
})(Kinvey || (Kinvey = {}));
//# sourceMappingURL=KinveyStat.js.map