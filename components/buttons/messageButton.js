import React from 'react';
import Component from '../component';
import { inject, observer } from 'mobx-react';

import SquareButton from './squareButton';



@inject("store")
@observer
export default class MessageButton extends Component {

	constructor() {
		super()
		this.mention = this.mention.bind(this)
	}


// ACTIONS

	mention() {
		console.log("message", this.props.user.address)
	}



// RENDER

	render() {
		return <SquareButton 
			icon="envelope"
			color={this.colors.neutralDark}
			background={this.colors.white}
			onPress={this.message}
		/>
	}
	
}