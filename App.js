import React, { Component } from 'react';
import { View } from 'react-native';
import { registerRootComponent } from 'expo';

import { Provider } from 'mobx-react';
import Store from './state/store';

import Root from './pages/root';


class App extends Component {

	constructor() {
		super()
		this.store = new Store()
	}

	render() {
		return <Provider store={this.store}>
			<Root />
		</Provider>
	}

}


registerRootComponent(App)

export default App;
