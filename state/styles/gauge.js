import { StyleSheet } from 'react-native';
import { computed, autorun } from 'mobx';


export default Style => class GaugeStyle extends Style {


	constructor(...args) {

		super(...args)

		this.compileGauge = this.compileGauge.bind(this)
		autorun(this.compileGauge)

	}



	compileGauge() {

		// Unpack post data
		const { height, wing } = this.layout.post
		const margin = this.layout.margin

		// Gauges
		this.layout.gauge = {
			height: Math.round(0.5 * (height - wing.left.overlap - (3 * margin))),
			width: wing.left.overlap,
			margin: Math.round(margin * 0.5),
		}

	}


	@computed
	get gauge() {
		return StyleSheet.create({

			container: {
				...this.row,
				justifyContent: "space-evenly",
				...this.withWidth(this.layout.gauge.width),
				...this.withHeight(this.layout.gauge.height),
				marginTop: this.layout.gauge.margin,
				marginBottom: 0,
				paddingLeft: this.layout.gauge.margin,
				paddingRight: this.layout.gauge.margin,
				borderRadius: this.layout.gauge.height,
			},

			text: {
				...this.text.title,
				color: this.colors.white,
				fontSize: this.font.size.smallest,
				lineHeight: this.layout.gauge.height,
				paddingTop: 1,
			},

		})
	}


}