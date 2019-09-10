import React from 'react';
import Component from '../../utils/component';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';

import settings from '../../settings';
import styles from '../../styles/styles';

import Button from '../../components/button';


@inject("store")
@observer
class QuickProfile extends Component {

	constructor() {
		super()
		this.state = {
			height: styles.quickProfile.container.minHeight,
			bio: null,
			scroll: false
		}
		this.navigate = this.navigate.bind(this)
		this.setHeight = this.setHeight.bind(this)
	}

	navigate(destination) {
		this.props.navigate(
			destination,
			{ address: this.props.store.session.address }
		)
	}

	setHeight({ nativeEvent }) {

		// Get element dimensions
		const height = nativeEvent.layout.height
		const margin = styles.quickProfile.body.marginTop * 2.0
		const header = styles.quickProfile.header.minHeight
		const footer = styles.quickProfile.footer.minHeight

		// Get element limits
		const min = styles.quickProfile.container.minHeight
		const max = styles.quickProfile.container.maxHeight

		// Calculate height to display bio unclipped
		// (Note, textboxes hide any line within 5 pixels
		//  of the bottom edge, hence the +5 below).
		const content = height + header + footer + (2.0 * margin) + 7

		// Calculate container height
		const full = Math.min(max, Math.max(min, content))

		// Set height
		if (full !== this.state.height) {
			this.updateState(state => state
				.set("height", full)
				.set("bio", height + 5)
				.set("scroll", full === max)
			)
		}

	}

	


	render() {
		const profile = this.props.store.session.user
		return <View style={[
				styles.quickProfile.container,
				{
					minHeight: this.state.height,
					maxHeight: this.state.height
				}
			]}>
			
			{profile ?
				<TouchableOpacity
					style={styles.quickProfile.profile}
					onPress={() => this.navigate("Profile")}>
					<View style={styles.quickProfile.profile}>

						<View style={styles.quickProfile.left}>
							<View style={styles.quickProfile.pictureHolder}>
								<Image
									style={styles.quickProfile.picture}
									source={profile.picture}
								/>
							</View>
						</View>

						<View style={styles.quickProfile.right}>

							<View style={styles.quickProfile.header}>
								<Text style={styles.profile.name}>
									{profile.name}
								</Text>
								<Text style={styles.profile.identity}>
									{profile.identity}
								</Text>
							</View>

							<ScrollView
								scrollEnabled={this.state.scroll}
								contentContainerStyle={[
									styles.quickProfile.body,
									this.state.bio ?
										{
											minHeight: this.state.bio,
											maxHeight: this.state.bio
										}
										: null
								]}>
								<Text
									onStartShouldSetResponder={
										this.state.scroll ?
											() => true
											: null
									}
									style={styles.quickProfile.bio}>
									{profile.bio}
								</Text>
								<Text
									onLayout={this.setHeight}
									pointerEvents="none"
									style={styles.quickProfile.dummy}>
									{profile.bio}
								</Text>
							</ScrollView>

						</View>
					</View>
				</TouchableOpacity>
				: null
			}

		<View style={styles.quickProfile.footer}>

				<Button
					onPress={() => this.navigate("Wallet")}
					icon="wallet"
					iconSize={settings.iconSize.largish}
					caption={<Text style={styles.wallet.buttonCaption}>
						<Text style={[
								styles.button.captionText,
								styles.wallet.pdm
							]}>
							{"100"}
						</Text>
						{"\n"}
						<Text style={[
								styles.button.captionText,
								styles.wallet.adm
							]}>
							{"37"}
						</Text>
					</Text>}
				/>

				<Button
					onPress={() => this.navigate("Followers")}
					icon="users"
					iconSize={settings.iconSize.largish}
					caption={"123"}
				/>

				<Button
					onPress={() => this.navigate("Following")}
					icon="eye"
					iconSize={settings.iconSize.largish}
					caption={"1.2k"}
				/>

				<Button
					onPress={() => this.navigate("Integrity")}
					icon="balance-scale"
					iconSize={settings.iconSize.largish}
					caption={"52%"}
				/>

			</View>


		</View>
	}

}

export default QuickProfile;