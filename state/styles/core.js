import { StyleSheet } from 'react-native';
import { computed, autorun } from 'mobx';


export default Style => class CoreStyle extends Style {


	constructor(...args) {

		super(...args)

		this.compileCore = this.compileCore.bind(this)
		autorun(this.compileCore)

	}


	compileCore() {

		// Unpack config
		const { headerHeight, footerHeight, drawerWidth, icons } = this.settings.core
		const coreHeaderHeight = Math.round(this.layout.screen.width * headerHeight)
		const coreFooterHeight = Math.round(this.layout.screen.width * footerHeight)
		const coreDrawerWidth = Math.round(this.layout.screen.width * drawerWidth)

		// Extend layout
		this.layout.core = {
			header: {
				height: coreHeaderHeight,
			},
			footer: {
				height: coreFooterHeight,
				icons: {
					small: this.layout.button.normal.iconSize * icons.small,
					medium: this.layout.button.normal.iconSize * icons.medium,
					large: this.layout.button.normal.iconSize * icons.large,
				},
			},
			content: {
				height: this.layout.screen.height - coreFooterHeight - coreHeaderHeight,
			},
			drawer: {
				width: coreDrawerWidth,
				height: this.layout.screen.width - coreFooterHeight,
				buffer: this.layout.screen.width - coreDrawerWidth,
			},
		}

	}


	// Core layout
	@computed
	get core() {
		return StyleSheet.create({

			// Main screen
			body: {
				...this.container,
			},

			// Page control header,
			header: {
				...this.row,
				justifyContent: "space-between",
				...this.withHeight(this.layout.core.header.height),
				...this.withWidth(this.layout.screen.width),
				paddingLeft: this.layout.margin,
				paddingRight: this.layout.margin,
				backgroundColor: this.colors.white,
				...this.withBorder(this.colors.neutralPale, "Bottom")
			},

			headerButton: {
				...this.container,
				...this.withSize(this.layout.core.header.height),
			},

			// Content above navigation footer
			content: {
				...this.container,
				...this.withWidth(this.layout.screen.width),
			},

			// Content overlay for (e.g.) task bar
			overlay: {
				...this.overlay,
				justifyContent: "flex-end",
			},

			// Wrapper for content pages
			inner: {
				...this.container,
				...this.overlay,
				backgroundColor: this.colors.neutral,
			},

			// Navigation footer
			footer: {
				...this.row,
				...this.withHeight(this.layout.core.footer.height),
				alignContent: "stretch",
				paddingLeft: this.layout.margin,
				paddingRight: this.layout.margin,
				...this.withBorder(this.colors.neutralPale, "Top"),
				backgroundColor: this.colors.white
			},

			// Button inside navigation footer
			navigationButton: {
				...this.container,
				alignSelf: "stretch"
			},

		})
	}


	@computed
	get drawer() {
		return StyleSheet.create({

			// Main drawer element
			body: {
				...this.row,
				position: "absolute",
				top: 0,
				bottom: 0,
				...this.withWidth(this.layout.screen.width),
			},

			// Visible area inside drawer
			inner: {
				...this.container,
				...this.withWidth(this.layout.screen.width),
				backgroundColor: this.colors.white,
				...this.withBorder(this.colors.neutralPale),
				borderBottomWidth: 0,
			},

			// Wrapper for drawer content
			content: {
				...this.container,
				padding: this.layout.screen.padding,
			},

			// Transparent buffer at the edge of draw
			// (overlays background content, tapping
			//  this closes the drawer)
			buffer: {
				...this.container,
				...this.withWidth(this.layout.core.drawer.buffer),
			},

		})
	}


	@computed
	get mask() {
		return StyleSheet.create({

			// Full screen container
			container: {
				...this.container,
				...this.overlay,
			},

			// Black, semi-opaque background
			backdrop: {
				...this.overlay,
				backgroundColor: this.colors.black,
				opacity: 0.85
			},

			// Content Container
			inner: {
				...this.withWidth(this.layout.screen.width),
				...this.withHeight(this.layout.screen.height - this.layout.screen.statusBar),
			},

			// Close button in top-right outside inner container
			closeButton: {
				...this.container,
				...this.overlay,
				...this.withSize(this.layout.button.normal.height),
				left: "auto",
				right: this.layout.screen.padding,
				top: this.layout.screen.padding,
			}

		})
	}



	@computed
	get popup() {
		return StyleSheet.create({

			container: {
				...this.container,
			},

			card: {
				margin: this.layout.screen.padding,
				marginTop: "auto",
				marginBottom: "auto",
				padding: this.layout.screen.padding,
				backgroundColor: this.colors.white,
			},

			title: {
				...this.text.title,
			},



		})
	}



	@computed
	get explainer() {
		return StyleSheet.create({

			subtitle: {
				...this.text.title,
				fontSize: this.font.size.smaller,
				color: this.colors.neutralDark
			},

			iconHolder: {
				...this.container,
				...this.withHeight(this.layout.iconSize + (2 * this.layout.screen.padding)),
			},

			icon: {
				color: this.colors.major
			},

			body: {
				...this.container,
			},

			text: {

			},

		})
	}


}