import React from 'react';
import Component from '../../../components/component';
import { Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';

import styles from '../../../styles/styles';
import settings from  '../../../settings';

import FadingView from '../../../components/animated/fadingView';



@inject("store")
@observer
class LobbyTitle extends Component {

	constructor() {
		super()
		this.nextTimer = undefined
	}


// LIFETCYCLE

	componentDidMount() {

		// Automatically display the first field after 2 seconds
		this.nextTimer = setTimeout(
			() => this.props.next(this.props.current + 1),
			2000
		)

	}

	componentWillUnmount() {
		clearTimeout(this.nextTimer)
	}



// RENDER

	render() {

		return <FadingView
			animator={this.props.animator}
			show={this.props.current <= 1 || this.props.mode === "signin"}
			style={styles.lobby.container}>

			<FadingView
				animator={this.props.animator}
				delayIn={settings.layout.fadeTime}
				show={this.props.mode === "register"}>
				<Text style={styles.lobby.heading}>
					Welcome to Podium
				</Text>
			</FadingView>

			<FadingView
				animator={this.props.animator}
				delayIn={settings.layout.fadeTime}
				show={this.props.mode === "signin"}>
				<Text style={styles.lobby.heading}>
					Welcome Back
				</Text>
			</FadingView>

		</FadingView>
		
	}

}

export default LobbyTitle;