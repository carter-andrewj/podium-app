import React from 'react';
import Page from '../../utils/page';
import { View, ScrollView, Text, TextInput,
		 Image, Dimensions } from 'react-native';
import { inject, observer } from 'mobx-react';

import { List } from 'immutable';

import settings from '../../settings';
import styles from '../../styles/styles';

import KeyboardView from '../../components/keyboardView';
import SquareButton from '../../components/squareButton';
import Button from '../../components/button';







function form(text, style, index, wrap=true) {
	return <Text
		key={`input-section-${index}`}
		style={style}
		numberOfLines={wrap ? undefined : 1}>
		{text}
	</Text>
}

function urlForm(text, index) {
	return form(text, styles.newPost.url, index)
}

function tagForm(text, index) {
	switch (text.slice(0, 1)) {
		case "@": return form(text, styles.newPost.mention, index, false)
		case "#": return form(text, styles.newPost.topic, index, false)
		case "/": return form(text, styles.newPost.group, index, false)
		default: return textForm(text, index)
	}
}

function textForm(text, index) {
	return form(text, styles.newPost.text, index)
}

const spacer = {
	type: "text",
	content: "",
}




@inject("store")
@observer
class CreatePost extends Page {

	constructor() {

		super()

		this.state = {
			postRaw: "",
			postRich: [],
			cost: 0,
			cursor: -1,
			atEnd: true,
			scrollLock: true,
			visibleHeight: Dimensions.get("window").height,
			sending: false
		}

		this.input = null
		this.scroll = null

		this.typePost = this.typePost.bind(this)
		this.selectPost = this.selectPost.bind(this)
		this.sendPost = this.sendPost.bind(this)
		this.savePost = this.savePost.bind(this)
		this.clearPost = this.clearPost.bind(this)

		this.onKeyboard = this.onKeyboard.bind(this)
		this.resize = this.resize.bind(this)
		this.scrollToEnd = this.scrollToEnd.bind(this)

	}

	pageWillFocus() {
		this.props.screenProps.setBanner(
			"back",
			<Button
				key="banner-post-save"
				icon="save"
				onPress={this.savePost}
			/>,
			<Button
				key="banner-post-clear"
				icon="trash-alt"
				onPress={this.clearPost}
			/>,
			<Button
				key="banner-post-send"
				onPress={this.sendPost}
				style={styles.newPost.sendButton}
				color={settings.colors.major}
				round={true}
				icon="share"
				iconColor={settings.colors.white}
			/>
		)
	}

	typePost(post) {

		// Get pricing
		const costs = this.props.store.config.postCosts
		let cost = 0

		// Find urls
		const urls = post.match(settings.regex.url) || []

		// Process rest of text
		const formatted = List(post.split(settings.regex.url))
			.filter((u, i) => i === 0 || u.length > 0)
			.push("")
			.map(rest => {

				// Find tags
				const tags = rest.match(settings.regex.tag) || []

				// Process rest of text
				return List(rest.split(settings.regex.tag))
					.filter((t, i) => i === 0 || t.length > 0)
					.push("")
					.map(text => {
						cost += text.length * costs.perCharacter
						return {
							type: "text",
							content: text,
							cost: text.length * costs.perCharacter
						}
					})
					.interleave(List(tags)
						.map(tag => {
							cost += costs.tag
							return {
								type: tag.slice(0, 1),
								content: tag,
								cost: costs.tag
							}
						})
						.push(spacer)
					)

			})
			.interleave(List(urls)
				.map(url => {
					cost += costs.url
					return {
						type: "url",
						content: url,
						cost: costs.url
					}
				})
				.push(spacer)
			)
			.flatten()

		// Get cursor location
		const cursor = this.state.cursor - 1
		let selection

		// Find cursor, if no text selected
		if (cursor >= 0) {
			let start = 0
			let end = 0
			let i = 0
			while (!selection && i < formatted.size) {

				// Get post section
				const current = formatted.get(i)

				// Ignore spacers
				if (current.content.length > 0) {	

					// Locate start and end of post section
					start = end
					end = start + current.content.length

					// Check if cursor is within current
					if (cursor >= start && cursor < end) {
						selection = current
					}

				}

				// Increment index
				i++

			}
		}

		// Update state
		this.updateState(
			state => state
				.set("postRaw", post)
				.set("postRich", formatted)
				.set("selection", selection)
				.set("cost", cost),
			this.scrollToEnd
		)

	}


	selectPost(event) {

		// Get current and new cursor position
		const selection = event.nativeEvent.selection

		// Check if cursor is at end of input
		const atEnd = (this.state.postRaw.length + 1) === selection.end

		// Ignore cursor if content is selected
		if (selection.end === selection.start) {
			this.updateState(
				state => state
					.set("cursor", selection.end)
					.set("atEnd", atEnd),
				() => this.typePost(this.state.postRaw)
			)
		} else if (this.state.cursor !== -1) {
			this.updateState(
				state => state
					.set("cursor", -1)
					.set("atEnd", atEnd),
				() => this.typePost(this.state.postRaw)
			)
		}

	}


