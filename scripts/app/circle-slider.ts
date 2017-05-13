declare var d3: any;

var width = "100%",
    height = "100%";
var circumference_r = 100;

var svg = d3.select("div.circle-slider").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + 160 + "," + 160 + ")");

var container = svg.append("g");

var arc = d3.arc()
    .innerRadius(90)
    .outerRadius(100)
    .startAngle(0 * (Math.PI/180)) //converting from degs to radians
    .endAngle(-90 * (Math.PI/180)) //just radians

var circumference = container.append("path")
    .attr("d", arc)
    .attr("class", "circumference")

var handle = [{
  x: 0,
  y: -circumference_r
}];

var drag = d3.drag()
  .subject(function(d) { return d; })
  .on("start", dragstarted)
  .on("drag", dragged)
  .on("end", dragended);

var handle_circle = container.append("g")
  .attr("class", "dot")
    .selectAll('circle')
  .data(handle)
    .enter().append("circle")
  .attr("r", 5)
  .attr("cx", function(d) { return d.x;})
  .attr("cy", function(d) { return d.y;})
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
    d3.select(this)
      .attr("cx", d.x = circumference_r * Math.cos(alpha))
      .attr("cy", d.y = -circumference_r * Math.sin(alpha));
  }
}

function dragended(d) {
  d3.select(this)
    .classed("dragging", false);
}