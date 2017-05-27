declare var d3: any;
/// <reference path="./circle-slider.ts"/>

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

    private clouds: Array<JQuery>
    private cloudButtonTapsCount: number = 0
    private rains: Array<JQuery>
    private isRainOn: boolean = false

    constructor() {
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
            this.cloudButtonTapsCount += 1
            if (this.cloudButtonTapsCount > this.clouds.length) {
                this.cloudButtonTapsCount = 0
                this.hideClouds()
            }
            else {
                this.clouds[this.cloudButtonTapsCount - 1].css({"display": "block", "opacity": 0})
                this.clouds[this.cloudButtonTapsCount - 1].animate({"opacity": 1}, 400)
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
        let temperatureCallback: (value: number) => void = function(progress) { 
            let formattedValue = Math.round(120 * progress - 60)
            d3.select("p.temperature-value").text(formattedValue)
            let whiteColor = new ColorRGB(255, 255, 255)
            let greyColor = new ColorRGB(95, 201, 226)
            let blueColor = new ColorRGB(0, 206, 255)
            let progressColor = ColorRGB.intermediateColor(greyColor, blueColor, progress)
            let styleString = "linear-gradient(to top, rgb" + whiteColor.toString() + ", rgb" + progressColor.toString() + ")"
            $("body").css("background-image", styleString)
        };

        let sunSlider = IslandArea.circleSliderForAttributes(
            d3.select("svg.sun-slider-container"),
            "img/sun-plain.png",
            0.4,
            new Slider.Point(1, 1), 0.95, 180, 90,
            temperatureCallback)
        sunSlider.render()
        
        let windForceCallback: (value: number) => void = function(progress) {
            let formattedValue = Math.round(20 * progress)
            d3.select("p.windforce-value").text(formattedValue + "м/с") 
        };

        let windSlider = IslandArea.circleSliderForAttributes(
            d3.select("svg.wind-slider-container"),
            "img/windforce-drag-element.png",
            0.3,
            new Slider.Point(0.5, 0.5), 0.5, 225, -45,
            windForceCallback)
        windSlider.render()
    }

    private hideClouds() {
        for (let item of this.clouds) {
            item.css("display", "none")
        }
    }

    private switchRainState(isOn: boolean) {
        for (let item of this.rains) {
            item.css("display", isOn ? "block" : "none")
        }
    }

    private static circleSliderForAttributes(container: d3.Selection<any, any, any, any>,
                                     dragItemPicture: string,
                                     dragItemSizeRatio: number,
                                     rotateAnchorPoint: Slider.Point,
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
    let island = new IslandArea()
    island.render()
});
