declare var d3: any;
/// <reference path="../../node_modules/@types/d3/index.d.ts"/>
/// <reference path="./geometry.ts"/>

namespace Compass {

    export class WindCompass {
        private onValueChangedListenter: (value: number) => void
        private compassHandler: d3.Selection<any, any, any, any>
        private compass: d3.Selection<any, any, any, any>
        private compassOriginAngle: number = 0
        private compassAngle: number = 0

        constructor(onValueChangedListenter: (value: number) => void) {
            this.onValueChangedListenter = onValueChangedListenter

            var compassDrag = d3.drag()
                .on("start", () => { this.dragStarted() })
                .on("drag", () => { this.didDragged() })
                .on("end", () => { this.dragEnded() })
            this.compassHandler = d3.select("div.compass-drag-handler").call(compassDrag)
            this.compass = d3.select("div.compass")
        }

        public render() {
            this.rotateCompass(0)
        }

        /* Darg handling */

        private dragStarted() {
            this.compassAngle = this.getCompassAngle(this.translateCompassCoordinates(d3.event))
        }

        private didDragged() {
            var angle = this.getCompassAngle(this.translateCompassCoordinates(d3.event))
            this.rotateCompass(this.compassOriginAngle += (angle - this.compassAngle));
            this.compassAngle = angle
        }

        private dragEnded() {
            var angle = this.getCompassAngle(this.translateCompassCoordinates(d3.event))
            this.compassOriginAngle += (angle - this.compassAngle)
            // Determines the step for slider sticking position in degrees
            var stickAngle = 45
            // Calculates total angle rounding it to the closest stick position
            var angleAmount = Math.round(this.compassOriginAngle / stickAngle)
            this.compassOriginAngle = stickAngle * angleAmount
            this.rotateCompass(this.compassOriginAngle);

            if (this.onValueChangedListenter) {
                // Discard full circles and return only actual offset
                let formattedAngle = (this.compassOriginAngle % 360)
                if (formattedAngle < 0) {
                    formattedAngle += 360
                }
                this.onValueChangedListenter(formattedAngle)
                console.log(formattedAngle)
            }
        }

        /* Rotation calculations */

        private rotateCompass(angle: number) {
            this.compass.style("transform", "rotate(" + angle + "deg)");
        }

        private translateCompassCoordinates(coordinates: Geometry.Point) {
            var bounds = this.compassHandler.node().getBoundingClientRect()
            return new Geometry.Point(coordinates.x - bounds.width / 2, -(coordinates.y - bounds.height / 2))
        }

        private getCompassAngle(position: Geometry.Point) {
            return Geometry.radiansToDegrees(Math.atan2(position.x, position.y))
        }
    }
}
