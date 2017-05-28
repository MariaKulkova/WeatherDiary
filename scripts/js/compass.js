/// <reference path="../../node_modules/@types/d3/index.d.ts"/>
/// <reference path="./geometry.ts"/>
var Compass;
(function (Compass) {
    class WindCompass {
        constructor(onValueChangedListenter) {
            this.compassOriginAngle = 0;
            this.compassAngle = 0;
            this.onValueChangedListenter = onValueChangedListenter;
            var compassDrag = d3.drag()
                .on("start", () => { this.dragStarted(); })
                .on("drag", () => { this.didDragged(); })
                .on("end", () => { this.dragEnded(); });
            this.compassHandler = d3.select("div.compass-drag-handler").call(compassDrag);
            this.compass = d3.select("div.compass");
        }
        render() {
            this.rotateCompass(0);
        }
        /* Darg handling */
        dragStarted() {
            this.compassAngle = this.getCompassAngle(this.translateCompassCoordinates(d3.event));
        }
        didDragged() {
            var angle = this.getCompassAngle(this.translateCompassCoordinates(d3.event));
            this.rotateCompass(this.compassOriginAngle += (angle - this.compassAngle));
            this.compassAngle = angle;
        }
        dragEnded() {
            var angle = this.getCompassAngle(this.translateCompassCoordinates(d3.event));
            this.compassOriginAngle += (angle - this.compassAngle);
            // Determines the step for slider sticking position in degrees
            var stickAngle = 45;
            // Calculates total angle rounding it to the closest stick position
            var angleAmount = Math.round(this.compassOriginAngle / stickAngle);
            this.compassOriginAngle = stickAngle * angleAmount;
            this.rotateCompass(this.compassOriginAngle);
            if (this.onValueChangedListenter) {
                let fullCircleArch = 360;
                // Discard full circles and return only actual offset
                this.onValueChangedListenter(this.compassOriginAngle % fullCircleArch);
            }
        }
        /* Rotation calculations */
        rotateCompass(angle) {
            this.compass.style("transform", "rotate(" + angle + "deg)");
        }
        translateCompassCoordinates(coordinates) {
            var bounds = this.compassHandler.node().getBoundingClientRect();
            return new Geometry.Point(coordinates.x - bounds.width / 2, -(coordinates.y - bounds.height / 2));
        }
        getCompassAngle(position) {
            return Geometry.radiansToDegrees(Math.atan2(position.x, position.y));
        }
    }
    Compass.WindCompass = WindCompass;
})(Compass || (Compass = {}));
//# sourceMappingURL=compass.js.map