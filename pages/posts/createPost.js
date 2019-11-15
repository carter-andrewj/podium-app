import React from 'react';
import Page from '../../components/page';
import { View, ScrollView, Text, TextInput,
		 Image, Dimensions } from 'react-native';
import { inject, observer } from 'mobx-react';

import { List, Map, fromJS } from 'immutable';

import settings from '../../settings';
import styles from '../../styles/styles';

import SquareButton from '../../components/buttons/squareButton';
import Button from '../../components/buttons/button';







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

			// Post text
			postRaw: "",
			postRich: [],

			// Post references
			references: {},

			// Post cost
			cost: 0,

			// Tracking position
			cursor: -1,
			selected: null,
			atEnd: true,
			scrollLock: true,

			// Dimension scaling
			visibleHeight: Dimensions.get("window").height -
				styles.layout.mainHeader.minHeight,
			fullHeight: 0,
			bodyHeight: styles.post.bodyText.minHeight,
			contentHeight: styles.post.bodyText.minHeight +
				styles.post.bodyText.padding,
			referenceHeight: 0,

			// Loading state
			sending: false

		}

		this.mounted = true

		this.input = null
		this.scroll = null

		this.validationTimer = null
		this.searchTimer = null

		this.typePost = this.typePost.bind(this)
		this.clearPost = this.clearPost.bind(this)

		this.selectPost = this.selectPost.bind(this)
		this.getSelected = this.getSelected.bind(this)
		
		this.search = this.search.bind(this)

		this.validatePost = this.validatePost.bind(this)
		this.validateIdentity = this.validateIdentity.bind(this)
		this.validateTopic = this.validateTopic.bind(this)
		this.validatePod = this.validatePod.bind(this)
		this.validateURL = this.validateURL.bind(this)

		// this.canPost = this.canPost.bind(this)
		this.sendPost = this.sendPost.bind(this)

		this.savePost = this.savePost.bind(this)

		this.onKeyboard = this.onKeyboard.bind(this)
		this.resize = this.resize.bind(this)
		this.scrollToEnd = this.scrollToEnd.bind(this)

	}




// SETUP

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





// POST EDITING

	typePost(post) {

		// Stop pending validations
		clearTimeout(this.validationTimer)

		// Get pricing
		const costs = this.props.store.config.postCosts
		let cost = 0

		// Find urls
		const urls = post.match(settings.regex.url) || []

		// Get current references
		let newRef = false;
		let references = Map(this.state.references)
			.map(r => {
				r.active = false
				return r
			})

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

						// Calculate cost
						cost += text.length * costs.perCharacter

						// Add to output
						return {
							type: "text",
							content: text,
							cost: text.length * costs.perCharacter
						}

					})
					.interleave(List(tags)
						.map(tag => {

							// Calculate cost
							cost += costs.tag

							// Add to references
							if (references.get(tag)) {
								references = references
									.setIn([tag, "active"], true)
							} else {
								newRef = true
								references = references.set(tag, Map({
									type: tag.slice(0, 1),
									loading: false,
									valid: undefined,
									active: true
								}))
							}

							// Add to output
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

					// Calculate cost
					cost += costs.url

					// Add to references
					if (references.get(tag)) {
						references = references
							.setIn([tag, "active"], true)
					} else {
						newRef = true
						references = references.set(url, Map({
							type: "url",
							loading: false,
							valid: undefined,
							active: true
						}))
					}

					// Add to output
					return {
						type: "url",
						content: url,
						cost: costs.url
					}

				})
				.push(spacer)
			)
			.flatten()


		// Update cursor position
		const cursor = this.state.cursor + 1
		const selected = this.getSelected(formatted.toJS(), cursor)

		// Update state
		this.updateState(
			state => state
				.set("postRaw", post)
				.set("postRich", formatted)
				.set("cursor", cursor)
				.set("selected", selected)
				.set("cost", cost)
				.set("references", references),
			() => {
				if (newRef) {
					this.resize()
				} else {
					this.scrollToEnd()
				}
				this.validationTimer = setTimeout(this.validatePost, 1000)
			}
		)

	}


	// Remove all content from the post and start fresh
	clearPost() {
		this.updateState(state => state
			.set("postRaw", "")
			.set("postRich", [])
			.set("cursor", -1)
			.set("selected", null)
			.set("cost", 0)
			.set("references", {})
		)
	}