	sendPost() {
		this.updateState(
			state => state.set("sending", true),
			() => this.props.store.session
				.sendPost({
					text: this.state.postRaw,
					references: {},
					media: {},
					parent: this.props.parent
				})
				.then(() => this.updateState(
					state => state.set("sending", false),
					() => this.props.navigation.goBack(null)
				))
				.catch(console.error)
		)
	}

	savePost() {
		console.log("saved to drafts")
	}

	clearPost() {
		this.updateState(state => state
			.set("postRaw", "")
			.set("postRich", [])
			.set("cursor", -1)
			.set("cost", 0)
		)
	}



	onKeyboard(height) {
		this.updateState(state => state
			.set("visibleHeight", height)
		)
	}

	resize({ nativeEvent }) {

		// Get height of components
		const view = this.state.visibleHeight
		const header = styles.post.header.minHeight
		const footer = styles.newPost.footer.minHeight
		const margin = styles.post.columnMiddle.margin
		const input = nativeEvent.contentSize.height + (2.0 * margin)

		// Calculate height
		let lock;
		let height;
		const textHeight = input + header + (2.0 * margin)
		const viewHeight = view - footer
		if (textHeight > viewHeight) {
			lock = false
			height = textHeight
		} else {
			lock = true
			height = viewHeight
			if (!this.state.scrollLock) {
				this.scroll.scrollTo({ y: 0 })
			}
		}

		// Set new minimum view height
		this.updateState(
			state => state
				.set("scrollLock", lock)
				.set("content", input)
				.set("height", height),
			this.scrollToEnd
		)

	}


	scrollToEnd() {
		if (!this.state.scrollLock && this.state.atEnd) {
			this.scroll.scrollToEnd()
		}
	}



	render() {

		const selection = this.state.selection

		return <KeyboardView
			onChange={this.onKeyboard}
			offset={styles.layout.mainHeader.minHeight}
			style={styles.newPost.container}>

			<ScrollView
				ref={ref => this.scroll = ref}
				contentContainerStyle={{
					minHeight: this.state.height,
					maxHeight: this.state.height,
				}}
				scrollEnabled={!this.state.scrollLock}
				showVerticalScrollIndicator={false}
				showHorizontalScrollIndicator={false}
				keyboardDismissMode="on-drag"
				keyboardShouldPersistTaps="handled"
				vertical={true}>

				<View style={styles.post.columnMiddle}>

					<View style={styles.post.coreLeft}>
						<View style={styles.post.profilePictureHolder}>
							<Image
								style={styles.post.profilePicture}
								source={this.props.store.session.user.picture}
							/>
						</View>
					</View>

					<View style={styles.post.core}>


						<View style={styles.post.header}>

							<View style={styles.post.title}>
								<Text style={styles.post.authorName}>
									{this.props.store.session.user.name}
								</Text>
								<Text style={styles.post.authorRest}>
									{this.props.store.session.user.identity}
								</Text>
							</View>

							<View style={styles.post.reactionHolder}>
							</View>

						</View>


						<View style={styles.post.body}>

							<View style={styles.newPost.content}>

								<View style={[
										styles.newPost.output,
										{ minHeight: this.state.content }
									]}>
									<Text>
										{this.state.postRich.map((f, i) => {
											switch (f.type) {
												case "text": return textForm(f.content, i)
												case "url": return urlForm(f.content, i)
												default: return tagForm(f.content, i)
											}
										})}
									</Text>
								</View>

								<TextInput

									ref={ref => this.input = ref}
									key="new-post"

									placeholder="Say something..."
									value={this.state.postRaw}
									onChangeText={this.typePost}

									onSelectionChange={this.selectPost}
									onContentSizeChange={this.resize}

									style={[
										styles.newPost.input,
										{ minHeight: this.state.content }
									]}
									autoFocus={true}
									autoCorrect={true}
									autoCapitalize="sentences"
									multiline={true}

									onBlur={() => this.input.focus()}
									
									returnKeyType="none"
									keyboardType="twitter"

								/>

							</View>


							<View style={styles.post.coreRight}>
						
								<View style={styles.post.buttonHolder}>
									<SquareButton 
										icon="photo-video"
										size={1.6}
										color={settings.colors.neutral}
										background={settings.colors.white}
										onPress={() => console.log("insert media")}
									/>
								</View>

							</View>

						</View>

					</View>

				</View>

			</ScrollView>

			<View style={styles.newPost.footer}>

				<View style={styles.containerRow}>
					{(selection && selection.type !== "text") ?
						<Text>
							Selected: {selection.content}
						</Text>
					: this.state.sending ?
						<Text>
							Sending...
						</Text>
					:
						<Text>
							Cost: {this.state.cost}
						</Text>
					}
				</View>

			</View>

		</KeyboardView>

	}


}

export default CreatePost;