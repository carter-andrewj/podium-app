import React from 'react';
import Component from '../../components/component';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { inject, observer } from 'mobx-react';

import styles from '../../styles/styles';

import SquareButton from '../../components/buttons/squareButton';
import FollowButton from '../../components/buttons/followButton';


@inject("store")
@observer
class QuickResult extends Component {

	constructor() {
		super()
		this.state = {
			ready: false,
			user: null
		}
		this.link = this.link.bind(this)
	}

	componentWillMount() {
		let user = this.props.store.users.add(this.props.address)
		user.load("profile")
			.then(user => this.updateState(state => state
				.set("ready", true)
				.set("user", user)
			))
			.catch(console.error)
	}

	link() {
		this.props.navigate("Profile", { address: this.props.address})
	}

	render() {
		return <TouchableOpacity onPress={this.link}>
			<View style={styles.quickSearch.result}>

				{this.state.user ?
					<View style={styles.quickSearch.resultLeft}>
						<FollowButton address={this.props.address} />
						<SquareButton
							icon="at"
							onPress={() => console.log("mention")}
						/>
					</View>
					:
					null
				}

				<View style={styles.quickSearch.resultMiddle}>
					<Text style={styles.profile.name}>
						{this.state.user ? this.state.user.name : ""}
					</Text>
					<Text tyle={styles.profile.identity}>
						{this.state.user ? this.state.user.identity : ""}
					</Text>
				</View>

				<View style={styles.quickSearch.resultRight}>
					{this.state.user ?
						<Image
							style={styles.quickSearch.resultPicture}
							source={this.state.user.picture}
						/>
						:
						null
					}
				</View>

			</View>
		</TouchableOpacity>
	}

}

export default QuickResult;