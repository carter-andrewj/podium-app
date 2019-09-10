import './icons.js';

import general from './general';

import text from './text';
import input from './input';
import button from './button';
import keyboard from './keyboard';

import splash from './splash';
import lobby from './lobby';

import alerts from './alerts';
import quickAlerts from './quickAlerts';

import quickSearch from './quickSearch';

import feed from './feed';
import post from './post';
import newPost from './newPost';

import quickProfile from './quickProfile';
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
	quickAlerts: quickAlerts,

	quickSearch: quickSearch,

	feed: { ...feed },
	post: { ...post },
	newPost: { ...newPost },

	quickProfile: quickProfile,
	profile: { ...profile },
	wallet: { ...wallet },

	layout: { ...layout },

}

export default styles;