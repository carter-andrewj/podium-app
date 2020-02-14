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

import ExplainReportingLinks from './explainers/explainReportingLinks';


@inject("store")
@observer
export default class Link extends Component {

	constructor() {
		super({
			overlay: false,
			source: undefined,
			meta: {}
		})
		this.follow = this.follow.bind(this)
		this.overlay = new Animated.Value(0.0)
		this.toggleOverlay = this.toggleOverlay.bind(this)
	}



	follow(url) {
		return new Promise((resolve, reject) => {
			fetch(url, { redirect: "follow" })
				.then(response => {
					let chk = this.props.url.match(/huffp/g)
					if (chk) {
						console.log(response)
					}
					return response.text()
				})
				.then(resolve)
				.catch(reject)
		})
	}


	componentDidMount() {

		// Get source
		let source = this.props.url
			.replace(/(http(?:s?)\:\/\/(www.)?)/gi, "")
			.split("/")[0]

		// Resolve link
		this.follow(this.props.url)
			.then(html => {
				
				let chk = this.props.url.match(/huffp/g)
				if (chk) {
					console.log(html)
					console.log("\n\n")
				}

				// Sanitize html string
				html = html.replace(/\&amp;/g, "&")

				// Make metadata object
				let meta = {}

				// Extract HTML title
				let title = html.match(/((\<title>).+?(?=\<\/title\>))/gi)
				if (title) meta.title = HTML.decode(title[0].substring(7))

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

				// Store link metadata
				this.updateState(state => state
					.set("meta", meta)
					.set("source", source)
				)

			})
	}


	toggleOverlay() {
		this.updateState(
			state => state.update("overlay", x => !x),
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

		let title = meta.title || meta["og:title"] || meta['twitter:title']
		let description = meta.description || meta["og:description"]  || meta["twitter:description"]
		let thumbnail = meta.thumbnail || meta["og:image"] || meta["twitter:image"]
		let favicon = meta.favicon

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

				{thumbnail ? 
					<View style={this.style.link.imageHolder}>

						<Image
							style={this.style.link.image}
							source={{ uri: thumbnail }}
						/>

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
								<Text
									numberOfLines={lineCount}
									style={this.style.link.description}>
									{description || "(no description available)"}
								</Text>
							</View>

						</Animated.View>

					</View>
					:
					<View style={this.style.link.info}>

					</View>
				}

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
									style={this.style.link.icon}
								/>
							}
						</View>
						<Text
							numberOfLines={2}
							style={this.style.link.title}>
							{title ? title.split("|")[0] : this.props.url}
						</Text>
						<SquareButton
							icon="plus"
							onPress={this.toggleOverlay}
							style={{
								...this.style.link.toggle,
								transform: [{ rotate: rotate }]
							}}
						/>
					</View>

					<View style={this.style.link.footer}>
						{source ?
							<IntegrityGauge
								user={undefined}
								style={this.style.link.gauge}
							/>
							: undefined
						}
						<Text
							numberOfLines={1}
							style={this.style.link.source}>
							{source}
						</Text>
					</View>

				</View>

			</TouchableOpacity>
		</View>

	}

}