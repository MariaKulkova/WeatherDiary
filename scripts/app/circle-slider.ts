declare var d3: any;

// interface SliderValueChangedListener {
//   (sender: QuaterSlider, angle: number): void;
// }

// class QuaterSlider {
//   // var width = "100%",
//   //     height = "100%";
//   // var circumference_r = 100;

//   listener: SliderValueChangedListener

//   constructor(listener: SliderValueChangedListener) {
//     this.listener = listener
//   }

//   draw() {
    
//   }
// }

var sunAngleCallback;

var circumference_r = 100;

var svg = d3.select("svg.slider-container")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 100 100")

var handle = [{
  x: 0,
  y: -100,
  angle: ""
}];

var drag = d3.drag()
  .subject(function(d) { return d; })
  .on("start", dragstarted)
  .on("drag", dragged)
  .on("end", dragended);

var handle_circle = svg.append("g")
  .attr("transform", "translate(" + (100 - 15) + "," + (100 - 15) + ")")
  .attr("class", "dot")
    .selectAll('image')
  .data(handle)
    .enter().append("image")
  .attr("height", "40")
  .attr("width", "40")
  .attr("xlink:href", "img/sun-plain.png")
  .attr("x", function(d) { return d.x;})
  .attr("y", function(d) { return d.y;})
  .style("transform", function(d) { return d.angle;})
  .style("transform-origin", "center center")  
  .call(drag);

function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this)
    .classed("dragging", true);
}

function dragged(d) {  
  var d_from_origin = Math.sqrt(Math.pow(d3.event.x, 2) + Math.pow(d3.event.y, 2));
  
  var alpha = Math.acos(d3.event.x/d_from_origin);
  var alphaDegrees = alpha * 180 / Math.PI;
  
  if (alphaDegrees >= 90 && d3.event.y <= 0) {
    var angle = alphaDegrees - 90;
    sunAngleCallback(angle)
    d3.select(this)
      .attr("x", d.x = circumference_r * Math.cos(alpha))
      .attr("y", d.y = -circumference_r * Math.sin(alpha))
      .style("transform", d.angle = "rotate(" + angle + "deg)");
  }
}

function dragended(d) {
  d3.select(this)
    .classed("dragging", false);
}