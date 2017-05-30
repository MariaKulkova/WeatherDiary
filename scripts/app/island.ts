declare var d3: any;
/// <reference path="./circle-slider.ts"/>
/// <reference path="./KinveyAuth.ts"/>
/// <reference path="./compass.ts"/>

class ColorRGB {
    red: number = 0
    green: number = 0
    blue: number = 0

    get components(): number[] {
        return [this.red, this.green, this.blue]
    }

    constructor(red: number, green: number, blue: number) {
        this.red = red
        this.green = green
        this.blue = blue
    }

    public toString(): string {
        return "(" + this.components.join(",") + ")"
    }

    // Creates color which looks like transition between two colors with some progress
    public static intermediateColor(firstColor: ColorRGB, secondColor: ColorRGB, weight: number): ColorRGB {
        let intermediateColor = new ColorRGB(Math.round(firstColor.red + (secondColor.red - firstColor.red) * weight),
                                             Math.round(firstColor.green + (secondColor.green - firstColor.green) * weight),
                                             Math.round(firstColor.blue + (secondColor.blue - firstColor.blue) * weight))
        return intermediateColor
    }
}

class IslandArea {

    private conditionsManager: Kinvey.WeatherConditionsManager
    private weatherCondition: Kinvey.WeatherCondition = new Kinvey.WeatherCondition()
    private selectedDate = new Date()

    // Weather condition components
    private sunSlider: Slider.CircleSlider
    private windForceSlider: Slider.CircleSlider
    private windCompass: Compass.WindCompass
    private clouds: Array<JQuery>
    private precipitations: Array<JQuery>
    private skyMinColor: ColorRGB = new ColorRGB(95, 201, 226)
    private skyMaxColor: ColorRGB = new ColorRGB(0, 206, 255)
    private precipitationButton: JQuery 

