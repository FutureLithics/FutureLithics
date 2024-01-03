import * as d3 from "d3";

const defaultOptions = {
  width: 600,
  height: 300,
};

class BaseChart {
  constructor(options = defaultOptions) {
    this.options = options;

    this.color = options.colorScheme.highlight;
    this.setDimensions();
    this.containerId = options.containerId;
    this.container = d3.select(`#${this.containerId}`);
    this.container.selectAll("svg").remove();

    this.selected = null;
  }

  setDimensions() {
    this.height = this.options.height;
    this.width = this.options.width;
  }

  createChart() {
    this.svg = this.container.append("svg");

    this.box = this.container.node().getBoundingClientRect();

    this.margins = {
      top: this.height / 15,
      bottom: this.height / 15,
      right: this.width / 30,
      left: this.width / 30,
    };

    this.dimensions = {
      innerWidth: this.width - this.margins.left - this.margins.right,
      innerHeight: this.height - this.margins.top - this.margins.bottom,
    };

    this.svg
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .attr("preserveAspectRatio", "xMinYMin  meet");

    this.mainGroup = this.svg.append("g");

    this.mainGroup.attr(
      "transform",
      `translate(${this.margins.left}, ${this.margins.top})`
    );
  }

  createTooltip() {
    this.tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  }

  dataHtml(d) {
    return `Category: <strong class="text-primary">${d.x}</strong> <br /> 
	    Subcategory: <strong class="text-primary">${d.x2}</strong> <br /> 
	    Value: <strong class="text-primary">${d.y}</strong>`;
  }

  displayTooltip(e, d) {
    this.targetBar = d3.select(event.currentTarget);
    this.targetBar.style("fill", this.color);

    this.tooltip.transition().duration(200).style("opacity", 0.9);

    this.tooltip
      .html(this.dataHtml(d))
      .style("left", e.pageX + "px")
      .style("top", e.pageY - 30 + "px");
  }

  hideTooltip(e) {
    this.targetBar = d3.select(event.currentTarget);
    this.targetBar.style("fill", (d) => this.colorFxn(d.x2));

    this.tooltip.transition().duration(200).style("opacity", 0);
  }
}

export default BaseChart;
