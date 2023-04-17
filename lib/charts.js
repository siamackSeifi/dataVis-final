// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/stacked-horizontal-bar-chart
// import * as d3 from "https://cdn.skypack.dev/d3@7";

export async function BarChart(data, {
    x = (d, i) => i, // given d in data, returns the (ordinal) x-value
    y = d => d, // given d in data, returns the (quantitative) y-value
    marginTop = 20, // the top margin, in pixels
    marginRight = 0, // the right margin, in pixels
    marginBottom = 30, // the bottom margin, in pixels
    marginLeft = 40, // the left margin, in pixels
    width, // the outer width of the chart, in pixels
    height = 400, // the outer height of the chart, in pixels
    xDomain, // an array of (ordinal) x-values
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3version7.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    xPadding = 0.1, // amount of x-range to reserve to separate bars
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    color = "currentColor", // bar fill color
    duration: initialDuration = 250, // transition duration, in milliseconds
    delay: initialDelay = (_, i) => i * 20 // per-element transition delay, in milliseconds
} = {}) {
    // separate values.
    const X = d3version7.map(data, x);
    const Y = d3version7.map(data, y);

    // Compute default domains, and unique the x-domain.
    if (xDomain === undefined) xDomain = X;
    if (yDomain === undefined) yDomain = [0, d3version7.max(Y)];
    xDomain = new d3version7.InternSet(xDomain);

    // Omit any data not present in the x-domain.
    const I = d3version7.range(X.length).filter(i => xDomain.has(X[i]));

    // Construct scales, axes, and formats.
    const xScale = d3version7.scaleBand(xDomain, xRange).padding(xPadding);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3version7.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3version7.axisLeft(yScale).ticks(height / 40, yFormat);
    const format = yScale.tickFormat(100, yFormat);

    const svg = d3version7.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 48%; margin-right: 1rem; height: auto; height: intrinsic;");

    const yGroup = svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick").call(grid))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));

    let rect = svg.append("g")
        .attr("fill", color)
        .selectAll("rect")
        .data(I)
        .join("rect")
        .property("key", i => X[i]) // for future transitions
        .call(position, i => xScale(X[i]), i => yScale(Y[i]))
        .style("mix-blend-mode", "multiply")
        .call(rect => rect.append("title")
            .text(i => [X[i], format(Y[i])].join("\n")));

    const xGroup = svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);

    // A helper method for updating the position of bars.
    function position(rect, x, y) {
        return rect
            .attr("x", x)
            .attr("y", y)
            .attr("height", typeof y === "function" ? i => yScale(0) - y(i) : i => yScale(0) - y)
            .attr("width", xScale.bandwidth());
    }

    // A helper method for generating grid lines on the y-axis.
    function grid(tick) {
        return tick.append("line")
            .attr("class", "grid")
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke", "currentColor")
            .attr("stroke-opacity", 0.1);
    }

    // Call chart.update(data, options) to transition to new data.
    return Object.assign(svg.node(), {
        update(data, {
            xDomain, // an array of (ordinal) x-values
            yDomain, // [ymin, ymax]
            duration = initialDuration, // transition duration, in milliseconds
            delay = initialDelay // per-element transition delay, in milliseconds
        } = {}) {
            // Compute values.
            const X = d3version7.map(data, x);
            const Y = d3version7.map(data, y);

            // Compute default domains, and unique the x-domain.
            if (xDomain === undefined) xDomain = X;
            if (yDomain === undefined) yDomain = [0, d3version7.max(Y)];
            xDomain = new d3version7.InternSet(xDomain);

            // Omit any data not present in the x-domain.
            const I = d3version7.range(X.length).filter(i => xDomain.has(X[i]));

            // Update scale domains.
            xScale.domain(xDomain);
            yScale.domain(yDomain);

            // Start a transition.
            const t = svg.transition().duration(duration);

            // Join the data, applying enter and exit.
            rect = rect
                .data(I, function (i) {
                    return this.tagName === "rect" ? this.key : X[i];
                })
                .join(
                    enter => enter.append("rect")
                        .property("key", i => X[i]) // for future transitions
                        .call(position, i => xScale(X[i]), yScale(0))
                        .style("mix-blend-mode", "multiply")
                        .call(enter => enter.append("title")),
                    update => update,
                    exit => exit.transition(t)
                        .delay(delay)
                        .attr("y", yScale(0))
                        .attr("height", 0)
                        .remove()
                );

            // Update the title text on all entering and updating bars.
            rect.select("title")
                .text(i => [X[i], format(Y[i])].join("\n"));

            // Transition entering and updating bars to their new position. Note
            // that this assumes that the input data and the x-domain are in the
            // same order, or else the ticks and bars may have different delays.
            rect.transition(t)
                .delay(delay)
                .call(position, i => xScale(X[i]), i => yScale(Y[i]));

            // Transition the x-axis (using a possibly staggered delay per tick).
            xGroup.transition(t)
                .call(xAxis)
                .call(g => g.selectAll(".tick").delay(delay));

            // Transition the y-axis, then post process for grid lines etc.
            yGroup.transition(t)
                .call(yAxis)
                .selection()
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick").selectAll(".grid").data([,]).join(grid));
        }
    });
}


