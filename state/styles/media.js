import { StyleSheet } from 'react-native';
import { computed, autorun } from 'mobx';


export default Style => class MediaStyle extends Style {


	constructor(...args) {

		super(...args)

	}


	@computed
	get avatar() {
		return StyleSheet.create({
			
			container: {
				...this.container,
				overflow: "hidden",
				margin: this.layout.margin,
			},

			border: {
				position: "absolute",
				left: -1,
				right: -1,
				top: -1,
				bottom: -1,
				...this.withBorder(this.colors.neutralPalest),
			},

			image: {
				resizeMode: "cover",
				backgroundColor: this.colors.white,
			},

		})
	}



	@computed
	get picture() {
		return StyleSheet.create({

			container: {
				...this.container,
				...this.withBorder(),
			},

			backdrop: {
				...this.container,
				...this.overlay,
				backgroundColor: this.colors.neutralPale,
			},

			image: {
				//resizeMode: "cover",
			}

		})
	}


}