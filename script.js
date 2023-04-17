// Set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 10, left: 30},
    width = 1400 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Add the legend labels
const legendOffset = 30;
const legendYOffset = -10;
const legendTextOffset = 20;

// Set up the SVG canvas and dimensions
const svg = d3version4.select("#chart")
    .append("svg")
    .attr("width", 1500)
    .attr("height", 700)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the time parser and format
const parseTime = d3version4.timeParse("%Y-%m");

// Set up the scales and axes
const x = d3version4.scaleTime().range([0, width]);
const y = d3version4.scaleLinear().range([height, 0]);
const xAxis = d3version4.axisBottom(x).ticks(d3version4.timeMonth.every(1)).tickFormat(d3version4.timeFormat("%b %Y"));
const yAxis = d3version4.axisLeft(y);

// Set up the line function
const line = d3version4.line()
    .x(function (d) {
        return x(d.date);
    })
    .y(function (d) {
        return y(d.value);
    });

// Load the data from the CSV file
d3version4.csv("data/unemployment_rate.csv", function (data) {

    // Convert the strings to numbers
    data.forEach(function (d) {
        d.date = parseTime(d.TIME_PERIOD);
        d.value = +d.OBS_VALUE;
    });

    // Get the list of unique geos
    const geos = Array.from(new Set(data.map(d => d.geo)));

    // Set up the color scale
    const color = d3version4.scaleOrdinal()
        .domain(geos)
        .range(d3version4.schemeCategory20);

    // Loop through each geo and plot a line
    geos.forEach(function (geo) {

        // Filter the data for the current geo
        const filteredData = data.filter(function (d) {
            return d.geo === geo;
        });

        // Set the domains of the scales
        x.domain(d3version4.extent(data, function (d) {
            return d.date;
        }));
        y.domain([0, d3version4.max(data, function (d) {
            return d.value;
        })]);

        // Add the X axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", "1em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");

        // Add the Y axis
        svg.append("g")
            .call(yAxis)
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .text("Unemployment rate (%)");

        // Add the line
        svg.append("path")
            .attr("id", geo)
            .datum(filteredData)
            .attr("fill", "none")
            .attr("stroke", color(geo))
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2)
            .attr("d", line);

// Set the initial visibility of the line
        if (geo === "EU27_2020") {
            d3version4.select("#EU27_2020").style("display", "initial");
        } else {
            d3version4.select("#" + geo).style("display", "none");
        }

        const labelMargin = 8;
        const labelWidth = 40;
        const labelX = (width - labelWidth * geos.length - labelMargin * (geos.length - 1)) / 2;


        // Add the legend label
        svg.selectAll("mylabels")
            .data(geos)
            .enter()
            .append("text")
            .attr("x", function (d, i) {
                return labelX + i * (labelWidth + labelMargin) + labelWidth / 2;
            })
            .attr("y", height + 70)
            .attr("dy", "0.85em")
            .attr("font-size", "13px")
            .attr("fill", color)
            .text(function (d) {
                return d;
            })
            .attr("text-anchor", "middle")

            .on("click", function (d) {
                // Get the corresponding line element
                const line = d3version4.select("#" + d);
                // Toggle the display property of the line
                const display = line.style("display") === "none" ? "initial" : "none";
                line.style("display", display);

            })
            .style("alignment-baseline", "middle")
            .style("cursor", "pointer")
    });
});