export async function StackedBarChart(data, {
    x = d => d, // given d in data, returns the (quantitative) x-value
    y = (d, i) => i, // given d in data, returns the (ordinal) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    title, // given d in data, returns the title text
    marginTop = 30, // top margin, in pixels
    marginRight = 0, // right margin, in pixels
    marginBottom = 0, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 640, // outer width, in pixels
    height, // outer height, in pixels
    xType = d3version7.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yDomain, // array of y-values
    yRange, // [bottom, top]
    yPadding = 0.1, // amount of y-range to reserve to separate bars
    zDomain, // array of z-values
    offset = d3version7.stackOffsetDiverging, // stack offset method
    order = d3version7.stackOrderNone, // stack order method
    xFormat, // a format specifier string for the x-axis
    xLabel, // a label for the x-axis
    colors = d3version7.schemeTableau10, // array of colors
} = {}) {
    // Compute values.
    const X = d3version7.map(data, x);
    const Y = d3version7.map(data, y);
    const Z = d3version7.map(data, z);

    // Compute default y- and z-domains, and unique them.
    if (yDomain === undefined) yDomain = Y;
    if (zDomain === undefined) zDomain = Z;
    yDomain = new d3version7.InternSet(yDomain);
    zDomain = new d3version7.InternSet(zDomain);

    // Omit any data not present in the y- and z-domains.
    const I = d3version7.range(X.length).filter(i => yDomain.has(Y[i]) && zDomain.has(Z[i]));

    // If the height is not specified, derive it from the y-domain.
    if (height === undefined) height = yDomain.size * 25 + marginTop + marginBottom;
    if (yRange === undefined) yRange = [height - marginBottom, marginTop];

    // Compute a nested array of series where each series is [[x1, x2], [x1, x2],
    // [x1, x2], …] representing the x-extent of each stacked rect. In addition,
    // each tuple has an i (index) property so that we can refer back to the
    // original data point (data[i]). This code assumes that there is only one
    // data point for a given unique y- and z-value.
    const series = d3version7.stack()
        .keys(zDomain)
        .value(([, I], z) => X[I.get(z)])
        .order(order)
        .offset(offset)
        (d3version7.rollup(I, ([i]) => i, i => Y[i], i => Z[i]))
        .map(s => s.map(d => Object.assign(d, {i: d.data[1].get(s.key)})));

    // Compute the default x-domain. Note: diverging stacks can be negative.
    if (xDomain === undefined) xDomain = d3version7.extent(series.flat(2));

    // Construct scales, axes, and formats.
    const xScale = xType(xDomain, xRange);
    const yScale = d3version7.scaleBand(yDomain, yRange).paddingInner(yPadding);
    const color = d3version7.scaleOrdinal(zDomain, colors);
    const xAxis = d3version7.axisTop(xScale).ticks(width / 80, xFormat);
    const yAxis = d3version7.axisLeft(yScale).tickSizeOuter(0);

    // Compute titles.
    if (title === undefined) {
        const formatValue = xScale.tickFormat(100, xFormat);
        title = i => `${Y[i]}\n${Z[i]}\n${formatValue(X[i])}`;
    } else {
        const O = d3version7.map(data, d => d);
        const T = title;
        title = i => T(O[i], i, data);
    }

    const svg = d3version7.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("transform", `translate(0,${marginTop})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", height - marginTop - marginBottom)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", width - marginRight)
            .attr("y", -22)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(xLabel));

    const bar = svg.append("g")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", function (d, i) {
            return colors[i];
        })
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", ([x1, x2]) => Math.min(xScale(x1), xScale(x2)))
        .attr("y", ({i}) => yScale(Y[i]))
        .attr("width", ([x1, x2]) => Math.abs(xScale(x1) - xScale(x2)))
        .attr("height", yScale.bandwidth());

    if (title) bar.append("title")
        .text(({i}) => title(i));

    svg.append("g")
        .attr("transform", `translate(${xScale(0)},0)`)
        .call(yAxis);

    return Object.assign(svg.node(), {scales: {color}});
}

export async function BoxPlot(data, {
    x = ([x]) => x, // given d in data, returns the (quantitative) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    inset = 0.5, // left and right inset
    insetLeft = inset, // inset for left edge of box, in pixels
    insetRight = inset, // inset for right edge of box, in pixels
    xType = d3version7.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3version7.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    thresholds = width / 40, // approximative number of thresholds
    stroke = "currentColor", // stroke color of whiskers, median, outliers
    fill = "#ddd", // fill color of boxes
    jitter = 4, // amount of random jitter for outlier dots, in pixels
    xFormat, // a format specifier string for the x-axis
    yFormat, // a format specifier string for the y-axis
    xLabel, // a label for the x-axis
    yLabel // a label for the y-axis
} = {}) {
    // Compute values.
    const X = d3version7.map(data, x);
    const Y = d3version7.map(data, y);

    // Filter undefined values.
    const I = d3version7.range(X.length).filter(i => !isNaN(X[i]) && !isNaN(Y[i]));

    // Compute the bins.
    const B = d3version7.bin()
        .thresholds(thresholds)
        .value(i => X[i])
        (I)
        .map(bin => {
            const y = i => Y[i];
            const min = d3version7.min(bin, y);
            const max = d3version7.max(bin, y);
            const q1 = d3version7.quantile(bin, 0.25, y);
            const q2 = d3version7.quantile(bin, 0.50, y);
            const q3 = d3version7.quantile(bin, 0.75, y);
            const iqr = q3 - q1; // interquartile range
            const r0 = Math.max(min, q1 - iqr * 1.5);
            const r1 = Math.min(max, q3 + iqr * 1.5);
            bin.quartiles = [q1, q2, q3];
            bin.range = [r0, r1];
            bin.outliers = bin.filter(i => Y[i] < r0 || Y[i] > r1);
            return bin;
        });

    // Compute default domains.
    if (xDomain === undefined) xDomain = [d3version7.min(B, d => d.x0), d3version7.max(B, d => d.x1)];
    if (yDomain === undefined) yDomain = [d3version7.min(B, d => d.range[0]), d3version7.max(B, d => d.range[1])];

    // Construct scales and axes.
    const xScale = xType(xDomain, xRange).interpolate(d3version7.interpolateRound);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3version7.axisBottom(xScale).ticks(thresholds, xFormat).tickSizeOuter(0);
    const yAxis = d3version7.axisLeft(yScale).ticks(height / 40, yFormat);

    const svg = d3version7.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));

    const g = svg.append("g")
        .selectAll("g")
        .data(B)
        .join("g");

    g.append("path")
        .attr("stroke", stroke)
        .attr("d", d => `
        M${xScale((d.x0 + d.x1) / 2)},${yScale(d.range[1])}
        V${yScale(d.range[0])}
      `);

    g.append("path")
        .attr("fill", fill)
        .attr("d", d => `
        M${xScale(d.x0) + insetLeft},${yScale(d.quartiles[2])}
        H${xScale(d.x1) - insetRight}
        V${yScale(d.quartiles[0])}
        H${xScale(d.x0) + insetLeft}
        Z
      `);

    g.append("path")
        .attr("stroke", stroke)
        .attr("stroke-width", 2)
        .attr("d", d => `
        M${xScale(d.x0) + insetLeft},${yScale(d.quartiles[1])}
        H${xScale(d.x1) - insetRight}
      `);

    g.append("g")
        .attr("fill", stroke)
        .attr("fill-opacity", 0.2)
        .attr("stroke", "none")
        .attr("transform", d => `translate(${xScale((d.x0 + d.x1) / 2)},0)`)
        .selectAll("circle")
        .data(d => d.outliers)
        .join("circle")
        .attr("r", 2)
        .attr("cx", () => (Math.random() - 0.5) * jitter)
        .attr("cy", i => yScale(Y[i]));

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call(g => g.append("text")
            .attr("x", width)
            .attr("y", marginBottom - 4)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(xLabel));

    return svg.node();
}

export async function Legend(color, {
    title,
    tickSize = 6,
    width = 320,
    height = 44 + tickSize,
    marginTop = 18,
    marginRight = 0,
    marginBottom = 16 + tickSize,
    marginLeft = 0,
    ticks = width / 64,
    tickFormat,
    tickValues
} = {}) {

    function ramp(color, n = 256) {
        const canvas = document.createElement("canvas");
        canvas.width = n;
        canvas.height = 1;
        const context = canvas.getContext("2d");
        for (let i = 0; i < n; ++i) {
            context.fillStyle = color(i / (n - 1));
            context.fillRect(i, 0, 1, 1);
        }
        return canvas;
    }

    const svg = d3version7.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .style("overflow", "visible")
        .style("display", "block");

    let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
    let x;

    // Continuous
    if (color.interpolate) {
        const n = Math.min(color.domain().length, color.range().length);

        x = color.copy().rangeRound(d3version7.quantize(d3version7.interpolate(marginLeft, width - marginRight), n));

        svg.append("image")
            .attr("x", marginLeft)
            .attr("y", marginTop)
            .attr("width", width - marginLeft - marginRight)
            .attr("height", height - marginTop - marginBottom)
            .attr("preserveAspectRatio", "none")
            .attr("xlink:href", ramp(color.copy().domain(d3version7.quantize(d3version7.interpolate(0, 1), n))).toDataURL());
    }

    // Sequential
    else if (color.interpolator) {
        x = Object.assign(color.copy()
                .interpolator(d3version7.interpolateRound(marginLeft, width - marginRight)),
            {range() { return [marginLeft, width - marginRight]; }});

        svg.append("image")
            .attr("x", marginLeft)
            .attr("y", marginTop)
            .attr("width", width - marginLeft - marginRight)
            .attr("height", height - marginTop - marginBottom)
            .attr("preserveAspectRatio", "none")
            .attr("xlink:href", ramp(color.interpolator()).toDataURL());

        // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
        if (!x.ticks) {
            if (tickValues === undefined) {
                const n = Math.round(ticks + 1);
                tickValues = d3version7.range(n).map(i => d3version7.quantile(color.domain(), i / (n - 1)));
            }
            if (typeof tickFormat !== "function") {
                tickFormat = d3version7.format(tickFormat === undefined ? ",f" : tickFormat);
            }
        }
    }

    // Threshold
    else if (color.invertExtent) {
        const thresholds
            = color.thresholds ? color.thresholds() // scaleQuantize
            : color.quantiles ? color.quantiles() // scaleQuantile
                : color.domain(); // scaleThreshold

        const thresholdFormat
            = tickFormat === undefined ? d => d
            : typeof tickFormat === "string" ? d3version7.format(tickFormat)
                : tickFormat;

        x = d3version7.scaleLinear()
            .domain([-1, color.range().length - 1])
            .rangeRound([marginLeft, width - marginRight]);

        svg.append("g")
            .selectAll("rect")
            .data(color.range())
            .join("rect")
            .attr("x", (d, i) => x(i - 1))
            .attr("y", marginTop)
            .attr("width", (d, i) => x(i) - x(i - 1))
            .attr("height", height - marginTop - marginBottom)
            .attr("fill", d => d);

        tickValues = d3version7.range(thresholds.length);
        tickFormat = i => thresholdFormat(thresholds[i], i);
    }

    // Ordinal
    else {
        x = d3version7.scaleBand()
            .domain(color.domain())
            .rangeRound([marginLeft, width - marginRight]);

        svg.append("g")
            .selectAll("rect")
            .data(color.domain())
            .join("rect")
            .attr("x", x)
            .attr("y", marginTop)
            .attr("width", Math.max(0, x.bandwidth() - 1))
            .attr("height", height - marginTop - marginBottom)
            .attr("fill", color);

        tickAdjust = () => {};
    }

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3version7.axisBottom(x)
            .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
            .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
            .tickSize(tickSize)
            .tickValues(tickValues))
        .call(tickAdjust)
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", marginLeft)
            .attr("y", marginTop + marginBottom - height - 6)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .attr("class", "title")
            .text(title));

    return svg.node();
}

export async function Choropleth(data, {
    id = d => d.id, // given d in data, returns the feature id
    value = () => undefined, // given d in data, returns the quantitative value
    title, // given a feature f and possibly a datum d, returns the hover text
    format, // optional format specifier for the title
    scale = d3version7.scaleSequential, // type of color scale
    domain, // [min, max] values; input of color scale
    range = d3version7.interpolateBlues, // output of color scale
    width = 640, // outer width, in pixels
    height, // outer height, in pixels
    projection, // a D3 projection; null for pre-projected geometry
    features, // a GeoJSON feature collection
    featureId = d => d.id, // given a feature, returns its id
    borders, // a GeoJSON object for stroking borders
    outline = projection && projection.rotate ? {type: "Sphere"} : null, // a GeoJSON object for the background
    unknown = "#ccc", // fill color for missing data
    fill = "white", // fill color for outline
    stroke = "white", // stroke color for borders
    strokeLinecap = "round", // stroke line cap for borders
    strokeLinejoin = "round", // stroke line join for borders
    strokeWidth, // stroke width for borders
    strokeOpacity, // stroke opacity for borders
    dotData = null,
    dotColors = null,
} = {}) {

    // Compute values.
    const N = d3version7.map(data, id); // array of neighborhoods
    const V = d3version7.map(data, value).map(d => d == null ? NaN : +d); // array of values to be represented
    const Im = new d3version7.InternMap(N.map((id, i) => [id, i]));
    const If = d3version7.map(features.features, featureId);


    // Compute default domains.
    if (domain === undefined) domain = d3version7.extent(V);

    // Construct scales.
    const color = scale(domain, range);
    if (color.unknown && unknown !== undefined) color.unknown(unknown);

    // Compute titles.
    if (title === undefined) {
        format = color.tickFormat(100, format);
        title = (f, i) => `${f.properties.name}\n${format(V[i])}`;
    } else if (title !== null) {
        const T = title;
        const O = d3version7.map(data, d => d);
        title = (f, i) => T(f, O[i]);
    }

    // Compute the default height. If an outline object is specified, scale the projection to fit
    // the width, and then compute the corresponding height.
    if (height === undefined) {
        if (outline === undefined) {
            height = 400;
        } else {
            const [[x0, y0], [x1, y1]] = d3version7.geoPath(projection.fitWidth(width, outline)).bounds(outline);
            const dy = Math.ceil(y1 - y0), l = Math.min(Math.ceil(x1 - x0), dy);
            projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
            height = dy;
        }
    }

    const projectionTest = d3version7.geoIdentity().reflectY(true)
        .fitSize([width, height], features);
    // Construct a path generator.
    const path = d3version7.geoPath(projectionTest);

    const svg = d3version7.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "width: 80%; height: auto; height: intrinsic;");

    if (outline != null) svg.append("path")
        .attr("fill", fill)
        .attr("stroke", "currentColor")
        .attr("d", path(outline));

    svg.append("svg:g")
        .selectAll("path")
        .data(features.features)
        .join("path")
        .attr("d", path)
        .attr("fill", (d, i) => {
            return color(V[Im.get(N[i])]);
        })
        .append("title")
        .text((d, i) =>
        { if(data.some(el => el.country === d.properties.ISO2))
            return `country name: ${d.properties.ISO2}\n
ppp drop amount: ${data.filter(e => e.country === d.properties.ISO2)[0]['pppDrop'].toFixed(3) || "N/A"}`;
        });

    if (borders != null) svg.append("path")
        .attr("pointer-events", "none")
        .attr("fill", "none")
        .attr("stroke", stroke)
        .attr("stroke-linecap", strokeLinecap)
        .attr("stroke-linejoin", strokeLinejoin)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-opacity", strokeOpacity)
        .attr("d", path(borders));

    if (dotData) {

        svg
            .selectAll("dot")
            .data(dotData)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return projectionTest([d.properties.Longitude, d.properties.Latitude])[0]
            })
            .attr("cy", function (d) {
                return projectionTest([d.properties.Longitude, d.properties.Latitude])[1]
            })
            .attr("r", 2)
            .style("fill", e => { return (dotColors? (dotColors[e.properties.Name] || "#2b8a3e") : "#2b8a3e") })
            // .style("fill", e => { return dotColors[e.properties.Name] || "#2b8a3e"; })
            .attr("stroke", "black")
            .attr("stroke-width", .3)
            .attr("fill-opacity", .8)
    }

    return Object.assign(svg.node(), {scales: {color}});
}
