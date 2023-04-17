function fetchData(check = true, value = "European Union") {
    // document.getElementsByTagName('svg')?.item(0)?.remove();
    var parse = d3version4.timeParse('%Y-%m-%d');
    d3version4.csv('data/owid-covid-data.csv', (casesData) => {
        casesData = filterByDate(casesData);
        if (value === "" || check === false) {
            // casesData = casesData.filter(r => r.location === 'European Union'
            //     || r.location === 'Austria'
            //     || r.location === 'Belgium'
            //     || r.location === 'Bulgaria'
            //     || r.location === 'Croatia'
            //     || r.location === 'Cyprus'
            //     || r.location === 'Czech'
            //     || r.location === 'Denmark'
            //     || r.location === 'Estonia'
            //     || r.location === 'Finland'
            //     || r.location === 'France'
            //     || r.location === 'Germany'
            //     || r.location === 'Greece'
            //     || r.location === 'Hungary'
            //     || r.location === 'Ireland'
            //     || r.location === 'Italy'
            //     || r.location === 'Latvia'
            //     || r.location === 'Lithuania'
            //     || r.location === 'Luxembourg'
            //     || r.location === 'Malta'
            //     || r.location === 'Netherlands'
            //     || r.location === 'Poland'
            //     || r.location === 'Portugal'
            //     || r.location === 'Romania'
            //     || r.location === 'Slovakia'
            //     || r.location === 'Slovenia'
            //     || r.location === 'Spain'
            //     || r.location === 'Sweden'
            // )
            return
        } else if (check && value === "European Union") {
            casesData = casesData.filter(r => r.location === 'European Union')
        } else if (check && value === "Austria") {
            casesData = casesData.filter(r => r.location === 'Austria')
        } else if (check && value === "Belgium") {
            casesData = casesData.filter(r => r.location === 'Belgium')
        } else if (check && value === "Bulgaria") {
            casesData = casesData.filter(r => r.location === 'Bulgaria')
        } else if (check && value === "Croatia") {
            casesData = casesData.filter(r => r.location === 'Croatia')
        } else if (check && value === "Cyprus") {
            casesData = casesData.filter(r => r.location === 'Cyprus')
        } else if (check && value === "Czech") {
            casesData = casesData.filter(r => r.location === 'Czech')
        } else if (check && value === "Denmark") {
            casesData = casesData.filter(r => r.location === 'Denmark')
        } else if (check && value === "Estonia") {
            casesData = casesData.filter(r => r.location === 'Estonia')
        } else if (check && value === "Finland") {
            casesData = casesData.filter(r => r.location === 'Finland')
        } else if (check && value === "France") {
            casesData = casesData.filter(r => r.location === 'France')
        } else if (check && value === "Germany") {
            casesData = casesData.filter(r => r.location === 'Germany')
        } else if (check && value === "Greece") {
            casesData = casesData.filter(r => r.location === 'Greece')
        } else if (check && value === "Hungary") {
            casesData = casesData.filter(r => r.location === 'Hungary')
        } else if (check && value === "Ireland") {
            casesData = casesData.filter(r => r.location === 'Ireland')
        } else if (check && value === "Italy") {
            casesData = casesData.filter(r => r.location === 'Italy')
        } else if (check && value === "Latvia") {
            casesData = casesData.filter(r => r.location === 'Latvia')
        } else if (check && value === "Lithuania") {
            casesData = casesData.filter(r => r.location === 'Lithuania')
        } else if (check && value === "Luxembourg") {
            casesData = casesData.filter(r => r.location === 'Luxembourg')
        } else if (check && value === "Malta") {
            casesData = casesData.filter(r => r.location === 'Malta')
        } else if (check && value === "Netherlands") {
            casesData = casesData.filter(r => r.location === 'Netherlands')
        } else if (check && value === "Poland") {
            casesData = casesData.filter(r => r.location === 'Poland')
        } else if (check && value === "Portugal") {
            casesData = casesData.filter(r => r.location === 'Portugal')
        } else if (check && value === "Romania") {
            casesData = casesData.filter(r => r.location === 'Romania')
        } else if (check && value === "Slovakia") {
            casesData = casesData.filter(r => r.location === 'Slovakia')
        } else if (check && value === "Slovenia") {
            casesData = casesData.filter(r => r.location === 'Slovenia')
        } else if (check && value === "Spain") {
            casesData = casesData.filter(r => r.location === 'Spain')
        } else if (check && value === "Sweden") {
            casesData = casesData.filter(r => r.location === 'Sweden')
        }

        casesData.forEach(function (d) {
            d.date = parse(d.date);
            if (d.date !== undefined && d.date !== "" && !isNaN(d.date) && d.total_cases !== undefined)
                d.value = +d.total_cases;

        });
        d3version4.csv('data/vaccinations.csv', (vaccinationData) => {
            vaccinationData = filterByDate(vaccinationData);
            if (value === "" || check === false) {
                // vaccinationData = vaccinationData.filter(r => r.location === 'European Union'
                //     || r.location === 'Austria'
                //     || r.location === 'Belgium'
                //     || r.location === 'Bulgaria'
                //     || r.location === 'Croatia'
                //     || r.location === 'Cyprus'
                //     || r.location === 'Czech'
                //     || r.location === 'Denmark'
                //     || r.location === 'Estonia'
                //     || r.location === 'Finland'
                //     || r.location === 'France'
                //     || r.location === 'Germany'
                //     || r.location === 'Greece'
                //     || r.location === 'Hungary'
                //     || r.location === 'Ireland'
                //     || r.location === 'Italy'
                //     || r.location === 'Latvia'
                //     || r.location === 'Lithuania'
                //     || r.location === 'Luxembourg'
                //     || r.location === 'Malta'
                //     || r.location === 'Netherlands'
                //     || r.location === 'Poland'
                //     || r.location === 'Portugal'
                //     || r.location === 'Romania'
                //     || r.location === 'Slovakia'
                //     || r.location === 'Slovenia'
                //     || r.location === 'Spain'
                //     || r.location === 'Sweden'
                // )
                return;
            } else if (check && value === "European Union") {
                vaccinationData = vaccinationData.filter(r => r.location === 'European Union')
            } else if (check && value === "Austria") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Austria')
            } else if (check && value === "Belgium") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Belgium')
            } else if (check && value === "Bulgaria") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Bulgaria')
            } else if (check && value === "Croatia") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Croatia')
            } else if (check && value === "Cyprus") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Cyprus')
            } else if (check && value === "Czech") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Czech')
            } else if (check && value === "Denmark") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Denmark')
            } else if (check && value === "Estonia") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Estonia')
            } else if (check && value === "Finland") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Finland')
            } else if (check && value === "France") {
                vaccinationData = vaccinationData.filter(r => r.location === 'France')
            } else if (check && value === "Germany") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Germany')
            } else if (check && value === "Greece") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Greece')
            } else if (check && value === "Hungary") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Hungary')
            } else if (check && value === "Ireland") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Ireland')
            } else if (check && value === "Italy") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Italy')
            } else if (check && value === "Latvia") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Latvia')
            } else if (check && value === "Lithuania") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Lithuania')
            } else if (check && value === "Luxembourg") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Luxembourg')
            } else if (check && value === "Malta") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Malta')
            } else if (check && value === "Netherlands") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Netherlands')
            } else if (check && value === "Poland") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Poland')
            } else if (check && value === "Portugal") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Portugal')
            } else if (check && value === "Romania") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Romania')
            } else if (check && value === "Slovakia") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Slovakia')
            } else if (check && value === "Slovenia") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Slovenia')
            } else if (check && value === "Spain") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Spain')
            } else if (check && value === "Sweden") {
                vaccinationData = vaccinationData.filter(r => r.location === 'Sweden')
            }

            vaccinationData.forEach(function (d) {
                d.date = parse(d.date);
                if (d.date !== undefined && d.date !== "" && !isNaN(d.date) && d.total_vaccinations !== undefined)
                    d.value = +d.total_vaccinations;
            });

            init();
            render(casesData, vaccinationData)
        })

    })


}

