import { StyleSheet } from 'react-native';
import { computed, autorun } from 'mobx';


export default Style => class PostStyle extends Style {


	constructor(...args) {

		super(...args)

		this.compilePost = this.compilePost.bind(this)
		autorun(this.compilePost)

	}


	compilePost() {

		// Unpack settings
		const { wingInset, headerHeight, mediaAspectRatio,
				thumbnailCount, popularitySize } = this.settings.post

		// Calculate dimensions
		const postInset = this.layout.screen.width * wingInset
		const postWidth = this.layout.screen.width - (2 * this.layout.margin)
		const postWingOverlap = 2 * this.layout.button.normal.height
		const postWingWidth = this.layout.screen.width - postInset -
							  postWingOverlap - this.layout.margin
		const postHeaderHeight = Math.round(this.layout.screen.width * headerHeight)
		const postHeight = (3 * this.layout.button.normal.height) + (3 * this.layout.margin)
		const bodyWidth = postWidth - (1.5 * postWingOverlap) - (2 * this.layout.margin)
		const bodyHeight = Math.round(postHeight - (2 * this.layout.margin) - postHeaderHeight)
		const popularityWidth = popularitySize * bodyWidth

		// Extend layout
		this.layout.post = {
			height: postHeight,
			width: postWidth,
			offset: this.layout.screen.width - postWingOverlap - postInset,
			span: Math.round(this.layout.screen.width - this.layout.button.normal.height -
							 (1.5 * this.layout.margin)),
			fullWidth: postWidth + (2 * postWingWidth) + (4 * this.layout.margin),
			padding: Math.round(this.layout.margin * 0.5),
			wing: {
				edge: {
					width: this.layout.button.normal.height
				},
				left: {
					width: postWingWidth,
					overlap: postWingOverlap,
				},
				right: {
					width: postWingWidth + this.layout.button.normal.height,
					overlap: postWingOverlap - this.layout.button.normal.height,
				},
			},
			header: {
				height: postHeaderHeight,
				avatar: {
					height: postWingOverlap,
					corner: Math.round(postWingOverlap * this.settings.media.avatar.corner),
				},
			},
			core: {
				height: postHeight - (2 * this.layout.margin),
				width: bodyWidth + this.layout.margin,
			},
			body: {
				height: bodyHeight,
				width: bodyWidth,
				media: {
					height: Math.round(mediaAspectRatio * bodyWidth),
					thumbnail: Math.round((bodyWidth - (this.layout.margin * Math.floor(thumbnailCount))) / thumbnailCount),
				}
			},
			reactor: {
				countdownHeight: Math.round(this.layout.button.normal.height * 2.0),
			},
			popularity: {
				width: popularityWidth,
				height: bodyHeight - Math.round(this.layout.margin * 2.0),
				axis: 2,
				bar: popularityWidth / 20.0,
			},
		}

	}




	@computed
	get post() {

		const column = {
			...this.row,
			alignItems: "flex-start",
			margin: this.layout.margin,
		}

		const controls = {
			...this.container,
			...this.withHeight(this.layout.post.core.height),
			position: "absolute",
			alignSelf: "center",
			justifyContent: "center",
		}


		return StyleSheet.create({

			window: {
				...this.container,
				...this.withWidth(this.layout.screen.width),
				backgroundColor: "transparent",
			},

			container: {
				...this.container,
				minHeight: this.layout.post.height,
			},

			columns: {
				...this.row,
				alignItems: "flex-start",
				...this.withWidth(this.layout.post.fullWidth),
				backgroundColor: this.colors.white,
			},



		// LEFT SWIPE - USER CONTEXT

			left: {
				...column,
				...this.withWidth(this.layout.post.wing.left.width),
				marginRight: 0,
			},

			leftEdge: {
				...this.container,
				...this.withWidth(this.layout.post.wing.edge.width),
				...this.withHeight(this.layout.post.core.height),
				justifyContent: "space-between",
			},

			leftBody: {
				...this.container,
				alignItems: "stretch",
				justifyContent: "flex-start",
				width: "100%",
				...this.withHeight(this.layout.post.body.height),
				paddingLeft: this.layout.margin,
				paddingRight: this.layout.margin,
			},

			bio: {
				...this.text.body,
				width: "100%",
				minHeight: this.layout.post.body.height - this.layout.margin,
				fontSize: this.font.size.smaller,
				padding: this.layout.post.padding,
			},




		// MIDDLE - THE POST ITSELF

			middle: {
				...column,
				justifyContent: "space-between",
				...this.withWidth(this.layout.post.width),
			},



			middleLeft: {
				...this.container,
				justifyContent: "flex-start",
				...this.withWidth(this.layout.post.wing.left.overlap),
			},

			avatar: {
				...this.container,
				...this.withSize(this.layout.post.wing.left.overlap),
			},



			middleCore: {
				...this.container,
				justifyContent: "flex-start",
				...this.withWidth(this.layout.post.core.width),
				paddingLeft: Math.round(0.5 * this.layout.margin),
			},

			header: {
				...this.row,
				...this.withHeight(this.layout.post.header.height),
				width: "100%",
			},

			titleHolder: {
				...this.row,
				justifyContent: "flex-start",
				maxHeight: this.layout.post.header.height,
			},

			title: {
				maxWidth: Math.round(0.88 * this.layout.post.core.width),
			},

			titleFull: {
				maxWidth: this.layout.post.core.width,
			},

			titleIcon: {
				...this.withSize(this.font.size.small),
				transform: [{ translateY: -1 * this.layout.border }],
			},

			name: {
				...this.text.name,
				fontSize: this.font.size.normal,
			},

			alias: {
				...this.text.alias,
				fontSize: this.font.size.smallest,
			},

			spacer: {
				...this.text.body,
				color: this.colors.neutral,
				fontSize: this.font.size.small,
			},

			age: {
				...this.text.alias,
				fontSize: this.font.size.smallest,
			},

			body: {
				...this.container,
				alignItems: "stretch",
				width: "100%",
				minHeight: this.layout.post.body.height,
			},



			textHolder: {
				...this.container,
				justifyContent: "flex-start",
				paddingTop: this.layout.post.padding,
			},

			text: {
				...this.text.body,
				...this.withWidth(this.layout.post.body.width),
				fontSize: this.font.size.smaller,
				paddingBottom: 0,
			},




			mediaSingle: {
				...this.container,
				...this.withWidth(this.layout.post.body.width),
				minHeight: this.layout.post.body.media.height,
				padding: this.layout.margin,
			},

			mediaHolder: {
				...this.row,
				...this.withWidth(this.layout.post.body.width),
				paddingTop: this.layout.post.padding,
				alignSelf: "flex-end",
				justifyContent: "flex-start",
			},

			mediaThumbnail: {
				...this.container,
				overflow: "hidden",
				...this.withSize(this.layout.post.body.media.thumbnail),
				margin: this.layout.margin,
				marginRight: 0,
			},

			mediaImage: {
				...this.withWidth("100%"),
				resizeMode: "stretch",
			},

			mediaGradient: {
				...this.overlay,
			},



			linkHolder: {
				...this.container,
				justifyContent: "flex-start",
				paddingTop: this.layout.post.padding,
			},



			middleRight: {
				...this.container,
				justifyContent: "space-between",
				...this.withWidth(this.layout.button.normal.height),
				...this.withHeight(this.layout.post.core.height),
			},


			controlPanel: {
				...controls,
				justifyContent: "space-between",
			},

			rewardPanel: {
				...controls,
				justifyContent: "space-around",
			},



			reactor: {
				...this.container,
				...this.withSize(this.layout.button.normal.height),
			},

			reactorIcon: {
				transform: [
					{ translateX: -0.13 * this.font.size.largest },
					{ rotate: "90deg" },
				],
				...this.withSize(this.font.size.largest),
			},

			reactorOverlay: {
				...this.container,
				...this.overlay,
			},

			reactorDelta: {
				...this.container,
				position: "absolute",
			},

			reactorText: {
				...this.text.body,
				fontSize: this.font.size.tiny,
			},

			reactorCountdown: {
				...this.container,
				position: "absolute",
				transform: [{ translateX: Math.round(0.95 * this.layout.button.normal.height) }],
				backgroundColor: this.colors.neutralDark,
				borderRadius: 2,
				...this.withWidth(2)
			},




			// RIGHT COLUMN - POST CONTEXT

			right: {
				...column,
				...this.withWidth(this.layout.post.wing.right.width),
				marginLeft: 0,
			},

			rightCounters: {
				...controls
			},

			rightCore: {
				...this.container,
			},

			rightHeader: {
				...this.container,
				...this.withWidth(this.layout.post.wing.right.body),
				...this.withHeight(this.layout.post.header.height),
			},

			timestamp: {
				width: "100%",
				...this.text.body,
				textAlign: "center",
				color: this.colors.neutralDark,
			},

			rightBody: {
				...this.row
			},

			cost: {
				...this.container,
			},

			popularityHolder: {
				...this.container,
				...this.withWidth(this.layout.post.popularity.width),
				padding: this.layout.margin,
			},

			popularityChart: {
				...this.row,
				...this.withHeight(this.layout.post.popularity.height),
				justifyContent: "flex-end",
				borderBottomWidth: this.layout.post.popularity.axis,
				borderBottomColor: this.colors.black,
			},

			popularityAxis: {
				...this.container,
				position: "absolute",
				...this.withHeight(this.layout.post.popularity.height),
				width: this.layout.post.popularity.axis,
				left: Math.round(0.5 * (this.layout.post.popularity.width -
										this.layout.post.popularity.axis)),
				backgroundColor: this.colors.black,
			},

			popularityBar: {
				...this.container,
				...this.withWidth(this.layout.post.popularity.bar),
			},

			rightEdge: {
				...this.container,
				...this.withWidth(this.layout.post.wing.edge.width),
				...this.withHeight(this.layout.post.core.height),
				justifyContent: "space-between",
			},



		})

	}


}