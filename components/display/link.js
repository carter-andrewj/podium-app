import React from 'react';
import Component from '../component';
import { View, Text, Image, TouchableOpacity,
		 Linking, Animated, Easing } from 'react-native';
import { inject, observer } from 'mobx-react';
import { FontAwesomeIcon } from 'expo-fontawesome';
import { Html5Entities as HTML } from 'html-entities';

import FadingView from '../animated/fadingView';
import IntegrityGauge from './integrityGauge';
import SquareButton from '../buttons/squareButton';
import Spinner from '../animated/spinner';

import ExplainReportingLinks from './explainers/explainReportingLinks';


@inject("store")
@observer
export default class Link extends Component {

	constructor() {

		// State
		super({

			overlay: true,
			lock: false,

			loaded: false,
			source: undefined,
			meta: {},
			display: {}

		})

		// Methods
		this.getSource = this.getSource.bind(this)
		this.followURL = this.followURL.bind(this)
		this.getMeta = this.getMeta.bind(this)
		
		this.toggleOverlay = this.toggleOverlay.bind(this)

		// Animations
		this.overlay = new Animated.Value(1.0)

	}


	componentDidMount() {
		this.getSource()
	}


	getSource() {

		// Get source
		let source = this.props.url
			.replace(/(http(?:s?)\:\/\/(www.)?)/gi, "")
			.split("/")[0]

		// Store source and follow url
		this.updateState(
			state => state.set("source", source),
			() => this.followURL(0)
		)

	}


	followURL(attempt) {

		// Fetch data from url
		fetch(this.props.url, { redirect: "follow" })

			// Unpack response
			.then(response => response.text())

			// Extract metadata
			.then(this.getMeta)

			// Handle errors
			.catch(error => {

				// Retry on lost connection
				if (error.message === "Network request failed")
					return this.followURL(attempt + 1)

				// Otherwise, throw the error
				throw error

			})

	}


