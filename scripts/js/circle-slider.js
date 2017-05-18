/// <reference path="../../node_modules/@types/d3/index.d.ts"/>
var Slider;
(function (Slider) {
    class CircleSlider {
        constructor(sliderContainer, imageUrl, dragElementSizeRatio, onValueChangedListener) {
            this.width = 100;
            this.height = 100;
            this.sliderRadius = 100;
            this.startAngle = 0;
            this.endAngle = 90;
            this.sliderContainer = sliderContainer;
            this.imageUrl = imageUrl;
            this.dragElementSizeRatio = this.width * dragElementSizeRatio;
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
                var alphaDegrees = alpha * 180 / Math.PI;
                if (alphaDegrees >= 90 && d3.event.y <= 0) {
                    console.log(d3.select(this));
                    var angle = alphaDegrees - 90;
                    console.log();
                    this.onValueChangedListener(angle);
                    this.dragElement
                        .attr("x", d.x = this.sliderRadius * Math.cos(alpha))
                        .attr("y", d.y = -this.sliderRadius * Math.sin(alpha))
                        .style("transform", d.rotateTransformation = "rotate(" + angle + "deg)");
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
            let handleDrag = [{ x: -10, y: -this.height, rotateTransformation: "" }];
            this.dragElement = this.sliderContainer.append("g")
                .attr("transform", "translate(" + (this.width - 15) + "," + (this.height - 15) + ")")
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