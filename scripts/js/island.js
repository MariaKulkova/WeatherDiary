/// <reference path="./circle-slider.ts"/>
class IslandArea {
    constructor() {
        this.cloudButtonTapsCount = 0;
        this.clouds = [$(".cloud-big"), $(".cloud-small"), $(".cloud-medium")];
        let cloudButton = $(".tool-button.cloud");
        cloudButton.on("click", (e) => {
            e.preventDefault();
            this.cloudButtonTapsCount += 1;
            if (this.cloudButtonTapsCount > this.clouds.length) {
                this.cloudButtonTapsCount = 0;
                this.hideClouds();
            }
            else {
                this.clouds[this.cloudButtonTapsCount - 1].css("display", "block");
            }
        });
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
    render() {
        let temperatureCallback = function (progress) {
            let formattedValue = Math.round(120 * progress - 60);
            d3.select("p.temperature-value").text(formattedValue);
            let progressColor = [Math.round(95 + (0 - 95) * progress),
                Math.round(201 + (206 - 201) * progress),
                Math.round(226 + (255 - 226) * progress)];
            let styleString = "linear-gradient(to top, rgb(255, 255, 255), rgb(" + progressColor.join(",") + "))";
            console.log(styleString);
            $("body").css("background-image", styleString);
        };
        let sunSlider = IslandArea.circleSliderForAttributes(d3.select("svg.sun-slider-container"), "img/sun-plain.png", 0.4, new Slider.Point(1, 1), 0.95, 180, 90, temperatureCallback);
        sunSlider.render();
        let windForceCallback = function (progress) {
            let formattedValue = Math.round(20 * progress);
            d3.select("p.windforce-value").text(formattedValue + "м/с");
        };
        let windSlider = IslandArea.circleSliderForAttributes(d3.select("svg.wind-slider-container"), "img/windforce-drag-element.png", 0.3, new Slider.Point(0.5, 0.5), 0.5, 225, -45, windForceCallback);
        windSlider.render();
        $("#datepicker").datepicker({
            inline: false,
            showOtherMonths: true,
            dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
            firstDay: 1,
            dateFormat: "dd.mm.yy",
            onSelect: () => {
                let dateString = $("#datepicker").datepicker({ dateFormat: "dd.mm.yy" }).val();
                $(".header-date").html(dateString);
                $(".modal").css("display", "none");
            }
        });
    }
    hideClouds() {
        for (let item of this.clouds) {
            item.css("display", "none");
        }
    }
    static circleSliderForAttributes(container, dragItemPicture, dragItemSizeRatio, rotateAnchorPoint, rotateRadiusRatio, startAngle, endAngle, callback) {
        let rotate = new Slider.RotateAttributes(rotateAnchorPoint.x, rotateAnchorPoint.y, rotateRadiusRatio, startAngle, endAngle);
        return new Slider.CircleSlider(container, dragItemPicture, dragItemSizeRatio, rotate, callback);
    }
}
$(() => {
    let island = new IslandArea();
    island.render();
});
//# sourceMappingURL=island.js.map