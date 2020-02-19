import React from 'react';
import { View, ScrollView, Text, TextInput, Image,
		 TouchableOpacity, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { inject, observer } from 'mobx-react';

import { List, Map, fromJS } from 'immutable';

import Page from '../../components/page';
import Screen from '../../components/screen';

import FadingView from '../../components/animated/fadingView';
import FadingIcon from '../../components/animated/fadingIcon';
import Spinner from '../../components/animated/spinner';
import SquareButton from '../../components/buttons/squareButton';
import Button from '../../components/buttons/button';

import Avatar from '../../components/media/avatar';
import Name from '../../components/display/name';
import Currency from '../../components/display/currency';

import Picture from '../../components/media/picture';
import Gallery from '../../components/media/gallery';












@inject("store")
@observer
class Compose extends Page {

	constructor() {

		super({

			// Post text
			postRaw: "",
			postRich: [],
			synced: true,

			// Post references
			references: {},
			media: List(),
			keyboard: true,
			searching: 0,
			results: Map(),

			// Post cost
			currency: "Podium",
			cost: 0,

			// Tracking position
			cursor: -1,
			selected: null,
			atEnd: true,
			scrollLock: true,

			// Dimension scaling
			rawHeight: 0,
			textHeight: undefined,
			contentHeight: undefined,

			// Loading state
			sending: false,

		})

		this.mounted = true

		this.input = null
		this.scroll = null

		this.referenceCount = 0
		this.validationTimer = null
		this.searchTimer = null

		this.typePost = this.typePost.bind(this)
		this.referencePost = this.referencePost.bind(this)
		this.clearPost = this.clearPost.bind(this)

		this.selectPost = this.selectPost.bind(this)
		this.getSelected = this.getSelected.bind(this)
		this.setSelected = this.setSelected.bind(this)

		this.search = this.search.bind(this)
		this.result = this.result.bind(this)
		this.resultKeys = this.resultKeys.bind(this)
		this.resultsHeader = this.resultsHeader.bind(this)
		this.resultsEmpty = this.resultsEmpty.bind(this)
		
		this.validatePost = this.validatePost.bind(this)
		this.validateAlias = this.validateAlias.bind(this)
		this.validateTopic = this.validateTopic.bind(this)
		this.validateDomain = this.validateDomain.bind(this)
		this.validateLink = this.validateLink.bind(this)

		this.createMedia = this.createMedia.bind(this)
		this.insertMedia = this.insertMedia.bind(this)
		this.insertGif = this.insertGif.bind(this)
		this.removeMedia = this.removeMedia.bind(this)

		// this.canPost = this.canPost.bind(this)
		this.send = this.send.bind(this)

		this.savePost = this.savePost.bind(this)

		this.resize = this.resize.bind(this)
		this.scrollToEnd = this.scrollToEnd.bind(this)

	}


	get pricing() {
		return this.nation.domain.tokens[this.getState("currency")].pricing
	}




// POST EDITING


	form(text, style, index, wrap=true) {
		return <Text
			key={`input-section-${index}`}
			style={style}
			numberOfLines={wrap ? undefined : 1}>
			{text}
		</Text>
	}

	urlForm(text, index) {
		return this.form(text, this.style.text.link, index)
	}

	tagForm(text, index) {
		switch (text.slice(0, 1)) {
			case "@": return this.form(text, this.style.text.mention, index, false)
			case "#": return this.form(text, this.style.text.topic, index, false)
			case "/": return this.form(text, this.style.text.domain, index, false)
			default: return this.textForm(text, index)
		}
	}

	textForm(text, index) {
		return this.form(text, this.style.text.body, index)
	}

	get spacer() {
		return {
			type: "text",
			content: "",
		}
	}


	typePost(post) {

		// Stop pending validations
		clearTimeout(this.referenceTimer)
		clearTimeout(this.validationTimer)

		// Store raw post output
		this.updateState(
			state => state
				.set("postRaw", post)
				.set("synced", false),
			() => this.referenceTimer = setTimeout(this.referencePost, 250)
		)

	}


	referencePost() {

		// Track active validations
		this.referenceCount = this.referenceCount + 1
		let thisReference = this.referenceCount

		// Get post text
		let post = this.getState("postRaw")
		let cost = 0

		// Ignore if post is empty
		if (!post || post.length === 0) {
			this.updateState(state => state.set("postRich", []))
			return
		}
		
		// Find urls
		const urls = post.match(this.config.regex.url) || []

		// Get current references
		let newRef = false
		let references = Map(this.getState("references"))
			.map(r => r.set("active", false))

		// Process rest of text
		const formatted = List(post.split(this.config.regex.url))
			.filter((u, i) => i === 0 || u.length > 0)
			.push("")
			.map(rest => {

				// Find tags
				const tags = rest.match(this.config.regex.tag) || []

				// Process rest of text
				return List(rest.split(this.config.regex.tag))
					.filter((t, i) => i === 0 || t.length > 0)
					.push("")
					.map(text => {

						// Calculate cost
						cost += text.length * this.pricing.character

						// Add to output
						return {
							type: "text",
							content: text,
							cost: text.length * this.pricing.character
						}

					})
					.interleave(List(tags)
						.map(tag => {

							// Calculate cost
							cost += this.pricing.reference

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
								cost: this.pricing.reference
							}

						})
						.push(this.spacer)
					)

			})
			.interleave(List(urls)
				.map(url => {

					// Calculate cost
					cost += this.pricing.link

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
						cost: this.pricing.link
					}

				})
				.push(this.spacer)
			)
			.flatten()

		// Update cursor position
		const cursor = this.getState("cursor") + 1
		const selected = this.getSelected(formatted.toJS(), cursor)

		// Check if a reference is selected
		let search = selected && ["@", "#", "/"].includes(selected.type)

		// Don't update if new validations have started
		if (this.referenceCount === thisReference) {

			// Update state
			this.updateState(
				state => state
					.set("synced", true)
					.set("postRich", formatted)
					.set("cursor", cursor)
					.set("selected", selected)
					.set("cost", cost)
					.set("references", references)
					.update("searching", s => s + 1),
				() => {

					// Resize if new references were found
					if (newRef) {
						this.resize()
					} else {
						this.scrollToEnd()
					}

					// Trigger search, if required
					if (search) this.search(selected)

					// Schedule validation
					this.validationTimer = setTimeout(this.validatePost, 1000)

				}
			)

			// Deceremement referencing counter
			this.referenceCount = this.referenceCount - 1

		}

	}


	// Remove all content from the post and start fresh
	clearPost() {
		this.updateState(state => state
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
	selectPost({ nativeEvent }) {

		// Get current and new cursor position
		const { start, end } = nativeEvent.selection

		// Check if cursor is at end of input
		const atEnd = (this.getState("postRaw").length) >= end - 1

		// Identify selected content
		const selected = this.getSelected(this.getState("postRich"), end)

		// Ignore cursor if content is selected
		if (end === start) {
			this.updateState(state => state
				.set("cursor", end)
				.set("selected", selected)
				.set("atEnd", atEnd),
			)
		} else if (this.getState("cursor") !== -1) {
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
		let i = 0
		let selected = null
		if (cursor > 0) {
			let start = 0
			let end = 0
			while (!selected && i < text.length) {

				// Ignore spacers
				if (text[i].content.length > 0) {

					// Locate start and end of post section
					start = end
					end = start + text[i].content.length

					// Select text block if cursor is within current bounds
					if (cursor > start && cursor <= end) {
						selected = text[i]
						selected.position = i
						selected.start = start
					}

				}

				// Increment index
				i++

			}
		} else if (cursor && text.length > 0) {
			selected = text[0]
			selected.position = 0
			selected.start = 0
		}

		// Return selected
		return selected

	}


	setSelected(text) {

		// Unpack current selection
		let { position, start, content } = this.getState("selected")
		let end = start + content.length

		// console.log(text, position, start, content)
		// let current = this.getState("postRaw")
		// console.log(current.substring(0, start) + text + current.substring(end, current.length))
		// let rich = this.getState("postRich")
		// let after = rich.setIn([position, "content"], text)
		// console.log(rich)
		// console.log(after)

		// Update post content
		this.updateState(state => state
			.update("postRaw", t => t.substring(0, start) + text + t.substring(end, t.length))
			.set("synced", false)
			.set("cursor", start + text.length),
			() => this.referenceTimer = setTimeout(this.referencePost, 250)
		)

	}




// QUICK SEARCH

	async search(reference) {

		// Get search term
		let term = reference.content.slice(1)

		// Ignore empty strings
		if (term.length > 0) {
			this.nation
				.search(term)
				.then(results => Promise.all(
					results.map(r => this.nation.get("user", r).whenReady())
				))
				.then(entities => this.updateState(state => state
					.update("searching", s => s - 1)
					.update("results", r => List(entities)
						.reduce((out, e) => out.set(e.address, e), r)
					)
				))
				.catch(console.error)
		}

	}


	get listResults() {
		return this.getState("results").valueSeq().toJS()
	}


	resultKeys(entity) {
		return `compose-result-${entity.address}`
	}


	result({ item, index }) {
		return <TouchableOpacity
			onPress={() => this.setSelected(item.label)}
			style={this.style.compose.result}>
			<Avatar
				user={item} 
				style={this.style.compose.resultAvatar}
				corner="left"
			/>
			<View style={this.style.compose.resultTitle}>
				<Text style={this.style.compose.resultName}>
					{item.name}
				</Text>
				<Text style={this.style.compose.resultAlias}>
					{item.label}
				</Text>
			</View>
		</TouchableOpacity>
	}



	resultsHeader() {
		let searching = this.getState("searching")
		return <View style={this.style.compose.resultHeader}>
			<FadingIcon
				icon="search"
				style={this.style.compose.resultsIcon}
				show={searching ? false : true}
			/>
			<Spinner
				style={this.style.compose.resultsIcon}
				show={searching ? true : false}
			/>
		</View>
	}


	resultsEmpty() {
		let selected = this.getState("selected")
		return <Text style={this.style.text.body}>
			{selected ?
				this.getState("searching") ?
					`searching for ${selected.content}` :
					`${selected.content} not found`
				: ""
			}
		</Text>
	}






// VALIDATION

	// Validate any references in the post that have yet
	// to be validated
	validatePost() {

		// Identify references requiring validation
		let unvalidated = Map(this.getState("references"))
			.filter(r => r.get("valid") === undefined
				&& !r.get("loading")
				&& r.get("active")
			)

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
						(resolve, reject) => { switch (reference.get("type")) {

							// Validate mentions
							case "@":
								this.validateAlias(text)
									.then(resolve)
									.catch(reject)
								break

							// Validate topics
							case "#":
								this.validateTopic(text)
									.then(resolve)
									.catch(reject)
								break

							// Validate groups
							case "/":
								this.validateDomain(text)
									.then(resolve)
									.catch(reject)
								break

							// Validate urls
							case "url":
								this.validateLink(text)
									.then(resolve)
									.catch(reject)
								break

							// Reject unknown refs
							default: reject(new Error(
								`Unknown post reference type: ${reference.get("type")}`
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


	validateAlias(alias) {
		return new Promise((resolve, reject) => {
			this.nation
				.find(alias.slice(1))
				.then(found => {

					// If found, pre-emptively load the
					// user's profile data
					if (found) this.nation.get("user", found)

					// Return the result
					resolve(found)

				})
				.catch(reject)
		})
	}


	validateTopic(topic) {
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(true), 2000)
		})
	}


	validateDomain(domain) {
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(true), 2000)
		})
	}


	validateLink(url) {
		return new Promise((resolve, reject) => {
			setTimeout(() => resolve(true), 2000)
		})
	}






// POST SUBMISSION

	get canPost() {

		return true

		// Is there content?
		// return this.getState("raw").length > 0

		// 	// Can the user afford to post?
		// 	&& this.getState("cost") < this.props.store.session.user.pdmBalance

		// 	// Are all post references valid?
		// 	&& this.getState("references")
		// 		.reduce((l, n) => l && (!n.active || n.valid), true)

		// 	// Is the user under a sanction preventing them from posting?
		// 	&& true

	}

	send() {
		if (this.canPost) {
			this.updateState(
				state => state.set("sending", true),
				() => {

					// Start sending post
					this.activeUser
						.post({
							text: this.getState("postRaw"),
							media: this.getState("media")
								.map(m => { return {
									base64: m.base64,
									type: m.uri.substring(m.uri.lastIndexOf(".") + 1)
								}})
						})
						.catch(console.error)

					// Navigate back
					this.updateState(
						state => state.set("sending", false),
						this.navigate.back
					)

				}	
			)
		}
	}





// DRAFTS

	savePost() {
		console.log("saved to drafts")
	}






// LAYOUT

	resize(event) {

		// Unpack native event
		let rawHeight
		if (event) {
			rawHeight = event.nativeEvent.contentSize.height
		} else {
			rawHeight = this.getState("rawHeight")
		}

		// Unpack layout
		const { height, padding } = this.layout.compose.content

		// Get text height
		let textHeight = Math.max(
			Math.ceil(rawHeight) + (2 * padding),
			height
		)

		// Get media height
		let mediaHeight = this.getState("media").size > 0 ?
			this.layout.compose.media.height : 0

		// Get post height
		let availableHeight = this.layout.visibleHeight.get() -
			this.layout.core.header.height -
			this.layout.compose.footer.height
		let contentHeight = textHeight + this.layout.post.header.height +
			(4 * this.layout.margin) + mediaHeight

		// Check if content is larger than bounds
		let scrollLock = availableHeight > contentHeight

		// Resize
		this.updateState(
			state => state
				.set("rawHeight", rawHeight)
				.set("contentHeight", contentHeight)
				.set("textHeight", textHeight)
				.set("scrollLock", scrollLock),
			this.scrollToEnd
		)

	}


	scrollToEnd() {
		if (!this.getState("scrollLock") && this.getState("atEnd")) {
			this.scroll.scrollTo({ y: this.getState("contentHeight") })
		}
	}





// MEDIA

	async createMedia() {
		console.log("camera")
	}

	async insertMedia() {

		// Allow keyboard to hide
		await new Promise(resolve => this.updateState(
			state => state.set("keyboard", false),
			resolve
		))

		// Hide keyboard
		this.input.blur()

		// Make closing function
		let done = result => {
			this.input.focus()
			this.updateState(
				state => state
					.set("keyboard", true)
					.update("media", m => result ? m.push(result) : m),
				result ? this.resize : null
			)
		}

		// Check permissions
		let permission = await this.store.permitCamera()

		// Return if permission denied
		// TODO - More messaging to the user in this case
		if (!permission) return done()

		// Pick image
		let { cancelled, base64, uri, exif } = await ImagePicker
			.launchImageLibraryAsync({
				mediaTypes: "Images",
				allowsEditing: true,
				base64: true,
			})
			.catch(this.setError)

		// Exit if no image selected
		if (cancelled) return done()

		// Otherwise, set image and resolve
		done({ uri, base64 })

	}


	removeMedia(_, index) {
		this.updateState(state => state.update("media", m => m.delete(index)))
	}


	async insertGif() {
		console.log("gif")
	}




// RENDER

	render() {
		return <View style={this.style.compose.body}>

			<View style={this.style.core.header}>

				<Button
					containerStyle={this.style.core.headerButton}
					onPress={() => this.props.navigator.back(1)}
					iconColor={this.colors.neutralDark}
					icon="trash-alt"
					iconSize={this.layout.core.header.icon}
				/>

				<Button
					containerStyle={this.style.core.headerButton}
					onPress={this.send}
					iconColor={this.colors.major}
					icon="comment-medical"
					iconSize={this.layout.core.header.icon}
				/>

			</View>

			<ScrollView
				ref={ref => this.scroll = ref}
				contentContainerStyle={{
					minHeight: this.getState("contentHeight"),
				}}
				scrollEnabled={!this.getState("scrollLock")}
				showVerticalScrollIndicator={false}
				showHorizontalScrollIndicator={false}
				keyboardShouldPersistTaps={this.getState("keyboard") ? "always" : "never"}
				vertical={true}>

				<View style={this.style.post.middle}>

					<View style={this.style.post.middleLeft}>
						<Avatar
							corner="right"
							user={this.activeUser}
							style={this.style.post.avatar}
						/>
					</View>

					<View style={this.style.post.middleCore}>


						<View style={this.style.post.header}>
							<Name withAlias user={this.activeUser} />
						</View>


						<View style={this.style.post.body}>


							<View style={this.style.compose.content}>

								<FadingView style={this.style.compose.costHolder}>
									<Currency
										delta={true}
										value={-10}
										style={this.style.compose.cost}
									/>
								</FadingView>

								<TextInput

									ref={ref => this.input = ref}
									key="new-post"

									placeholder="Say something..."
									value={this.getState("postRaw")}
									onChangeText={this.typePost}

									onSelectionChange={this.selectPost}
									onContentSizeChange={this.resize}

									style={{
										...this.style.compose.input,
										minHeight: this.getState("textHeight"),
									}}
									autoFocus={true}
									autoCorrect={true}
									autoCapitalize="sentences"
									multiline={true}

									onBlur={() => (this.input && this.getState("keyboard")) ?
										this.input.focus()
										: null
									}
									
									returnKeyType="none"
									keyboardType="twitter"

								/>

								<View
									pointerEvents="none"
									style={{
										...this.style.compose.output,
										minHeight: this.getState("textHeight"),
										opacity: this.getState("synced") ? 1.0 : 0.0,
									}}>
									<Text>
										{this.getState("postRich").map((f, i) => {
											switch (f.type) {
												case "text": return this.textForm(f.content, i)
												case "url": return this.urlForm(f.content, i)
												default: return this.tagForm(f.content, i)
											}
										})}
									</Text>
								</View>

							</View>


							<FadingView
								show={this.getState("media").length > 0}
								style={this.style.compose.galleryHolder}>

								<View style={this.style.compose.costHolder}>
									<Currency
										delta={true}
										value={-10}
										style={this.style.compose.cost}
									/>
								</View>

								<Gallery
									keyName="compose"
									media={this.getState("media")}
									overlay={this.removeMedia}
								/>

							</FadingView>


							<View style={this.style.compose.referenceHolder}>
								{Map(this.getState("links"))
									.map((link, key) => {
										return <FadingView
											key={key}
											show={link.active}
											style={this.style.compose.reference}>

											<View style={this.style.compose.costHolder}>
												<Currency
													delta={true}
													value={-10}
													style={this.style.compose.cost}
												/>
											</View>

											{link.loading || link.valid === undefined ?
												<Text>Loading...</Text>
											: link.valid ?
												<Text>Found</Text>
											:
												<Text>Not found</Text>
											}

										</FadingView>
									})
									.toList()
								}
							</View>


							<View style={this.style.compose.referenceHolder}>
								{Map(this.getState("references"))
									.map((reference, key) => {
										return <FadingView
											key={key}
											show={reference.active}
											style={this.style.compose.reference}>

											<View style={this.style.compose.costHolder}>
												<Currency
													delta={true}
													value={-10}
													style={this.style.compose.cost}
												/>
											</View>

											{reference.loading || reference.valid === undefined ?
												<Text>Loading...</Text>
											: reference.valid ?
												<Text>Found</Text>
											:
												<Text>Not found</Text>
											}

										</FadingView>
									})
									.toList()
								}
							</View>

						</View>

					</View>


					<View style={this.style.post.middleRight}>
							
						<View style={this.style.post.buttonHolder}>
							<SquareButton 
								icon="camera"
								onPress={this.createMedia}
							/>
							<SquareButton 
								icon="photo-video"
								onPress={this.insertMedia}
							/>
							<SquareButton
								icon="expand"
								label="gif"
								onPress={this.insertGif}
							/>
						</View>

					</View>

				</View>

			</ScrollView>

			<FadingView
				show={this.getState("selected")}
				style={this.style.compose.footer}>

				<FlatList

					ref={this.quickResults}
					keyExtractor={this.resultKeys}

					endFillColor={this.colors.white}

					ListHeaderComponent={this.resultsHeader}
					ListHeaderComponentStyle={this.style.compose.resultsHeader}

					ListEmptyComponent={this.resultsEmpty}

					ItemSeparatorComponent={this.resultSpacer}

					data={this.listResults}
					extraData={this.getState("searching")}

					renderItem={this.result}

					horizontal={true}
					maintainVisibleContentPosition={{
						minIndexForVisible: 0,
					}}
					directionalLockEnabled={true}

					keyboardShouldPersistTaps="handled"

				/>

			</FadingView>

		</View>

	}



// CLEAN UP

	pageWillUnmount() {
		this.mounted = false
		clearTimeout(this.validationTimer)
		clearTimeout(this.searchTimer)
	}


}

export default Compose;