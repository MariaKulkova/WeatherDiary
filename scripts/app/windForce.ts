declare var d3: any;

var windForceAngleCallback;

var windForceDrag = d3.drag()
    .on("start", windForceDragStarted)
    .on("drag", windForceDragged);

var windForceOriginAngle = 0
var windForceAngle = 0

function getWindForceHandler() {
    return d3.select("div.windForce-drag-handler")
}

function getWindForce() {
    return d3.select("div.windForce")
}

getWindForceHandler().call(windForceDrag)

function rotateWindForce(angle) {
    getWindForce().style("transform", "rotate(" + angle + "deg)");
    
    if (windForceAngleCallback) {
        windForceAngleCallback(angle)
    }
}

function translateWindForceCoordinates(coordinates) {
    var bounds = getWindForceHandler().node().getBoundingClientRect()
    return {
        x: coordinates.x - bounds.width / 2,
        y: -(coordinates.y - bounds.height / 2)
    }
}

function getWindForceAngle(pos) {
    return Math.atan2(pos.x, pos.y) * 180 / Math.PI
}

function windForceDragStarted() {
    windForceAngle = getWindForceAngle(translateWindForceCoordinates(d3.event))
}

function windForceDragged() {
    var angle = getWindForceAngle(translateWindForceCoordinates(d3.event))
    rotateWindForce(windForceOriginAngle += (angle - windForceAngle));
    windForceAngle = angle
}

rotateWindForce(0)
