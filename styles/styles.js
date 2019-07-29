import config from './constants';

import './icons.js';

import general from './general';

import text from './text';
import input from './input';

import splash from './splash';
import lobby from './lobby';


const styles = {

	...general,

	// Components
	text: { ...text },
	input: { ...input },

	// Pages
	splash: { ...splash },
	lobby: { ...lobby },


}

export default styles;