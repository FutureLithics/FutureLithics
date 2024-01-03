import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import BaseChart from "../BaseChart";

const parseTime = d3.timeParse("%Y-%m-%d");
const formatTime = d3.timeFormat("%Y-%m-%d");

class LineChart extends BaseChart {
  constructor(options) {
    super(options);

    this.colorFxn = d3.scaleOrdinal(d3[`scheme${options.colorScheme.scheme}`]);
    this.createTooltip();

    this.curve = d3[`${options.curve}`] || d3.curveLinear;

    this.duration = 1000;
  }

  dataHtml(d) {
    return `Date: <strong class="text-primary">${formatTime(
      d.x
    )}</strong> <br /> 
	    Category: <strong class="text-primary">${d.x2}</strong> <br /> 
	    Value: <strong class="text-primary">${d.y}</strong>`;
  }

  displayTooltip(e, d) {
    this.targetBar = d3.select(event.currentTarget);

    this.tooltip.transition().duration(200).style("opacity", 0.9);

    this.tooltip
      .html(this.dataHtml(d))
      .style("left", e.pageX + 10 + "px")
      .style("top", e.pageY - 30 + "px");
  }

  hideTooltip(e) {
    this.targetBar = d3.select(event.currentTarget);

    this.tooltip.transition().duration(200).style("opacity", 0);
  }

  lineSelector(e, d) {
    this.targetLine = d3.select(event.currentTarget);
    const className = this.targetLine.attr("data-category");

    if (this.selected != className || className == undefined) {
      this.reColorElements();

      if (className == undefined) {
        return;
      }
    }

    if (this.selected == null || this.selected != className) {
      this.selected = className;

      let nonSelected = d3
        .selectAll(".chart-lines, .chart-circles")
        .filter(function () {
          return !this.classList.contains(className);
        });

      nonSelected
        .transition()
        .duration(this.duration / 2)
        .style("stroke", "#aaa")
        .style("opacity", 0.3);
    } else {
      this.reColorElements();

      this.selected = null;
    }
  }

  reColorElements() {
    d3.selectAll(".chart-lines")
      .transition()
      .duration(this.duration / 2)
      .style("stroke", (line) => this.colorFxn(line[1][0].x2))
      .style("fill", "none")
      .style("opacity", 1);

    d3.selectAll(".chart-circles")
      .transition()
      .duration(this.duration / 2)
      .style("fill", "#90f1c4")
      .style("stroke", "none")
      .style("opacity", 1);
  }

  setScalesAndAxis(data) {
    this.scaleX = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.x))
      .range([this.margins.left, this.dimensions.innerWidth]);

    this.scaleY = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y) + 1])
      .range([this.dimensions.innerHeight, 0]);

    this.axisX = d3.axisBottom(this.scaleX).ticks(12);

    this.axisY = d3.axisLeft(this.scaleY).ticks(5);

    this.axisXGrid = d3
      .axisBottom(this.scaleX)
      .ticks(4)
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

  setInitialLines(data) {
    const line = d3
      .line()
      .x((d) => this.scaleX(d.x))
      .y((d) => this.scaleY(d.y) - this.margins.left)
      .curve(this.curve);

    this.linesGroup = this.mainGroup.append("g");

    this.lines = this.linesGroup
      .selectAll("path")
      .data(data)
      .enter()
      .append("path")
      .attr("class", (d) => `chart-lines ${d[1][0].x2}`)
      .attr("data-category", (d) => d[1][0].x2)
      .attr("stroke", (d) => this.colorFxn(d[0]))
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("d", (d) => line(d[1]));

    this.lineNodes = d3.selectAll(".chart-lines").nodes();

    this.lineNodes.forEach((d) => {
      const node = d3.select(d);

      let lineLength = node.node().getTotalLength();

      node
        .attr("stroke-dasharray", lineLength)
        .attr("stroke-dashoffset", lineLength)
        .attr("stroke-width", 3)
        .transition()
        .duration(this.duration)
        .attr("stroke-dashoffset", 0);

      node.on("click", (e, d) => this.lineSelector(e, d));
    });
  }

  setCirclePoints(data) {
    this.circleGroup = this.mainGroup.append("g");

    this.circles = this.circleGroup
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle");

    this.circles
      .attr("data-category", (d) => d.x2)
      .attr("class", (d) => `chart-circles ${d.x2}`)
      .attr("cx", (d) => this.scaleX(d.x))
      .attr("cy", (d) => this.scaleY(d.y) - this.margins.left)
      .attr("r", 5)
      .style("fill", "#90f1c4")
      .style("opacity", 0);

    this.circles
      .transition()
      .delay(this.duration)
      .duration(this.duration / 4)
      .style("opacity", 1);

    this.circles
      .on("mouseover", (e, d) => this.displayTooltip(e, d))
      .on("mouseout", (e) => this.hideTooltip(e))
      .on("touchstart", (e, d) => this.displayTooltip(e, d))
      .on("touchend", (e) => this.hideTooltip(e))
      .on("click", (e, d) => this.lineSelector(e, d));
  }

  displayData(data) {
    const newData = [...data].map((d) => {
      return { x: parseTime(d.x), y: d.y, x2: d.x2 };
    });

    const nestData = d3.group(newData, (d) => d.x2);

    this.setScalesAndAxis(newData);
    this.setInitialLines(nestData);
    this.setCirclePoints(newData);
  }
}

const LineChartComponent = (props) => {
  const { data, options } = props;

  const defaultOptions = {
    containerId: "line-chart",
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

  const getOptions = setOptions(options);

  useEffect(() => {
    const chart = new LineChart(getOptions);
    chart.createChart();
    chart.displayData(data);
  }, [options]);

  return (
    <div>
      <div id={getOptions.containerId} className="chart-viewbox"></div>
    </div>
  );
};

LineChartComponent.propTypes = {
  data: PropTypes.any,
  options: PropTypes.any,
};

export default LineChartComponent;
