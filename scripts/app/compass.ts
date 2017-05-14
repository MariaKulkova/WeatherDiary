declare var d3: any;

var compassAngleCallback;

var compassDrag = d3.drag()
    .on("start", compassDragStarted)
    .on("drag", compassDragged)
    .on("end", compassDragEnded);

var compassOriginAngle = 0
var compassAngle = 0

function getCompassHandler() {
    return d3.select("div.compass-drag-handler")
}

function getCompass() {
    return d3.select("div.compass")
}

getCompassHandler().call(compassDrag)

function rotateCompass(angle) {
    getCompass().style("transform", "rotate(" + angle + "deg)");
    
    if (compassAngleCallback) {
        compassAngleCallback(angle)
    }
}

function translateCompassCoordinates(coordinates) {
    var bounds = getCompassHandler().node().getBoundingClientRect()
    return {
        x: coordinates.x - bounds.width / 2,
        y: -(coordinates.y - bounds.height / 2)
    }
}

function getCompassAngle(pos) {
    return Math.atan2(pos.x, pos.y) * 180 / Math.PI
}

function compassDragStarted() {
    compassAngle = getCompassAngle(translateCompassCoordinates(d3.event))
}

function compassDragged() {
    var angle = getCompassAngle(translateCompassCoordinates(d3.event))
    rotateCompass(compassOriginAngle += (angle - compassAngle));
    compassAngle = angle
}

function compassDragEnded() {
    var angle = getCompassAngle(translateCompassCoordinates(d3.event))
    var stickAngle = 45
    var angleAmount = Math.round(angle / stickAngle)
    rotateCompass(compassOriginAngle = stickAngle * angleAmount);
}

rotateCompass(0)
