/// <reference path="./circle-slider.ts"/>
/// <reference path="./KinveyAuth.ts"/>
/// <reference path="./compass.ts"/>
class ColorRGB {
    constructor(red, green, blue) {
        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.red = red;
        this.green = green;
        this.blue = blue;
    }
    get components() {
        return [this.red, this.green, this.blue];
    }
    toString() {
        return "(" + this.components.join(",") + ")";
    }
    // Creates color which looks like transition between two colors with some progress
    static intermediateColor(firstColor, secondColor, weight) {
        let intermediateColor = new ColorRGB(Math.round(firstColor.red + (secondColor.red - firstColor.red) * weight), Math.round(firstColor.green + (secondColor.green - firstColor.green) * weight), Math.round(firstColor.blue + (secondColor.blue - firstColor.blue) * weight));
        return intermediateColor;
    }
}
class IslandArea {
    constructor(conditionsManager) {
        this.weatherCondition = new Kinvey.WeatherCondition();
        this.skyMinColor = new ColorRGB(95, 201, 226);
        this.skyMaxColor = new ColorRGB(0, 206, 255);
        this.conditionsManager = conditionsManager;
        // Set up datepicker to present russian labels and date formats
        $("#datepicker").datepicker({
            inline: false,
            showOtherMonths: true,
            dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            monthNames: ["Январь", "Февраль", "Март", "Апрель",
                "Май", "Июнь", "Июль", "Август",
                "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
            firstDay: 1,
            dateFormat: "dd.mm.yy",
            onSelect: () => {
                let dateString = $("#datepicker").val();
                $(".header-date").html(dateString);
                $(".modal").css("display", "none");
            }
        });
        // Set up clouds tool
        this.clouds = [$(".cloud-big-wrapper"), $(".cloud-small-wrapper"), $(".cloud-medium-wrapper")];
        let cloudButton = $(".tool-button.cloud");
        cloudButton.on("click", (e) => {
            e.preventDefault();
            this.weatherCondition.cloudness += 1;
            if (this.weatherCondition.cloudness > this.clouds.length) {
                this.weatherCondition.cloudness = 0;
                this.hideClouds();
                this.setPrecipitationEnabled(false);
            }
            else {
                this.showCloud(this.clouds[this.weatherCondition.cloudness - 1]);
                this.setPrecipitationEnabled(true);
            }
        });
        // Set up rain tool
        this.precipitations = [$(".rain-big"), $(".rain-medium"), $(".rain-small")];
        this.precipitationButton = $(".tool-button.rain");
        this.precipitationButton.on("click", (e) => {
            e.preventDefault();
            this.weatherCondition.precipitation = !this.weatherCondition.precipitation;
            this.switchPrecipitationState(this.weatherCondition.precipitation);
        });
        // Set up datepicker modal appearing
        let dateButton = $(".header-date");
        dateButton.on("click", (e) => {
            e.preventDefault();
            $(".modal").css("display", "flex");
        });
        let modal = document.getElementById("datepicker-modal");
        window.onclick = (e) => {
            if (e.target == modal) {
                modal.style.display = "none";
            }
        };
        // Set up save button
        let saveButton = $(".save-button");
        saveButton.on("click", (e) => {
            e.preventDefault();
            console.log("Save button tapped. Saved object: " + this.weatherCondition);
            this.conditionsManager.saveCondition(this.weatherCondition);
        });
    }
    // Initializes and renders programmatically created elements
    render() {
        // Sun slider initialization
        let temperatureCallback = (progress) => {
            let maxTemperature = Kinvey.WeatherConditionsManager.maxTemperature;
            let minTemperature = Kinvey.WeatherConditionsManager.minTemperature;
            let formattedValue = Math.round((maxTemperature - minTemperature) * progress + minTemperature);
            this.updateTemperatureComponent(formattedValue);
            this.updateSkyComponent(progress);
            this.weatherCondition.temperature = formattedValue;
        };
        this.sunSlider = IslandArea.circleSliderForAttributes(d3.select("svg.sun-slider-container"), "img/sun-plain.png", 0.4, new Geometry.Point(1, 1), 0.95, 180, 90, temperatureCallback);
        this.sunSlider.render();
        // Compass component
        let compassCallback = (angle) => {
            this.setDirectionLabelForAngle(angle);
            this.weatherCondition.windDirection = angle / 45 + 1;
        };
        this.windCompass = new Compass.WindCompass(compassCallback);
        this.windCompass.render();
        // Wind force slider initialization
        let windForceCallback = (progress) => {
            let formattedValue = Math.round(Kinvey.WeatherConditionsManager.maxWindForce * progress);
            this.updateWindForceLabel(formattedValue);
            this.weatherCondition.windForce = formattedValue;
        };
        this.windForceSlider = IslandArea.circleSliderForAttributes(d3.select("svg.wind-slider-container"), "img/windforce-drag-element.png", 0.3, new Geometry.Point(0.5, 0.5), 0.5, 225, -45, windForceCallback);
        this.windForceSlider.render();
        this.initializeStartValues();
        this.fetchConditionsData();
    }
    fetchConditionsData() {
        this.conditionsManager.fetchCondition(new Date(), (condition) => {
            if (condition) {
                console.log(condition);
                this.weatherCondition = condition;
                this.initializeStartValues();
            }
        });
    }
    initializeStartValues() {
        // Initialize values for modificators
        let maxTemperature = Kinvey.WeatherConditionsManager.maxTemperature;
        let minTemperature = Kinvey.WeatherConditionsManager.minTemperature;
        let temperatureProgress = (this.weatherCondition.temperature - minTemperature) / (maxTemperature - minTemperature);
        this.sunSlider.setProgressValue(temperatureProgress);
        let windForceProgress = this.weatherCondition.windForce / Kinvey.WeatherConditionsManager.maxWindForce;
        this.windForceSlider.setProgressValue(windForceProgress);
        let directionAngle = this.weatherCondition.windDirection * 45;
        this.windCompass.setRotateAngle(directionAngle);
        // Initialize values for dependent components
        this.updateTemperatureComponent(this.weatherCondition.temperature);
        this.updateWindForceLabel(this.weatherCondition.windForce);
        this.setCloudsLevel(this.weatherCondition.cloudness);
        this.setDirectionLabelForAngle(directionAngle);
        this.switchPrecipitationState(this.weatherCondition.precipitation);
    }
    /* Dependent graphical components */
    // Sets the temperature label in Celsius degrees
    updateTemperatureComponent(value) {
        $(".temperature-value").text(value);
    }
    // Sets the sky color based on transition value from grey to blue
    updateSkyComponent(ratio) {
        let whiteColor = new ColorRGB(255, 255, 255);
        let progressColor = ColorRGB.intermediateColor(this.skyMinColor, this.skyMaxColor, ratio);
        let styleString = "linear-gradient(to top, rgb" + whiteColor.toString() + ", rgb" + progressColor.toString() + ")";
        $("body").css("background-image", styleString);
    }
    // Sets the wind force label in meters per second
    updateWindForceLabel(value) {
        $(".windforce-value").text(value + "м/с");
    }
    // Sets the correct amount of clouds according to cloudness level
    setCloudsLevel(value) {
        if (value > this.clouds.length) {
            throw new RangeError("Clouds level is out of range");
        }
        if (value == 0) {
            this.hideClouds();
        }
        else {
            for (let i = 0; i < value; i++) {
                this.showCloud(this.clouds[i]);
            }
        }
    }
    // Hides all of the clouds
    hideClouds() {
        for (let item of this.clouds) {
            item.css("display", "none");
        }
    }
    // Shows given cloud with animation
    showCloud(cloud) {
        cloud.css({ "display": "block", "opacity": 0 });
        cloud.animate({ "opacity": 1 }, 400);
    }
    // Shows or hides rain according to the given value
    switchPrecipitationState(isOn) {
        for (let item of this.precipitations) {
            item.css("display", isOn ? "block" : "none");
        }
    }
    setDirectionLabelForAngle(angle) {
        $(".compass-direction").text(this.angleToDirection(angle));
    }
    setPrecipitationEnabled(isEnabled) {
        if (isEnabled) {
            this.precipitationButton.css("pointer-events", "auto");
        }
        else {
            this.weatherCondition.precipitation = false;
            this.switchPrecipitationState(false);
            this.precipitationButton.css("pointer-events", "none");
        }
    }
    /* Helpers methods */
    angleToDirection(angle) {
        let direction = angle / 45 + 1;
        return Kinvey.directionNameForCompassPoint(direction);
    }
    static circleSliderForAttributes(container, dragItemPicture, dragItemSizeRatio, rotateAnchorPoint, rotateRadiusRatio, startAngle, endAngle, callback) {
        let rotate = new Slider.RotateAttributes(rotateAnchorPoint.x, rotateAnchorPoint.y, rotateRadiusRatio, startAngle, endAngle);
        return new Slider.CircleSlider(container, dragItemPicture, dragItemSizeRatio, rotate, callback);
    }
}
//# sourceMappingURL=island.js.map