import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, Collapse } from 'reactstrap';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faAngleDown } from '@fortawesome/free-solid-svg-icons';

const iconClass = (card, routeName) => {
	if(card === null){
		return 'icon rotate-up';
	}

	if(card === routeName){
		return 'icon rotate-down';
	} else {
		return 'icon rotate-up';
	}
}

const routeFilter = (route) => {
	if(route.routes){
		const routes = route.routes;
		const filteredRoutes = routes.filter((r) => {
			return r.type === 'active' || r.type === 'external';
		});
		if(filteredRoutes.length > 0){
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

const RecursiveAccordion = (props) => {
	const { routes } = props;

	const [card, setCard] = useState(null);

	const toggle = (name) => {
		if(card === name) {
			setCard(null);
		} else {
			setCard(name)
		}
	}

	return (
	  <div className="mobile-nav-body-container">
		{ 
			routes.map((route, i) => {
				if(routeFilter(route)){
					return (
						<Card key={route.name}>
						  
							<CardHeader onClick={() => toggle(route.name)} className="d-flex justify-content-between align-items-center pe-4">
					       <Link to={{pathname: route.path}}  target={route.type == 'external' ? "_balnk" : ""}  className="flex-grow text-end mw-100">
						       <h6 style={{paddingLeft: `${10 * (route.level - 1)}px` }} className="text-start">
						         {route.title}
						       </h6> 
					       </Link>
					       <FontAwesomeIcon icon={ faAngleDown } className={iconClass(card, route.name)}  />
					    </CardHeader>
					    <Collapse isOpen={card === route.name ? true : false}>
					    	<RecursiveAccordion routes={route.routes} />
					    </Collapse>
						</Card>
					)		
				} else {
					return (
						<Card key={route.name}>
							<CardHeader>
							  <Link to={{pathname: route.path}}  target={route.type == 'external' ? "_balnk" : ""}  className="flex-grow text-end mw-100">
					        <h6 style={{paddingLeft: `${10 * (route.level - 1)}px` }} className="text-start">
					          {route.title}
					        </h6>
					      </Link>
					    </CardHeader>
						</Card>
					)					
				}
			})
		}
	  </div>
	)
}

RecursiveAccordion.propTypes = {
	routes: PropTypes.any
}

const MobileNav = (props) => {
  const { routes } = props;

  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

	return (
	 	<div className="d-block d-sm-none mobile-nav">
	 	  <button className="mobile-toggle btn btn-secondary" onClick={toggle}>
	 	  	<FontAwesomeIcon icon={faBars}  />
	 	  </button>
	 	  { open && <div className="mobile-nav-body"><RecursiveAccordion routes={routes} /></div> }
	  </div>
	);
}

MobileNav.propTypes = {
	routes: PropTypes.any
}

export default MobileNav;