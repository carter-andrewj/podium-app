import React from 'react';
import Component from '../../utils/component';
import { FlatList, Text, View, Button } from 'react-native';
import { inject, observer } from 'mobx-react';

import styles from '../../styles/styles';


@inject("store")
@observer
class Feed extends Component {

	constructor() {
		super()
		this.state = {
			threads: []
		}
		this.signOut = this.signOut.bind(this)
	}

	signOut() {
		this.props.store.session
			.signOut()
			.then(() => {
				console.log("out")
				this.props.navigation.navigate("Lobby")
			})
	}

	render() {
		return <View style={styles.container}>
			<FlatList
				contentContainerStyle={styles.container}
				data={this.props.store.feed.threads}
				keyExtractor={item => item.key}
				renterItem={item => <Thread data={item} />}
			/>
			<Button
				onPress={this.signOut}
				style={styles.buttonCard}
				title="sign out"
			/>
		</View>
	}

}

export default Feed;