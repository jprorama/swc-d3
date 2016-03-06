// Select the dataset
// note: references to the parsed data "nations" only available in callback
//       so render the plot within the callback.
var dataUrl = "https://raw.githubusercontent.com/IsaKiko/D3-visualising-data/gh-pages/code/nations.json";
d3.json(dataUrl, function(nations) {

// Select the chart area by ID 
var chart_area = d3.select("#chart_area");

var frame = chart_area.append("svg");

// Create canvas inside frame.
var canvas = frame.append("g");

// Set margins, width, and height.
var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5};
var frame_width = 960;
var frame_height = 350;
var canvas_width = frame_width - margin.left - margin.right;
var canvas_height = frame_height - margin.top - margin.bottom;

// Set frame attributes width and height.
frame.attr("width", frame_width);
frame.attr("height", frame_height);

// Shift the canvas and make it slightly smaller than the svg canvas.
canvas.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Follow d3 data example
// http://isakiko.github.io/D3-visualising-data/08-d3enter.html

// Create a logarithmic scale for the income 
var xScale = d3.scale.log(); // income
xScale.domain([250, 1e5]); // set minimum and maximum value
xScale.range([0, canvas_width]); // set minimum and maximum range on the page

// Creating the x & y axes.
var xAxis = d3.svg.axis().orient("bottom").scale(xScale);

// Add the x-axis.
canvas.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + canvas_height + ")")
    .call(xAxis);

// create linear scale for life expectency
// note: y-axis drawn from top of the svg down so the first tick drawn is the maximum of our domain "84"
var yScale = d3.scale.linear().domain([84,10]).range([0,canvas_height]); // life expectancy

// Create y axis
// note: .orient() tells d3 how to draw the axis based on expected location. it doesn't place the axis
var yAxis = d3.svg.axis().orient("left").scale(yScale);

// Add y-axis
// note: translate is 0,0 because the coordinate system is top-left with positive positions down and right 
//       in the case of the y axis it is drawn from the top-left down, so there is no need to translate its position
canvas.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(yAxis);

// create sqrt scale for country population
// note: d3.scale is a mapping function to convert data into a range
var rScale = d3.scale.sqrt().domain([0,5e8]).range([0,40]);

// color scale for country region
var colorScale = d3.scale.category20().domain(["Sub-Saharan Africa", "South Asia", "Middle East & North Africa", "America", "Europe & Central Asia", "East Asia & Pacific"]);

// plot the data from life expectancy for final year
var data_canvas = canvas.append("g")
  .attr("class", "data_canvas");

// example filters
//
// filter by population size
//var filtered_nations = nations.filter(function(nation){
//    return nation.population[nation.population.length-1] > 10000000;
//});

// filter by region
//var filtered_nations = nations.filter(function(nation){
//    return nation.region[nation.region.length-1] == "Sub-Saharan Africa";
//});

// copy all nations to filtered_nations
var filtered_nations = nations.map(function(nation) { return nation; });

// render the graph on page load
update();

function update() {
  var dot = data_canvas.selectAll(".dot").data(filtered_nations, function(d){return d.name});

  dot.enter().append("circle").attr("class","dot")
                .style("fill", function(d) { return colorScale(d.region); })
                .attr("cx", function(d) { return xScale(d.income[d.income.length-1]); }) // this is how attr knows to work with the data
                .attr("cy", function(d) { return yScale(d.lifeExpectancy[d.lifeExpectancy.length-1]); })
                .attr("r", function(d) { return rScale(d.population[d.population.length-1]); });

  dot.exit().remove();
}

d3.selectAll(".region_cb").on("change", function() {
  var type = this.value;
  if (this.checked) { // adding data points (not quite right yet)
    var new_nations = nations.filter(function(nation){ return nation.region == type;});
    filtered_nations = filtered_nations.concat(new_nations);
  } else { // remove data points from the data that match the filter
    filtered_nations = filtered_nations.filter(function(nation){ return nation.region != type;});
  }
  update();
});

})
