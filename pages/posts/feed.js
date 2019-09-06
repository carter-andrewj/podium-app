import React from 'react';
import Page from '../../utils/page';
import { Dimensions, FlatList, Text, View } from 'react-native';
import { inject, observer } from 'mobx-react';

import globals from '../../globals';
import styles from '../../styles/styles';

import Post from './post';



const testThreads = [
	"testpost1",
	"testpost2",
	"testpost3",
	"testpost4",
	"testpost5",
	"testpost6",
	"testpost7",
]




@inject("store")
@observer
class Feed extends Page {

	constructor() {

		super()

		this.state = {
			threads: [],
			loading: false
		}

		this.keyIndex = 0
		this.loader = null

		this.feed = React.createRef()

		this.thread = this.thread.bind(this)
		this.threadKey = this.threadKey.bind(this)
		this.loadThreads = this.loadThreads.bind(this)

		this.header = this.header.bind(this)
		this.footer = this.footer.bind(this)
		this.empty = this.empty.bind(this)
		this.spacer = this.spacer.bind(this)

		this.lockScroll = this.lockScroll.bind(this)
		this.unlockScroll = this.unlockScroll.bind(this)

	}

	componentDidMount() {
		this.loadThreads()
	}

	shouldComponentUpdate(props) {
		return !props.screenProps.animUpdate
	}

	pageWillFocus() {
		this.props.screenProps.setBanner(
			"alerts",
			"feed",
			"post",
			"search"
		)
	}


	scrollTo(index) {
		this.feed.current.scrollToIndex({
			index: index,
			viewPosition: 0.5
		})
	}



	loadThreads() {
		clearTimeout(this.loader)
		this.updateState(
			state => state.set("loading", true),
			() => this.loader = setTimeout(
				() => this.updateState(state => state
					.update("threads", t => t.concat(testThreads))
					.set("loading", false)
				),
				2000
			)
		)
	}

	thread(address, index) {
		return <Post
			key={`post-${index}`}
			address={address}
			index={index}
		/>
	}

	threadKey() {
		this.keyIndex++
		return this.keyIndex - 1
	}






	header() {
		return this.state.threads.length > 0 ?
			<View
				style={styles.container}
				key="feed-header">
				<View style={styles.feed.header}>
					<Text>HEADER</Text>
				</View>
				{this.spacer("header")}
			</View>
			: null
	}

	footer() {
		return this.state.threads.length > 0 ?
			<View
				key="feed-footer"
				style={styles.feed.footer}>
				{this.spacer("footer")}
				<Text>FOOTER</Text>
			</View>
			: null
	}

	empty() {
		return <View style={styles.feed.placeholder}>
			<Text style={styles.feed.placeholderText}>
				fetching posts
			</Text>
		</View>
	}

	spacer({ leadingItem }) {
		return <View
			key={`separator-${leadingItem}`}
			style={styles.feed.separator}
		/>
	}

	lockScroll() {
		globals.screenLock = "feed"
	}

	unlockScroll() {
		globals.screenLock = false
	}


	render() {
		return <View style={styles.feed.container}>
			<FlatList

				ref={this.feed}
				contentContainerStyle={styles.feed.list}

				ListHeaderComponent={this.header}
				ListFooterComponent={this.footer}
				ListEmptyComponent={this.empty}
				ItemSeparatorComponent={this.spacer}

				data={this.state.threads}
				initialNumToRender={5}

				renderItem={this.thread}
				refreshing={this.state.loading}

				scrollEnabled={!globals.screenLock ||
					globals.screenLock === "feed"}
				onScrollBeginDrag={this.lockScroll}
				onScrollEndDrag={this.unlockScroll}

				onEndReached={this.loadThreads}
				onEndReachedThreshold={1.0}

			/>
		</View>
	}



	componentWillUnmount() {
		clearTimeout(this.loader)
	}

}

export default Feed;