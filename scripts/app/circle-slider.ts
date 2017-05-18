/// <reference path="../../node_modules/@types/d3/index.d.ts"/>

namespace Slider {

  export interface DragCoordinates {
    x: number
    y: number
    rotateTransformation: string
  }

  export class CircleSlider {
    private readonly width: number = 100
    private readonly height: number = 100
    private readonly sliderRadius: number = 100

    private sliderContainer: d3.Selection<any, any, any, any>
    private imageUrl: string
    private dragElementSizeRatio: number
    private onValueChangedListener: (value: number) => void

    private dragElement: d3.Selection<any, any, any, any>
    private startAngle: number = 0
    private endAngle: number = 90

    constructor(sliderContainer: d3.Selection<any, any, any, any>,
                imageUrl: string,
                dragElementSizeRatio: number,
                onValueChangedListener: (value: number) => void) {
        this.sliderContainer = sliderContainer
        this.imageUrl = imageUrl
        this.dragElementSizeRatio = this.width * dragElementSizeRatio
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
    
        var alpha = Math.acos(d3.event.x/d_from_origin);
        var alphaDegrees = alpha * 180 / Math.PI;
        
        if (alphaDegrees >= 90 && d3.event.y <= 0) {
          console.log(d3.select(this))
          var angle = alphaDegrees - 90;
          console.log()
          
          this.onValueChangedListener(angle)
          this.dragElement
            .attr("x", d.x = this.sliderRadius * Math.cos(alpha))
            .attr("y", d.y = -this.sliderRadius * Math.sin(alpha))
            .style("transform", d.rotateTransformation = "rotate(" + angle + "deg)");
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

      let handleDrag: [DragCoordinates] = [{ x: -10, y: -this.height, rotateTransformation: "" }]

      this.dragElement = this.sliderContainer.append("g")
        .attr("transform", "translate(" + (this.width - 15) + "," + (this.height - 15) + ")")
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

