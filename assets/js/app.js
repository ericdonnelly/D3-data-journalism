var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating x-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
      d3.max(censusData, d => d[chosenYAxis]) * 1.2
    ])
    .range([0, width]);

  return yLinearScale;

}

// function used for updating x-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
      d3.max(censusData, d => d[chosenYAxis]) * 1.2
    ])
    .range([0, width]);

  return yLinearScale;

}

// function used for updating y-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderxAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderyAxes(newYScale, yAxis) {
  var bottomAxis = d3.axisBottom(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newXScale(d[chosenYAxis]));

  return circlesGroup;
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  //select x label
  //poverty percentage
  if (chosenXAxis === 'poverty') {
      var xLabel = "Poverty:";
  }
  //household income in dollars
  else if (chosenXAxis === 'income') {
      var xLabel = "Median Income:";
  }
  //age (number)
  else {
      var xLabel = "Age:";
  }

  //select y label
  //percentage lacking healthcare
  if (chosenYAxis === 'healthcare') {
      var yLabel = "No Healthcare:"
  }
  //percentage obese
  else if (chosenYAxis === 'obesity') {
      var yLabel = "Obesity:"
  }
  //smoking percentage
  else {
      var yLabel = "Smokers:"
  }

  //create tooltip
  var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-8, 0])
      .html(function(d) {
          return (`${d.state}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}%`);
      });

  circlesGroup.call(toolTip);

  //add events
  circlesGroup.on("mouseover", toolTip.show)
  .on("mouseout", toolTip.hide);

  return circlesGroup;
}


// Retrieve data from the CSV file and execute everything below
// d3.csv("./assets/data/data.csv").then(function(censusData, err) {
//   if (err) throw err;

//   // parse data
//   censusData.forEach(function(data) {
//     data.obesity = +data.obesity;
//     data.income = +data.income;
//     data.smokes = +data.smokes;
//     data.age = +data.age;
//     data.healthcare = +data.healthcare;
//     data.poverty = +data.poverty;
//   });

//   // xLinearScale function above csv import
//   var xLinearScale = xScale(censusData, chosenXAxis);
//   var yLinearScale = yScale(censusData, chosenYAxis);