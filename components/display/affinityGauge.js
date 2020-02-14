import React from 'react';
import Component from '../component';
import { inject, observer } from 'mobx-react';

import Gauge from './gauge';



@inject("store")
@observer
export default class AffinityGauge extends Component {

	render() {
		return <Gauge
			hide={this.props.user.address === this.activeUser.address}
			value={this.props.user ? this.props.user.affinity : undefined}
			iconSize={10}
			icon="dna"
			style={this.props.style}
		/>

	}

}