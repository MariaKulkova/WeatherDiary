/// <reference path="./circle-slider.ts"/>
let svg = d3.select("svg.slider-container");
let sunAngleCallback = function (angle) {
    let formattedValue = Math.round(120 * angle - 60);
    d3.select("p.temperature-value").text(formattedValue);
};
let rotate = new Slider.RotateAttributes(0.5, 0.5, 0.5, 0, 360);
let sunSlider = new Slider.CircleSlider(svg, "img/sun-plain.png", 0.4, rotate, sunAngleCallback);
sunSlider.render();
//# sourceMappingURL=island.js.map