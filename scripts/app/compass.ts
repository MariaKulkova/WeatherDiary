declare var d3: any;

var compassAngleCallback;

var compassDrag = d3.drag()
    .on("start", compassDragStarted)
    .on("drag", compassDragged);

var windForceDrag = d3.drag()
    .on("start", windForceDragStarted)
    .on("drag", windForceDragged);

var compassOriginAngle = 0
var compassAngle = 0

function getCompassHandler() {
    return d3.select("div.compass-drag-handler")
}

function getCompass() {
    return d3.select("div.compass")
}

function getWindForceHandler() {
    return d3.select("div.wind-force-drag-handler")
}

function getWindForce() {
    return d3.select("div.wind-force")
}

getCompassHandler().call(compassDrag);
getWindForceHandler().call()

function rotateCompass(angle) {
    getCompass().style("transform", "rotate(" + angle + "deg)");
    
    if (compassAngleCallback) {
        compassAngleCallback(angle)
    }
}

function rotateWindForce(angle) {
    getCompass().style("transform", "rotate(" + angle + "deg)");
    
    if (compassAngleCallback) {
        compassAngleCallback(angle)
    }
}

function translateCoordinates(coordinates) {
    var bounds = getCompassHandler().node().getBoundingClientRect()
    return {
        x: coordinates.x - bounds.width / 2,
        y: -(coordinates.y - bounds.height / 2)
    }
}

function getAngle(pos) {
    return Math.atan2(pos.x, pos.y) * 180 / Math.PI
}

function compassDragStarted() {
    compassAngle = getAngle(translateCoordinates(d3.event))
}

function compassDragged() {
    var angle = getAngle(translateCoordinates(d3.event))
    rotateCompass(compassOriginAngle += (angle - compassAngle));
    compassAngle = angle
}

rotateCompass(0)

function windForceDragStarted() {
    compassAngle = getAngle(translateCoordinates(d3.event))
}

function windForceDragged() {
    var angle = getAngle(translateCoordinates(d3.event))
    rotateCompass(compassOriginAngle += (angle - compassAngle));
    compassAngle = angle
}

rotateWindForce(0)