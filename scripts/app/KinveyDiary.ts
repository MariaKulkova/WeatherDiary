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
        date: Date
        temperature: number
        cloudness: number
        precipitation: PrecipitationType
        windForce: number
        windDirection: CompassPoints
    }

    export class WeatherConditionsManager {

        public static readonly maxTemperature: number = 40
        public static readonly minTemperature: number = -40
        public static readonly maxWindForce: number = 20

        constructor() { }

        fetchCondition(date: Date, completed: (condition: WeatherCondition) => void) {
            let activeUser = Kinvey.User.getActiveUser()

            let query = new Kinvey.Query()
            query.equalTo("userId", activeUser.data._id)
            let dataStore = Kinvey.DataStore.collection("conditions", Kinvey.DataStoreType.Network)
            
            let stream = dataStore.find(query)
            stream.subscribe(function onNext(entities) {
                completed(entities[0])
            }, function onError(error) {
                // Show error
            }, function onComplete() {

            });
        }
    }
}