// SELECTION

	// Identify the current cursor position in the post
	// and, if applicable, the section of text selected
	selectPost(event) {

		// Get current and new cursor position
		const selection = event.nativeEvent.selection

		// Check if cursor is at end of input
		const atEnd = (this.state.postRaw.length) >= selection.end - 1

		// Identify selected content
		const selected = this.getSelected(this.state.postRich, selection.end)

		// Ignore cursor if content is selected
		if (selection.end === selection.start) {
			this.updateState(state => state
				.set("cursor", selection.end)
				.set("selected", selected)
				.set("atEnd", atEnd),
			)
		} else if (this.state.cursor !== -1) {
			this.updateState(state => state
				.set("cursor", -1)
				.set("selected", null)
				.set("atEnd", atEnd),
			)
		}

	}


	// Identify the current element of text selected
	getSelected(text, cursor) {

		// Adjust cursor location to identify previous
		// selection when at the end of an element (i.e.
		// in this example, we want to identify the
		// preceding @-tag as the selected item, not
		// the following space:
		//
		// "Post with @identity| included."
		//
		// where | = cursor
		cursor = cursor - 1

		// Find cursor, if no text selected
		let selected
		if (cursor >= 0) {
			let start = 0
			let end = 0
			let i = 0
			while (!selected && i < text.size) {

				// Get post section
				const current = text.get(i)

				// Ignore spacers
				if (current.content.length > 0) {

					// Locate start and end of post section
					start = end
					end = start + current.content.length

					// Check if cursor is within current
					if (cursor >= start && cursor < end) {

						// Set selection
						selected = current

					}

				}

				// Increment index
				i++

			}
		}

		// Check if a reference is selected
		if (selected && ["@", "#", "/"].includes(selected.type)) {

			// Trigger a search
			this.search(selected)

			// Return the selected content
			return selected

		// Otherwise, return nothing
		} else {
			return null
		}

	}





// SEARCH

	search(reference) {
		console.log("searching", reference)
	}




// VALIDATION

	// Validate any references in the post that have yet
	// to be validated
	validatePost() {

		// Identify references requiring validation
		let unvalidated = Map(this.state.references)
			.filter(r => r.valid === undefined && !r.loading)

		// Check if any validations are required
		if (unvalidated.size > 0) {

			// Update state
			this.updateState(

				// Track active validations
				state => state.update("references",
					refs => fromJS(refs).map((r, k) => r
						.update("loading", l => unvalidated.get(k) ? true : l)
					)
				),

				// Perform validations
				() => unvalidated.map((reference, text) => {

					// Perform validation
					new Promise(
						(resolve, reject) => { switch (reference.type) {

							// Validate mentions
							case "@":
								this.validateIdentity(text)
									.then(resolve)
									.catch(reject)
								break;

							// Validate topics
							case "#":
								this.validateTopic(text)
									.then(resolve)
									.catch(reject)
								break;

							// Validate groups
							case "/":
								this.validatePod(text)
									.then(resolve)
									.catch(reject)
								break;

							// Validate urls
							case "url":
								this.validateURL(text)
									.then(resolve)
									.catch(reject)
								break;

							// Reject unknown refs
							default: reject(new Error(
								`Unknown post reference type: ${reference.type}`
							))

						}})
						.then(result => this.updateState(state => state
							.setIn(["references", text, "loading"], false)
							.setIn(["references", text, "valid"], result)
						))
						.catch(console.error)
				
				})

			)

		}

	}


	validateIdentity(identity) {
		return new Promise((resolve, reject) => {
			this.props.store.users
				.is(identity.slice(1))
				.then(found => {

					// Return the result
					resolve(found)

					// If found, pre-emptively load the
					// user's profile data
					if (found) {
						this.props.store.users
							.add(found)
							.load("profile")
							.catch(console.error)
					}

				})
				.catch(reject)
		})
	}


	validateTopic(topic) {
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(true), 2000)
		})
	}


	validatePod(pod) {
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(true), 2000)
		})
	}


	validateURL(url) {
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(true), 2000)
		})
	}






