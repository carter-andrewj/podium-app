import React from 'react';
import Component from '../../component';
import { View, Text } from 'react-native';
import { inject, observer } from 'mobx-react';
import { FontAwesomeIcon } from 'expo-fontawesome';

import Explainer from '../explainer';


@inject("store")
@observer
export default class ExplainReportingLinks extends Component {

	render() {
		return <Explainer
			title="Reporting Links"
			icon="exclamation-triangle">
			<Text style={this.style.text.paragraph}>
				Podium will allow you to report more than just posts.
			</Text>
			<Text style={this.style.text.paragraph}>
				By allowing users to report links, we can calculate an
				Integrity score for references cited on the
				platform - providing users with appropriate
				warnings if/when they encounter unreliable, malicious,
				or toxic sources of information.
			</Text>
			<Text style={this.style.text.paragraph}>
				Because Integrity is used to determine the prominence
				of an account and its posts, this also means problematic
				sources of information will be seen less - rewarding
				sources that prioritise accuracy and responsibility.
			</Text>
		</Explainer>
	}

}