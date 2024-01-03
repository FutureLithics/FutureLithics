import React, { useEffect } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import BaseChart from "../BaseChart";

class StackedBarChart extends BaseChart {
  constructor(options) {
    super(options);

    this.colorFxn = d3.scaleOrdinal(d3[`scheme${options.colorScheme.scheme}`]);
    this.createTooltip();
  }

  setHorizontalScalesAndAxis(data) {
    this.scaleX = d3
      .scaleBand()
      .domain(data.map((d) => d.x))
      .range([this.margins.left, this.dimensions.innerWidth]);

    this.scaleY = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y) + 1])
      .range([this.dimensions.innerHeight, this.margins.bottom]);

    this.axisX = d3.axisBottom(this.scaleX).ticks(data.map((d) => d.x).length);
    this.axisY = d3.axisLeft(this.scaleY).ticks(5);

    this.axisXGrid = d3
      .axisBottom(this.scaleX)
      .ticks(5)
      .tickFormat("")
      .tickSize(-this.dimensions.innerHeight + this.margins.top);
    this.axisYGrid = d3
      .axisLeft(this.scaleY)
      .ticks(5)
      .tickFormat("")
      .tickSize(-this.dimensions.innerWidth + this.margins.left);

    this.bottomAxis = this.mainGroup
      .append("g")
      .attr("class", "text-secondary")
      .attr(
        "transform",
        `translate(${0}, ${this.dimensions.innerHeight - this.margins.bottom})`
      )
      .call(this.axisX);

    this.leftAxis = this.mainGroup
      .append("g")
      .attr("class", "text-secondary")
      .attr(
        "transform",
        `translate(${this.margins.left}, -${this.margins.bottom})`
      )
      .call(this.axisY);

    this.bottomAxisGrid = this.mainGroup
      .append("g")
      .attr("class", "grid-lines")
      .attr(
        "transform",
        `translate(${0}, ${this.dimensions.innerHeight - this.margins.bottom})`
      )
      .call(this.axisXGrid);

    this.leftAxisGrid = this.mainGroup
      .append("g")
      .attr("class", "grid-lines")
      .attr(
        "transform",
        `translate(${this.margins.left}, -${this.margins.bottom})`
      )
      .call(this.axisYGrid);

    d3.selectAll(".text-secondary .domain").style("stroke", "#484641ff");
  }

  appendHorizontalBars(data) {
    this.setHorizontalScalesAndAxis(data);

    this.bars = this.mainGroup
      .append("g")
      .attr(
        "transform",
        `translate(${this.margins.left}, -${this.margins.top})`
      )
      .selectAll(".bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "rects")
      .attr("x", (d) => this.scaleX(d.x))
      .style("fill", (d) => this.colorFxn(d.x2))
      .attr("width", this.scaleX.bandwidth() - this.margins.left * 2)
      .attr("height", 0)
      .attr("y", this.scaleY(0));

    this.bars
      .transition()
      .attr("y", (d) => this.scaleY(d.y))
      .attr("height", (d) => this.dimensions.innerHeight - this.scaleY(d.y));

    this.bars
      .on("mouseover", (e, d) => this.displayTooltip(e, d))
      .on("mouseout", (e) => this.hideTooltip(e))
      .on("touchstart", (e, d) => this.displayTooltip(e, d))
      .on("touchend", (e) => this.hideTooltip(e));
  }

  setVerticalScalesAndAxis(data) {
    this.scaleX = d3
      .scaleBand()
      .domain(data.map((d) => d.x))
      .range([this.dimensions.innerHeight, this.margins.top]);

    this.scaleY = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y) + 1])
      .range([this.margins.left, this.dimensions.innerWidth]);

    this.axisX = d3.axisLeft(this.scaleX).ticks(data.map((d) => d.x).length);
    this.axisY = d3.axisTop(this.scaleY).ticks(5);

    this.axisXGrid = d3
      .axisLeft(this.scaleX)
      .ticks(5)
      .tickFormat("")
      .tickSize(-this.dimensions.innerWidth + this.margins.left);
    this.axisYGrid = d3
      .axisTop(this.scaleY)
      .ticks(5)
      .tickFormat("")
      .tickSize(-this.dimensions.innerHeight + this.margins.top);

    this.leftAxis = this.mainGroup
      .append("g")
      .attr("class", "text-secondary")
      .attr("transform", `translate(${0}, -${0})`)
      .call(this.axisX.tickFormat(""));

    this.topAxis = this.mainGroup
      .append("g")
      .attr("class", "text-secondary")
      .attr(
        "transform",
        `translate(-${this.margins.left}, ${this.margins.top})`
      )
      .call(this.axisY);

    this.leftAxisGrid = this.mainGroup
      .append("g")
      .attr("class", "grid-lines")
      .attr("transform", `translate(${0}, ${0})`)
      .call(this.axisXGrid);

    this.topAxisGrid = this.mainGroup
      .append("g")
      .attr("class", "grid-lines")
      .attr(
        "transform",
        `translate(-${this.margins.left}, ${this.margins.top})`
      )
      .call(this.axisYGrid);

    d3.selectAll(".text-secondary .domain").style("stroke", "#484641ff");
  }

  appendVerticalBars(data) {
    this.setVerticalScalesAndAxis(data);
    this.bars = this.mainGroup
      .append("g")
      .attr(
        "transform",
        `translate(-${this.margins.left}, ${this.margins.top})`
      )
      .selectAll(".bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", (d) => this.scaleX(d.x) - this.margins.top / 2)
      .style("fill", (d) => this.colorFxn(d.x2))
      .attr("width", 0)
      .attr("height", this.scaleX.bandwidth() - this.margins.left)
      .attr("x", this.scaleY(0));

    this.bars
      .transition()
      .attr("width", (d) => this.scaleY(d.y) - this.margins.left);

    this.bars
      .on("mouseover", (e, d) => this.displayTooltip(e, d))
      .on("mouseout", (e) => this.hideTooltip(e))
      .on("touchstart", (e, d) => this.displayTooltip(e, d))
      .on("touchend", (e) => this.hideTooltip(e));
  }

  displayData(options, data) {
    if (options.orientation == "landscape") {
      this.appendHorizontalBars(data);
    } else {
      this.appendVerticalBars(data);
    }
  }
}

const StackedBarComponent = (props) => {
  const { data, options } = props;

  const defaultOptions = {
    orientation: "landscape",
    containerId: "bar-chart",
    width: 600,
    height: 300,
  };

  const setOptions = (options) => {
    if (options == undefined) {
      return defaultOptions;
    } else {
      return options;
    }
  };

  /* values should be sorted so longer rectangles are rendered first */
  let sortedData = [...data].sort((a, b) => b.y - a.y);

  const getOptions = setOptions(options);

  useEffect(() => {
    const chart = new StackedBarChart(getOptions);
    chart.createChart();
    chart.displayData(getOptions, sortedData);
  }, [options]);

  return <div id={getOptions.containerId} className="chart-viewbox"></div>;
};

StackedBarComponent.propTypes = {
  data: PropTypes.any,
  options: PropTypes.any,
};

export default StackedBarComponent;
