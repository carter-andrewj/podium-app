import React from 'react';
import Component from '../utils/component';
import { Text, View, Button } from 'react-native';
import { inject, observer } from 'mobx-react';

import styles from '../../styles/styles';

import Post from './post';



@inject("store")
@observer
class Thread extends Component {

	constructor() {
		super()
		this.state = {
			expanded: false
		}
	}

	render() {
		return <View style={[styles.container, styles.feed.thread]}>

			{this.props.data.depth > 0 ?
				<Post address={this.props.data.origin} />
				: null
			}

			{this.props.data.depth > 3 ?
				this.state.expanded ?
					<FlatList
						data={this.props.data.rest}
						keyExtractor={item => item}
						renderItem={item => <Post address={item} />}
					/>
					:
					<View style={[styles.container, styles.feed.expandThreadButton]}>
						<Text style={}>
							{`${this.props.data.depth - 3} more posts`}
						</Text>
					</View>
				: null
			}

			{this.props.data.depth > 1 ?
				<Post address={this.props.data.parent} />
				: null
			}

			<Post address={this.props.data.address} />

		</View>
	}

}