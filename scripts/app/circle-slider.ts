/// <reference path="../../node_modules/@types/d3/index.d.ts"/>

namespace Slider {

  export interface DragCoordinates {
    x: number
    y: number
    rotateTransformation: string
  }

  export class RotateAttributes {
    centerX: number
    centerY: number
    radius: number
    startAngle: number
    endAngle: number

    constructor(centerX: number,
                centerY: number,
                radius: number,
                startAngle: number,
                endAngle: number) {
      this.checkAngle(startAngle)
      this.checkAngle(endAngle)

      this.centerX = centerX
      this.centerY = centerY
      this.radius = radius
      this.startAngle = startAngle
      this.endAngle = endAngle
    }

    private checkAngle(angle: number) {
      if (angle < 0 || angle > 360) {
        // throw new EvalError("")
      }
    }

  }

  class Point {
    x: number
    y: number

    constructor(x: number,
                y: number) {
      this.x = x
      this.y = y
    }
  }

  export class CircleSlider {
    private readonly width: number = 100
    private readonly height: number = 100

    private sliderContainer: d3.Selection<any, any, any, any>
    private imageUrl: string
    private dragElementSizeRatio: number
    private rotateAttributes: RotateAttributes
    private onValueChangedListener: (value: number) => void
    private dragElement: d3.Selection<any, any, any, any>

    private currentAngle: number

    constructor(sliderContainer: d3.Selection<any, any, any, any>,
                imageUrl: string,
                dragElementSizeRatio: number,
                rotateAttributes: RotateAttributes,
                onValueChangedListener: (value: number) => void) {
        this.sliderContainer = sliderContainer
        this.imageUrl = imageUrl
        this.dragElementSizeRatio = this.width * dragElementSizeRatio
        this.rotateAttributes = rotateAttributes
        this.onValueChangedListener = onValueChangedListener
    }

    public render() {
      this.sliderContainer
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + this.width + " " + this.height)
      
      let dragstarted = (d: DragCoordinates) => { 
        d3.event.sourceEvent.stopPropagation();
        this.dragElement.classed("dragging", true); 
      }

      let dragged = (d: DragCoordinates) => {
        var d_from_origin = Math.sqrt(Math.pow(d3.event.x, 2) + Math.pow(d3.event.y, 2));
        var alpha = Math.acos(d3.event.x / d_from_origin);
        if (d3.event.y > 0) {
          alpha = Math.PI * 2 - alpha
        }
        var alphaDegrees = alpha * 180 / Math.PI;
        console.log(alpha)
        
        if (alphaDegrees >= this.rotateAttributes.startAngle && alphaDegrees <= this.rotateAttributes.endAngle) {
          var angle = (alphaDegrees - this.rotateAttributes.startAngle) / (this.rotateAttributes.endAngle - this.rotateAttributes.startAngle);
          this.onValueChangedListener(angle)
          this.dragElement
            .attr("x", d.x = (this.width * this.rotateAttributes.radius) * Math.cos(alpha))
            .attr("y", d.y = -(this.height * this.rotateAttributes.radius) * Math.sin(alpha))
            .style("transform", d.rotateTransformation = "rotate(" + alphaDegrees + "deg)");
        }
      }

      let dragended = (d: DragCoordinates) => {
        this.dragElement.classed("dragging", false);
      }

      let drag = d3.drag()
        .subject(function(d) { return d; })
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);

      let handleDrag: [DragCoordinates] = [{ 
        x: (this.width * this.rotateAttributes.radius) * Math.cos(this.rotateAttributes.startAngle * Math.PI / 180), 
        y: -(this.height * this.rotateAttributes.radius) * Math.sin(this.rotateAttributes.startAngle * Math.PI / 180), 
        rotateTransformation: ""
      }]

      let translateX = this.width * this.rotateAttributes.centerX - this.dragElementSizeRatio / 2
      let translateY = this.height * this.rotateAttributes.centerY - this.dragElementSizeRatio / 2
      this.dragElement = this.sliderContainer.append("g")
        .attr("transform", "translate(" + translateX + "," + translateY + ")")
        .selectAll('image')
        .data(handleDrag)
        .enter().append("image")

      this.dragElement
        .attr("class", "sun")
        .attr("height", this.dragElementSizeRatio)
        .attr("width", this.dragElementSizeRatio)
        .attr("xlink:href", this.imageUrl)
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .style("transform", function(d) { return d.rotateTransformation; })
        .style("transform-origin", "center center")  
        .call(drag);
    }
  }
}

