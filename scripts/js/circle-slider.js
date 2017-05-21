/// <reference path="../../node_modules/@types/d3/index.d.ts"/>
var Slider;
(function (Slider) {
    class RotateAttributes {
        constructor(centerX, centerY, radius, startAngle, endAngle) {
            this.checkAngle(startAngle);
            this.checkAngle(endAngle);
            this.centerX = centerX;
            this.centerY = centerY;
            this.radius = radius;
            this.startAngle = startAngle;
            this.endAngle = endAngle;
        }
        checkAngle(angle) {
            if (angle < 0 || angle > 360) {
                // throw new EvalError("")
            }
        }
    }
    Slider.RotateAttributes = RotateAttributes;
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }
    class CircleSlider {
        constructor(sliderContainer, imageUrl, dragElementSizeRatio, rotateAttributes, onValueChangedListener) {
            this.width = 100;
            this.height = 100;
            this.sliderContainer = sliderContainer;
            this.imageUrl = imageUrl;
            this.dragElementSizeRatio = this.width * dragElementSizeRatio;
            this.rotateAttributes = rotateAttributes;
            this.onValueChangedListener = onValueChangedListener;
        }
        render() {
            this.sliderContainer
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 " + this.width + " " + this.height);
            let dragstarted = (d) => {
                d3.event.sourceEvent.stopPropagation();
                this.dragElement.classed("dragging", true);
            };
            let dragged = (d) => {
                var d_from_origin = Math.sqrt(Math.pow(d3.event.x, 2) + Math.pow(d3.event.y, 2));
                var alpha = Math.acos(d3.event.x / d_from_origin);
                if (d3.event.y > 0) {
                    alpha = Math.PI * 2 - alpha;
                }
                var alphaDegrees = alpha * 180 / Math.PI;
                console.log(alpha);
                if (alphaDegrees >= this.rotateAttributes.startAngle && alphaDegrees <= this.rotateAttributes.endAngle) {
                    var angle = (alphaDegrees - this.rotateAttributes.startAngle) / (this.rotateAttributes.endAngle - this.rotateAttributes.startAngle);
                    this.onValueChangedListener(angle);
                    this.dragElement
                        .attr("x", d.x = (this.width * this.rotateAttributes.radius) * Math.cos(alpha))
                        .attr("y", d.y = -(this.height * this.rotateAttributes.radius) * Math.sin(alpha))
                        .style("transform", d.rotateTransformation = "rotate(" + alphaDegrees + "deg)");
                }
            };
            let dragended = (d) => {
                this.dragElement.classed("dragging", false);
            };
            let drag = d3.drag()
                .subject(function (d) { return d; })
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
            let handleDrag = [{
                    x: (this.width * this.rotateAttributes.radius) * Math.cos(this.rotateAttributes.startAngle * Math.PI / 180),
                    y: -(this.height * this.rotateAttributes.radius) * Math.sin(this.rotateAttributes.startAngle * Math.PI / 180),
                    rotateTransformation: ""
                }];
            let translateX = this.width * this.rotateAttributes.centerX - this.dragElementSizeRatio / 2;
            let translateY = this.height * this.rotateAttributes.centerY - this.dragElementSizeRatio / 2;
            this.dragElement = this.sliderContainer.append("g")
                .attr("transform", "translate(" + translateX + "," + translateY + ")")
                .selectAll('image')
                .data(handleDrag)
                .enter().append("image");
            this.dragElement
                .attr("class", "sun")
                .attr("height", this.dragElementSizeRatio)
                .attr("width", this.dragElementSizeRatio)
                .attr("xlink:href", this.imageUrl)
                .attr("x", function (d) { return d.x; })
                .attr("y", function (d) { return d.y; })
                .style("transform", function (d) { return d.rotateTransformation; })
                .style("transform-origin", "center center")
                .call(drag);
        }
    }
    Slider.CircleSlider = CircleSlider;
})(Slider || (Slider = {}));
//# sourceMappingURL=circle-slider.js.map