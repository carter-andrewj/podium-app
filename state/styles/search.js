import { StyleSheet } from 'react-native';
import { computed, autorun } from 'mobx';


export default Style => class SearchStyle extends Style {


	constructor(...args) {

		super(...args)

		this.compileSearch = this.compileSearch.bind(this)
		autorun(this.compileSearch)

	}



	compileSearch() {

		// Unpack settings
		const { inputHeight, iconSize } = this.settings.search

		const searchInputHeight = Math.round(inputHeight * this.layout.screen.width)
		const searchResultHeight = Math.round((this.layout.button.normal.height * 2) +
			(this.layout.margin * 2.5))

		this.layout.search = {
			input: {
				height: searchInputHeight,
				icon: Math.round(iconSize * this.layout.screen.width)
			},
			counter: {
				height: searchInputHeight - (2 * this.layout.margin),
			},
			result: {
				width: this.layout.core.drawer.width - (2 * (this.layout.screen.padding - this.layout.border)) - 1,
				height: searchResultHeight,
				avatar: {
					size: searchResultHeight - (2 * this.layout.margin),
				},
				footer: {
					height: this.layout.gauge.height + this.layout.gauge.margin,
					width: (2 * this.layout.gauge.width) + this.layout.margin,
				},
			},
		}

	}


	@computed
	get search() {

		const iconHolder = {
			...this.container,
			height: this.layout.search.input.height,
			...this.withWidth(this.layout.search.input.height),
		}

		return StyleSheet.create({

			container: {
				...this.container,
			},

			header: {
				...this.row,
				...this.withHeight(this.layout.search.input.height),
			},

			input: {
				width: "100%",
				height: "100%",
				borderRadius: this.layout.search.input.height,
				...this.text.body,
				padding: this.layout.search.input.height,
				paddingTop: 0,
				paddingBottom: 0, 
				fontSize: this.font.size.small,
				backgroundColor: this.colors.white,
				...this.withBorder(this.colors.neutral),
			},

			overlay: {
				...this.row,
				...this.overlay,
				alignItems: "flex-start",
			},

			iconLeft: {
				...iconHolder,
				alignSelf: "flex-start",
			},

			iconRight: {
				...iconHolder,
				...this.withHeight(this.layout.search.input.height),
				alignSelf: "flex-end",
			},

			iconOver: {
				...this.container,
				...this.overlay,
			},

			results: {
				...this.container,
				alignSelf: "stretch",
				overflow: "hidden",
				...this.withWidth(this.layout.core.drawer.width),
				marginTop: this.layout.screen.padding,
				transform: [{ translateX: -1 * this.layout.screen.padding }],
			},

			counter: {
				...this.container,
				...this.withHeight(this.layout.search.counter.height),
				marginBottom: this.layout.margin,
			},

			counterText: {
				...this.text.title,
				color: this.colors.neutralDark,
				fontSize: this.font.size.normal,
			},

		})
	}


	@computed
	get result() {
		return StyleSheet.create({

			container: {
				...this.row,
				...this.withWidth(this.layout.search.result.width),
				...this.withHeight(this.layout.search.result.height),
				padding: this.layout.margin,
				backgroundColor: this.colors.white,
				...this.withBorder(this.colors.neutralPale),
				overflow: "hidden",
			},

			left: {
				...this.container,
				alignSelf: "stretch",
				justifyContent: "space-between",
				...this.withWidth(this.layout.button.normal.height),
			},

			middle: {
				...this.container,
				flexGrow: 1,
				alignItems: "flex-end",
				justifyContent: "space-between",
				marginLeft: this.layout.margin,
				marginRight: this.layout.margin,
			},

			header: {
				...this.container,
				alignItems: "flex-end",
			},

			name: {
				justifyContent: "flex-end",
			},

			alias: {
				...this.text.alias,
			},

			footer: {
				...this.row,
				justifyContent: "space-between",
				alignSelf: "flex-end",
				...this.withWidth(this.layout.search.result.footer.width),
				...this.withHeight(this.layout.search.result.footer.height),
			},

			right: {
				...this.container,
				...this.withSize(this.layout.search.result.avatar.size),
			},

		})

	}



}