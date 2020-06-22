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
				justifyContent: "flex-end",
				paddingLeft: this.layout.gauge.margin,
				paddingRight: this.layout.gauge.margin,
			},

			text: {
				...this.text.title,
				fontSize: this.font.size.tiny,
				height: this.font.size.smallest,
				marginLeft: "auto",
			},

			icon: {
				minHeight: this.font.size.smallest,
			}

		})
	}


}