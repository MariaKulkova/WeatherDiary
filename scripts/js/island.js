/// <reference path="./circle-slider.ts"/>
/// <reference path="./KinveyAuth.ts"/>
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
        this.cloudButtonTapsCount = 0;
        this.isRainOn = false;
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
            this.cloudButtonTapsCount += 1;
            if (this.cloudButtonTapsCount > this.clouds.length) {
                this.cloudButtonTapsCount = 0;
                this.hideClouds();
            }
            else {
                let currentCloud = this.clouds[this.cloudButtonTapsCount - 1];
                currentCloud.css({ "display": "block", "opacity": 0 });
                currentCloud.animate({ "opacity": 1 }, 400);
            }
        });
        // Set up rain tool
        this.rains = [$(".rain-big"), $(".rain-medium"), $(".rain-small")];
        let rainButton = $(".tool-button.rain");
        rainButton.on("click", (e) => {
            e.preventDefault();
            this.isRainOn = !this.isRainOn;
            this.switchRainState(this.isRainOn);
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
        };
        this.sunSlider = IslandArea.circleSliderForAttributes(d3.select("svg.sun-slider-container"), "img/sun-plain.png", 0.4, new Slider.Point(1, 1), 0.95, 180, 90, temperatureCallback);
        this.sunSlider.render();
        // Wind force slider initialization
        let windForceCallback = (progress) => {
            let formattedValue = Math.round(Kinvey.WeatherConditionsManager.maxWindForce * progress);
            this.updateWindForceLabel(formattedValue);
        };
        this.windForceSlider = IslandArea.circleSliderForAttributes(d3.select("svg.wind-slider-container"), "img/windforce-drag-element.png", 0.3, new Slider.Point(0.5, 0.5), 0.5, 225, -45, windForceCallback);
        this.windForceSlider.render();
        this.initializeStartValues();
    }
    initializeStartValues() {
        this.conditionsManager.fetchCondition(new Date(), function (condition) {
            $(".temperature-value").text(condition.temperature);
        });
    }
    /* Dependent graphical components */
    updateTemperatureComponent(value) {
        $(".temperature-value").text(value);
    }
    updateSkyComponent(ratio) {
        let whiteColor = new ColorRGB(255, 255, 255);
        let progressColor = ColorRGB.intermediateColor(this.skyMinColor, this.skyMaxColor, ratio);
        let styleString = "linear-gradient(to top, rgb" + whiteColor.toString() + ", rgb" + progressColor.toString() + ")";
        $("body").css("background-image", styleString);
    }
    updateWindForceLabel(value) {
        $(".windforce-value").text(value + "м/с");
    }
    hideClouds() {
        for (let item of this.clouds) {
            item.css("display", "none");
        }
    }
    switchRainState(isOn) {
        for (let item of this.rains) {
            item.css("display", isOn ? "block" : "none");
        }
    }
    /* Helpers methods */
    static circleSliderForAttributes(container, dragItemPicture, dragItemSizeRatio, rotateAnchorPoint, rotateRadiusRatio, startAngle, endAngle, callback) {
        let rotate = new Slider.RotateAttributes(rotateAnchorPoint.x, rotateAnchorPoint.y, rotateRadiusRatio, startAngle, endAngle);
        return new Slider.CircleSlider(container, dragItemPicture, dragItemSizeRatio, rotate, callback);
    }
}
$(() => {
    Kinvey.initializeKinvey(function (succeeded) {
        let manager = new Kinvey.WeatherConditionsManager();
        let island = new IslandArea(manager);
        island.render();
    });
});
//# sourceMappingURL=island.js.map