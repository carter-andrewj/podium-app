import { StyleSheet } from 'react-native';
import { computed, autorun } from 'mobx';


export default Style => class ProfileStyle extends Style {


	constructor(...args) {

		super(...args)

		this.compileProfile = this.compileProfile.bind(this)
		autorun(this.compileProfile)

	}


	compileProfile() {

		// Calculate dimensions
		const controlHeight = this.layout.button.normal.height + this.layout.margin
		const height = this.layout.screen.padding + controlHeight +
			((this.layout.button.normal.height + this.layout.margin) * 4)
		const avatarWidth = height - controlHeight -(2 * this.layout.gauge.height) -
			(3 * this.layout.margin) - this.layout.screen.padding
		const headerWidth = this.layout.screen.width - (2 * this.layout.screen.padding)
		const rightWidth = avatarWidth + this.layout.margin + this.layout.button.normal.height

		const tabHeight = (2 * this.layout.button.normal.height) + (3 * this.layout.margin)

		// Extend layout
		this.layout.profile = {
			header: {
				height: height,
				innerHeight: height - controlHeight - this.layout.screen.padding,
				innerWidth: this.layout.screen.width - (2 * this.layout.screen.padding),
				left: {
					width: headerWidth - rightWidth - this.layout.margin,
					titleHeight: this.font.size.large + this.font.size.small +
						this.layout.margin,
				},
				right: {
					width: rightWidth,
					avatar: avatarWidth,
				},
				controls: {
					height: controlHeight,
				},
			},
			tab: {
				height: tabHeight,
				avatar: 2 * this.layout.button.normal.height,
			}
		}

	}



	@computed
	get profile() {
		return StyleSheet.create({

			header: {
				...this.container,
				...this.withHeight(this.layout.profile.header.height),
				padding: this.layout.screen.padding,
				paddingBottom: this.layout.margin,
				backgroundColor: this.colors.white,
			},

			top: {
				...this.row,
				...this.withHeight(this.layout.profile.header.innerHeight)
			},

			left: {
				...this.container,
				...this.withWidth(this.layout.profile.header.left.width),
			},

			title: {
				...this.container,
				alignItems: "flex-start",
				...this.withHeight(this.layout.profile.header.left.titleHeight),
				width: "100%",
			},

			name: {
				...this.text.name,
				fontSize: this.font.size.large,
				textAlign: "left",
			},

			alias: {
				...this.text.alias,
				fontSize: this.font.size.smaller,
				textAlign: "left",
			},

			leftBody: {
				...this.container,
				alignItems: "flex-start",
				alignContent: "flex-start",
				width: "100%",
			},

			bio: {
				...this.text.paragraph,
				marginBottom: "auto",
			},

			right: {
				...this.row,
				...this.withWidth(this.layout.profile.header.right.width),
			},

			rightBody: {
				...this.column,
				width: "100%",
				alignItems: "center",
				alignContent: "flex-start",
				...this.withWidth(this.layout.profile.header.right.avatar),
			},

			avatar: {
				...this.withSize(this.layout.profile.header.right.avatar),
				margin: 0,
			},

			gaugeHolder: {
				...this.container,
				justifyContent: "flex-start",
				paddingTop: Math.round(0.5 * this.layout.margin),
			},

			gauge: {
				alignSelf: "flex-end",
				marginRight: this.layout.margin
			},

			buttons: {
				...this.container,
				justifyContent: "space-between",
				...this.withWidth(this.layout.button.normal.height),
				...this.withHeight(this.layout.profile.header.innerHeight),
				marginLeft: this.layout.margin,
				paddingBottom: this.layout.margin,
			},

			contentControls: {
				...this.row,
				minWidth: this.layout.profile.header.innerWidth,
				alignItems: "center",
				justifyContent: "space-evenly",
				backgroundColor: this.colors.white,
			},

			list: {},

		})
	}


	@computed
	get profileTab() {
		return StyleSheet.create({

			container: {
				...this.row,
				...this.withWidth(this.layout.screen.width),
				minHeight: this.layout.profile.tab.height,
				backgroundColor: this.colors.white,
			},

			left: {
				...this.column,
				alignItems: "flex-start",
				...this.withWidth(this.layout.button.normal.height),
			},

			body: {
				...this.container,
			},

			right: {
				...this.container,
				...this.withWidth(this.layout.profile.tab.avatar),
			},

			avatar: {
				...this.withSize(this.layout.profile.tab.avatar),
			},

		})
	}


}