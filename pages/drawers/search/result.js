import React from 'react';
import Component from '../../../components/component';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { computed, when } from 'mobx';
import { inject, observer } from 'mobx-react';

import SlidingView from '../../../components/animated/slidingView';
import Name from '../../../components/display/name';
import Avatar from '../../../components/media/avatar';
import SquareButton from '../../../components/buttons/squareButton';
import FollowButton from '../../../components/buttons/followButton';
import IntegrityGauge from '../../../components/display/integrityGauge';
import AffinityGauge from '../../../components/display/affinityGauge';



@inject("store")
@observer
class Result extends Component {

	constructor() {

		// Initialize
		super()

		// Methods
		this.link = this.link.bind(this)

	}


	componentDidUpdate() {
		this.props.animator.play()
	}



// SUBJECT

	@computed
	get user() {
		return this.nation.get("user", this.props.address)
	}


	link() {
		this.props.navigate.to("Profile", { address: this.props.address })
	}




// RENDER

	@computed
	get show() {

		// Hide if no terms are set
		if (!this.props.terms || this.props.terms.length === 0) return false

		// Hide if the subject user is not loaded
		if (!this.user || !this.user.ready) return false

		// Get regex for current search string
		let sanitizedTerms = this.props.terms.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&')
		let regex = new RegExp(`(${sanitizedTerms})`, "i")

		// Hide if the user does not match the current search terms
		if (!regex.test(this.user.alias) && !regex.test(this.user.name)) return false

		// Otherwise, show
		return true

	}


	render() {

		return <SlidingView
			from="right"
			show={this.show}
			animator={this.props.animator}
			beforeShow={this.props.beforeShow}
			onHide={this.props.onHide}
			offset={this.layout.screen.padding}
			style={this.style.result.container}>

			<View style={this.style.result.left}>
				<FollowButton user={this.user} />
				<SquareButton
					icon="at"
					onPress={() => console.log("mention")}
				/>
			</View>
			
			<View style={this.style.result.middle}>

				<View style={this.style.result.header}>
					<Name
						user={this.user}
						style={this.style.result.name}
					/>
					<Text style={this.style.result.alias}>
						{this.user.alias}
					</Text>
				</View>

				<View style={this.style.result.footer}>
					<AffinityGauge user={this.user} />
					<IntegrityGauge user={this.user} />
				</View>

			</View>

			<TouchableOpacity onPress={this.link}>
				<Avatar
					corner="left"
					style={this.style.result.right}
					user={this.user}
				/>
			</TouchableOpacity>

		</SlidingView>
	}

}

export default Result;