import './icons.js';

import general from './general';

import text from './text';
import input from './input';
import button from './button';
import keyboard from './keyboard';

import splash from './splash';
import lobby from './lobby';


const styles = {

	...general,

	// Components
	text: { ...text },
	input: { ...input },
	button: { ...button },
	keyboard: { ...keyboard },

	// Pages
	splash: { ...splash },
	lobby: { ...lobby },

}

export default styles;