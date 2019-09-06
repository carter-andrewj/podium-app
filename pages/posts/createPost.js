import React from 'react';
import Page from '../../utils/page';
import { View, ScrollView, Text, TextInput, Image } from 'react-native';
import { inject, observer } from 'mobx-react';

import { List } from 'immutable';

import settings from '../../settings';
import styles from '../../styles/styles';

import Button from '../../components/button';







let i = 0

function form(text, style) {
	i = i + 1
	return <Text key={i} style={style}>
		{text}
	</Text>
}

function urlForm(text) {
	return form(text, styles.newPost.url)
}

function tagForm(text) {
	switch (text.slice(0, 1)) {
		case "@": return form(text, styles.newPost.mention)
		case "#": return form(text, styles.newPost.topic)
		case "/": return form(text, styles.newPost.group)
		default: return textForm(text)
	}
}

function textForm(text) {
	return form(text, styles.newPost.text)
}

const spacer = {
	type: "text",
	content: "",
	element: textForm("")
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
			scrollLock: true
		}

		this.input = null
		this.scroll = null

		this.scrollTimer = undefined

		this.typePost = this.typePost.bind(this)
		this.selectPost = this.selectPost.bind(this)
		this.sendPost = this.sendPost.bind(this)
		this.savePost = this.savePost.bind(this)
		this.clearPost = this.clearPost.bind(this)

		this.resize = this.resize.bind(this)

	}

	pageWillFocus() {
		this.props.screenProps.setBanner(
			"back",
			<Button
				key="banner-save"
				icon="save"
				onPress={this.savePost}
			/>,
			<Button
				key="banner-clear"
				icon="trash-alt"
				onPress={this.clearPost}
			/>,
			<Button
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
							element: textForm(text),
							cost: text.length * costs.perCharacter
						}
					})
					.interleave(List(tags)
						.map(tag => {
							cost += costs.tag
							return {
								type: tag.slice(0, 1),
								content: tag,
								element: tagForm(tag),
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
						element: urlForm(url),
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
			this.state.atEnd ?
				() => this.scroll.scrollToEnd()
				: null
		)

	}

	checkPost(event) {
		console.log(event)
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
		console.log(this.state.post)
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



	resize({ nativeEvent }) {

		// Get height of components
		const view = styles.keyboard.aboveWithHeaderWithAuto.minHeight
		const header = styles.post.header.minHeight
		const footer = styles.newPost.footer.minHeight
		const margin = styles.post.columnMiddle.margin
		const input = nativeEvent.contentSize.height + (2.0 * margin)

		// Calculate height
		let lock;
		let height;
		const textHeight = input + header + (2.0 * margin)
		const viewHeight = view - footer - margin
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
		clearTimeout(this.scrollTimer)
		this.updateState(

			// Update state with new dimensions
			state => state
				.set("scrollLock", lock)
				.set("content", input)
				.set("height", height),

			// Update scroll, if at end of input
			this.state.atEnd ?
				() => this.scrollTimer = setTimeout(
					() => this.scroll.scrollToEnd(),
					5
				)
				: null

		)

	}


	render() {

		const selection = this.state.selection

		return <View style={styles.container}>

			<View style={[
					styles.keyboard.aboveWithHeaderWithAuto,
					styles.newPost.container
				]}>

				<ScrollView
					ref={ref => this.scroll = ref}
					contentContainerStyle={{
						minHeight: this.state.height,
						maxHeight: this.state.height,
					}}
					scrollEnabled={!this.state.scrollLock}
					showVerticalScrollIndicator={false}
					vertical={true}>

					<View style={styles.post.columnMiddle}>

						<View style={styles.post.coreLeft}>
							<View style={styles.post.profilePictureHolder}>
								<Image
									style={styles.post.profilePicture}
									source={require("../../assets/profile-placeholder.png")}
								/>
							</View>
						</View>

						<View style={styles.post.core}>


							<View style={styles.post.header}>

								<View style={styles.post.title}>
									<Text style={styles.post.authorName}>
										Username
									</Text>
									<Text style={styles.post.authorRest}>
										@identity
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
											{this.state.postRich.map(f => f.element)}
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
										<View style={styles.post.button}>
											<Text style={styles.post.counter}>
												0
											</Text>
										</View>
										<Button 
											style={styles.post.button}
											icon="bullhorn"
											iconSize={20}
											color={settings.colors.white}
											onPress={() => console.log("promote")}
										/>
									</View>

									<View style={styles.post.buttonHolder}>
										<View style={styles.post.button}>
											<Text style={styles.post.counter}>
												0
											</Text>
										</View>
										<Button
											style={styles.post.button}
											icon="reply"
											iconSize={20}
											color={settings.colors.white}
											onPress={() => console.log("reply")}
										/>
									</View>

								</View>

							</View>

						</View>

					</View>

				</ScrollView>

				<View
					ref="footer"
					style={styles.newPost.footer}>

					{(selection && selection.type !== "text") ?
						<View style={styles.containerRow}>
							<Text>
								Selected: {selection.content}
							</Text>
						</View>
						:
						<View style={styles.containerRow}>
							<Text>
								Cost: {this.state.cost}
							</Text>
						</View>
					}

				</View>

			</View>

			<View style={styles.keyboard.belowWithAuto} />

		</View>
	}


	pageWillMount() {
		clearTimeout(this.scrollTimer)
	}

}

export default CreatePost;