import React from 'react';
import Component from '../component';
import { inject, observer } from 'mobx-react';

import SquareButton from './squareButton';



@inject("store")
@observer
export default class ReportButton extends Component {

	constructor() {
		super()
		this.report = this.report.bind(this)
	}


// ACTIONS

	report() {
		console.log("report", this.props.subject.address)
	}



// RENDER

	render() {
		return <SquareButton 
			icon="exclamation-triangle"
			color={this.colors.bad}
			background={this.colors.white}
			onPress={this.report}
		/>
	}
	
}