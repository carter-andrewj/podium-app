import React from 'react';
import Component from '../../utils/component';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { inject, observer } from 'mobx-react';

import settings from '../../settings';
import styles from '../../styles/styles';

import Button from '../../components/button';


@inject("store")
@observer
class QuickProfile extends Component {

	constructor() {
		super()
		this.navigate = this.navigate.bind(this)
	}

	navigate(destination) {
		this.props.navigate(
			destination,
			{ address: this.props.store.session.address }
		)
	}

	render() {
		const profile = this.props.store.session.user
		return <View style={styles.profile.quickContainer}>
			
			{profile ?
				<TouchableOpacity onPress={() => this.navigate("Profile")}>
					<View style={styles.profile.quickProfile}>

						<View style={styles.profile.quickContainerLeft}>
							<View style={styles.profile.quickPictureHolder}>
								<Image
									style={styles.profile.quickPicture}
									source={profile.picture}
								/>
							</View>
						</View>

						<View style={styles.profile.quickContainerRight}>

							<View style={styles.profile.quickHeader}>
								<Text>
									<Text style={styles.profile.quickName}>
										{profile.name}
									</Text>
									{" "}
									<Text style={styles.profile.quickIdentity}>
										{`@${profile.identity}`}
									</Text>
								</Text>
							</View>

							<View style={styles.profile.quickBody}>
								<Text style={styles.profile.quickBio}>
									{profile.bio}
								</Text>
							</View>

						</View>
					</View>
				</TouchableOpacity>
				: null
			}

			<View style={styles.profile.quickLinks}>

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