namespace Kinvey {
    declare var Kinvey: any;

    export const enum PrecipitationType {
        none,
        rain,
        snow
    }

    export const enum CompassPoints {
        none,
        north,
        northwest,
        west,
        southwest,
        south,
        southeast,
        east,
        northeast
    }

    export function directionNameForCompassPoint(point: CompassPoints): string {
        let directionString: string
        switch(point) {  
            case CompassPoints.north: { 
                directionString = "С" 
                break; 
            } 

            case CompassPoints.northeast: { 
                directionString = "СВ" 
                break; 
            } 

            case CompassPoints.east: { 
                directionString = "В" 
                break; 
            } 

            case CompassPoints.southeast: { 
                directionString = "ЮВ" 
                break; 
            } 

            case CompassPoints.south: { 
                directionString = "Ю" 
                break; 
            } 

            case CompassPoints.southwest: { 
                directionString = "ЮЗ" 
                break; 
            } 

            case CompassPoints.west: { 
                directionString = "З" 
                break; 
            } 

            case CompassPoints.northwest: { 
                directionString = "СЗ" 
                break; 
            } 

            default: { 
                directionString = "" 
                break; 
            } 
        } 
        return directionString
    }

    export class WeatherCondition {
        _id: string
        date: Date = new Date()
        temperature: number = 0
        cloudness: number = 0
        precipitation: boolean = false
        windForce: number = 0
        windDirection: CompassPoints = 0
        userId: string
    }

    export class WeatherConditionsManager {

        public static readonly maxTemperature: number = 40
        public static readonly minTemperature: number = -40
        public static readonly maxWindForce: number = 20

        constructor() { }

        public fetchCondition(date: Date, completed: (condition: WeatherCondition) => void) {
            let activeUser = Kinvey.User.getActiveUser()

            let query = new Kinvey.Query()
            query.equalTo("_acl.creator", activeUser.data._id)
            query.equalTo("date", date.toISOString())
            let dataStore = Kinvey.DataStore.collection("conditions", Kinvey.DataStoreType.Network)
            
            let stream = dataStore.find(query)
            stream.subscribe(function onNext(entities) {
                console.log("Fetched condition: ", entities[0])
                completed(entities[0])
            }, function onError(error) {
                // Show error
            }, function onComplete() {

            });
        }

        public saveCondition(condition: WeatherCondition, completed?: (succeeded: boolean, error?: string) => void) {
            let dataStore = Kinvey.DataStore.collection("conditions", Kinvey.DataStoreType.Network)
            var promise = dataStore.save(condition).then(function onSuccess(entity) {
                    console.log("Successfully saved: " + entity)
                    if (completed) {
                        completed(true)
                    }
                }).catch(function onError(error) {
                    console.log("Error occured during entity saving" + error)
                    if (completed) {
                        completed(false, error)
                    }
                });
        }
    }
}