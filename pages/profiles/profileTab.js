import React from 'react';
import Component from '../../components/component';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';

import Avatar from '../../components/media/avatar';
import IntegrityGauge from '../../components/display/integrityGauge';
import AffinityGauge from '../../components/display/affinityGauge';

import FollowButton from '../../components/buttons/followButton';
import MentionButton from '../../components/buttons/mentionButton';


@inject("store")
@observer
class ProfileTab extends Component {

	constructor() {
		super()
	}


	get user() {
		return this.nation.get("user", this.props.address)
	}


	render() {
		return <View style={this.style.profileTab.container}>
			
			<View style={this.style.profileTab.left}>
				<FollowButton user={this.user} />
				<MentionButton user={this.user} />
			</View>

			<View style={this.style.profileTab.body}>
				<View style={this.style.profileTab.title}>
					<Text style={this.style.profileTab.name}>
						{this.user.name}
					</Text>
					<Text style={this.style.profileTab.alias}>
						{this.user.alias}
					</Text>
				</View>
				<Text style={this.style.post.bio}>
					{this.user.about}
				</Text>
			</View>

			<View style={this.style.profileTab.right}>
				<Avatar
					user={this.user} 
					style={this.style.profileTab.avatar}
				/>
				<IntegrityGauge user={this.user} />
				<AffinityGauge user={this.user} />
			</View>

		</View>
	}

}

export default ProfileTab;