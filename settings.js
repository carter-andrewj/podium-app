

// DEPRECIATED //
// DEPRECIATED //
// DEPRECIATED //
// DEPRECIATED //
// DEPRECIATED //
// DEPRECIATED //
// DEPRECIATED //
// DEPRECIATED //
// DEPRECIATED //
// DEPRECIATED //


const settings = {

	server: {
		local: false,
		url: "https://api.podium-network.com"
	},

	fonts: {
		body: "Varela",
		titles: "VarelaRound"
	},

	colors: {

		// Greens
		major: "#00AA22",
		majorPale: "#89D494",
		majorPalest: "#F3FBF5",

		// Reds
		minor: "#AA2200",
		minorPale: "#D49489",
		minorPalest: "#FBF5F3",

		// Greys
		neutralPalest: "#F5F5F5",
		neutralPale: "#E9E9E9",
		neutral: "#DDDDDD",
		neutralDark: "#B6B6B6",
		neutralDarkest: "#888888",

		white: "#FEFEFE",
		black: "#010101",

		pod: "#00AA22",
		aud: "#AA0088",

		good: "#0088AA",	// Blue (not green - colour blindness)
		warn: "#DD8800",	// Amber
		bad: "#AA2200",		// Red

		note: "#AA0088",	// Purple
		info: "#0088AA",	// Blue
		other: "#AA8800",	// Tan

	},

	iconSize: {
		small: 14,
		smallish: 18,
		medium: 22,
		largish: 25,
		large: 32
	},

	size: {
		smallest: 1,
		smaller: 2,
		small: 4,
		smallish: 8,
		normal: 16,
		bigish: 32,
		big: 64,
		bigger: 128,
		biggest: 256
	},

	fontsize: {
		tiny: 10,
		smaller: 12,
		small: 14,
		smallish: 16,
		normal: 18,
		largish: 22,
		large: 26,
		huge: 32,
	},

	layout: {

		// Screen
		screenMargin: 0.05,		// Space around edges of screen (% of screen width)
		keyboardDelay: 25,		// Delay before resizing screen to keyboard to prevent jittering on focus changes (ms)
		transitionTime: 500,	// Delay before navigating between screens (ms)

		// Tasks
		maxTasks: 3,			// Maximum number of tasks that can be displayed at the same time
		taskExit: 1500,			// Interval between task completion and removal from HUD
		taskLifetime: 4000,		// Minimum amount of time to display each task, even if it completes sooner (ms)

		// Inputs
		inputHeight: 0.16,		// Height of single line inputs (% of screen width)
		multilineHeight: 0.48,	// Height of multi-line inputs (% of screen width)
		checkBox: 0.05,			// Size of checkbox (% of screen width)

		// Core layout
		drawerSize: 0.9,		// Width of left/right nav drawers (% of screen width)
		navHeight: 0.17,		// Height of navigation footer (% of screen width)
		headerHeight: 0.14,		// Height of page headers and search input (% of screen width)

		// Pan Responder
		panStart: 5,			// Number of pixels moved before pan locks the screen
		xLimit: 0.2,			// Scroll limit (% of screen width) before auto-pan moves to next stable point upon release
		vLimit: 0.5,			// Velocity limit before auto-pan moves to next stable point upon release
		panBounce: 7,			// Bounciness of auto-pan animation
		panTime: 150,			// Effective duration of a pan animation (ms)
		overScroll: 0.6,		// Decay factor for pan when scrolling outside of screen bounds
		deadZone: 10,			// Boundary on edges of pannable object where pan will be ignored (pixels)

		// General
		border: 1.0,			// Width of borders between layout segments (pixels)
		margin: 0.02,			// Margin used on core nav components (% of screen width)
		corner: 0.38,			// Border radius of images with 1 corner rounded (% of image width)
		button: 0.07,			// Size of standard square HUD button (% of screen width)
		buttonIcon: 0.045,		// Size of icon in standard square HUD buton (% of screen width)
		largeButton: 0.12,		// Size of large HUD button (% of screen width)

		// Timings
		speed: 300,				// Speed of movement when calculating distance animations (px/s)
		moveTime: 100,			// Duration of movement/resize animations (ms)
		spinPause: 150,			// Duration of pause between spin cycles (ms)
		spinTime: 1600,			// Spin duration for loading icon (ms)
		fadeTime: 100,			// Fade in/out of fader elements (ms)

		// Lobby
		lobbyNavDelay: 4000,	// Delay before showing signin/register buttons in lobby (ms)
		lobbyFooter: 0.15,		// Padding to bottom of lobby to raise center of screen (% of screen height)

		// Quick Profile
		quickProfile: 0.25,		// Minimum size of quick profile element in left drawer (% of screen width)
		quickProfileCap: 0.8,	// Maximum size of quick profile element in left drawer (% of screen width)
		quickProfileName: 0.12,	// Height of name element in quick profile (% of screen width)

		// Search
		searchHeight: 0.1,		// Size of search input box (% of screen width)
		searchIcon: 15,			// Size of icons in quicksearch input (pixels)

		// Posts
		postHeight: 0.15,		// Minimum height of a post (% of screen height)
		postHeader: 0.06,		// Height of post header - name, @identity, etc.. (% of screen width)
		postReactor: 0.3,		// Width of reactor element in post header (% of screen width)
		postWing: 0.9,			// Width of post wings outside left/right side of screen (% of screen width)
		postWingOverlap: 0.18,	// Overlap of post wings with post core content (% of screen width)

		// Post Creation
		refHeight: 0.1,			// Height of a post creation reference validator (% of screen width)

	},

	regex: {

		// Regex for matching @, #, or \ tags
		tag: /[@#\/][a-z0-9_-]+[a-z0-9_-]*?(?=\W|$)/gi,

		// Regex for matching urls
		url: /(?:http[s]*:\/\/)?(?:www\.)?(?!ww*\.)[a-z][a-z0-9.\-/]*\.[a-z]{2}(?:[^\s]*[a-z0-9/]|(?=\W))/gi
	
	}

}

export default settings;