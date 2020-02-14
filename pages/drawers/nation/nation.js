import React from 'react';
import DrawerComponent from '../../../components/drawer/component';
import { View, Text, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';

import Drawer from '../../../components/drawer/drawer';
import MenuButton from '../../../components/buttons/menuButton';



@inject("store")
@observer
class Nation extends DrawerComponent {

	render() {
		return <Drawer
			position="right"
			open={this.props.open}
			controller={this.props.controller}
			animator={this.props.animator}
			style={this.style.alerts.body}>

			<Text>nation</Text>

		</Drawer>
	}

}

export default Nation;