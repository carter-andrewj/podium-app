

const config = {

	media: {
		source: "https://media.podium-network.com",
		preload: [
			"icon.png"
		]
	},

	records: {
		reload: 1000 * 10,
		lifetime: 1000 * 60
	},

	validation: {
		delay: 500,
		alias: {
			minLength: 1,
			maxLength: 20,
			chars: /[^A-Z0-9_-]/i
		},
		passphrase: {
			minLength: 7,
			maxLength: 36
		},
		name: {
			maxLength: 50
		},
		about: {
			maxLength: 250
		}
	},

	postCosts: {
		perCharacter: 1,
		tag: 10,
		url: 10
	}

}


export default config;