    constructor(conditionsManager: Kinvey.WeatherConditionsManager) {
        this.conditionsManager = conditionsManager
        $(".header-date").html(this.formattedStringFromDate(this.selectedDate))

        // Set up datepicker to present russian labels and date formats
        $("#datepicker").datepicker({
            inline: false,
            showOtherMonths: true,
            dayNamesMin: [ "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
            monthNames: [ "Январь", "Февраль", "Март","Апрель", 
                          "Май", "Июнь", "Июль", "Август",
                          "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
            firstDay: 1,
            dateFormat: "dd.mm.yy",
            onSelect: () => {
                let currentDatepicker = $("#datepicker")
                let dateString = currentDatepicker.val()
                $(".header-date").html(dateString)
                $(".modal").css("display", "none")
                this.selectedDate = currentDatepicker.datepicker("getDate")
                this.fetchConditionsData()
            }
        });

        // Set up clouds tool
        this.clouds = [$(".cloud-big-wrapper"), $(".cloud-small-wrapper"), $(".cloud-medium-wrapper")]
        let cloudButton = $(".tool-button.cloud")
        cloudButton.on("click", (e: BaseJQueryEventObject) => {
            e.preventDefault()
            this.weatherCondition.cloudness += 1
            if (this.weatherCondition.cloudness > this.clouds.length) {
                this.weatherCondition.cloudness = 0
                this.hideClouds()
                this.setPrecipitationEnabled(false)
            }
            else {
                this.showCloud(this.clouds[this.weatherCondition.cloudness - 1])
                this.setPrecipitationEnabled(true)
            }
        })

        // Set up rain tool
        this.precipitations = [$(".rain-big"), $(".rain-medium"), $(".rain-small")]
        this.precipitationButton = $(".tool-button.rain")
        this.precipitationButton.on("click", (e: BaseJQueryEventObject) => {
            e.preventDefault()
            this.weatherCondition.precipitation = !this.weatherCondition.precipitation
            this.switchPrecipitationState(this.weatherCondition.precipitation)
        })

        // Set up datepicker modal appearing
        let dateButton = $(".header-date")
        dateButton.on("click", (e: BaseJQueryEventObject) => {
            e.preventDefault()
            $(".modal").css("display", "flex")
        })

        let modal = document.getElementById("datepicker-modal");
        window.onclick = (e: MouseEvent) => {
            if (e.target == modal) {
                modal.style.display = "none";
            }
        }

        // Set up save button
        let saveButton = $(".save-button")
        saveButton.on("click", (e: BaseJQueryEventObject) => {
            e.preventDefault()
            this.weatherCondition.date = this.selectedDate
            console.log("Save button tapped. Saved object: " + this.weatherCondition)
            this.conditionsManager.saveCondition(this.weatherCondition)
        })
    }
    
    // Initializes and renders programmatically created elements
    public render() {
        // Sun slider initialization
        let temperatureCallback = (progress: number) => { 
            let maxTemperature = Kinvey.WeatherConditionsManager.maxTemperature
            let minTemperature = Kinvey.WeatherConditionsManager.minTemperature
            let formattedValue = Math.round((maxTemperature - minTemperature) * progress + minTemperature)
            this.updateTemperatureComponent(formattedValue)
            this.updateSkyComponent(progress)
            this.weatherCondition.temperature = formattedValue
        }
        this.sunSlider = IslandArea.circleSliderForAttributes(
            d3.select("svg.sun-slider-container"),
            "img/sun-plain.png",
            0.4,
            new Geometry.Point(1, 1), 0.95, 180, 90,
            temperatureCallback)
        this.sunSlider.render()

        // Compass component
        let compassCallback = (angle: number) => {
            this.setDirectionLabelForAngle(angle)
            this.weatherCondition.windDirection = angle / 45 + 1
        }
        this.windCompass = new Compass.WindCompass(compassCallback)
        this.windCompass.render()
        
        // Wind force slider initialization
        let windForceCallback = (progress: number) => {
            let formattedValue = Math.round(Kinvey.WeatherConditionsManager.maxWindForce * progress)
            this.updateWindForceLabel(formattedValue)
            this.weatherCondition.windForce = formattedValue
        }
        this.windForceSlider = IslandArea.circleSliderForAttributes(
            d3.select("svg.wind-slider-container"),
            "img/windforce-drag-element.png",
            0.3,
            new Geometry.Point(0.5, 0.5), 0.5, 225, -45,
            windForceCallback)
        this.windForceSlider.render()

        this.initializeStartValues()
        this.fetchConditionsData()
    }

    private fetchConditionsData() {
        this.conditionsManager.fetchCondition(this.selectedDate, (condition: Kinvey.WeatherCondition) => {
            if (condition) {
                console.log(condition)
                this.weatherCondition = condition
            }
            else {
                this.weatherCondition = new Kinvey.WeatherCondition()
            }
            this.initializeStartValues()
        })
    }

    private initializeStartValues() {
        // Initialize values for modificators
        let maxTemperature = Kinvey.WeatherConditionsManager.maxTemperature
        let minTemperature = Kinvey.WeatherConditionsManager.minTemperature
        let temperatureProgress = (this.weatherCondition.temperature - minTemperature) / (maxTemperature - minTemperature)
        this.sunSlider.setProgressValue(temperatureProgress)
        let windForceProgress = this.weatherCondition.windForce / Kinvey.WeatherConditionsManager.maxWindForce
        this.windForceSlider.setProgressValue(windForceProgress)
        let directionAngle = this.weatherCondition.windDirection * 45
        this.windCompass.setRotateAngle(directionAngle)
        
        // Initialize values for dependent components
        this.updateTemperatureComponent(this.weatherCondition.temperature)
        this.updateWindForceLabel(this.weatherCondition.windForce)
        this.setCloudsLevel(this.weatherCondition.cloudness)
        this.setDirectionLabelForAngle(directionAngle)
        this.switchPrecipitationState(this.weatherCondition.precipitation)
        this.updateSkyComponent(temperatureProgress)
    }

    /* Dependent graphical components */

    // Sets the temperature label in Celsius degrees
    private updateTemperatureComponent(value: number) {
        $(".temperature-value").text(value)
    }

    // Sets the sky color based on transition value from grey to blue
    private updateSkyComponent(ratio: number) {
        let whiteColor = new ColorRGB(255, 255, 255)
        let progressColor = ColorRGB.intermediateColor(this.skyMinColor, this.skyMaxColor, ratio)
        let styleString = "linear-gradient(to top, rgb" + whiteColor.toString() + ", rgb" + progressColor.toString() + ")"
        $("body").css("background-image", styleString)
    }

    // Sets the wind force label in meters per second
    private updateWindForceLabel(value: number) {
        $(".windforce-value").text(value + "м/с")
    }

    // Sets the correct amount of clouds according to cloudness level
    private setCloudsLevel(value: number) {
        if (value > this.clouds.length) {
            throw new RangeError("Clouds level is out of range")
        }

        if (value == 0) {
            this.hideClouds()
        }
        else {
            for (let i = 0; i < value; i++) {
                this.showCloud(this.clouds[i])
            }
        }
    }

    // Hides all of the clouds
    private hideClouds() {
        for (let item of this.clouds) {
            item.css("display", "none")
        }
    }

    // Shows given cloud with animation
    private showCloud(cloud: JQuery) {
        cloud.css({"display": "block", "opacity": 0})
        cloud.animate({"opacity": 1}, 400)
    }

    // Shows or hides rain according to the given value
    private switchPrecipitationState(isOn: boolean) {
        for (let item of this.precipitations) {
            item.css("display", isOn ? "block" : "none")
        }
    }

    private setDirectionLabelForAngle(angle: number) {
        $(".compass-direction").text(this.angleToDirection(angle))
    }

    private setPrecipitationEnabled(isEnabled: boolean) {
        if (isEnabled) {
            this.precipitationButton.css("pointer-events", "auto")
        }
        else {
            this.weatherCondition.precipitation = false
            this.switchPrecipitationState(false)
            this.precipitationButton.css("pointer-events", "none")
        }
    }

    /* Helpers methods */

    private angleToDirection(angle: number): string {
        let direction: Kinvey.CompassPoints = angle / 45 + 1
        return Kinvey.directionNameForCompassPoint(direction)
    }

    private static circleSliderForAttributes(container: d3.Selection<any, any, any, any>,
                                     dragItemPicture: string,
                                     dragItemSizeRatio: number,
                                     rotateAnchorPoint: Geometry.Point,
                                     rotateRadiusRatio: number,
                                     startAngle: number, 
                                     endAngle: number,
                                     callback: (value: number) => void): Slider.CircleSlider {
        let rotate = new Slider.RotateAttributes(rotateAnchorPoint.x, 
                                                 rotateAnchorPoint.y, 
                                                 rotateRadiusRatio, 
                                                 startAngle, 
                                                 endAngle)
        return new Slider.CircleSlider(container, dragItemPicture, dragItemSizeRatio, rotate, callback)
    }

    private formattedStringFromDate(date: Date): string {
        let formattedString = ('0' + date.getDate()).slice(-2) + '.' + 
                              ('0' + (date.getMonth()+1)).slice(-2) + '.' +
                               date.getFullYear()
        return formattedString
    }
}
