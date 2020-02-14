import React from 'react';
import Component from '../component';
import { inject, observer } from 'mobx-react';

import SquareButton from './squareButton';



@inject("store")
@observer
export default class MentionButton extends Component {

	constructor() {
		super()
		this.mention = this.mention.bind(this)
	}


// ACTIONS

	mention() {
		console.log("mention", this.props.user.address)
	}



// RENDER

	render() {
		return <SquareButton 
			icon="at"
			color={this.colors.neutralDark}
			background={this.colors.white}
			onPress={this.mention}
		/>
	}
	
}