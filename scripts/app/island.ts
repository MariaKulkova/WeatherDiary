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
    private weatherCondition: Kinvey.WeatherCondition
    private isRainOn: boolean = false

    // Weather condition components
    private sunSlider: Slider.CircleSlider
    private windForceSlider: Slider.CircleSlider
    private windCompass: Compass.WindCompass
    private clouds: Array<JQuery>
    private rains: Array<JQuery>
    private skyMinColor: ColorRGB = new ColorRGB(95, 201, 226)
    private skyMaxColor: ColorRGB = new ColorRGB(0, 206, 255)

    constructor(conditionsManager: Kinvey.WeatherConditionsManager) {
        this.conditionsManager = conditionsManager

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
                let dateString = $("#datepicker").val()
                $(".header-date").html(dateString)
                $(".modal").css("display", "none")
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
            }
            else {
                this.showCloud(this.clouds[this.weatherCondition.cloudness - 1])
            }
        })

        // Set up rain tool
        this.rains = [$(".rain-big"), $(".rain-medium"), $(".rain-small")]
        let rainButton = $(".tool-button.rain")
        rainButton.on("click", (e: BaseJQueryEventObject) => {
            e.preventDefault()
            this.isRainOn = !this.isRainOn
            this.switchRainState(this.isRainOn)
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
            console.log(angle)
        }
        this.windCompass = new Compass.WindCompass(compassCallback)
        this.windCompass.render()
        
        // Wind force slider initialization
        let windForceCallback = (progress: number) => {
            let formattedValue = Math.round(Kinvey.WeatherConditionsManager.maxWindForce * progress)
            this.updateWindForceLabel(formattedValue)
        }
        this.windForceSlider = IslandArea.circleSliderForAttributes(
            d3.select("svg.wind-slider-container"),
            "img/windforce-drag-element.png",
            0.3,
            new Geometry.Point(0.5, 0.5), 0.5, 225, -45,
            windForceCallback)
        this.windForceSlider.render()

        this.initializeStartValues()
    }

    initializeStartValues() {
        this.conditionsManager.fetchCondition(new Date(), (condition: Kinvey.WeatherCondition) => {
            this.weatherCondition = condition
            
            let maxTemperature = Kinvey.WeatherConditionsManager.maxTemperature
            let minTemperature = Kinvey.WeatherConditionsManager.minTemperature
            let temperatureProgress = (condition.temperature - minTemperature) / (maxTemperature - minTemperature)
            this.sunSlider.setProgressValue(temperatureProgress)

            let windForceProgress = condition.windForce / Kinvey.WeatherConditionsManager.maxWindForce
            this.windForceSlider.setProgressValue(windForceProgress)
            
            this.updateTemperatureComponent(condition.temperature)
            this.updateWindForceLabel(condition.windForce)
            this.setCloudsLevel(condition.cloudness)
        })
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
    private switchRainState(isOn: boolean) {
        for (let item of this.rains) {
            item.css("display", isOn ? "block" : "none")
        }
    }

    /* Helpers methods */

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
}

$(() => {
    Kinvey.initializeKinvey(function(succeeded) {
        let manager = new Kinvey.WeatherConditionsManager()
        let island = new IslandArea(manager)
        island.render()
    })
});
