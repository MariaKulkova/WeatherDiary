declare var d3: any;

sunAngleCallback = function(angle) {
    var value = (90 - Math.round(angle)) / 2;
    d3.select("p.temperature-value").text(value)
}