// POST SUBMISSION

	get canPost() {

		// Can the user afford to post?
		return this.state.cost < this.props.store.session.user.pdmBalance

		// Are all post references valid?
			&& this.state.references
				.reduce((l, n) => l && (!n.active || n.valid), true)

		// Is the user under a sanction preventing them from posting?
			&& true

	}

	sendPost() {
		if (this.canPost) {
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
	}





// DRAFTS

	savePost() {
		console.log("saved to drafts")
	}






// LAYOUT CONTROL


	resize(event) {

		// Get visible height
		const screenHeight = Dimensions.get("window").height
		const footerHeight = styles.newPost.footer.minHeight
		const headerHeight = styles.layout.mainHeader.minHeight
		const viewHeight = screenHeight - headerHeight - footerHeight

		// Get content height
		const titleHeight = styles.post.header.minHeight
		const margin = styles.post.columnMiddle.margin
		const refHeight = styles.newPost.reference.minHeight *
			Map(this.state.references).filter(r => r.active).size

		// Calculate input height
		let inputHeight;
		if (event) {
			console.log(event.nativeEvent.contentSize.height)
			inputHeight = Math.round(event.nativeEvent.contentSize.height + (2 * margin) + 2)
		} else {
			inputHeight = this.state.inputHeight
		}

		// Calculate height
		let lock;
		let height;
		let bodyHeight = inputHeight + titleHeight
		const contentHeight = bodyHeight + refHeight
		if (contentHeight > viewHeight) {
			lock = false
			height = contentHeight
		} else {
			lock = true
			height = viewHeight
			inputHeight = Math.max(
				inputHeight,
				Math.round(viewHeight - titleHeight - refHeight - (2 * margin))
			)
			bodyHeight = inputHeight + titleHeight
			if (!this.state.scrollLock) {
				this.scroll.scrollTo({ y: 0 })
			}
		}

		// Set new minimum view height
		this.updateState(
			state => state
				.set("scrollLock", lock)
				.set("inputHeight", inputHeight)
				.set("bodyHeight", bodyHeight)
				.set("referenceHeight", refHeight)
				.set("fullHeight", height),
			this.scrollToEnd
		)

	}


	scrollToEnd() {
		if (!this.state.scrollLock && this.state.atEnd) {
			this.scroll.scrollTo({ y: this.state.bodyHeight})
		}
	}





// RENDER

	render() {
		return <KeyboardView
			onChange={this.onKeyboard}
			offset={styles.layout.mainHeader.minHeight}
			style={styles.newPost.container}>

			<ScrollView
				ref={ref => this.scroll = ref}
				contentContainerStyle={{
					minHeight: this.state.fullHeight,
					maxHeight: this.state.fullHeight,
				}}
				scrollEnabled={!this.state.scrollLock}
				showVerticalScrollIndicator={false}
				showHorizontalScrollIndicator={false}
				keyboardShouldPersistTaps="always"
				vertical={true}>

				<View style={[
						styles.post.columnMiddle,
						{
							minHeight: this.state.bodyHeight,
							maxHeight: this.state.bodyHeight,
						}
					]}>

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
										{
											minHeight: this.state.inputHeight,
											maxHeight: this.state.inputHeight,
										}
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
										{
											minHeight: this.state.inputHeight,
											maxHeight: this.state.inputHeight
										}
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

				<View style={[
						styles.newPost.referenceHolder,
						{
							minHeight: this.state.referenceHeight,
							maxHeight: this.state.referenceHeight,
						}
					]}>
					{Map(this.state.references)
						.filter(r => r.active)
						.map((reference, key) => {
							return <View
								key={key}
								style={styles.newPost.reference}>
								{reference.loading || reference.valid === undefined ?
									<Text>Loading...</Text>
								: reference.valid ?
									<Text>Found</Text>
								:
									<Text>Not found</Text>
								}
							</View>
						})
						.toList()
					}
				</View>

			</ScrollView>

			<View style={styles.newPost.footer}>

				<View style={styles.containerRow}>
					{this.state.selected ?
						<Text>
							Selected: {this.state.selected.content}
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



// CLEAN UP

	pageWillUnmount() {
		this.mounted = false
		clearTimeout(this.validationTimer)
		clearTimeout(this.searchTimer)
	}


}

export default CreatePost;