	getMeta(html) {

		// Sanitize html string
		html = html.replace(/\&amp;/g, "&")

		// Make metadata object
		let meta = {}

		// Extract HTML title
		let pageTitle = html.match(/((\<title>).+?(?=\<\/title\>))/gi)
		if (pageTitle) meta.title = HTML.decode(pageTitle[0].substring(7))

		// Extract HTML favicon
		let links = html.match(/((\<link ).+?(?=\>))/gi)
		if (links.length > 0) {
			links.map(link => {
				let rels = link.match(/(( rel\=\").+?(?=\"))/gi)
				let hrefs = link.match(/(( href\=\").+?(?=\"))/gi)
				if (rels && hrefs) {
					let rel = rels[0].substring(6).replace(/\s/g, "")
				 	if (["icon", "shortcuticon", "iconshortcut"].indexOf(rel) >= 0) {
						let href = hrefs[0].substring(7)
						if (href.charAt(0) === "/") {
							meta["favicon"] = `https://${source}${href}`
						} else {
							meta["favicon"] = href
						}
					}
				}
			})
		}

		// Extract HTML meta tags
		let tags = html.match(/((\<meta ).+?(?=\>))/gi)
		if (tags.length > 0) {
			tags.map(tag => {
				let name = tag.match(/(( name\=\").+?(?=\"))/gi)
				let prop = tag.match(/(( property\=\").+?(?=\"))/gi)
				if (name || prop) {
					key = name ? name[0].substring(7) : prop[0].substring(11)
					let content = tag.match(/(( content\=\").+?(?=\"))/gi)
					if (content) meta[key] = HTML.decode(content[0].substring(10))
				}
			})
		}

		// Derive presentation
		let title = meta.title || meta["og:title"] || meta['twitter:title']
		let description = meta.description || meta["og:description"]  || meta["twitter:description"]
		let thumbnail = meta.thumbnail || meta["og:image"] || meta["twitter:image"]
		let favicon = meta.favicon

		// Store link metadata
		this.updateState(

			// Set display data
			state => state
				.set("loaded", true)
				.set("lock", thumbnail ? false : true)
				.set("meta", meta)
				.set("display", {
					title,
					description,
					thumbnail,
					favicon
				}),

			// Hide overlay if image found
			() => thumbnail ?
				this.toggleOverlay() :
				this.lockOverlay()

		)

	}





	toggleOverlay() {
		this.updateState(

			// Save state
			state => state.update("overlay", x => !x),

			// Animate in/out
			() => Animated
				.timing(this.overlay, {
					toValue: this.getState("overlay") ? 1.0 : 0.0,
					duration: this.timing.fade,
					easing: Easing.linear
				})
				.start()

		)
	}







	get explain() {
		return {
			reportingLinks: () => this.mask(<ExplainReportingLinks/>)
		}
	}


	render() {

		let source = this.getState("source")
		let meta = this.getState("meta")
		let locked = this.getState("locked")

		let { title, description, thumbnail, favicon } = this.getState("display")

		let rotate = this.overlay.interpolate({
			inputRange: [0.0, 1.0],
			outputRange: ["0deg", "45deg"]
		})

		let lineCount = Math.floor(this.style.link.imageHolder.minHeight /
			this.style.link.description.lineHeight)

		return <View style={this.style.link.container}>
			<TouchableOpacity
				onPress={() => Linking.openURL(this.props.url)}
				style={this.style.container}>

				<View style={this.style.link.imageHolder}>

					{thumbnail ? 
						<Image
							style={this.style.link.image}
							source={{ uri: thumbnail }}
						/>
						:
						null
					}

					<Animated.View style={{
							...this.style.link.overlay,
							opacity: this.overlay
						}}>

						<View style={this.style.link.overlayBackground} />

						<View style={this.style.link.buttonHolder}>
							<SquareButton
								icon="exclamation-triangle"
								onPress={this.explain.reportingLinks}
								style={this.style.link.overlayButtonOn}
							/>
							<SquareButton
								icon="quote-right"
								onPress={() => console.log("QUOTE LINK")}
								style={this.style.link.overlayButtonOn}
							/>
							<SquareButton
								icon="newspaper"
								onPress={() => console.log("SOURCE")}
								style={this.style.link.overlayButtonOn}
							/>
						</View>

						<View style={this.style.link.descriptionHolder}>
							{this.getState("loaded") ? 
								<Text
									numberOfLines={lineCount || 1}
									style={this.style.link.description}>
									{description || "(no description available)"}
								</Text>
								:
								<Spinner size={this.font.size.huge} />
							}
						</View>

					</Animated.View>

				</View>

				<View style={this.style.link.body}>

					<View style={this.style.link.header}>

						<View style={this.style.link.iconHolder}>
							{favicon ?
								<Image
									source={{ uri: favicon }}
									style={this.style.link.icon}
								/>
								:
								<FontAwesomeIcon
									icon="link"
									color={this.colors.neutralDarkest}
									style={this.style.link.icon}
								/>
							}
						</View>

						<Text
							numberOfLines={title ? 2 : 1}
							ellipsizeMode={title ? undefined : "tail"}
							style={(!title || locked) ?
								this.style.link.titleFull :
								this.style.link.title
							}>
							{title ? title : this.props.url}
						</Text>

						{(title && !locked) ?
							<SquareButton
								icon="plus"
								onPress={this.toggleOverlay}
								style={{
									...this.style.link.toggle,
									transform: [{ rotate: rotate }]
								}}
							/>
							: null
						}

					</View>

					<View style={this.style.link.footer}>
						<IntegrityGauge
							user={undefined}
							style={this.style.link.gauge}
						/>
						<Text
							numberOfLines={1}
							style={this.style.link.source}>
							{source || this.props.url}
						</Text>
					</View>

				</View>

			</TouchableOpacity>
		</View>

	}

}