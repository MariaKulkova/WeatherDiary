declare var d3: any;
/// <reference path="./circle-slider.ts"/>

let svg = d3.select("svg.slider-container")
let sunAngleCallback: (value: number) => void = function(angle) { 
    let formattedValue = Math.round(120 * angle - 60)
    d3.select("p.temperature-value").text(formattedValue)
};

let rotate = new Slider.RotateAttributes(1, 1, 0.95, 180, 90)
let sunSlider = new Slider.CircleSlider(svg, "img/sun-plain.png", 0.4, rotate, sunAngleCallback)
sunSlider.render()
