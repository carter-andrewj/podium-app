import React from 'react';
import Page from '../../components/page';
import { Dimensions, FlatList, Text, View,
		 TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from 'expo-fontawesome';

import { toJS, computed } from 'mobx';
import { inject, observer } from 'mobx-react';

import Post from './post';

import Button from '../../components/buttons/button';
import Spinner from '../../components/animated/spinner';

import Animator from '../../utils/animator';



@inject("store")
@observer
class Feed extends Page {

	constructor() {

		super({
			scroll: true,
			issue: -1,
		})

		// Refs
		this.feedlist = React.createRef()

		// Utilities
		this.animator = new Animator()

		// Methods
		this.publish = this.publish.bind(this)

		this.keys = this.keys.bind(this)
		this.thread = this.thread.bind(this)
		this.header = this.header.bind(this)
		this.footer = this.footer.bind(this)
		this.empty = this.empty.bind(this)
		this.spacer = this.spacer.bind(this)

		this.scrollTo = this.scrollTo.bind(this)

	}



// LIFECYCLE

	componentDidUpdate() {
		this.animator.play()
	}



// PUBLISH

	get feed() {
		return this.session.feed
	}

	@computed
	get isPublishing() {
		return this.feed.publishing
	}

	async publish() {

		// Add posts
		await this.feed.publish()

		// Show posts
		this.updateState(state => state.set("issue", this.feed.size))

	}






// SCROLL

	get scroll() {
		return {
			lock: () => this.updateState(state => state.set("scroll", false)),
			unlock: () => this.updateState(state => state.set("scroll", true)),
		}
	}




// COMPONENTS

	keys({ type, issue, address }, index) {
		switch (type) {

			// Label notices
			case "notice": return `feed-notice-${index}`

			// Label threads
			case "thread": return `thread-${address}-issue-${issue}`

			// Otherwise, return nothing
			default: return `feed-${index}`

		}
	}

	thread({ item, index }) {

		// Check type of element
		switch (item.type) {

			// Make notice elements
			case "notice":
				return <View
					style={this.style.feed.notice}>
					<View style={this.style.feed.noticeBackground}>
						<FontAwesomeIcon
							icon="chevron-up"
							size={this.layout.feed.notice.icon}
							color={this.colors.white}
						/>
					</View>
					<Text style={this.style.feed.noticeText}>
						{`published ${item.value} new posts`}
					</Text>
				</View>

			// Make threads
			case "thread":
				const { address, issue } = item
				const stale = this.feed.isStale(address, issue)
				return <Post
					address={address}
					index={index}
					currentIssue={this.getState("issue")}
					issue={issue}
					stale={stale}
					animator={this.animator}
					feedScroll={this.scroll}
				/>

			// Otherwise, return nothing
			default: return null

		}
	}


	header() {
		const pending = this.feed.pending
		const plural = (pending === 1) ? "" : "s"
		return (pending > 0) ?
			<TouchableOpacity
				key="feed-header"
				onPress={this.publish}
				style={this.style.feed.button}>
				<Text style={this.style.feed.buttonText}>
					{`${pending} new post${plural}`}
				</Text>
			</TouchableOpacity>
			:
			<Text style={this.style.feed.noticeText}>
				no new posts
			</Text>
	}


	footer() {
		return this.feed.backfilling ?
			<Spinner size={this.layout.feed.notice.spinner} /> :
			<Text style={this.style.feed.noticeText}>
				no more posts
			</Text>
	}

	empty() {
		return <View style={this.style.feed.spacer} />
	}

	spacer({ leadingItem }) {
		return <View
			key={`${leadingItem.key}-spacer`}
			style={this.style.feed.separator}
		/>
	}





// SCROLL

	scrollTo(index) {
		this.feedlist.current.scrollToIndex({
			index: index,
			viewPosition: 0.5
		})
	}




//RENDER

	render() {

		return <View style={this.style.core.inner}>

			<View style={this.style.core.header}>

				<Button
					containerStyle={this.style.core.headerButton}
					onPress={() => console.log("filter")}
					icon="filter"
					iconSize={this.layout.core.header.icon}
				/>

				<Button
					containerStyle={this.style.core.headerButton}
					onPress={() => console.log("to top")}
					icon="angle-up"
					iconSize={this.layout.core.header.icon}
				/>

			</View>

			<FlatList

				ref={this.feedlist}
				keyExtractor={this.keys}

				endFillColor={this.colors.neutral}

				ListHeaderComponent={this.header}
				ListHeaderComponentStyle={this.style.feed.notice}

				ListEmptyComponent={this.empty}

				ListFooterComponent={this.footer}
				ListFooterComponentStyle={this.style.feed.notice}

				ItemSeparatorComponent={this.spacer}

				data={this.feed.all}
				extraData={this.feed.pending}

				renderItem={this.thread}

				scrollEnabled={this.getState("scroll")}
				scrollsToTop={false}

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