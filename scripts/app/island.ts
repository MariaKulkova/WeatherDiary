declare var d3: any;

sunAngleCallback = function(angle) {
    d3.select("p.temperature-value").text(angle)
}