function filterByDate(data) {
    var startDate = new Date("2020-01-01");
    var endDate = new Date("2022-12-31");

    return data.filter(a => {
        var date = new Date(a.date);
        return (date >= startDate && date <= endDate);
    });
}

var chartContainer;
var svg1;
var marginContainer;
var x2;
var y2;
var xAxis2;
var yAxis2;
var width2;
var height2;
var line2;
// var area;
var startData;

var margin = {top: 20, right: 30, bottom: 30, left: 40};
var maxWidth = 900 - margin.left - margin.right;

var detailWidth = 150;
var detailHeight = 75;
var detailMargin = 15;

function init() {
    chartContainer = null;
    svg1 = null;
    marginContainer = null;
    chartContainer = d3version4.select('#chart-container');
    svg1 = chartContainer.append('svg');
    marginContainer = svg1.append('g');
}

function render(first, second) {
    var fdata = eval(first);
    var sdata = eval(second);

    var parse = d3version4.timeParse('%Y-%m-%d');

    fdata = fdata.map(function (datum) {
        if (typeof datum.date == 'string') {
            datum.date = parse(datum.date);
        }

        return datum;
    });
    sdata = sdata.map(function (datum) {
        if (typeof datum.date == 'string') {
            datum.date = parse(datum.date);
        }

        return datum;
    });

    getDimensions();

    svg1.attr("width", width2 + margin.left + margin.right)
        .attr("height", height2 + margin.top + margin.bottom);

    marginContainer
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x2 = d3version4.scaleTime().range([0, width2]);
    y2 = d3version4.scaleLinear().range([height2, 0]);
    x2.domain(d3version4.extent(fdata, function (d) {
        return d.date;
    }));
    x2.domain(d3version4.extent(sdata, function (d) {
        return d.date;
    }));
    y2.domain([0, d3version4.max(fdata, function (d) {
        return d.value;
    })]);
    y2.domain([0, d3version4.max(sdata, function (d) {
        return d.value;
    })]);

    line2 = d3version4.line()
        .defined(d => d.value !== undefined && d.date !== undefined)
        .x(function (d) {
            return x2(d.date);
        })
        .y(function (d) {
            return y2(d.value);
        })

    startData = fdata.map(function (datum) {
        return {
            date: datum.date,
            value: datum.value
        };
    });

    xAxis2 = d3version4.axisBottom(x2)

    yAxis2 = d3version4.axisLeft(y2)

    marginContainer.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height2 + ')')
        .call(xAxis2
            .tickSizeOuter(0));

    marginContainer.append('g')
        .attr('class', 'y axis')
        .call(yAxis2)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', '1.5em')
        .style('text-anchor', 'end')
        .text('Number')


    marginContainer.append('path')
        .datum(fdata)
        .attr('class', 'red-stroke')
        .attr('d', line2)
        .call(transition)
        // .transition()
        // .duration(7500)
        // .attrTween("stroke-dasharray", tweenDash)
        // .on("end", () => { d3.select(this).call(transition); });

    marginContainer.append('text')
        .datum(fdata[fdata.length - 1])
        .attr('x', x2(fdata[fdata.length - 1].date)) // position the text next to the end of the line
        .attr('y', y2(fdata[fdata.length - 1].value))
        .text('Cases'); // set the text content

    marginContainer.append('path')
        .datum(sdata)
        .attr('class', 'blue-stroke')
        .attr('d', line2)
        .call(transition)
        // .transition()
        // .duration(7500)
        // .attrTween("stroke-dasharray", tweenDash)
        // .on("end", () => { d3.select(this).call(transition); });

    marginContainer.append('text')
        .datum(sdata[sdata.length - 1])
        .attr('x', x2(sdata[sdata.length - 1].date)  - 25) // position the text next to the end of the line
        .attr('y', y2(sdata[sdata.length - 1].value))
        .text('Vaccination'); // set the text content

    function transition(path) {
        path.transition()
            .duration(7500)
            .attrTween("stroke-dasharray", tweenDash)
            .on("end", () => { d3version4.select('red-stroke').call(transition);
                d3version4.select('blue-stroke').call(transition);});
    }
    function tweenDash() {
        const l = this.getTotalLength(),
            i = d3version4.interpolateString("0," + l, l + "," + l);
        return function(t) { return i(t) };
    }


}


function getDimensions() {
    var containerWidth = parseInt(d3version4.select('#chart-container').style('width'));
    margin.top = 20;
    margin.right = 30;
    margin.left = 40;
    margin.bottom = 30;

    width2 = containerWidth - margin.left - margin.right;
    if (width2 > maxWidth) {
        width2 = maxWidth;
    }
    height2 = .75 * width2;
}

fetchData(true, "European Union");

