import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import BaseChart from '../BaseChart';

class PieChart extends BaseChart {
  innerRadius = 0;
  outerRadius = 1.001;

	constructor(options){
		super(options);
		
		this.colorFxn = d3.scaleOrdinal(d3[`scheme${options.colorScheme.scheme}`]);
		this.createTooltip();
		this.radius = Math.min(this.height, this.width) / 2;

		this.duration = 1000;
	}

	dataHtml(d){
		return `
	    ${d.data.sector}: <strong class="text-primary">${d.data.percentage}%</strong> <br />
	  `;
	} 

	displayTooltip(e, d){
	  
    this.targetBar = d3.select(event.currentTarget);

    this.tooltip.transition()		
	    .duration(200)		
	    .style("opacity", .9);

	  this.tooltip.html(this.dataHtml(d))
      .style("left", (e.pageX + 10) + "px")		
      .style("top", (e.pageY - 30) + "px");
	}

  hideTooltip(e){

  	this.targetBar = d3.select(event.currentTarget);

    this.tooltip.transition()		
	    .duration(200)		
	    .style("opacity", 0);
  }

  reColorElements(){

  }

  selectData(e, d){

  }

  displayData(data){
  	this.mainGroup.attr('transform', null)
  	this.mainGroup.attr('transform', `translate(${this.width/2}, ${this.height/2})`)

  	this.pie = d3.pie()
  	  .value((d) => d.percentage)(data);
		
  	this.setScalesAndAxis();
  	this.setInitialAreas(data);
  }

  setScalesAndAxis(){
  	this.arc = d3.arc()
  	  .innerRadius(this.radius * this.innerRadius)
  	  .outerRadius(this.radius * this.outerRadius)
  }

  setInitialAreas(data){
  	this.pieGroup = this.mainGroup
  	  .selectAll('.pie-slices')
  	  .data(this.pie)
  	  .enter()
  	  .append('path');
  }

  updateOptions(options){
  	this.colorFxn = d3.scaleOrdinal(d3[`scheme${options.colorScheme.scheme}`]);

  	this.updateChart();
  }

  updateRadius(radius){
  	this.innerRadius = radius;
  	this.setScalesAndAxis();

  	this.updateChart();
  }

  updateChart(){
  	if(this.pieGroup == undefined){
  		return;
  	}

    this.pieGroup.attr('d', this.arc )
		  .attr('fill', d => this.colorFxn(d.data.sector))
		  .attr("stroke", "black")
		  .style("stroke-width", "2px")
		  .style("opacity", 0.7)
  }
}

const parseData = (data) => {
	const tempObject = {};

  // consolidate values
	data.forEach( d => {
		if(Object.keys(tempObject).includes(d.x2)){
			tempObject[d.x2] += parseInt(d.y);
		} else {
			tempObject[d.x2] = parseInt(d.y);
		}
	});

  // calculate percentages
	const total = Object.values(tempObject).reduce( (acc, value) => {
		return  acc + value;
	});

	Object.keys(tempObject).forEach( key => {
		tempObject[key] = Math.round((tempObject[key] / total) * 100)
	});

	// establish as array
  const newData = [];

  Object.keys(tempObject).forEach( key => {
  	newData.push({sector: key, percentage: tempObject[key]})
  });

	return newData;
}

let chart = null;

const PieChartComponent = (props) => {

	const { data, options, radius } = props;

	const defaultOptions = {
    containerId: "pie-chart",
    width: 600,
	  height: 300
	}

	const newData = parseData(data);

  const setOptions = (options) => {
		if(options == undefined){
			return defaultOptions;	
		} else {
			return options;
		}
  }

  const getOptions = setOptions(options);

  useEffect(()=>{
  	let chart = new PieChart(getOptions);
  	chart.createChart();
  	chart.displayData(newData);
  	resetChart(chart)
  }, [])  

  useEffect(()=>{
	  chart && chart.updateOptions(getOptions)
	  resetChart(chart);
  }, [options])

  useEffect(()=>{
  	chart && chart.updateRadius(radius);
  	const newChart = chart;
  	resetChart(chart);
  }, [radius])

  const resetChart = (newChart) => {
  	chart = newChart;
  }

	return (
		<div>
			<div id={getOptions.containerId} className="chart-viewbox"></div>
		</div>
	)
}

PieChartComponent.propTypes = {
	data: PropTypes.any,
	options: PropTypes.any,
	radius: PropTypes.any
}

export default PieChartComponent;
