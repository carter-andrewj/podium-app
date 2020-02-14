import React from 'react';
import Component from '../component';
import { ScrollView } from 'react-native';
import { inject, observer } from 'mobx-react';

import Picture from './picture';



@inject("store")
@observer
export default class Gallery extends Component {

	render() {
		return <ScrollView
			horizontal={true}
			contentContainerStyle={this.style.post.mediaHolder}>
			{this.props.media.map((media, i) => 
				<Picture
					key={`${this.props.keyName}-gallery-${media.address}`}
					style={this.style.post.mediaThumbnail}
					uri={media.uri}>
					{this.props.overlay ? this.props.overlay(media, i) : null}
				</Picture>
			)}
		</ScrollView>
	}

}


