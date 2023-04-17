import * as Chart from "./lib/charts.js";

// load the data here
const map = (await d3version7.json("data/geojson/europe.geojson"));
const ppp = await d3version7.csv("data/ppp.csv");
const labour = await d3version7.csv("data/labour_productivity.csv");
const inflation = await d3version7.csv("data/inflation.csv");
const poverty = await d3version7.csv("data/poverty_risk.csv");


// data preparation logics goes here
let mapData = [];
let temp;
d3version7.group(ppp.filter(d => {return d.TIME_PERIOD === '2021-S1' || d.TIME_PERIOD === '2022-S1'}),
    l => l.geo)
    .forEach((item, key) => {
        temp = Math.abs(item[1].OBS_VALUE - item[0].OBS_VALUE) > 1 ? 0.1 : Math.abs(item[1].OBS_VALUE - item[0].OBS_VALUE);
        mapData.push({country: key, pppDrop: temp});
});

let labourData = [];
labour.filter(d => {return d.geo === 'EU27_2020'}).forEach(v => {
    labourData.push({
        key: v.TIME_PERIOD,
        value: parseInt(v.OBS_VALUE)
    });
});

let inflationData = [];
let rawData = inflation.filter(d => {return d.geo === 'EU27_2020'})
    .sort((a,b) => (a.TIME_PERIOD > b.TIME_PERIOD) ? 1 : ((b.TIME_PERIOD > a.TIME_PERIOD) ? -1 : 0));
let quarter;
for (let i = 0; i < rawData.length; i += 3) {
    if      (i % 12 === 0) quarter = "1";
    else if (i % 12 === 3) quarter = "2";
    else if (i % 12 === 6) quarter = "3";
    else if (i % 12 === 9) quarter = "4";

    inflationData.push({
        key: rawData[i].TIME_PERIOD.split('-')[0] + "-" + quarter,
        value: parseInt(rawData[i].OBS_VALUE) +
            parseInt(rawData[i+1].OBS_VALUE) +
            parseInt(rawData[i+2].OBS_VALUE)
    });
}

let mean2019 = ppp.filter(d => {return d.TIME_PERIOD === "2019-S1"});
let mean2020 = ppp.filter(d => {return d.TIME_PERIOD === "2020-S1"});
let mean2021 = ppp.filter(d => {return d.TIME_PERIOD === "2021-S1"});
let mean2022 = ppp.filter(d => {return d.TIME_PERIOD === "2022-S1"});
let pppData = [
    {
        key: "2019-S1",
        value: mean2019.reduce((r, c) => r + parseFloat(c.OBS_VALUE), 0) / mean2019.length
    },
    {
        key: "2020-S1",
        value: mean2020.reduce((r, c) => r + parseFloat(c.OBS_VALUE), 0) / mean2020.length
    },
    {
        key: "2021-S1",
        value: mean2021.reduce((r, c) => r + parseFloat(c.OBS_VALUE), 0) / mean2021.length
    },
    {
        key: "2022-S1",
        value: mean2022.reduce((r, c) => r + parseFloat(c.OBS_VALUE), 0) / mean2022.length
    },
];
pppData = [];
ppp.filter(d => {return d.geo === "IT"}).forEach(d => {
    pppData.push({
        key: d.TIME_PERIOD,
        value: d.OBS_VALUE
    })
});

let povertyData = poverty.filter(d => {return d.geo === 'EU27_2020'});




// create charts here
const inflationBarChart = await Chart.BarChart(labourData, {
    x: d => d.key,
    y: d => d.value,
    yLabel: "labour productivity value",
    width: 1080,
    height: 500,
    color: "steelblue"
});
document.getElementById("labourProductivity").appendChild(inflationBarChart);

const labourBarChart = await Chart.BarChart(inflationData, {
    x: d => d.key,
    y: d => d.value,
    yLabel: "inflation rate value",
    width: 1080,
    height: 500,
    color: "red"
});
document.getElementById("labourProductivity").appendChild(labourBarChart);

const pppBarChart = await Chart.BarChart(pppData, {
    x: d => d.key,
    y: d => d.value,
    yLabel: "purchanig power parity",
    width: 1080,
    height: 500,
    color: "steelblue"
});
document.getElementById("ppp").appendChild(pppBarChart);

const povertyBarChart = await Chart.BarChart(povertyData, {
    x: d => d.TIME_PERIOD,
    y: d => d.OBS_VALUE,
    yLabel: "poverty risk",
    width: 1080,
    height: 500,
    color: "red"
});
document.getElementById("poverty").appendChild(povertyBarChart);

const choroplethChartSVG = await Chart.Choropleth(mapData, {
    id: d => d.country,
    value: d => d.pppDrop,
    scale: d3version7.scaleQuantize,
    domain: [Math.min(...mapData.map(o => o.pppDrop)), Math.max(...mapData.map(o => o.pppDrop))],
    // range: d => d.pppDrop >= 0 ? d3.schemeGreens[5] : d3.schemeReds[5],
    range: d3version7.schemeReds[5],
    title: (f, d) => `country: ${d?.country}, \n ppp drop: ${d?.pppDrop}`,
    features: map,
    featureId: d => d.ISO2,
    // borders: statemesh,
    width: 975,
    height: 610
})

document.getElementById("map").appendChild(choroplethChartSVG);

const legend = await Chart.Legend(d3version7.scaleSequential([0, 0.1], d3version7.interpolateReds), {
    title: "ppp drop rate amount"
});
document.getElementById("mapLegend").appendChild(legend);
//
// const legendSVG = d3.create("svg")
//     .scaleThreshold()
//     .domain()
//     .range();
//
// document.getElementById("map").appendChild(legendSVG);
