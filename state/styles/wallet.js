import { StyleSheet } from 'react-native';
import { computed, autorun } from 'mobx';


export default Style => class WalletStyle extends Style {


	constructor(...args) {

		super(...args)

		this.compileWallet = this.compileWallet.bind(this)
		autorun(this.compileWallet)

	}



	compileWallet() {

	}


	@computed
	get currency() {
		return StyleSheet.create({

			container: {
				...this.row,
				padding: this.layout.gauge.margin,
			},

			text: {
				...this.text.title,
				fontSize: this.font.size.tiny,
				marginLeft: "auto",
			},

			icon: {
				marginRight: "auto",
			}

		})
	}


}