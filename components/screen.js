import React from 'react';
import Component from './component';
import { inject, observer } from 'mobx-react';

import { SafeAreaView } from 'react-native';

import KeyboardView from './keyboardView';
import Mask from './mask';
import TaskBar from './tasks/taskBar';



@inject("store")
@observer
class Screen extends Component {

	render() {
		return <SafeAreaView style={{
				...this.style.general.screen,
				...this.style.general.overlay,
			}}>
			<KeyboardView
				style={this.props.style}
				offsetBottom={this.props.offsetBottom}
				footer={this.props.hideFooter ?
					null :
					this.props.footer || <TaskBar />
				}>
				{this.props.children}
			</KeyboardView>
			<Mask
				content={this.props.store.mask.content}
				onClose={this.props.store.mask.onClose}
			/>
		</SafeAreaView>
	}

}

export default Screen;