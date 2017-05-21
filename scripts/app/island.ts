declare var d3: any;
/// <reference path="./circle-slider.ts"/>

let svg = d3.select("svg.sun-slider-container")
let sunAngleCallback: (value: number) => void = function(angle) { 
    let formattedValue = Math.round(120 * angle - 60)
    d3.select("p.temperature-value").text(formattedValue)
};
let rotate = new Slider.RotateAttributes(1, 1, 0.95, 180, 90)
let sunSlider = new Slider.CircleSlider(svg, "img/sun-plain.png", 0.4, rotate, sunAngleCallback)
sunSlider.render()

let svgWind = d3.select("svg.wind-slider-container")
let windAngleCallback: (value: number) => void = function(angle) { 
    let formattedValue = Math.round(120 * angle - 60)
};
let rotateWind = new Slider.RotateAttributes(0.5, 0.5, 0.5, 225, -45)
let windSlider = new Slider.CircleSlider(svgWind, "img/windforce-drag-element.png", 0.3, rotateWind, windAngleCallback)
windSlider.render()
