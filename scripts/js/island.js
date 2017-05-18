/// <reference path="./circle-slider.ts"/>
let svg = d3.select("svg.slider-container");
let sunAngleCallback = function (angle) {
    let formattedValue = (90 - Math.round(angle)) / 2;
    d3.select("p.temperature-value").text(formattedValue);
};
let sunSlider = new Slider.CircleSlider(svg, "img/sun-plain.png", 0.4, sunAngleCallback);
sunSlider.render();
//# sourceMappingURL=island.js.map