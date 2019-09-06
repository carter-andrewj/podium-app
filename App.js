import React from 'react';
import { View } from 'react-native';
import { Provider } from 'mobx-react';
import { registerRootComponent } from 'expo';

import Store from './state/store';

import Navigator from './pages/navigator';

import styles from './styles/styles';



let store = new Store();


class App extends React.Component {
	render() {
		return <Provider store={store}>
			<Navigator />
		</Provider>
	}
}

registerRootComponent(App);

export default App;
