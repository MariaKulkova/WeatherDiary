/// <reference path="./circle-slider.ts"/>
class IslandArea {
    render() {
        let temperatureCallback = function (progress) {
            let formattedValue = Math.round(120 * progress - 60);
            d3.select("p.temperature-value").text(formattedValue);
        };
        let sunSlider = IslandArea.circleSliderForAttributes(d3.select("svg.sun-slider-container"), "img/sun-plain.png", 0.4, new Slider.Point(1, 1), 0.95, 180, 90, temperatureCallback);
        sunSlider.render();
        let windForceCallback = function (progress) {
            let formattedValue = Math.round(20 * progress);
            d3.select("p.windforce-value").text(formattedValue + "м/с");
        };
        let windSlider = IslandArea.circleSliderForAttributes(d3.select("svg.wind-slider-container"), "img/windforce-drag-element.png", 0.3, new Slider.Point(0.5, 0.5), 0.5, 225, -45, windForceCallback);
        windSlider.render();
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