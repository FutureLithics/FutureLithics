import React, { useState } from "react";
import PropTypes from "prop-types";

import {
	BarChartComponent,
	BandedBarComponent,
	StackedBarComponent
} from '../../charts/bar';

import DesktopTable from "../../tables/DesktopTable";
import MobileTable from "../../tables/MobileTable";
import SelectInput from "../../shared/SelectInput";

const options = {
  orientation: [
    { value: "landscape", key: "Landscape" },
    { value: "portrait", key: "Portrait" },
  ],
  chartType: [
    { value: "bar", key: "Bar", table: "single" },
    { value: "scaleBand", key: "Scale Band", table: "double" },
    { value: "stacked", key: "Stacked Bar", table: "double" },
  ],
  colorScheme: [
    {
      value: "default",
      key: "Default Colors",
      highlight: "#25DD87",
      scheme: "Dark2",
    },
    {
      value: "second",
      key: "Category 10",
      highlight: "#F8BA42",
      scheme: "Category10",
    },
    {
      value: "tableau",
      key: "Tableau 10",
      highlight: "#d82340",
      scheme: "Tableau10",
    },
  ],
};

const componentSwitch = (value, data, options) => {
  switch (value) {
    case "bar":
      return <BarChartComponent data={data} options={options} />;
    case "scaleBand":
      return <BandedBarComponent data={data} options={options} />;
    case "stacked":
      return <StackedBarComponent data={data} options={options} />;
    default:
      return <BarChartComponent data={data} options={options} />;
  }
};

const BarChartInterface = (props) => {
  const { data, info } = props;

  const [orientation, setOrientation] = useState(options.orientation[0].value);
  const [chartType, setChartType] = useState(options.chartType[0]);
  const [colorScheme, setColorScheme] = useState(options.colorScheme[0]);

  const tableOptions = {
    type: chartType.table,
  };

  const chartSetter = (value) => {
    const chart = options.chartType.filter((c) => c.value == value)[0];
    setChartType(chart);
    tableOptions.type = chartType.table;
  };

  const colorSetter = (value) => {
    const color = options.colorScheme.filter((c) => c.value == value)[0];
    setColorScheme(color);
  };

  const componentOptions = {
    orientation,
    colorScheme,
    containerId: "bar-divy-1",
    width: 600,
    height: 300,
  };

  return (
    <div className="bar-chart-container container my-4">
      <div className="p-4 ash-container my-2">
        <h5>{info.title}</h5>
        <div className="my-2 row justify-content-start">
          <div className="col-md-3 py-2">
            <SelectInput
              options={options.orientation}
              value={orientation.value}
              handler={setOrientation}
            />
          </div>
          <div className="col-md-3 py-2">
            <SelectInput
              options={options.chartType}
              value={chartType.value}
              handler={chartSetter}
            />
          </div>
          <div className="col-md-3 py-2">
            <SelectInput
              options={options.colorScheme}
              value={colorScheme.value}
              handler={colorSetter}
            />
          </div>
        </div>
        {componentSwitch(chartType.value, data, componentOptions)}
      </div>

      <div className="text-center p-4 ash-container my-4 d-none d-md-block">
        <DesktopTable data={data} type={chartType.table} />
      </div>
      <div className="text-center p-4 ash-container my-4 d-block d-md-none">
        <MobileTable data={data} type={chartType.table} />
      </div>
    </div>
  );
};

BarChartInterface.propTypes = {
  data: PropTypes.any,
  info: PropTypes.any,
};

export default BarChartInterface;
