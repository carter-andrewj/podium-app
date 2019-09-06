import './icons.js';

import general from './general';

import text from './text';
import input from './input';
import button from './button';
import keyboard from './keyboard';

import splash from './splash';
import lobby from './lobby';

import alerts from './alerts';

import feed from './feed';
import post from './post';
import newPost from './newPost';

import profile from './profile';
import wallet from './wallet';

import layout from './layout';


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

	alerts: { ...alerts },

	feed: { ...feed },
	post: { ...post },
	newPost: { ...newPost },

	profile: { ...profile },
	wallet: { ...wallet },

	layout: { ...layout },

}

export default styles;