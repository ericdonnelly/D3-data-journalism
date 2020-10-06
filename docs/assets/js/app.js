var svgWidth = 960;
var svgHeight = 620;

var margin = {
  top: 20,
  right: 40,
  bottom: 200,
  left: 100
};

var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

var chart = d3
  .select('#scatter')
  .append('div')
  .classed('chart', true);

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = chart
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
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
      d3.max(censusData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderxAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(2000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderyAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(2000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(2000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

//function for updating states
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  textGroup.transition()
    .duration(2000)
    .attr('x', d => newXScale(d[chosenXAxis]))
    .attr('y', d => newYScale(d[chosenYAxis]));

  return textGroup
}
// function to retrieve data on tooltip values 
function style(value, chosenXAxis) {

  //style based on variable
  //poverty
  if (chosenXAxis === 'poverty') {
      return `${value}%`;
  }
  //household income
  else if (chosenXAxis === 'income') {
      return `${value}`;
  }
  else {
    return `${value}`;
  }
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
      var yLabel = "Obesity:";
  }
  //smoking percentage
  else {
      var yLabel = "Smokers:";
  }

  //create tooltip
  var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-8, 0])
      .html(function(d) {
          return (`${d.state}<br>${xLabel} ${style(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}%`);
      });

  circlesGroup.call(toolTip);

  //add events
  circlesGroup.on("mouseover", toolTip.show)
  .on("mouseout", toolTip.hide);

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function(censusData, err) {
  if (err) throw err;

  // parse data
  censusData.forEach(function(data) {
    data.obesity = +data.obesity;
    data.income = +data.income;
    data.smokes = +data.smokes;
    data.age = +data.age;
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);
  var yLinearScale = yScale(censusData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  //append y axis
  var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    // .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("fill", "#87D2B8")
    .attr("opacity", ".75");

    //append text
    var textGroup = chartGroup.selectAll('.stateText')
      .data(censusData)
      .enter()
      .append('text')
      .classed('stateText', true)
      .attr('x', d => xLinearScale(d[chosenXAxis]))
      .attr('y', d => yLinearScale(d[chosenYAxis]))
      .attr('dy', 3)
      .attr('font-size', '10px')
      .text(function(d){return d.abbr});

  // Create group for three x-axis labels
  var xlabelsGroup = chartGroup.append("g")
  .attr('transform', `translate(${width / 2}, ${height + 20 + margin.top})`);

  var povertyLabel = xlabelsGroup.append("text")
    .classed("aText", true)
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xlabelsGroup.append("text")
    .classed("aText", true)
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Median Age");

    var incomeLabel = xlabelsGroup.append("text")
    .classed("aText", true)
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Median Household Income");


  // Create group for three y-axis labels
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${0 - margin.left/4}, ${(height/2)})`);

  var healthcareLabel = ylabelsGroup.append("text")
    .classed("aText", true)
    .classed("active", true)
    .attr("x", 0)
    .attr("y", 0 - 20)
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .attr("value", "healthcare")
    .text("Lacks Healthcare (%)");

  var smokeLabel = ylabelsGroup.append("text")
    .classed("aText", true)
    .classed("inactive", true)
    .attr("x", 0)
    .attr("y", 0 - 40)
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .attr("value", "smokes")
    .text("Smokes (%)");

  var obesityLabel = ylabelsGroup.append("text")
    .classed("aText", true)
    .classed("inactive", true)
    .attr("x", 0)
    .attr("y", 0 - 60)
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .attr("value", "obesity")
    .text("Obese (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    //x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", function() {
            //get value of selection
            var value = d3.select(this).attr("value");

            //check if value is same as current axis
            if (value != chosenXAxis) {

                //replace chosenXAxis with value
                chosenXAxis = value;

                //update x scale for new data
                xLinearScale = xScale(censusData, chosenXAxis);

                //update x axis with transition
                xAxis = renderxAxes(xLinearScale, xAxis);

                //update circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                //update tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                //update text 
                textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                //change classes
                if (chosenXAxis === "poverty") {
                    povertyLabel.classed("active", true).classed("inactive", false);
                    ageLabel.classed("active", false).classed("inactive", true);
                    incomeLabel.classed("active", false).classed("inactive", true);
                }
                else if (chosenXAxis === "age") {
                    povertyLabel.classed("active", false).classed("inactive", true);
                    ageLabel.classed("active", true).classed("inactive", false);
                    incomeLabel.classed("active", false).classed("inactive", true);
                }
                else {
                    povertyLabel.classed("active", false).classed("inactive", true);
                    ageLabel.classed("active", false).classed("inactive", true);
                    incomeLabel.classed("active", true).classed("inactive", false);
                }
            }
        });

    //y axis labels event listener
    ylabelsGroup.selectAll("text")
    .on("click", function() {
        //get value of selection
        var value = d3.select(this).attr("value");

        //check if value is same as current axis
        if (value != chosenYAxis) {

            //replace chosenYAxis with value
            chosenYAxis = value;

            //update y scale for new data
            yLinearScale = yScale(censusData, chosenYAxis);

            //update x axis with transition
            yAxis = renderyAxes(yLinearScale, yAxis);

            //update circles with new y values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //update tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            //update text 
            textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //change classes
            if (chosenYAxis === "obesity") {
                obesityLabel.classed("active", true).classed("inactive", false);
                smokeLabel.classed("active", false).classed("inactive", true);
                healthcareLabel.classed("active", false).classed("inactive", true);
            }
            else if (chosenYAxis === "smokes") {
                obesityLabel.classed("active", false).classed("inactive", true);
                smokeLabel.classed("active", true).classed("inactive", false);
                healthcareLabel.classed("active", false).classed("inactive", true);
            }
            else {
                obesityLabel.classed("active", false).classed("inactive", true);
                smokeLabel.classed("active", false).classed("inactive", true);
                healthcareLabel.classed("active", true).classed("inactive", false);
            }
        }
    });
}).catch(function(error) {
  console.log(error);
});