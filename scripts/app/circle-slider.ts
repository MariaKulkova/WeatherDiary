/// <reference path="../../node_modules/@types/d3/index.d.ts"/>
/// <reference path="./geometry.ts"/>

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
      if (angle < -360 || angle > 360) {
        throw new EvalError("Angle value " + angle + " is invalid")
      }
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

    private savedVector: Geometry.Point
    private cumulativeAngle: number = 0

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

        let startAngleRad = Geometry.degreesToRadians(this.rotateAttributes.startAngle)
        this.savedVector = new Geometry.Point(this.width * this.rotateAttributes.radius * Math.cos(startAngleRad),
                                              -this.height * this.rotateAttributes.radius * Math.sin(startAngleRad))
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
        let currentVector = new Geometry.Point(d3.event.x, d3.event.y)
        let currentVectorAngle = this.angleForPoint(currentVector)

        // Determine rotation limitation
        let oldVectorAngle = this.angleForPoint(this.savedVector)
        let deltaAngle = this.angleBetweenVectors(this.savedVector, currentVector)
        if (this.isRotateClockwise(this.savedVector, currentVector)) {
          deltaAngle = -deltaAngle
        }

        let arcLength = Math.abs(this.rotateAttributes.endAngle - this.rotateAttributes.startAngle)
        let newCumulativeAngle = this.cumulativeAngle - Geometry.radiansToDegrees(deltaAngle)
        if (newCumulativeAngle <= arcLength && newCumulativeAngle >= 0) {
          this.cumulativeAngle = newCumulativeAngle

          let alphaDegrees = Geometry.radiansToDegrees(currentVectorAngle)
          var progress = this.cumulativeAngle / arcLength
          this.onValueChangedListener(progress)
          this.dragElement
            .attr("x", d.x = this.width * this.rotateAttributes.radius * Math.cos(currentVectorAngle))
            .attr("y", d.y = -this.height * this.rotateAttributes.radius * Math.sin(currentVectorAngle))
            .style("transform", d.rotateTransformation = "rotate(" + alphaDegrees + "deg)");

          this.savedVector = currentVector
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

      let initialCoordinates: [DragCoordinates] = [{ 
        x: this.savedVector.x, 
        y: this.savedVector.y, 
        rotateTransformation: "rotate(" + this.rotateAttributes.startAngle + "deg)"
      }]

      let translateX = this.width * this.rotateAttributes.centerX - this.dragElementSizeRatio / 2
      let translateY = this.height * this.rotateAttributes.centerY - this.dragElementSizeRatio / 2
      this.dragElement = this.sliderContainer.append("g")
        .attr("transform", "translate(" + translateX + "," + translateY + ")")
        .selectAll("image")
        .data(initialCoordinates)
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

    public setProgressValue(value: number) {
      let arcLength = Math.abs(this.rotateAttributes.endAngle - this.rotateAttributes.startAngle)
      this.cumulativeAngle = arcLength * value
      let realAngle = this.rotateAttributes.startAngle - this.cumulativeAngle
      this.savedVector = new Geometry.Point(this.width * this.rotateAttributes.radius * Math.cos(Geometry.degreesToRadians(realAngle)),
                                           -this.height * this.rotateAttributes.radius * Math.sin(Geometry.degreesToRadians(realAngle)))
      
      // We should reinitialize data binding for correct slider work
      let initialCoordinates: [DragCoordinates] = [{ 
        x: this.savedVector.x, 
        y: this.savedVector.y, 
        rotateTransformation: "rotate(" + realAngle + "deg)"
      }]

      this.sliderContainer.select("g")
        .selectAll("image")
        .data(initialCoordinates)
      
      this.dragElement
        .attr("x", initialCoordinates[0].x)
        .attr("y", initialCoordinates[0].y)
        .style("transform", initialCoordinates[0].rotateTransformation)
    }

    // Helpers methods

    private isRotateClockwise(start: Geometry.Point, end: Geometry.Point): boolean {
      let orientedArea = start.y * end.x - start.x * end.y
      return orientedArea < 0
    }

    private angleBetweenVectors(start: Geometry.Point, end: Geometry.Point): number {
      let startLength = Math.sqrt(Math.pow(start.x, 2) + Math.pow(start.y, 2))
      let endLength = Math.sqrt(Math.pow(end.x, 2) + Math.pow(end.y, 2))
      let cosValue = (start.x * end.x + start.y * end.y) / (startLength * endLength)
      var alpha = Math.acos(this.roundNumber(cosValue, 5))
      return alpha
    }

    private angleForPoint(point: Geometry.Point): number {
      var currentVectorLength = Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
      var alpha = Math.acos(point.x / currentVectorLength);
      if (point.y > 0) {
        alpha = Math.PI * 2 - alpha
      }
      return alpha
    }

    private roundNumber(value: number, precision: number): number {
      let factor = Math.pow(10, precision)
      let tempNumber = value * factor
      var roundedTempNumber = Math.round(tempNumber)
      return roundedTempNumber / factor
    }
  }
}
