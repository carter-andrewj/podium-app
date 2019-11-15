import React from 'react';
import Component from '../../../components/component';
import { Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';

import FadingView from '../../../components/animated/fadingView';
import Button from '../../../components/buttons/button';
import Spinner from '../../../components/animated/spinner';

import settings from '../../../settings';
import styles from '../../../styles/styles';



@inject("store")
@observer
class Welcome extends Component {

	render() {
		return <FadingView
			animator={this.props.animator}
			show={this.props.focus === this.props.index}
			style={styles.lobby.container}>

			<View style={styles.lobby.welcome}>
				<Text style={styles.lobby.heading}>
					{`Welcome, ${this.props.data.get("alias").get("value")}`}
				</Text>
				<Text style={styles.lobby.welcomeText}>
					[WELCOME TEXT GOES HERE]
				</Text>
				<Text style={styles.text.paragraph}>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
				</Text>
			</View>

			<FadingView
				animator={this.props.animator}
				show={this.props.complete}
				style={styles.lobby.container}>
				<Button
					style={styles.lobby.submitButton}
					color={settings.colors.white}
					label="continue"
					labelStyle={styles.lobby.submitText}
					onPress={() => this.props.next(this.props.index + 1)}
				/>
			</FadingView>

			<FadingView
				animator={this.props.animator}
				show={!this.props.complete}
				style={styles.lobby.container}>
				<Spinner color={settings.colors.major} />
			</FadingView>

		</FadingView>

	}

}

export default Welcome;