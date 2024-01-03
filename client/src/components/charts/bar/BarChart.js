import React, { useEffect } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import BaseChart from "../BaseChart";

/*
 * @param data = [{x: 2, y: 2}, ...]
 * @param options {
 *    orientation: 'portriat' || 'landscape',
 *    containerId: String
 *  }
 *
 */

class BarChart extends BaseChart {
  constructor(options) {
    super(options);
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
      .attr("x", (d) => this.scaleX(d.x))
      .style("fill", this.color)
      .attr(
        "width",
        this.scaleX.bandwidth() - this.margins.right - this.margins.left
      )
      .attr("height", 0)
      .attr("y", this.scaleY(0))
      .transition()
      .attr("y", (d) => this.scaleY(d.y))
      .attr("height", (d) => this.dimensions.innerHeight - this.scaleY(d.y));
  }

  setVerticalScalesAndAxis(data) {
    this.scaleX = d3
      .scaleBand()
      .domain(data.map((d) => d.x))
      .range([this.dimensions.innerHeight, this.margins.top]);

    this.scaleY = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y) + d3.max(data, (d) => d.y) / 10])
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
      .enter();

    this.bars
      .append("rect")
      .attr("y", (d) => this.scaleX(d.x) - this.margins.top / 2)
      .style("fill", this.color)
      .attr("width", 0)
      .attr("height", this.scaleX.bandwidth() - this.margins.left)
      .attr("x", this.scaleY(0))
      .transition()
      .attr("width", (d) => this.scaleY(d.y) - this.margins.left);

    this.bars
      .append("text")
      .style("stroke", "transparent")
      .style("fill", "#F8BA42")
      .style("font-size", "0.7em")
      .style("stroke-width", "0.1em")
      .text((d) => d.x)
      .attr("y", (d) => this.scaleX(d.x) + this.margins.top / 2 - 2)
      .attr("x", (d) => this.scaleY(0) + this.margins.left)
      .transition()
      .attr("x", (d) => this.scaleY(d.y) + 5);
  }

  displayData(options, data) {
    if (options.orientation == "landscape") {
      this.appendHorizontalBars(data);
    } else {
      this.appendVerticalBars(data);
    }
  }
}

const BarChartComponent = (props) => {
  const { data, options } = props;

  const defaultOptions = {
    orientation: "landscape",
    containerId: "bar-chart",
    width: 600,
    height: 300,
  };

  const collectData = {};

  data.map((d) => {
    if (Object.keys(collectData).includes(d.x)) {
      collectData[d.x] += d.y;
    } else {
      collectData[d.x] = d.y;
    }
  });

  const collectArray = [];

  for (let key in collectData) {
    const obj = { x: key, y: collectData[key] };
    collectArray.push(obj);
  }

  const setOptions = (options) => {
    if (options == undefined) {
      return defaultOptions;
    } else {
      return options;
    }
  };

  const getOptions = setOptions(options);

  useEffect(() => {
    const chart = new BarChart(getOptions);
    chart.createChart();
    chart.displayData(getOptions, collectArray);
  }, [options]);

  return <div id={getOptions.containerId} className="chart-viewbox"></div>;
};

BarChartComponent.propTypes = {
  data: PropTypes.any,
  options: PropTypes.any,
};

export default BarChartComponent;
