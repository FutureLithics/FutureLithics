import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
	PieChartComponent
} from '../../charts/pie';

import DesktopTable from '../../tables/DesktopTable';
import MobileTable from '../../tables/MobileTable';
import SelectInput from '../../shared/SelectInput';
import RangeInput from '../../shared/RangeInput';

const options = {
	colorScheme: [
		{ value: 'default', key: "Default Colors", highlight: '#25DD87', scheme: 'Dark2' },
		{ value: 'second', key: "Category 10", highlight: '#F8BA42', scheme: 'Category10' },
		{ value: 'tableau', key: "Tableau 10", highlight: '#d82340', scheme: 'Tableau10' }
	]
}

const sliders = {
	radial: { minValue: 0.0, maxValue: 0.9,  step: 0.01, label: 'Inner Radius' }
}

const componentSwitch = (value, data, options, radius) => {
  switch (value) {
    default:
      return <PieChartComponent options={options} data={data} radius={radius}/>;
  }
};

const PieChartInterface = (props) => {

	const { data, info } = props;

	const [ stateData, setStateData ] = useState([...data]);

	const [ radialSlider, setRadialSlider ] = useState(0);
	const [ colorScheme, setColorScheme] = useState(options.colorScheme[0]);

	const colorSetter = (value) => {
		const color = options.colorScheme.filter((c) => c.value == value)[0];
		setColorScheme(color);
	}

	const radialSetter = (value) => {
		setRadialSlider(value);
	}

	const componentOptions = {
		colorScheme,
		containerId: 'pie-div-1',
		width: 600,
	  height: 300
	}

	const stillData = [...data.map((d) => d)];

	return (
		<div className="bar-chart-container container my-4" >
		  <div className="p-4 ash-container my-2">
				<h5>{info.title}</h5>
				<div className="my-2 row justify-content-start">
					<div className="col-md-3 py-2">
				  	<SelectInput options={options.colorScheme} value={colorScheme.value} handler={colorSetter} />
				  </div>
				  <div className="col-md-3 py-2">
				  	<RangeInput options={sliders.radial} value={radialSlider} handler={setRadialSlider} />
				  </div>
			  </div>
				{componentSwitch(null, stillData, componentOptions, radialSlider)}
			</div>
			<div className="text-center p-4 ash-container my-4 d-none d-md-block">
		  	<DesktopTable  data={stateData} type={'double'} />
		  </div>
		  <div className="text-center p-4 ash-container my-4 d-block d-md-none">
		  	<MobileTable  data={stateData} type={'double'} />
		  </div>
		</div>
	)
}

PieChartInterface.propTypes = {
	data: PropTypes.any,
	info: PropTypes.any
}

export default PieChartInterface;