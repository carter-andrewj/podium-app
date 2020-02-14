import { StyleSheet } from 'react-native';
import { computed, autorun } from 'mobx';


export default Style => class LinkStyle extends Style {


	constructor(...args) {

		super(...args)

		this.compileLink = this.compileLink.bind(this)
		autorun(this.compileLink)

	}


	compileLink() {

		// Unpack settings
		const { imageHeight, corners } = this.settings.link
		const height = Math.round(
			this.layout.button.normal.height +
			(this.layout.margin * 2.5) +
			this.layout.gauge.height
		)
		const image = Math.round(imageHeight * this.layout.screen.width)
		const corner = Math.round(image * this.settings.media.avatar.corner)

		// Extend layout
		this.layout.link = {
			height: height + image,
			body: {
				height: height,
				corners: {
					big: corner,
					small: Math.round(height * corners),
				},
				header: {
					height: this.layout.button.normal.height,
					icon: Math.round(this.layout.button.normal.height - (1.6 * this.layout.margin)),
					title: {
						width: Math.round(
							this.layout.post.body.width -
							(3.0 * this.layout.margin) -
							(2.0 * this.layout.button.normal.height)
						)
					}
				},
				footer: {
					height: this.layout.gauge.height,
					source: {
						width: Math.round(this.layout.post.body.width -
							this.layout.gauge.width - (0.5 * corner))
					}
				}
			},
			image: {
				height: image,
			},
		}

	}



	@computed
	get link() {
		return StyleSheet.create({

			container: {
				...this.container,
				alignSelf: "center",
				overflow: "hidden",
				...this.withWidth(this.layout.post.body.width),
				...this.withBorder(this.colors.neutralPale),
				backgroundColor: this.colors.white,
				borderRadius: this.layout.link.body.corners.small,
				borderBottomRightRadius: this.layout.link.body.corners.big,
				marginTop: this.layout.post.padding,
			},




			imageHolder: {
				...this.container,
				...this.withHeight(this.layout.link.image.height),
			},

			image: {
				width: this.layout.post.body.width - (2 * this.layout.border),
				height: this.layout.link.image.height,
			},

			overlay: {
				...this.row,
				...this.overlay,
				padding: this.layout.margin,
				alignItems: "flex-start",
			},

			overlayBackground: {
				...this.overlay,
				backgroundColor: this.colors.black,
				opacity: 0.85,
			},

			descriptionHolder: {
				...this.container,
				justifyContent: "flex-start",
				marginLeft: this.layout.margin,
			},

			description: {
				...this.text.body,
				color: this.colors.white,
				fontSize: this.font.size.smallest,
				lineHeight: this.font.size.smaller,
			},

			overlayButtonOn: {
				backgroundColor: "transparent",
				color: this.colors.white,
				marginBottom: Math.round(0.5 * this.layout.margin),
			},

			overlayButtonOff: {
				alignSelf: "flex-end",
				backgroundColor: "rgba(255,255,255,0.45)",
				color: this.colors.white,
				marginBottom: Math.round(0.5 * this.layout.margin),
			},




			body: {
				...this.container,
				...this.withHeight(this.layout.link.body.height),
				alignItems: "flex-start",
			},



			header: {
				...this.row,
				...this.withHeight(this.layout.link.body.header.height),
			},

			iconHolder: {
				...this.container,
				...this.withSize(this.layout.button.normal.height),
				marginLeft: Math.round(0.5 * this.layout.margin),
			},

			icon: {
				...this.withSize(this.layout.link.body.header.icon),
			},

			title: {
				...this.text.body,
				...this.withWidth(this.layout.link.body.header.title.width),
				fontSize: this.font.size.smallest,
				lineHeight: this.font.size.smaller,
			},

			toggle: {
				color: this.colors.neutralDark,
				marginRight: Math.round(0.5 * this.layout.margin),
			},



			footer: {
				...this.row,
				...this.withHeight(this.layout.link.body.footer.height),
				margin: Math.round(0.5 * this.layout.margin),
				marginLeft: this.layout.margin,
				marginRight: this.layout.margin,
				marginBottom: 0,
				justifyContent: "flex-start",
			},

			gauge: {
				marginTop: 0,
			},

			source: {
				...this.text.body,
				maxWidth: this.layout.link.body.footer.source.width,
				marginLeft: this.layout.margin,
				fontSize: this.font.size.smallest,
				lineHeight: this.layout.link.body.footer.height,
				color: this.colors.neutralDarkest,
			}

		})
	}


}