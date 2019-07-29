import React from 'react';
import { SafeAreaView } from 'react-native';
import { Provider } from 'mobx-react';

import Store from './state/store';

import Navigator from './pages/navigator';

import styles from './styles/styles';



let store = new Store();


export default function App() {
	return (
		<Provider store={store}>
			<Navigator />
		</Provider>
	);
}
