import { StyleSheet } from 'react-native';
import { computed, autorun } from 'mobx';


export default Style => class MenuStyle extends Style {


	constructor(...args) {

		super(...args)

		this.compileMenu = this.compileMenu.bind(this)
		autorun(this.compileMenu)

	}


	compileMenu() {

		// Extend layout
		const { headerHeight, buttonSpacing } = this.settings.menu
		const header = Math.round(this.layout.screen.width * headerHeight)
		const avatarSize = header - (2.0 * this.layout.screen.padding)
		const sectionHeight = this.layout.button.large.height + this.font.size.small + 
			this.layout.margin + (2 * this.layout.screen.padding)
		const sectionWidth = this.layout.core.drawer.width - (2.0 * this.layout.screen.padding)
		const buttonSpace = Math.round(buttonSpacing * this.layout.screen.width)

		this.layout.menu = {
			header: {
				height: header,
				name: this.font.size.normal,
				alias: this.font.size.smaller,
				bio: this.font.size.smallest,
				avatar: avatarSize,
			},
			section: {
				width: sectionWidth,
				single: sectionHeight,
				double: sectionHeight + this.layout.margin + this.layout.button.large.height
			},
			buttons: {
				spacing: Math.round(buttonSpacing * this.layout.screen.width),
				width: Math.round(0.5 * (sectionWidth - buttonSpace)),
			},
		}

	}


	@computed
	get menu() {

		const section = {
			...this.container,
			justifyContent: "flex-start",
			...this.withWidth(this.layout.menu.section.width),
			paddingBottom: (2 * this.layout.screen.padding),
		}

		return StyleSheet.create({

			body: {
				...this.container,
				backgroundColor: this.colors.white,
				padding: this.layout.screen.padding,
			},



			header: {
				...this.row,
				alignItems: "flex-start",
				justifyContent: "flex-start",
				...this.withHeight(this.layout.menu.header.height),
			},

			avatar: {
				...this.container,
				...this.withSize(this.layout.menu.header.avatar),
				marginBottom: this.layout.screen.padding,
			},

			profile: {
				...this.container,
				justifyContent: "flex-start",
				paddingLeft: this.layout.margin,
			},

			name: {
				...this.text.name,
				fontSize: this.layout.menu.header.name,
				width: "100%",
			},

			alias: {
				...this.text.alias,
				fontSize: this.layout.menu.header.alias,
				width: "100%",
			},

			bio: {
				...this.text.paragraph,
				fontSize: this.layout.menu.header.bio,
				width: "100%",
				paddingTop: this.layout.margin,
			},




			section: {
				...section,
				...this.withHeight(this.layout.menu.section.single),
			},

			sectionDouble: {
				...section,
				...this.withHeight(this.layout.menu.section.double),
			},

			headingHolder: {
				...this.container,
				...this.withWidth(this.layout.menu.section.width),
				...this.withHeight(this.font.size.small),
				...this.withBorder(this.colors.neutralDark, "Bottom")
			},

			heading: {
				...this.text.title,
				width: "100%",
				color: this.colors.neutralDark,
				textTransform: "uppercase",
				fontSize: this.font.size.smaller,
				textAlign: "left",
			},

			buttonHolder: {
				...this.container,
				paddingBottom: 100,
			},

			buttonPair: {
				...this.row,
				justifyContent: "space-between",
				...this.withWidth(this.layout.menu.section.width),
				...this.withHeight(this.layout.button.large.height),
				marginTop: this.layout.margin,
			},


			footer: {
				...this.row,
				...this.withWidth(this.layout.menu.section.width),
				...this.withHeight(this.layout.button.large.height),
				justifyContent: "space-evenly",
				alignSelf: "flex-end",
			}



		})
	}


	// Menu button style
	@computed
	get menuButton() {
		return StyleSheet.create({

			// View container for the menu buttons
			container: {
				...this.row,
				...this.withHeight(this.layout.button.large.height),
				maxWidth: this.layout.menu.buttons.width,
			},

			pair: {
				...this.withWidth(this.layout.menu.buttons.width),
			},

			group: {
				minWidth: this.layout.button.large.height
			},

			// Icon on each button
			icon: {
				...this.container,
				...this.withSize(this.layout.button.large.height),
			},

			// Text below the icon on each button
			title: {
				...this.text.title,
				fontSize: this.font.size.tiny,
				lineHeight: this.font.size.small,
				color: this.colors.neutralDarkest,
				textAlign: "center",
			},

			// Container for text next to each icon
			// (i.e. number of followers, etc...)
			caption: {
				...this.container,
			},

			// Text in each caption
			text: {
				...this.text.body,
				width: "100%",
				padding: 0,
				paddingLeft: this.layout.margin,
				paddingRight: this.layout.margin,
				paddingBottom: this.font.size.tiniest,
				textAlign: "left",
			},

		})
	}


}