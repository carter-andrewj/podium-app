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
		//const {  } = this.settings.alerts

		// Extend layout
		this.layout.alerts = {}

	}


	@computed
	get alerts() {
		return StyleSheet.create({

			body: {
				...this.container,
				backgroundColor: this.colors.white,
			},

		})
	}

}