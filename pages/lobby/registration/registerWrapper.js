import React from 'react';
import Component from '../../../utils/component';
import { View } from 'react-native';
import { inject, observer } from 'mobx-react';

import styles from '../../../styles/styles';
import settings from '../../../settings';

import Button from '../../../components/button';



@inject("store")
@observer
class RegisterWrapper extends Component {

	render() {
		return <View style={styles.lobby.container}>
			<View style={this.props.keyboard ?
					styles.keyboard.above :
					styles.container
				}>

				<View style={styles.lobby.header}>

					<View style={[
							styles.containerRow,
							{ justifyContent: "flex-start" }
						]}>
						<Button
							inactive={this.props.hideBack}
							style={this.props.hideBack ?
								{ opacity: 0 }
								: null
							}
							onPress={() => this.props.navigation.goBack()}
							icon="arrow-left"
							iconColor={settings.colors.major}
							round={true}
						/>
					</View>

					<View style={styles.containerRow}>
						{this.props.skip ?
							<Button
								onPress={this.props.skip}
								label="skip"
							/>
							: null
						}
					</View>

					<View style={[
							styles.containerRow,
							{ justifyContent: "flex-end" }
						]}>
						<Button
							onPress={() => this.props.navigation.navigate("signin")}
							label="sign in"
							iconColor={settings.colors.minor}
							round={true}
						/>
					</View>

				</View>

				<View style={styles.spacer} />

				{this.props.children}

				<View style={styles.spacer} />

			</View>
			
			{this.props.keyboard ?
				<View style={styles.keyboard.below} />
				: null
			}

		</View>
	}

}


export default RegisterWrapper;