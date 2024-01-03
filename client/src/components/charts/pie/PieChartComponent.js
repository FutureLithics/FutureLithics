import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import BaseChart from "../BaseChart";

class PieChart extends BaseChart {
  innerRadius = 0;
  outerRadius = 1.001;

  constructor(options) {
    super(options);

    this.colorFxn = d3.scaleOrdinal(d3[`scheme${options.colorScheme.scheme}`]);
    this.createTooltip();
    this.radius = Math.min(this.height, this.width) / 2;
    this.cornerRadius = 0;
    this.padAngle = 0;
    this.data = null;

    this.duration = 1000;
  }

  dataHtml(d) {
    return `
	    ${d.data.sector}: <strong class="text-primary">${d.data.percentage}%</strong> <br />
	  `;
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

  reColorElements() {}

  selectData(e, d) {}

  midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }

  displayData(data) {
    this.mainGroup.attr("transform", null);
    this.mainGroup.attr(
      "transform",
      `translate(${this.width / 2}, ${this.height / 2})`
    );

    this.data = data;

    this.pie = d3
      .pie()
      .value((d) => d.percentage)
      .padAngle(this.padAngle)(this.data);

    this.setScalesAndAxis();
    this.setInitialAreas(data);
  }

  setScalesAndAxis() {
    this.arc = d3
      .arc()
      .innerRadius(this.radius * this.innerRadius)
      .outerRadius(this.radius * this.outerRadius)
      .cornerRadius(this.cornerRadius);

    this.outerArc = d3
      .arc()
      .innerRadius(this.radius * (this.outerRadius + 0.1))
      .outerRadius(this.radius * (this.outerRadius + 0.1));
  }

  setInitialAreas(data) {
    this.pieGroup = this.mainGroup
      .selectAll(".pie-slices")
      .data(this.pie)
      .enter()
      .append("path");

    this.lineGroup = this.mainGroup.selectAll(".lines").data(this.pie).enter();

    this.labelGroup = this.mainGroup
      .selectAll(".labels")
      .data(this.pie)
      .enter();
  }

  updateOptions(options) {
    this.colorFxn = d3.scaleOrdinal(d3[`scheme${options.colorScheme.scheme}`]);

    this.updateChart();
  }

  updateRadius(radius) {
    this.innerRadius = radius;
    this.setScalesAndAxis();

    this.updateChart();
  }

  updateOuterRadius(radius) {
    this.outerRadius = radius;
    this.setScalesAndAxis();

    this.updateChart();
  }

  updateCornerRadius(radius) {
    this.cornerRadius = Number(radius);
    this.setScalesAndAxis();

    this.updateChart();
  }

  addTextLabels(d) {
    const outerCentroid = this.outerArc.centroid(d);
    const ascender = this.midAngle(d) < Math.PI ? 25 : -125;
    const pos = [outerCentroid[0] + ascender, outerCentroid[1] - 13];

    return pos;
  }

  drawLines(d) {
    const centroid = this.arc.centroid(d);
    const outerCentroid = this.outerArc.centroid(d);
    const ascender = this.midAngle(d) < Math.PI ? 25 : -25;
    const tail = [outerCentroid[0] + ascender, outerCentroid[1]];

    return `M ${centroid.join(" ")} L ${outerCentroid.join(" ")} L ${tail.join(
      " "
    )}`;
  }

  updateChart() {
    if (this.pieGroup == undefined) {
      return;
    }

    this.lineGroup.selectAll(".lines").remove();
    this.labelGroup.selectAll(".labels").remove();

    this.pieGroup
      .attr("d", this.arc)
      .attr("fill", (d) => this.colorFxn(d.data.sector))
      .attr("class", "text-secondary")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    this.lineGroup
      .append("path")
      .attr("class", "text-secondary lines")
      .attr("fill", "transparent")
      .attr("stroke", "#F8BA42")
      .style("stroke-width", "1px")
      .attr("d", (d) => this.drawLines(d));

    this.labelGroup
      .append("foreignObject")
      .attr("width", "100px")
      .attr("height", "26px")
      .attr("x", (d) => this.addTextLabels(d)[0])
      .attr("y", (d) => this.addTextLabels(d)[1])
      .append("xhtml:div")
      .attr("class", "text-primary labels")
      .html(
        (d) =>
          `<p class="m-0 p-0 ${
            this.midAngle(d) < Math.PI ? "text-start" : "text-end"
          }">${d.data.sector}</p>`
      );
  }
}

const parseData = (data) => {
  const tempObject = {};

  // consolidate values
  data.forEach((d) => {
    if (Object.keys(tempObject).includes(d.x2)) {
      tempObject[d.x2] += parseInt(d.y);
    } else {
      tempObject[d.x2] = parseInt(d.y);
    }
  });

  // calculate percentages
  const total = Object.values(tempObject).reduce((acc, value) => {
    return acc + value;
  });

  Object.keys(tempObject).forEach((key) => {
    tempObject[key] = Math.round((tempObject[key] / total) * 100);
  });

  // establish as array
  const newData = [];

  Object.keys(tempObject).forEach((key) => {
    newData.push({ sector: key, percentage: tempObject[key] });
  });

  return newData;
};

let chart = null;

const PieChartComponent = (props) => {
  const { data, options, radius, radiusOuter, cornerRadius } = props;

  const defaultOptions = {
    containerId: "pie-chart",
    width: 600,
    height: 300,
  };

  const newData = parseData(data);

  const setOptions = (options) => {
    if (options == undefined) {
      return defaultOptions;
    } else {
      return options;
    }
  };

  const getOptions = setOptions(options);

  useEffect(() => {
    let chart = new PieChart(getOptions);
    chart.createChart();
    chart.displayData(newData);
    resetChart(chart);
  }, []);

  useEffect(() => {
    chart && chart.updateOptions(getOptions);
    resetChart(chart);
  }, [options]);

  useEffect(() => {
    chart && chart.updateRadius(radius);
    const newChart = chart;
    resetChart(chart);
  }, [radius]);

  useEffect(() => {
    chart && chart.updateOuterRadius(radiusOuter);
    const newChart = chart;
    resetChart(chart);
  }, [radiusOuter]);

  useEffect(() => {
    chart && chart.updateCornerRadius(cornerRadius);
    const newChart = chart;
    resetChart(chart);
  }, [cornerRadius]);

  const resetChart = (newChart) => {
    chart = newChart;
  };

  return (
    <div>
      <div id={getOptions.containerId} className="chart-viewbox"></div>
    </div>
  );
};

PieChartComponent.propTypes = {
  data: PropTypes.any,
  options: PropTypes.any,
  radius: PropTypes.any,
  radiusOuter: PropTypes.any,
  cornerRadius: PropTypes.any,
};

export default PieChartComponent;
