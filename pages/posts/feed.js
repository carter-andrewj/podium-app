import React from 'react';
import Page from '../../components/page';
import { Dimensions, FlatList, Text, View,
		 TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from 'expo-fontawesome';

import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';

import globals from '../../globals';
import settings from '../../settings';
import styles from '../../styles/styles';

import Post from './post';

import Spinner from '../../components/animated/spinner';



@inject("store")
@observer
class Feed extends Page {

	constructor() {

		super()

		this.state = {
			threads: [],
			loading: false
		}

		this.feed = React.createRef()

		this.thread = this.thread.bind(this)
		this.header = this.header.bind(this)
		this.footer = this.footer.bind(this)
		this.empty = this.empty.bind(this)
		this.spacer = this.spacer.bind(this)

		this.scrollTo = this.scrollTo.bind(this)
		this.lockScroll = this.lockScroll.bind(this)
		this.unlockScroll = this.unlockScroll.bind(this)

	}


	pageWillFocus() {
		this.props.screenProps.setBanner(
			"alerts",
			"feed",
			"post",
			"search"
		)
	}



// COMPONENTS

	thread({ item, index }) {

		// Check type of element
		switch (item.type) {

			// Make notice elements
			case "notice":
				return <View style={styles.feed.notice}>
					<View style={styles.feed.noticeBackground}>
						<FontAwesomeIcon
							icon="chevron-up"
							size={90}
							color={settings.colors.white}
						/>
					</View>
					<Text style={styles.feed.noticeText}>
						{`published ${item.value} new posts`}
					</Text>
				</View>

			// Make threads
			case "thread":
				const { key, address, origin, appearances } = item
				const stale = this.props.store.posts
					.isStale(origin, appearances)
				return <Post
					key={key}
					address={address}
					stale={stale}
					index={index}
				/>

			// Otherwise, return nothing
			default: return null

		}
	}


	header() {
		const pending = this.session.feed.pending
		return pending > 0 ?
			<View
				key="feed-header"
				style={styles.feed.button}>
				<TouchableOpacity
					onPress={this.session.publish}
					style={styles.container}>
					<Text style={styles.feed.buttonText}>
						{`show ${pending} new posts`}
					</Text>
				</TouchableOpacity>
			</View>
			:
			<View
				key="feed-header"
				style={styles.feed.notice}>
				<Text style={styles.feed.noticeText}>
					no new posts
				</Text>
			</View>
	}


	footer() {
		return <View
			key="feed-footer"
			style={styles.feed.notice}>
			<Spinner size={40} />
		</View>
	}

	empty() {
		return <View style={styles.feed.spacer} />
	}

	spacer({ leadingItem }) {
		return <View
			key={`${leadingItem.key}-spacer`}
			style={styles.feed.separator}
		/>
	}





// SCROLL

	scrollTo(index) {
		this.feed.current.scrollToIndex({
			index: index,
			viewPosition: 0.5
		})
	}

	lockScroll(event) {
		if (!globals.screenLock) {
			globals.screenLock = "feed"
		}
	}

	unlockScroll() {
		if (globals.screenLock === "feed") {
			globals.screenLock = false
		}
	}




//RENDER

	render() {

		return <View style={styles.feed.container}>
			<FlatList

				ref={this.feed}

				contentContainerStyle={styles.feed.list}
				endFillColor={settings.colors.neutral}

				ListHeaderComponent={this.header}
				ListEmptyComponent={this.empty}
				ListFooterComponent={this.footer}
				ItemSeparatorComponent={this.spacer}

				data={this.session.feed.all}
				extraData={this.session.feed.pending}
				initialNumToRender={5}

				renderItem={this.thread}
				refreshing={this.state.loading}

				scrollEnabled={!globals.screenLock ||
					globals.screenLock === "feed"}
				onScrollBeginDrag={this.lockScroll}
				onScrollEndDrag={this.unlockScroll}
				scrollsToTop={false}

				onEndReached={this.loadThreads}
				onEndReachedThreshold={1.0}

				maintainVisibleContentPosition={{
					minIndexForVisible: 0,
				}}
				directionalLockEnabled={true}

				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="on-drag"

			/>
		</View>
	}


}

export default Feed;