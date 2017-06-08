namespace Kinvey {
    declare var Kinvey: any;

    export class StatData {
        value: any
        date: Date

        constructor(value: any, dateString: string) {
            this.value = value
            this.date = new Date(dateString)
        }
    }

    export class StatisticsManager {

        constructor() { }

        public fetchCondition(startDate: Date, endDate: Date, completed: (conditions: StatData[], error?: string) => void) {
            let activeUser = Kinvey.User.getActiveUser()

            console.log("Stat", startDate)
            let query = new Kinvey.Query()
            query.equalTo("_acl.creator", activeUser.data._id)
            query.ascending("date")
            query.greaterThanOrEqualTo("date", startDate.toISOString())
            query.lessThanOrEqualTo("date", endDate.toISOString())
            console.log(startDate, " ", endDate)
            let dataStore = Kinvey.DataStore.collection("conditions", Kinvey.DataStoreType.Network)
            
            let stream = dataStore.find(query)
            stream.subscribe(function onNext(entities) {
                console.log(entities)
                let temperatureValues: StatData[] = []
                for (let item of entities) {
                    let statData = new StatData(item.temperature, item.date)
                    temperatureValues.push(statData)
                }
                completed(temperatureValues)
            }, function onError(error) {
                completed([], error)
            }, function onComplete() {
            });
        }
    }
}