import React from 'react';
import Page from '../../components/page';
import { View, Text, Image, ScrollView, FlatList } from 'react-native';

import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';

import Spinner from '../../components/animated/spinner';

import Avatar from '../../components/media/avatar';
import IntegrityGauge from '../../components/display/integrityGauge';
import AffinityGauge from '../../components/display/affinityGauge';

import Button from '../../components/buttons/button';
import FollowButton from '../../components/buttons/followButton';
import MentionButton from '../../components/buttons/mentionButton';
import ReportButton from '../../components/buttons/reportButton';
import MessageButton from '../../components/buttons/messageButton';

import CaptionButton from '../../components/buttons/captionButton';
import SquareButton from '../../components/buttons/squareButton';

import Post from '../posts/post';
import ProfileTab from './profileTab';




@inject("store")
@observer
class ProfilePage extends Page {

	constructor() {

		super({
			content: "posts",
			scroll: true
		})

		// Methods
		this.setContent = this.setContent.bind(this)

		this.empty = this.empty.bind(this)
		this.listKey = this.listKey.bind(this)
		this.listItem = this.listItem.bind(this)
		this.spacer = this.spacer.bind(this)
		this.footer = this.footer.bind(this)

	}


// GETTERS

	get user() {
		return this.nation.get("user", this.props.address || this.activeUser.address)
	}

	@computed
	get data() {
		switch (this.getState("content")) {
			case "followers": return this.user.followers.all
			case "following": return this.user.following.all
			default: return this.user.posts.all
		}
	}



// CONTENT SELECTION

	setContent(content) {
		this.updateState(state => state.set("content", content))
	}

	get scroll() {
		return {
			lock: () => this.updateState(state => state.set("scroll", false)),
			unlock: () => this.updateState(state => state.set("scroll", true)),
		}
	}




// RENDER

	empty() {

		// Show nothing while user is loading
		if (!this.user.ready) return <Spinner />

		// Return message
		switch (this.getState("content")) {

			// No followers
			case "followers": return <Text style={this.style.feed.noticeText}>
				{`${this.user.alias} has no followers`}
			</Text>

			// Following no one
			case "following": return <Text style={this.style.feed.noticeText}>
				{`${this.user.alias} does not follow anyone`}
			</Text>

			// Has not posted
			default: return <View style={this.style.profile.empty}>
				<Text style={this.style.feed.noticeText}>
					{`${this.user.alias} has not posted`}
				</Text>
			</View>

		}

	}


	listKey(address) {
		return `profile-${address}`
	}


	listItem({ item, index }) {

		switch (this.getState("content")) {

			// Posts
			case "posts": return <Post
				address={item}
				feedScroll={this.scroll}
			/>

			// Followers and Following
			default: return <ProfileTab
				address={item}
			/>

		}
	}


	spacer(_, index) {
		return <View
			key={`spacer-${index}`}
			style={this.style.feed.separator}
		/>
	}


	footer() {
		return <Image
			source={require("../../assets/glyph-white.png")}
			style={this.style.feed.glyph}
		/>
	}


	render() {
		return <View style={this.style.core.inner}>

			<View style={this.style.core.header}>

				<Button
					containerStyle={this.style.core.headerButton}
					onPress={() => this.props.navigator.back(1)}
					icon="arrow-left"
					iconSize={this.layout.core.header.icon}
				/>

				<Button
					containerStyle={this.style.core.headerButton}
					onPress={() => console.log("to top")}
					icon="angle-up"
					iconSize={this.layout.core.header.icon}
				/>

			</View>

			<View style={this.style.profile.header}>

				<View style={this.style.profile.top}>
				
					<View style={this.style.profile.left}>

						<View style={this.style.profile.title}>
							<Text style={this.style.profile.name}>
								{this.user.name}
							</Text>
							<Text style={this.style.profile.alias}>
								{this.user.alias}
							</Text>
						</View>

						<View style={this.style.profile.leftBody}>
							<Text style={this.style.profile.bio}>
								{this.user.about}
							</Text>
						</View>		

					</View>

					<View style={this.style.profile.right}>

						<View style={this.style.profile.rightBody}>
							<Avatar
								user={this.user}
								style={this.style.profile.avatar}
								corner="left"
							/>
							<View style={this.style.profile.gaugeHolder}>
								<IntegrityGauge
									user={this.user}
									style={this.style.profile.gauge}
								/>
								<AffinityGauge
									user={this.user}
									style={this.style.profile.gauge}
								/>
							</View>
						</View>

						<View style={this.style.profile.buttons}>
							<FollowButton user={this.user} />
							<MentionButton user={this.user} />
							<ReportButton subject={this.user} />
							<MessageButton user={this.user} />
						</View>

					</View>

				</View>

				<ScrollView
					horizontal
					directionalLockEnabled={true}
					contentContainerStyle={this.style.profile.contentControls}>

					<CaptionButton
						icon="comment"
						caption={this.user.postCount}
						onPress={() => this.setContent("posts")}
						color={this.getState("content") === "posts" ?
							this.colors.major :
							this.colors.neutral
						}
					/>

					<CaptionButton
						icon="eye"
						caption={this.user.followingCount}
						onPress={() => this.setContent("following")}
						color={this.getState("content") === "following" ?
							this.colors.major :
							this.colors.neutral
						}
					/>

					<CaptionButton
						icon="users"
						caption={this.user.followerCount}
						onPress={() => this.setContent("followers")}
						color={this.getState("content") === "followers" ?
							this.colors.major :
							this.colors.neutral
						}
					/>

				</ScrollView>

			</View>

			<FlatList

				ref={this.contentList}
				
				style={this.style.profile.list}
				endFillColor={this.colors.neutralDark}

				ListHeaderComponent={this.header}
				ListHeaderComponentStyle={this.style.feed.notice}

				ListEmptyComponent={this.empty}

				ListFooterComponent={this.footer}
				ListFooterComponentStyle={this.style.feed.notice}

				ItemSeparatorComponent={this.spacer}

				data={this.data}
				extraData={this.user.ready}
				initialNumToRender={5}
				keyExtractor={this.listKey}
				renderItem={this.listItem}

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

export default ProfilePage;