import React from 'react';
import Component from '../components/component';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';

import Navigator from '../components/navigator';
// import Screen from '../components/screen';

import Loader from './loader';
import Lobby from './lobby/lobby';
import Core from './core';

// import styles from '../styles/styles';
// import settings from '../settings';




@inject("store")
@observer
class Root extends Component {

	constructor() {

		super()
		
		// Methods
		this.navigate = this.navigate.bind(this)
		this.signOut = this.signOut.bind(this)

		// State
		this.pages = {
			"Loader": { Page: Loader },
			"Lobby": { Page: Lobby },
			"Core": {
				Page: Core,
				props: { signOut: this.signOut }
			}
		}
		this.navigator = undefined

	}




// LIFECYCLE

	componentDidMount() {

		// Load Fonts
		Promise
			.all([
				this.store.loadAccount(),
				this.store.loadNation(),
				this.store.loadFonts(),
			])
			.then(async ([ credentials ]) => {

				//Check if existing credentials were found
				if (credentials && credentials.nation === this.nation.name.get()) {

					// Unpack credentials
					const { keyPair, passphrase } = credentials

					// Generate a sign-in task
					await this.session
						.keyIn(keyPair, passphrase)
						.catch(err => {
							console.log(err)
							throw err
						})

					// Navigate to core UI
					this.navigate("Core")

				// Otherwise, load the lobby
				} else {
					this.navigate("Lobby")
				}

			})
			.catch(error => this.updateState(
				state => state.set("error", error)
			))
	
	}


	navigate(to, props) {
		this.navigator.navigate(to, props)
	}


	signOut() {

		// Handle sign-out
		if (this.session.authenticated.get()) {

			// Sign ot
			this.session
				.signOut()
				.then(() => this.navigate("Lobby", { signIn: true }))

		}

	}




	render() {
		return <Navigator
			name="root"
			controller={controls => this.navigator = controls}
			pages={this.pages}
			startingPage={"Loader"}
		/>
	}



}

export default Root;