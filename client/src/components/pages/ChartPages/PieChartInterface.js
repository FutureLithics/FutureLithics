import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

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
	radial: { minValue: 0.0, maxValue: 0.9,  step: 0.01, label: 'Inner Radius', inner: true },
	radialOuter: { minValue: 0.1, maxValue: 0.9,  step: 0.01, label: 'Outer Radius', inner: false },
	cornerRadius: { minValue: 0, maxValue: 60,  step: 1, label: 'Corner Radius', inner: false }
}

const componentSwitch = (value, data, options, radius, radiusOuter, cornerRadiusSlider) => {
  switch (value) {
    default:
      return( <PieChartComponent 
              options={options} 
              data={data} 
              radius={radius} 
              radiusOuter={radiusOuter} 
              cornerRadius={cornerRadiusSlider}
            />);
  }
};

const ControlDrawer = ({
	children
}) => {
  const [ open, setOpen ] = useState(false);

  const toggle = () => {
  	setOpen(!open);
  }

	return (
    <Dropdown isOpen={open} toggle={toggle} className="control-drawer">
      <DropdownToggle>
        Controls
        <FontAwesomeIcon icon={faChevronDown} />
      </DropdownToggle>
      <DropdownMenu right className="dropdown-control-drawer">
        {children}
      </DropdownMenu>
    </Dropdown>
	);
}

ControlDrawer.propTypes = {
	children: PropTypes.any
}

const PieChartInterface = (props) => {

	const { data, info } = props;

	const [ stateData, setStateData ] = useState([...data]);

	const [ radialSlider, setRadialSlider ] = useState(0);
	const [ radialOuterSlider, setRadialOuterSlider ] = useState(0.9);
	const [ cornerRadiusSlider, setCornerRadiusSlider ] = useState( (radialOuterSlider - radialSlider) / 2 );
	const [ colorScheme, setColorScheme] = useState(options.colorScheme[0]);

	const colorSetter = (value) => {
		const color = options.colorScheme.filter((c) => c.value == value)[0];
		setColorScheme(color);
	}

	const radialSetter = (val, inner) => {
		const value = Number(val);
		const step = 0.1;

		if(inner){
			if(value >= (Number(radialOuterSlider) - step) ){
				setRadialOuterSlider(value + step);
				setRadialSlider(value);
			} else {
				setRadialSlider(value);
			}		
		} else {
			if(value <= (Number(radialSlider) + step) ){
				setRadialSlider(value - step);
			  setRadialOuterSlider(value);
		  } else {
		  	setRadialOuterSlider(value);
		  }
		}
	}

	const cornerRadialSetter = (val) => {
		setCornerRadiusSlider(val);
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
				<div className="my-2 row justify-content-between">
					<div className="col-md-3 py-2">
				  	  <SelectInput options={options.colorScheme} value={colorScheme.value} handler={colorSetter} />
				  </div>
				  <div className="col-md-3 py-2">
					  <ControlDrawer>
						  <div className="py-2">
						  	<RangeInput options={sliders.radial} value={radialSlider} handler={radialSetter} />
						  </div>
						  <div className="py-2">
						  	<RangeInput options={sliders.radialOuter} value={radialOuterSlider} handler={radialSetter} />
						  </div>
						  <div className="py-2">
						  	<RangeInput options={sliders.cornerRadius} value={cornerRadiusSlider} handler={cornerRadialSetter} />
						  </div>
					  </ControlDrawer>				  	
				  </div>
			  </div>
				{componentSwitch(null, stillData, componentOptions, radialSlider, radialOuterSlider, cornerRadiusSlider)}
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