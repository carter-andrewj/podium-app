import React from 'react';
import Component from '../component';
import { inject, observer } from 'mobx-react';

import Gauge from './gauge';



@inject("store")
@observer
export default class IntegrityGauge extends Component {

	render() {
		return <Gauge
			value={this.props.user ? this.props.user.integrity : undefined}
			iconSize={13}
			icon="balance-scale"
			style={this.props.style}
		/>
	}

}