import { StyleSheet } from 'react-native';
import { computed, autorun } from 'mobx';


export default Style => class AlertsStyle extends Style {


	constructor(...args) {

		super(...args)

		this.compileAlerts = this.compileAlerts.bind(this)
		autorun(this.compileAlerts)

	}


	compileAlerts() {

		// Unpack settings
		const { height } = this.settings.alerts
		const alertHeight = Math.round(this.layout.screen.width * height)

		// Extend layout
		this.layout.alerts = {
			width: this.layout.core.drawer.width - (2 * this.layout.screen.padding),
			height: alertHeight,
			inner: alertHeight - (2 * this.layout.margin),
		}

	}


	@computed
	get alerts() {
		return StyleSheet.create({

			body: {
				...this.container,
				backgroundColor: this.colors.white,
				padding: this.layout.screen.padding,
			},

			filter: {
				...this.row,
				...this.withWidth(this.layout.menu.section.width),
				...this.withHeight(this.layout.button.normal.height),
				marginTop: this.layout.margin,
				marginBottom: this.layout.screen.padding + this.layout.margin,
				justifyContent: "space-evenly",
			},

			filterButtonOn: {
				color: this.colors.major,
				transform: [{ scale: 1.2 }]
			},

			filterButtonOff: {},

			filterLabel: {
				fontSize: this.font.size.tiny,
				lineHeight: this.font.size.tiny,
				transform: [{ translateY: this.font.size.tiny * 2 }]
			},

			holder: {
				...this.row,
				...this.withWidth(this.layout.alerts.width),
				...this.withHeight(this.layout.alerts.height),
				...this.withBorder(),
				borderBottomWidth: 0,
			},

			avatar: {
				...this.withWidth(this.layout.alerts.inner),
				...this.withHeight(this.layout.alerts.inner),
			},

			content: {
				...this.container,
				alignItems: "flex-start",
				marginRight: this.layout.margin,
			},

			text: {
				...this.text.body,
				fontSize: this.font.size.smaller,
				paddingBottom: Math.round(0.5 * this.layout.margin),
			},

			notice: {
				...this.text.title,
				color: this.colors.neutralDark,
				fontSize: this.font.size.small,
			},

			timeHolder: {
				...this.container,
				alignItems: "flex-end",
				position: "absolute",
				right: 0,
				bottom: Math.round(0.5 * this.layout.margin),
			},

			time: {
				...this.text.body,
				color: this.colors.neutralDarkest,
				fontSize: this.font.size.tiny,
			},

			footer: {
				...this.container,
				alignContent: "stretch",
				paddingTop: this.layout.screen.padding,
				...this.withBorder(this.colors.border, "Top"),
			}

		})
	}

}