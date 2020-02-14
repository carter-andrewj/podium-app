import React from 'react';
import DrawerComponent from '../../../components/drawer/component';
import { View, Text, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';

import Drawer from '../../../components/drawer/drawer';

// import styles from '../../../styles/styles';



@inject("store")
@observer
class Alerts extends DrawerComponent {

	render() {
		return <Drawer
			position="left"
			open={this.props.open}
			controller={this.props.controller}
			animator={this.props.animator}
			style={this.style.alerts.body}>

			<Text>
				{JSON.stringify(this.nation.alerts)}
			</Text>

		</Drawer>
	}

}

export default Alerts;